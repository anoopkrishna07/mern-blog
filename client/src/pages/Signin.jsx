import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import {signinStart, signinSuccess, signinFailure} from '../redux/user/userslice.js';
import OAuth from '../components/OAuth.jsx';

export default function Signin() {
  const [formData, setformData] = useState({});
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) =>{
    setformData({...formData, [e.target.id]: e.target.value.trim() })
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(!formData.email || !formData.password){
      return dispatch(signinFailure('Please fill out all fields.'));
    }
    try{
        dispatch(signinStart());
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if(data.success === false){
          dispatch(signinFailure(data.message));
        }
        if(res.ok){
          dispatch(signinSuccess(data));
          navigate('/');
        }
    } catch(error) {
        dispatch(signinFailure(error.message));
    }
  
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className='flex-1'>
        <Link to="/" className='font-bold dark:text-white text-4xl'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Anoop's</span>
        Blog
        </Link>
        <p className='text-sm mt-5'>
           You can sign in with your email and password.
           Or with Google.
        </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}

                />
            </div>
            <div>
              <Label value='Password' />
              <TextInput
                type='password'
                placeholder='**********'
                id='password'
                onChange={handleChange}

                />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                  <Spinner size='sm' />
                  <span className='pt-3'>Loading...</span>
                  </>
                 ) : 'Sign In'
              }
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Dont have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>
            Sign Up
            </Link>
          </div>
          {errorMessage &&
          <Alert className='mt-5' color='failure'>
            {errorMessage}
          </Alert>}
        </div>
      </div>
    </div>
  )
}
