import { format } from "path";
import imagekit from "../config/imageKit";
import User from "../models/UserModel";
import fs from 'fs';

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
    const {userId} = req.auth();
    const {username,bio,location,full_name} = req.body;
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
    updatedData = {
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