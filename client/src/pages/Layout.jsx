import React, { useState } from 'react'
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';

const Layout = () => {
  const user = useSelector((state) => state.user.value);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return user ? (
    <div className='w-full min-h-screen flex'>
      <SideBar sidebarOpen={sidebarOpen} setSideBarOpen={setSidebarOpen}/>
      <div className={`flex-1 bg-linear-to-r from-zinc-500 via-stone-600 to-zinc-900 ${sidebarOpen ? 'ml-60':''}`}>
        <Outlet />
      </div>
      {sidebarOpen ? 
      <X className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 cursor-pointer sm:hidden' onClick={() => setSidebarOpen(false)}/> :
      <Menu className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 cursor-pointer sm:hidden' onClick={() => setSidebarOpen(true)}/>
      }
    </div>
  ) : (
    <div className='h-screen w-full items-center flex'>
      <Loading />
    </div>
  )
}

export default Layout
