import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import RecentMessages from '../components/RecentMessages';
import {useAuth} from '@clerk/clerk-react'
import toast from 'react-hot-toast';
import api from '../api/axios';
const Feed = () => {
  const [feeds,setFeeds] = useState([]);
  const [loading,setLoading] = useState(true); 
  const {getToken} = useAuth();
  const getFeeds = async() => {
    try {
      const token = await getToken();
      const {data} = await api.get('/api/post/feed',{
        headers:{
          'Authorization': `Bearer ${token}`,
        }
      })
      if(data.success){
        setFeeds(data.posts);
      }else{
        console.log(data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(()=>{
    const fetchData = async()=>{
      await getFeeds();
      setLoading(false);
    }
    fetchData();
  },[])
  return !loading ?  (
    <div className='w-full flex justify-between min-h-screen  py-1'>
    {/* stories and posts here */}
      <div className='w-[800px]'>
        <StoriesBar />
        <div className='p-4 space-y-6'>
          {feeds.map((post,index)=>(
            <PostCard key={index} post={post} />
          )) }
        </div>
      </div>
    {/* Right Sidebar */}
      <div className='w-[420px]'>
        <RecentMessages />
      </div>
    </div>
  ) : <Loading />
}

export default Feed
