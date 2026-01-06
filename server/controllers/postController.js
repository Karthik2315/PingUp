import fs from "fs";
import imagekit from "../config/imageKit.js";
import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";


export const addPost = async(req,res) => {
  try {
    const {userId} = await req.auth();
    const {content,post_type} = req.body;
    const images = req.files;
    let images_urls = [];
    if(images.length)
    {
      images_urls = await Promise.all(
        images.map(async (image) => {
          const fileBuffer = fs.readFileSync(image.path);
          const response = await imagekit.upload({
            file : fileBuffer,
            fileName : image.originalname,
            folder: "posts",
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
          return url;
        })
      )
    }
    await Post.create({
      user:userId,
      content,
      image_urls:images_urls,
      post_type
    });
    res.status(200).json({success:true,message:"Post created successfully"})
  } catch (error) {
    console.error("Server Error : ",error.message);
    res.status(500).json({
      success:false,
      message:"Server Error"
    })
  }
};

export const getFeedPosts = async(req,res) => {
  try {
    const {userId} = req.auth();
    const user = await User.findById(userId);
    const userIds = [userId,...user.connections,...user.following];
    const posts = await Post.find({user:{$in:userIds}}).populate('user').sort({createdAt:-1});
    res.status(200).json({
      success:true,
      message:"Got the feed correctly",
      posts
    });
  } catch (error) {
    console.error("Error happened while getting feed posts : ",error.message);
    res.status(500).json({
      success:false,
      message:"Internal Server errors"
    })
  }
}

export const likePost = async(req,res) => {
  try {
    const {userId} = req.auth();
    const {postId} = req.body();
    const post = await Post.findById(postId);
    if(post.likes_count.includes(userId))
    {
      post.likes_count = post.likes_count.filter(user => user !== userId);
      await post.save();
      res.status(200).json({
        success:true,
        message:"Post Unliked"
      });
    }
    else{
      post.likes_count.push(userId);
      await post.save();
      res.status(200).json({
        success:true,
        message:"Post liked"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success:false,
      message:"Internal Server errors"
    })  }
}