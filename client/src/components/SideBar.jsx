import React from 'react'

const SideBar = ({sidebarOpen,setSideBarOpen}) => {
  return (
    <div className={`w-60 flex flex-col justify-between items-center border-r bg-white border-gray-200 shadow-md ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out`}>
      
    </div>
  )
}

export default SideBar
