import React from 'react'
import { Eye, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'

const Messages = () => {
  const {connections} = useSelector((state)=>state.connections)
  const navigate = useNavigate();
  return (
    <div className='min-h-screen relative bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Messages</h1>
          <p className='text-slate-900'>Talk to your friends and family</p>
        </div>
        <div className='flex flex-col gap-3'>
          {connections.map((user)=>(
            <div key={user._id} className='relative max-w-xl flex flex-warp gap-5 p-6 bg-white shadow rounded-md'>
              <img src={user.profile_picture} className='rounded-full size-12'/>
              <div>
                <p className='font-semibold'>{user.full_name}</p>
                <p className='text-slate-500 text-[12px]'>@{user.username}</p>
                <p className='text-sm'>{user.bio}</p>
              </div>
              <div className='absolute right-5 top-0 flex flex-col gap-2 mt-4'>
                <button onClick={() => navigate(`/messages/${user._id}`)} className='flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer gap-1 p-2'>
                  <MessageSquare className='size-4'/>
                </button>
                <button onClick={() => navigate(`/profile/${user._id}`)} className='flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer gap-1 p-2'>
                  <Eye className='size-4'/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Messages
