import React, { useEffect } from 'react'
import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Edit() {
    const {id,idx}=useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    async function show() {
        let res = await axios.get(`/api/edit/${id}/${idx}`,{withCredentials:true});
        setTitle(res.data.sitename);
        setDesc(res.data.password);
    }
    useEffect(()=>{
        show();
    },[]);
    async function change(sitename,password) {
        let res = await axios.post(`/api/edit/${id}/${idx}`,{sitename,password},{withCredentials:true});
        if(res.data.success == true)
            navigate(`/profile/${id}`);
        else
            console.log("something went wrong");
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 text-gray-800 p-6">
            <div className='w-full flex justify-end'>
                <button className=' bg-red-500 rounded-2xl text-2xl mx-10 my-4 px-4 text-white py-1' onClick={(e) => logout(e)}>Logout</button>
            </div>
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl  my-10 p-10">
                <div className='flex row mb-4 items-end gap-5'>
                    <img className='w-16 h-20 object-cover object-center rounded-md' src='/logo.png' alt="App icon" />
                    <h1 className="text-3xl font-bold text-blue-600 mb-6 flex items-center ">Password Manager</h1>
                </div>
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Website name</label>
                        <textarea
                            rows={1}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter the Site Name..."
                            value={title}
                            
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input type='text'
                            
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter the Password..."
                            value={desc}
                            
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={()=>{const sitename =title;const password = desc;change(sitename,password)}}
                        className="bg-blue-400 hover:bg-blue-900 active:bg-green-500 text-white font-semibold rounded-lg px-6 py-2 mt-2 "
                    >Update The Password
                    </button>
                </div>

                
            </div>
        </div>
    );
}

export default Edit;

