import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems';
import { CirclePlus, LogOut } from 'lucide-react';
import {UserButton,useClerk} from '@clerk/clerk-react';
import { useSelector } from 'react-redux';

const SideBar = ({sidebarOpen,setSideBarOpen}) => {
  const navigator = useNavigate();
  const user = useSelector((state) => state.user.value) ;
  const {signOut} = useClerk();
  return (
    <div className={`fixed left-0 top-0 h-full w-60 flex flex-col justify-between items-center border-r bg-white border-gray-200 shadow-md ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out`}>
      <div className='w-full'>
        <img src={assets.logo} className='cursor-pointer w-24 ml-7 my-2' onClick={() => navigator('/')}/>
        <hr className='border-gray-300 mb-8'/>
        <MenuItems />
        <Link to={'/create-post'} className='mt-5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 flex items-center justify-center gap-3 py-2 mx-5 hover:scale-105 active:scale-95 transition-all duration-300'>
          <CirclePlus className='w-5 h-5 text-white'/>
          <p className='text-[15px] text-white'>Create Post</p>
        </Link>
      </div>
      <div className='w-full border-t border-gray-200 flex items-center justify-between p-5'>
        <div className='flex justify-between gap-2 items-center cursor-pointer'>
          <UserButton />
          <div>
            <h1 className='text-sm font-medium'>{user.full_name}</h1>
            <p className='text-xs text-gray-500'>@{user.username}</p>
          </div>
        </div>
          <LogOut onClick={() => signOut()} className='w-4.5 cursor-pointer hover:text-gray-400'/>
      </div>
    </div>
  )
}

export default SideBar
