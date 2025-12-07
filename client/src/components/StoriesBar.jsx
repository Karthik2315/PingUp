import React, { useEffect, useState } from 'react'
import { dummyStoriesData } from '../assets/assets';
import { CirclePlus } from 'lucide-react';
import moment from 'moment';
import StoryModal from './StoryModal';
import StoryViewer from './StoryViewer';

const StoriesBar = () => {
  const [stories,setStories] = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [viewStory,setViewStory] = useState(null); 
  const dummyStories = dummyStoriesData;
  const getStories = async() => {
    setStories(dummyStories);
  }
  useEffect(()=>{
    const fetch = async()=>{
      await getStories(); 
    }
    fetch();
  },[]);
  return (
    <div className='max-w-[700px] no-scrollbar overflow-x-auto px-4 '>
      <div className='flex gap-4 pb-5 pt-4'>
        <div className='shrink-0 flex flex-col py-10 px-4 rounded-2xl  gap-1 items-center justify-center border-2 border-dashed border-blue-500 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 hover:group' onClick={() => setShowModal(true)}>
          <CirclePlus className='size-10 text-white fill-indigo-500'/>
          <p className='text-[13px] font-medium text-slate-700 hover:scale-105'>Create Story</p>
        </div>
        {
          stories.map((story,index)=>(
            <div key={index} className='shrink-0 relative rounded-lg shadow-md w-26 cursor-pointer transition-all duration-300 bg-gradient-to-b from-indigo-400 to-purple-300 hover:shadow-lg hover:scale-105 active:scale-95 flex flex-col items-center gap-2 p-2' onClick={() => setViewStory(story)}>
            <img src={story.user.profile_picture} className='size-8 absolute top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow'/>
            <p className='absolute top-18 text-center text-black text-sm truncate max-w-24'>{story.content}</p>
            <p className='text-white absolute bottom-1 right-2 z-10 text-xs'>{moment(story.createdAt).fromNow()}</p>
            {
              story.media_type !== 'text' && 
              <div className='absolute inset-0 z-1 rounded-lg bg-black overflow-hidden'>
                {
                  story.media_type === 'image' ? 
                  <img src={story.media_url} className='h-full w-full object-cover hover:scale-105 transition-all duration-500 opacity-70 hover:opacity-80' /> :
                  <video src={story.media_url} className='h-full w-full object-cover hover:scale-105 transition-all duration-500 opacity-70 hover:opacity-80' />
                }
              </div>
            }
            </div>
          ))
        }
      </div>
      {showModal && <StoryModal setShowModal={setShowModal} fetchStories={getStories} />}
      {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />}
    </div>
  )
}

export default StoriesBar
