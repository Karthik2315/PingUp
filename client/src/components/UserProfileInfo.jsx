import { Calendar, Edit, MapPin, Verified } from 'lucide-react'
import React from 'react'
import moment from 'moment'

const UserProfileInfo = ({user,posts,profileId,setShowEdit}) => {
  return (
    <div className='relative py-4 px-6 bg-white'>
      <div className='flex items-start gap-6'>
        <div className='absolute size-32 border-4 border-white shadow-lg rounded-full -top-16'>
          <img src={user.profile_picture} className='absolute rounded-full z-2'/>
        </div>
        <div className='ml-35 flex-1 flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='flex items-center gap-3'>
                <h1 className='text-2xl font-bold text-gray-600'>{user.full_name}</h1>
                <Verified className='size-6 text-blue-500'/>
              </div>
              <p className='text-gray-500 text-[15px]'>{user.username ? `@${user.username}` : 'Add a username'}</p>
            </div>
            {!profileId &&
            <button className='flex items-center justify-center gap-1 border border-slate-500 px-3 py-1 rounded-md cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300' onClick={() => setShowEdit(true)}><Edit className='size-4'/>Edit</button> }
          </div>
          <p className='text-sm text-slate-400 mt-5'>{user.bio}</p>
          <div className='flex items-center text-sm text-gray-500 mt-4 gap-6'>
              <span className='flex items-center gap-1'>
                <MapPin className='size-4'/>
                {user.location ? user.location : 'Add Location'}
              </span>
              <span className='flex items-center gap-1'>
                <Calendar className='size-4'/>
                Joined <span className='font-medium'>{moment(user.createdAt).fromNow()}</span>
              </span>
          </div>
          <div className='flex items-center gap-6 mt-6 border-t border-gray-200 pt-4'>
            <div>
              <span className='sm:text-xl font-bold text-gray-900'>
                {posts.length}
              </span>
              <span className='text-xs sm:text-sm text-gray-500 ml-1'>
                Posts
              </span>
            </div>
            <div>
              <span className='sm:text-xl font-bold text-gray-900'>
                {user.followers.length}
              </span>
              <span className='text-xs sm:text-sm text-gray-500 ml-1'>
                Followers
              </span>
            </div>
            <div>
              <span className='sm:text-xl font-bold text-gray-900'>
                {user.following.length}
              </span>
              <span className='text-xs sm:text-sm text-gray-500 ml-1'>
                Following
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileInfo
