import { format } from "path";
import imagekit from "../config/imageKit.js";
import User from "../models/UserModel.js";
import fs from 'fs';
import Connection from "../models/ConnectionModel.js";
import Post from "../models/PostModel.js";
import { inngest } from "../inngest/index.js";

export const getUserData = async(req,res) => {
  try {
    const {userId} = req.auth();
    const user = await User.findById(userId);
    if(!user) {
      return res.status(404).json({success:false,message: "User not found"});
    }
    res.status(200).json({success:true,user});
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({success:false,message: "Internal Server Error"});
  }
}

export const updateUserData = async(req,res) => {
  try {
    const {userId} = await req.auth();
    let {username,bio,location,full_name} = req.body;
    const tempUser = await User.findById(userId);
    !username && (username = tempUser.username);
    if(tempUser.username !== username)
    {
      const user = await User.findOne({username});
      if(user)
      {
        username = tempUser.username; // Revert to old username
      }
    }
    const updatedData = {
      username,
      bio,
      full_name,
      location
    }

    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];
    if(profile)
    {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file : buffer,
        fileName : profile.originalname
      });
      const url = imagekit.url({
        path:response.filePath,
        transformation:[
          {
            quality: "auto",
          },
          {
            format: "webp"
          },
          {
            width:"512"
          }
        ]
      });
      updatedData.profile_picture = url;
    }
    if(cover)
    {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file : buffer,
        fileName : cover.originalname
      });
      const url = imagekit.url({
        path:response.filePath,
        transformation:[
          {
            quality: "auto",
          },
          {
            format: "webp"
          },
          {
            width:"1280"
          }
        ]
      });
      updatedData.cover_photo = url;
    }
    const user = await User.findByIdAndUpdate(userId,updatedData,{new:true});
    res.status(200).json({success:true,user,message: "User data updated successfully"});
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({success:false,message: "Internal Server Error"});
  }
}


export const discoverUsers = async(req,res) => {
  try {
    const {userId} = req.auth();
    const {input} = req.body;
    const allUsers = await User.find({
      $or: [
        { username: { $regex: input, $options: 'i' } },
        { full_name: { $regex: input, $options: 'i' }} ,
        { email: { $regex: input, $options: 'i' } },
        {location: { $regex: input, $options: 'i' } }
      ]})
    const filteredUsers = allUsers.filter(user => user._id !== userId);
    res.status(200).json({success:true,users: filteredUsers,message: "Users discovered successfully"});
  } catch (error) {
    console.error("Error discovering users:", error);
    res.status(500).json({success:false,message: "Internal Server Error"});
  }
}

export const followUser = async(req,res) => {
  try {
    const {userId} = req.auth();
    const {id} = req.body;
    const user = await User.findById(userId);
    if(user.following.includes(id)) {
      return res.status(400).json({success:false,message: "Already following the user"});
    }
    user.following.push(id);
    await user.save();
    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();
    res.status(200).json({success:true,message: "User followed successfully"});
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({success:false,message: "Internal Server Error"});
  }
}

export const unfollowUser = async(req,res) => {
  try {
    const {userId} = req.auth();
    const {id} = req.body;
    const user = await User.findById(userId);
    user.following = user.following.filter(followingId => followingId !== id);
    await user.save();
    const toUser = await User.findById(id);
    toUser.followers = toUser.followers.filter(followerId => followerId !== userId);
    await toUser.save();
    res.status(200).json({success:true,message: "User unfollowed successfully"});
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({success:false,message: "Internal Server Error"});
  }
}

export const sendConnectionRequest = async(req,res) =>{
  try {
    const {userId} = req.auth();
    const {id} = req.body;
    const last24Hours = new Date(Date.now() - 24*60*60*1000);
    const connectionRequests = await Connection.find({from_user_id:userId,createdAt:{$gt:last24Hours}});
    if(connectionRequests.length >= 20)
    {
      return res.status(429).json({success:false,message: "Connection request limit reached. Please try again later."});
    }
    const connection1 = await Connection.findOne({from_user_id:userId,to_user_id:id});
    if(connection1)
    {
      if(connection1.status === "accepted")
      {
        return res.status(400).json({success:false,message: "You are already connected with this user"});
      }
      return res.status(400).json({success:false,message: "Connection request already sent"});
    }
    const connection2 = await Connection.findOne({from_user_id:id,to_user_id:userId});
    if(connection2)
    {
      if(connection2.status === "accepted")
      {
        return res.status(400).json({success:false,message: "You are already connected with this user"});
      }
      return res.status(400).json({success:false,message: "User has already sent you a connection request"});
    }
    const newConnection = await Connection.create({from_user_id:userId,to_user_id:id});
    await inngest.send({
      name:"app/connection-request",
      data:{
        connectionId:newConnection._id
      }
    })
    res.status(200).json({success:true,message: "Connection request sent successfully"});
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({success:false,message: "Internal Server Error"});
  }
}

export const getUserConnections = async(req,res) => {
  try {
    const {userId} = req.auth();
    const user = await User.findById(userId).populate('connections followers following');
    const connections = user.connections;
    const followers = user.followers;
    const following = user.following;
    const pendingConnections = (await Connection.find({to_user_id:userId,status:"pending"}).populate('from_user_id')).map(conn => conn.from_user_id);
    res.status(200).json({success:true,connections,followers,following,pendingConnections,message: "User connections fetched successfully"});
  } catch (error) {
    console.error("Error fetching user connections:", error);
    res.status(500).json({success:false,message: "Internal Server Error"});
  }
}

export const acceptConnectionRequest = async(req,res) => {
  try {
    const {userId} = req.auth();
    const {id} = req.body;
    const connection = await Connection.findOne({from_user_id:id,to_user_id:userId,status:"pending"});
    if(!connection)
    {
      return res.status(404).json({success:false,message: "Connection request not found"});
    }
    const user = await User.findById(userId);
    const fromUser = await User.findById(id);
    user.connections.push(id);
    fromUser.connections.push(userId);
    await user.save();
    await fromUser.save();
    connection.status = "accepted";
    await connection.save();
    res.status(200).json({success:true,message: "Connection request accepted successfully"});
  } catch (error) {
    console.error("Error accepting connection request:", error);
    res.status(500).json({success:false,message: "Internal Server Error"});
  }
}

export const getUserProfiles = async(req,res) => {
  try {
    const {profileId} = req.body;
    const profile = await User.findById(profileId);
    if(!profile)
    {
      console.log("uckk")
      return res.status(404).json({
        success:false,
        message:"User was not found"
      })
    }
    const posts = await Post.find({user:profileId}).populate('user');
    res.status(200).json({
      success:true,
      profile,
      posts,
      message:"Got the user"
    })
  } catch (error) {
    console.error("Error accepting connection request:", error);
    res.status(500).json({success:false,message: "Internal Server Error"});
  }
}