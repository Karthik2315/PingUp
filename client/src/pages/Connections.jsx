import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyConnectionsData, dummyFollowersData, dummyFollowingData, dummyPendingConnectionsData } from '../assets/assets'
import { UserCheck, UserPlus, UserRoundPen, Users } from 'lucide-react';

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
      </div>
    </div>
  )
}

export default Connections
