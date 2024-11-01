import { TextInput, Button } from 'flowbite-react';
import React, {useState, useRef} from 'react'
import {useSelector} from 'react-redux'

export default function DashProfile() {
  const {currentUser} = useSelector((state) => state.user);
  const [imagefile, setimagefile] = useState(null);
  const [imagefileurl, setimagefileurl] = useState(null);
  const filepickerref= useRef();

  const handleImageChange = (e) =>{
    const file = e.target.files[0];
    if(file) {
      setimagefile(file);
      setimagefileurl(URL.createObjectURL(file));
    }
  };
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filepickerref} hidden/>
        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filepickerref.current.click()}>
        <img src={imagefileurl || currentUser.profilePicture} alt="user" className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'/>
        </div>
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}/>
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email}/>
        <TextInput type='password' id='password' placeholder='password'/>
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
