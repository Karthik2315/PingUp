import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import RecentMessages from '../components/RecentMessages';

const Feed = () => {
  const [feeds,setFeeds] = useState([]);
  const [loading,setLoading] = useState(true); 
  const dummyFeeds = dummyPostsData;
  const getFeeds = async() => {
    setFeeds(dummyFeeds)
  }
  useEffect(()=>{
    const fetchData = async()=>{
      await getFeeds();
      setLoading(false);
    }
    fetchData();
  },[])
  return !loading ?  (
    <div className='w-full flex justify-between min-h-screen  py-10'>
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
