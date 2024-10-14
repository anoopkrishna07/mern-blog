import React from 'react'
import {Button} from 'flowbite-react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import { app } from '../firebase'
import {useDispatch, useSelector} from 'react-redux';
import {signinStart, signinSuccess, signinFailure} from '../redux/user/userslice.js';
import { Link, useNavigate } from 'react-router-dom';

export default function OAuth() {
   const auth = getAuth(app);
   const navigate = useNavigate();
   const dispatch = useDispatch();
    const handleGoogle = async () =>{
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account'});
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL
                })

        })
        const data = await res.json()
        if(res.ok){
            dispatch(signinSuccess());
            navigate('/');
        }
            
        } catch(error) {
            console.log(error);
            
        }
    }

  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogle}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}
