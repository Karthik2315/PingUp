import React, { useEffect, useRef, useState } from 'react'
import { ImageIcon, Send, SendIcon } from 'lucide-react'
import {useDispatch, useSelector} from 'react-redux'
import {useAuth} from '@clerk/clerk-react'
import {useParams} from 'react-router-dom'
import api from '../api/axios'
import { addMessages, fetchMessages, resetMessages } from '../features/messages/messageSlice'

const ChatBox = () => {
  const {userId} = useParams();
  const messages = useSelector((state)=>state.messages.messages)
  const {connections} = useSelector((state) => state.connections)
  const {getToken} = useAuth();
  const dispatch = useDispatch();
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(null)
  const messagesEndRef = useRef(null)
  const fetchUserMessages = async() => {
    try {
      const token = await getToken();
      dispatch(fetchMessages({token,id:userId}))
    } catch (error) {
      console.log(error)
    }
  }
  const sendMessages = async() =>{
    try {
      if(!text && !image) return ;
      const token = await getToken();
      const formData = new FormData();
      formData.append('to_user_id',userId);
      formData.append('text',text);
      image && formData.append('image',image);
      const {data} = await api.post('/api/message/send',formData,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      if(data.success){
        setText('');
        setImage(null);
        dispatch(addMessages(data.message));
      }else{
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    fetchUserMessages();
    return ()=>{
      dispatch(resetMessages());
    }
  },[userId]);

  useEffect(()=>{
    if(connections.length > 0){
      const user = connections.find(connection => connection._id === userId);
      setUser(user);
    }
  },[connections,userId])

  useEffect(()=>{
    if (!messages || messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])
  useEffect(()=>{
    if (!messages || messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  },[])
  return user && (
    <div className='flex flex-col min-h-screen'>
      <div className='flex items-center gap-2 p-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
        <img src={user.profile_picture} className='size-10 rounded-full'/>
        <div>
          <h2 className='font-semibold text-[15px]'>{user.full_name}</h2>
          <p className='text-slate-500 font-light text-[12px]'>@{user.username}</p>
        </div>
      </div>
      <div className='p-5 h-[650px] overflow-y-scroll' >
        <div className='space-y-4 max-w-6xl mx-auto'>
          {
            messages.toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => (
              <div key={index} className={`flex flex-col ${message.to_user_id === user._id ? 'items-end' : 'items-start'}`}>
                <div className={`p-2 text-sm max-w-sm text-slate-700 rounded-lg shadow ${message.to_user_id !== user._id ? 'rounded-bl-none' : 'rounded-br-none'}`}>
                  {
                    message.message_type === 'image' && <img src={message.media_url} className='w-full max-w-sm rounded-lg mb-1' alt="" />
                  }
                  <p>{message.text}</p>
                </div>
              </div>
            ))
          }
            <div ref={messagesEndRef} />
          <div />
        </div>
      </div>
      <div className='px-4'>
          <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
            <input type='text' className='flex-1 outline-none text-slate-700' placeholder='Type a message...' onKeyDown={e => e.key==='Enter' && sendMessages()} onChange={(e)=>setText(e.target.value)} value={text}/>
            <label htmlFor='image'>
              {
                image ? <img src={URL.createObjectURL(image)} alt="preview" className='w-8 h-8 object-cover rounded-full cursor-pointer'/>:
                <ImageIcon className='size-7 text-gray-500 cursor-pointer' />
              }
              <input type='file' id='image' accept='image/*' hidden onChange={(e) => setImage(e.target.files[0])} />
            </label>  
            <button className='flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-3 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer' onClick={sendMessages}>
              <SendIcon className='size-4 text-white' />
            </button>
          </div>
      </div>
    </div>  
  )
}

export default ChatBox
