import fs from 'fs';
import imagekit from '../config/imageKit.js';
import Message from '../models/MessageModel.js';

// create a empty object for server side event connections

const connections = {};

export const sseController = async(req,res) => {
  const {userId} = req.params;
  console.log('New client connected for SSE:', userId);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  connections[userId] = res;
  res.write('log:connected to SSE stream \n\n')
  req.on('close', () => {
    console.log('Client disconnected from SSE:', userId);
    delete connections[userId];
  });
}

export const sendMessage = async(req,res) => {
  try {
    const {userId} = req.auth();
    const {to_user_id,text} = req.body;
    const image = req.file;
    let media_url = '';
    let message_type = image ? 'image' : 'text';
    if(message_type === 'image'){
      const fileBuffer = fs.readFileSync(image.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: image.originalname,
      });
      media_url = imagekit.url({
        path:response.filePath,
        transformation:[{quality:"auto"},{format:"webp"},{width:1280}]
      })
    }
    const message = await Message.create({
      from_user_id: userId,
      to_user_id,
      text,
      media_url,
      message_type
    })
    res.status(201).json({success:true,message:'Message sent successfully',data:message});

    const messageWithUserData = await Message.findById(message._id).populate('from_user_id');
    if(connections[to_user_id]){
      connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
    }
  } catch (error) {
    console.error('Error sending SSE message:', error);
    res.status(500).json({success:false,message:'Internal server error'});
  }
}

export const getChatMessages = async(req,res) => {
  try {
    const {userId} = req.auth();
    const {to_user_id} = req.body;
    const messages = await Message.find({
      $or:[
        {from_user_id:userId,to_user_id},
        {from_user_id:to_user_id,to_user_id:userId}
      ]
    }).sort({createdAt:-1});
    await Message.updateMany({from_user_id:to_user_id,to_user_id:userId},{seen:true});
    res.status(200).json({
      success:true,
      message:'Chat messages fetched successfully',
      messages
    })
  } catch (error) {
    console.log('Error fetching chat messages:', error);
    res.status(500).json({success:false,message:'Internal server error'});
  }
}

export const getRecentMessages = async(req,res) => {
  try {
    const {userId} = req.auth();
    const messages = await Message.find({to_user_id:userId}).populate('from_user_id to_user_id').sort({createdAt:-1});
    res.status(200).json({
      success:true,
      message:'Recent messages fetched successfully',
      messages
    })
  } catch (error) {
    console.log('Error fetching chat messages:', error);
    res.status(500).json({success:false,message:'Internal server error'});
  }
}