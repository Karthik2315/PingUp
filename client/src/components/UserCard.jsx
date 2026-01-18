import React from 'react'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react';
import { useSelector } from 'react-redux';

const UserCard = ({user}) => {
  const currentUser = useSelector((state) => state.user.value);

  const handleFollow = async() => {

  }
  return (
    <div key={user._id} className='p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md'>
      <div className='text-center'>
        <img src={user.profile_picture} className='rounded-full w-16 shadow-md mx-auto'/>
        <p className='mt-4 font-semibold'>{user.fullname}</p>
        {user.username && <p className='text-gray-500 font-light'>@{user.username}</p>}
        {user.bio && <p className='text-gray-600 mt-2 text-center text-sm px-4'>{user.bio}</p>}
      </div>
      <div className='flex justify-center items-center gap-2 mt-3'>
        <div className='flex items-center justify-center gap-2 border border-gray-400 rounded-full px-3 py-1 text-slate-400 text-[12px]'>
          <MapPin className='size-4 text-black' />
          {user.location}
        </div>
        <div className='flex items-center justify-center gap-2 border border-gray-400 rounded-full px-3 py-1 text-slate-400 text-[12px]'>
          <span className='text-black'>{user.followers.length}</span> Followers
        </div>
      </div>
      <div className='flex mt-4 gap-2'>
        {/* Follow Button */}
        <button onClick={handleFollow} disabled={currentUser?.following.includes(user._id)}
                className='w-full py-2 rounded-md flex justify-center
                          items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600
                          hover:from-indigo-600 hover:to-purple-700 active:scale-95 
                          text-white cursor-pointer hover:scale-105 transition-all duration-300'>
          <UserPlus className='w-4 h-4'/>
          {currentUser?.following.includes(user._id) ? 'Following' : 'Follow'}
        </button>
        <button className='flex items-center justify-center w-16 border text-slate-500 group rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300'>
          {currentUser?.connections.includes(user._id) ? <MessageCircle className='size-4 group-hover:scale-105 transition'/>
          : <Plus className='size-4 group-hover:scale-105 transition' />}
        </button>
      </div>
    </div>
  )
}

export default UserCard
