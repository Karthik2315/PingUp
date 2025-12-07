import React, { useEffect, useState } from 'react'
import { dummyRecentMessagesData } from '../assets/assets';
import { Link } from 'react-router-dom';
import moment from 'moment';

const RecentMessages = () => {
  const [messages,setMessages] = useState([]);
  const fetchRecentMessages = async() => {
    setMessages(dummyRecentMessagesData);
  }
  useEffect(()=>{
    const fetchData = async()=>{
      await fetchRecentMessages();
    }
    fetchData();
  },[])
  return (
    <div className='bg-white mt-4 mr-20 p-4 min-h-20 rounded-md text-xs shadow text-slate-600'>
      <h3 className='font-semibold text-slate-800 mb-4 text-[15px]'>Recent Messages</h3>
      <div>
        {messages.map((message,index) => (
          <Link to={`/messages/${message.from_user_id._id}`} key={index} className='flex items-start gap-2 py-2 px-1 hover:bg-slate-100'>
            <img src={message.from_user_id.profile_picture} className='size-8 rounded-full' />
            <div className='flex-1'>
              <div className='flex justify-between'>
                <p className='text-black font-semibold'>{message.from_user_id.full_name}</p>
                <p>{moment(message.createdAt).fromNow()}</p>
              </div>
              <div className='flex justify-between mt-1'>
                <p className='text-gray-500'>{message.text ? message.text:'Media'}</p>
                {message.seen && 
                <p className='bg-indigo-500 text-white size-4 rounded-full flex items-center justify-center text-[10px]'>1
                </p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecentMessages
