import { TextInput, Button, Alert, Modal } from 'flowbite-react';
import React, {useState, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { updateStart, updateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure, signoutSuccess } from '../redux/user/userslice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {Link} from 'react-router-dom';

export default function DashProfile() {
  const {currentUser, error, loading} = useSelector((state) => state.user);
  const [imagefile, setimagefile] = useState(null);
  const [imagefileurl, setimagefileurl] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const filepickerref= useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) =>{
    const file = e.target.files[0];
    if(file) {
      setimagefile(file);
      setimagefileurl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if(Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }
      else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess('User profile updated successfully');
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () =>{
    setShowModel(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if(!res.ok) {
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess(data));
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const handleSignOut = async () =>{
    try {
      const res = await fetch(`/api/user/signout`, {
        method: 'POST'
      });
      const data = await res.json();
      if(!res.ok) {
        console.log(data.message);
        
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
        console.log(error);
      }
  };
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filepickerref} hidden/>
        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filepickerref.current.click()}>
        <img src={imagefileurl || currentUser.profilePicture} alt="user" className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'/>
        </div>
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading}>
          {loading ? 'Loading...' : 'Update'}
        </Button>
        {currentUser.isAdmin && (
          <Link to='/create-post'>
          <Button type='button' className='w-full' gradientDuoTone='purpleToPink'>
            Create a post
          </Button>
          </Link>
        )}
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModel(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
       <Alert color='success' className='mt-5'>
        {updateUserSuccess}
       </Alert> )
      }
      {updateUserError && (
       <Alert color='failure' className='mt-5'>
        {updateUserError}
       </Alert> )
      }
      {error && (
       <Alert color='failure' className='mt-5'>
        {error}
       </Alert> )
      }
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 mx-auto mb-4 text-gray-400 dark:text-gray-200'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModel(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
