    import React, { useEffect } from 'react'
    import { useState, useRef } from 'react';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';

    function Profile() {
        let [name,setName]=useState('');
        const navigate = useNavigate();
        const titleRef = useRef(null);
        const descRef = useRef(null);
        const [message, setMessage] = useState('');
        const [messageColor, setMessageColor] = useState('text-green-600');
        const [row, setRow] = useState([]);
        const [title, setTitle] = useState('');
        const [desc, setDesc] = useState('');
        let alreadyfetch = useRef(false);
        const addrow = () => {
            if (desc.length && title.length) {
                const newrow = {
                    sno: row.length + 1,
                    Title: title.trim(),
                    Description: desc.trim(),
                };
                setRow((prev) => [...prev, newrow]);
                setTitle('');
                setDesc('');
                setMessage('Passwords Added Successfully')
            } else {
                setMessage('Please enter all the fields');
                setMessageColor('text-red-400')
            }
        };
        const delete_row = (delindex) => {
            del(delindex);
            const newrow = row.filter((items, i) => i != delindex)

            newrow.map((item, index) => {
                item.sno = index + 1;
            })
            setRow(newrow);
        }
        async function edit_row(idx) {
            let id = await getid();
            navigate(`/edit/${id}/${idx}`);
        }

        async function del(delindex) {
            let id = await getid();
            let res = await axios.post(`/api/del/${id}`, { delindex }, { withCredentials: true })
            let data = res.data.success;
            if (data)
                console.log("Deleted Successfullly");
            else
                console.log("NOt deleted");
            navigate(`/profile/${id}`);
        }
        async function logout() {
            setRow([]);
            let res = await axios.get('/api/logout', { withCredentials: true });
            navigate('/login');

        }
        async function getid() {
            try{
            let res = await axios.get('/api/getid', { withCredentials: true });
            return res.data.id;
            }
            catch{
                logout();
            }
        }
        async function send_data(sitename, password) {
            let id = await getid();
            let res = await axios.post(`/api/create/${id}`, { sitename, password }, { withCredentials: true });
            navigate(`/profile/${id}`);
        }
        useEffect(()=>{
            if(message.length>0){
                const time = setTimeout(()=>{setMessage('')},2000);
                return ()=>clearTimeout(time);
            }
            
        },[message])
        useEffect(() => {
            const fetchData = async () => {
            await get_data();
            };
            fetchData();
        }, []);
        async function get_data() {
            let id = await getid();
            let res = await axios.get(`/api/show/${id}`, { withCredentials: true });
            let data = res.data.passwords;
            
            let rows = data.map((key, index) => (
                { sno: index + 1, Title: key.sitename, Description: key.password }

            ));
            setName(res.data.name);
            setRow(rows);
        }
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 text-gray-800 p-6">
                <div className='w-full flex justify-end'>
                    <button className=' bg-red-500 rounded-2xl text-md mx-10 mt-2 px-4 text-white py-1' onClick={() => logout()}>Logout</button>
                </div>
                <div className="ml-6 text-2xl font-semibold text-gray-700">Welcome Back, {name}</div>
                <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl  my-5 p-10">
                    <div className='flex row mb-4 items-end gap-5'>
                        <img className='w-16 h-20 object-cover object-center rounded-md' src='/logo.png' alt="App icon" />
                        <h1 className="text-3xl font-bold text-blue-600 mb-6 flex items-center ">Password Manager</h1>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Website name</label>
                            <textarea ref={titleRef}
                                rows={1}
                                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter the Site Name..."
                                value={title}

                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input type='text' ref={descRef}

                                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter the Password..."
                                value={desc}

                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => { const sitename = title; const password = desc; addrow(); send_data(sitename, password) }}
                            className="bg-blue-400 hover:bg-blue-900 active:bg-green-500 text-white font-semibold rounded-lg px-6 py-2 mt-2 "
                        >Add Password
                        </button>
                    </div>
                    <div className={`mt-2 text-center text-sm font-medium ${message.length > 0 ? '' : 'hidden'} ${messageColor}`}>
                        {message}
                    </div>
                    <table className="w-full mt-6 table-auto text-left">
                        <thead>
                            <tr className="bg-blue-100 text-blue-800">
                                <th className="border-b w-3 border-blue-300">S.No.</th>
                                <th className="border-b w-1/2 border-blue-300 px-4 py-2">Website Name</th>
                                <th className="border-b border-blue-300 px-4 py-2">Password</th>
                                <th className="border-b w-5 border-blue-300 px-4 py-2 ">Actions</th>
                            </tr>
                        </thead>
                        <tbody className='px-4 py-2'>
                            {row.map((item, index) => (
                                <tr key={index} className="hover:bg-blue-50 transition">
                                    <td className="border-b border-gray-200 px-4 py-2">{item.sno}</td>
                                    <td className="border-b border-gray-200 px-4 py-2">{item.Title}</td>
                                    <td className="border-b border-gray-200 px-4 py-2">{item.Description}</td>
                                    <td className="border-b border-gray-200 px-4 py-2">
                                        <div className="flex gap-1 items-center justify-center">
                                            <button onClick={() => navigator.clipboard.writeText(item.Description)}>
                                                📋
                                            </button>
                                            <button onClick={() => delete_row(index)}>
                                                <img
                                                src='/trash.png'
                                                alt='Delete'
                                                className="h-6 w-6 "/>
                                            </button>
                                            <button onClick={() => edit_row(index)}>
                                                <img src='/edit.png'
                                                alt='Edit'
                                                
                                                className="h-4 w-4"/>
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    export default Profile;

