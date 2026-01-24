import { ArrowLeft, Sparkles, TextAlignCenter, Upload } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import {useAuth} from '@clerk/clerk-react'
import api from '../api/axios';


const StoryModal = ({setShowModal,fetchStories}) => {

  const bgColors = ["#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ca8a04", "#0d9488"]
  const [mode, setMode] = useState("text")
  const [background, setBackground] = useState(bgColors[0])
  const [text, setText] = useState("")
  const [media, setMedia] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if(file)
    {
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }
  const {getToken} = useAuth()
  const handleCreateStory = async() => {
    const media_type = mode === "media" ? media?.type.startsWith('image') ? 'image':'video':'text';
    if(media_type === 'text' && !text)
    {
      throw new Error("Please Enter some text");
    }
    let formData = new formData();
    formData.append('content',text);
    formData.append('media_type',media_type);
    formData.append('media',media);
    formData.append('background_color',background);
    const token = await getToken();
    try {
      const {data} = await api.post('/api/story/create',formData,{
        headers: {
          'Authorization': `Bearer ${token}`,
      }});
      if(data.success){
        setShowModal(false);
        fetchStories();
      }else{
        console.log(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-4 flex items-center justify-between'>
          <button onClick={() => setShowModal(false)} className='text-white p-2 cursor-pointer'>
            <ArrowLeft />
          </button>
          <h2 className='text-lg font-semibold'>Create Story</h2>
          <span className='w-10'></span>
        </div>
        <div className='w-full h-[400px] rounded-md flex items-center justify-center' style={{backgroundColor: background}}>
          {mode ==='text' && 
          <textarea className='bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none' placeholder="what's your mind?" onChange={(e) => setText(e.target.value)} value={text}/>}
          {
            (mode ==='media' && previewUrl && (
              media?.type.startsWith('image/') ?
              <img src ={previewUrl} className='h-full w-full object-contain' /> :
              <video src={previewUrl} className='h-full w-full object-contain' controls />
            ))
          }
        </div>
        <div className='flex gap-2 mt-3'>
          {bgColors.map((color,index)=>(
            <div key={index} className='size-6 rounded-full cursor-pointer border border-amber-50' onClick={() => setBackground(color)} style={{background:color}}></div>
          ))}
        </div>
        <div className='flex gap-2 mt-2 items-center justify-between'>
          <button className={`flex items-center w-1/2 rounded-md cursor-pointer hover:scale-105 transition-all duration-300 active:scale-95 py-2 gap-2 ${mode === 'text' ? 'bg-white text-black' : 'bg-black/20'} justify-center`} onClick={() => {setMode('text');setMedia(null);setPreviewUrl(null)}}><TextAlignCenter className='size-4'/>Text</button>
          <label className={`flex items-center w-1/2 rounded-md cursor-pointer hover:scale-105 transition-all duration-300 active:scale-95 py-2 gap-2 ${mode === 'media' ? 'bg-white text-black' : 'bg-black/20'} justify-center`}>
          <input onChange={(e) => {handleMediaUpload(e);setMode('media')}} type='file' accept='image/*,video/*' className='hidden'/><Upload className='size-4'/>Photo/Video</label>
        </div>
        <button onClick={() => toast.promise(handleCreateStory(),{
          loading: 'Creating Story...',
          success: <p>Story Added</p>,
          error: e => <p>{e.message}</p>,
        })} className='flex items-center justify-center gap-2 text-white w-full py-2 mt-3 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer' ><Sparkles className='size-6 fill-white' />Create Story</button>
      </div>
    </div>
  )
}

export default StoryModal
