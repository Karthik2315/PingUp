import React, { useState } from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { SearchIcon } from 'lucide-react'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'

const Discover = () => {
  const [input, setInput] = useState('')
  const [users, setUsers] = useState(dummyConnectionsData)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      setUsers([])
      setLoading(true)
      setTimeout(() => {
        setUsers(dummyConnectionsData)
        setLoading(false)
      }, 1000)
    }
  }
  return (
  <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
    <div className='max-w-6xl mx-auto p-6'>

      {/* Title */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover People</h1>
        <p className='text-slate-600'>Connect with amazing people and grow your network</p>
      </div>
      {/* Search Input */}
      <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
        <div className='p-6  flex items-center gap-4'>
        <SearchIcon className=' text-slate-400 size-5' />
        <input type='text' placeholder='Search people by name, username, bio or location ...' className='pl-10 py-2 w-full border border-gray-300 rounded-md' onChange={(e) => setInput(e.target.value)} value={input} onKeyUp={handleSearch} />
        </div>
      </div>
      <div className='flex flex-wrap gap-6'>
        {users.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
      {loading && <Loading height='60vh' />}
    </div>
  </div>
  )
}

export default Discover
