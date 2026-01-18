import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='min-h-screen flex flex-row'>
      <img src={assets.bgImage} alt="Background" className='absolute top-0 left-0 -z-1 w-full h-full object-cover'/>
      <div className='flex-1 flex flex-col items-start justify-between p-6 pl-40'>
        <img src={assets.logo} alt="Logo" className='h-12'/>
        <div>
          <h1 className='font-bold text-6xl bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent pb-2'>More than just friends truly connect</h1>
          <p className='text-3xl text-indigo-900 max-w-108'>
            connect with global community on PingUp
          </p>
        </div>
        <span className='md:h-10'></span>
      </div>
      <div className='flex-1 flex items-center justify-center p-6'>
        <SignIn/>
      </div>
    </div>
  )
}

export default Login
