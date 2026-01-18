import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const ProfileModal = ({setShowEdit}) => {
  const user = useSelector((state) => state.user.value);
  const [form,setForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    full_name: user.full_name,
    profile_picture: null,
    cover_photo: null
  })
  const handleSaveProfile = async(e) => {
    e.preventDefault();

  }
  return (
    <div className='fixed flex items-center justify-center min-h-screen inset-0 z-[110] bg-black/50'> 
      <div className='w-2xl mx-auto'>
        <div className='bg-white rounded-lg shadow p-6'>
          <h1 className='text-2xl font-semibold text-gray-900 mb-4'>Edit Profile</h1>
          <form onSubmit={handleSaveProfile} className='space-y-4'>
            <div className='flex mx-20 items-center justify-between gap-3'>
              <label htmlFor='profile_picture' className='block text-sm font-medium text-gray-700 mb-1'>
                Profile Picture
                <input type='file' id='profile_picture' accept='image/*' hidden onChange={(e)=>setForm({...form,profile_picture:e.target.files[0]})} />
                <img src={form.profile_picture ? URL.createObjectURL(form.profile_picture) : user.profile_picture} alt='Profile' className='w-24 h-24 rounded-full object-cover cursor-pointer mt-2'/>
              </label>
              <label className='block text-center text-sm font-medium text-gray-700 mb-1' htmlFor='cover_photo'>
                Cover Photo
                <input type='file' id='cover_photo' accept='image/*' hidden onChange={(e)=>setForm({...form,cover_photo:e.target.files[0]})} />
                <img src={form.cover_photo ? URL.createObjectURL(form.cover_photo) : user.cover_photo} alt='Profile' className='h-50 w-80 rounded-md object-cover cursor-pointer mt-2'/>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input type="text" className='w-full p-3 border border-gray-200 rounded-lg text-[14px]' placeholder='Please enter your full name' onChange={(e) => setForm({...form, full_name: e.target.value})} value={form.full_name}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UserName
              </label>
              <input type="text" className='w-full p-3 border border-gray-200 rounded-lg text-[14px]' placeholder='Please enter username' onChange={(e) => setForm({...form, username: e.target.value})} value={form.username}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea rows={3} className='w-full text-[13px] p-3 border border-gray-200 rounded-lg' placeholder='Please Bio' onChange={(e) => setForm({...form, bio: e.target.value})} value={form.bio}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input type="text" className='w-full p-3 border border-gray-200 rounded-lg text-[14px]' placeholder='Please enter your location' onChange={(e) => setForm({...form, location: e.target.value})} value={form.location}/>
            </div>
            <div className='flex justify-end space-x-3 pt-6'>
              <button onClick={() => setShowEdit(false)} type='button' className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95  duration-200 cursor-pointer'>Cancel</button>

              <button type='submit' className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer hover:scale-105 active:scale-95  duration-200'>Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 

export default ProfileModal
