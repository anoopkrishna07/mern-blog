import React, { useState } from 'react'
import {Alert, Button, FileInput, Select, TextInput} from 'flowbite-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

export default function Createpost() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false) {
        setPublishError(data.message);
        return
      }
      if(res.ok) {
        setPublishError(null);
        navigate(`/posts/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <Select onChange={(e) => setFormData({...formData, category: e.target.value})}>
            <option value='uncategorized'>Select a category</option>
            <option value='cat1'>Category 1</option>
            <option value='cat2'>Category 2</option>
            <option value='cat3'>Category 3</option>
          </Select>
        </div>
        <div className='flex gap-4 justify-between items-center border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
          <Button type='button' size='sm' gradientDuoTone='purpleToBlue' outline>
            Upload Image
          </Button>
        </div>
        <ReactQuill theme='snow' placeholder='Write content here' className='h-72 mb-12' required onChange={(value) => setFormData({...formData, content: value})} />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
        {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
      </form>
    </div>
  )
}
