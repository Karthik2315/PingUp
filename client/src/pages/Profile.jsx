import React, { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import Loading from '../components/Loading';
import UserProfileInfo from '../components/UserProfileInfo';
import PostCard from '../components/PostCard';
import moment from 'moment';
import ProfileModal from '../components/ProfileModal';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';
import {toast} from 'react-hot-toast';
import { useSelector } from 'react-redux';

const Profile = () => {
  const currentUser = useSelector((state) => state.user.value)
  const {getToken} = useAuth()
  const {profileId} = useParams();
  const [user,setUser] = useState(null);
  const [posts,setPosts] = useState([]);
  const [activeTab,setActiveTab] = useState('posts');
  const [showEdit,setShowEdit] = useState(false);
  const fetchData = async(profileId) => {
    const token = await getToken();
    try {
          const {data} = await api.post(`/api/user/profiles`,{profileId},{
            headers:{
              Authorization:`Bearer ${token}`
            }
          })
          if(data.success){
            setUser(data.profile);
            setPosts(data.posts);
          }else{
            toast.error(data.message);
          }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }
  useEffect(() => {
    if(profileId)
    {
      const temp = async() => {
        await fetchData(profileId);
      }
      temp();
    }else{
      const temp = async() => {
        await fetchData(currentUser._id);
      }
      temp();
    }

  },[profileId,currentUser]);
  return user ? (
    <div className='relative min-h-screen overflow-y-scrollbar no-scrollbar bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
      {/*Profile card */}
      <div className='bg-white shadow rounded-2xl overflow-hidden'>
        {/* Cover Photo */}
        <div className='h-56 bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200'>
          {user.cover_photo && <img src={user.cover_photo} className='object-cover w-full h-full' />}
        </div>
        <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
      </div>
      <div className='mt-6'>
        <div className='bg-white rounded-xl flex mx-auto max-w-md gap-2'>
          {["posts","media","likes"].map((tab) => (
            <div key={tab} className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer hover:scale-105 active:scale-95 duration-200
              ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}
              onClick={() => setActiveTab(tab)}>  
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>
        {activeTab ==='posts' && (
          <div className='flex flex-col items-center gap-6'>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
        {activeTab ==='media' && (
          <div className='flex flex-warp mt-6 max-w-6xl gap-6'>
            {
              posts.filter((post) =>post.image_urls.length>0).map((post)=>(
                <>
                  {post.image_urls.map((image,index)=>(
                    <Link target='_blank' to={image} key={index} className='relative group'>
                      <img src={image} key={index} className='w-64 aspect-video object-cover rounded-lg' />
                      <p className='absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blue-xl text-white opacity-0 group-hover:opacity-100 transition duration-300'>
                        Posted {moment(post.createdAt).fromNow()}
                      </p>
                    </Link>
                  ))}
                </>
              ))  
            }
          </div>
        )}
      </div>
      </div>
      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  ) : (<Loading />)
}

export default Profile
