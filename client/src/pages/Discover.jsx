import React, { useEffect, useState } from 'react'
import { SearchIcon } from 'lucide-react'
import UserCard from '../components/UserCard'
import { useAuth } from '@clerk/clerk-react'
import Loading from '../components/Loading'
import api from '../api/axios'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../features/users/userSlice'

const Discover = () => {
  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const {getToken} = useAuth()
  const dispatch = useDispatch();
  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        setUsers([]);
        setLoading(true);
        const token = await getToken();
        const {data} = await api.post('/api/user/discover',{input},{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if(data.success){
          setUsers(data.users);
          setLoading(false);
        }else{
          console.log('Error searching users:', data.message);
          setLoading(false);
        }
        setInput('');
      } catch (error) {
        console.log('Error searching users:', error)
      }
    }
  }
  useEffect(()=>{
    getToken().then((token) => dispatch(fetchUser(token)));
  },[])
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
