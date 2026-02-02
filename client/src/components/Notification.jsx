import React from 'react'
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-hot-toast';

const Notification = ({t,message}) => {
  const navigate = useNavigate();
  return (
    <div className={`max-w-md w-full bg-black text-white shadow-lg rounded-lg flex border border-gray-300  transition`}>
      <div className='flex-1 p-4'>
        <div className='flex items-start'>
          <img src={message.from_user_id.profile_picture} alt='' className='size-10 rounded-full mt-0.5 flex-shrink-0' />
          <div className='ml-3 flex-1'>
            <p className='text-sm font-medium'>{message.from_user_id.full_name}</p>
            <p className='text-gray-500 text-sm'>{message.text.slice(0,50)}</p>
          </div>  
        </div>
      </div> 
      <div className='flex'>
        <button onClick={()=>{navigate(`/messages/${message.from_user_id._id}`); 
        toast.dismiss(t.id)}} className='p-4 text-indigo-600 font-semibold cursor-pointer'>Reply</button>
      </div>
    </div>
  )
}

export default Notification
