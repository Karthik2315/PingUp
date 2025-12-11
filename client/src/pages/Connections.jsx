import React, { useState } from 'react'
import { data, useNavigate } from 'react-router-dom'
import { dummyConnectionsData, dummyFollowersData, dummyFollowingData, dummyPendingConnectionsData } from '../assets/assets'
import { MessagesSquare, UserCheck, UserPlus, UserRoundPen, Users } from 'lucide-react';

const Connections = () => {
  const connections = dummyConnectionsData;
  const followers = dummyFollowersData;
  const following = dummyFollowingData;
  const pending = dummyPendingConnectionsData;
  const navigate = useNavigate();
  const dataArray = [
    { label: 'Followers', value: followers, icon: Users },
    { label: 'Following', value: following, icon: UserCheck },
    { label: 'Pending', value: pending, icon: UserRoundPen },
    { label: 'Connections', value: connections, icon: UserPlus },
  ];
  const [currentTab,setCurrentTab] = useState('Followers')
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Connections</h1>
          <p className='text-slate-900'>Manage your connections and discover new connections</p>
        </div>
        <div className='flex flex-wrap gap-6 mb-6'>
          {dataArray.map((item,index) => (
            <div key={index} className='flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md'>
            <b>{item.value.length}</b>
            <p className='text-slate-600'>{item.label}</p>
            </div>
          ))}
        </div>
        <div className='inline-flex flex-warp items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm'>
          {dataArray.map((tab)=>(
            <button key={tab.label} className={`flex items-center gap-1 cursor-pointer px-3 py-1 text-sm rounded-md transition-colors ${tab.label===currentTab ? 'text-black bg-white font-medium':'text-gray-500 hover:text-black'}`} onClick={()=>setCurrentTab(tab.label)}>
              <tab.icon className='size-4'/> {tab.label}
            </button>
          ))}
        </div>
        {/* Connections*/}
        <div className='flex flex-warp gap-6 mt-5'>
          {dataArray.find((item) => item.label === currentTab).value.map((user)=>(
            <div key={user._id} className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'>
              <img src={user.profile_picture} alt='' className='rounded-full w-12 h-12 shadow-md mx-auto'/>
              <div className='flex-1'>
                <p className='font-medium text-slate-700'>{user.full_name}</p>
                <p className='text-slate-500 text-[15px]'>@{user.username}</p>
                <p className='text-gray-600 text-sm'>{user.bio.slice(0,30)}...</p>
                <div className='flex gap-2 mt-4'>
                  <button className='w-full p-2 text-sm rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer' onClick={() => navigate(`/profile/${user._id}`)}>View Profile</button>
                  {
                    currentTab === 'Following' && (
                      <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'>
                        Unfollow
                      </button>
                    )
                  }
                  {
                    currentTab === 'Pending' && (
                      <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'>
                        Accept
                      </button>
                    )
                  }
                  {
                    currentTab === 'Connections' && (
                      <button onClick={() => navigate(`/messages/${user.id}`)}
                              className='w-full p-2 text-sm rounded bg-slate-100
                                        hover:bg-slate-200 text-slate-800 active:scale-95 transition
                                        cursor-pointer flex items-center justify-center gap-1'>
                        <MessagesSquare className='w-4 h-4'/>
                        Message
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Connections
