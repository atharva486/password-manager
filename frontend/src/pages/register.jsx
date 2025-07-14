import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Register() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    async function send() {
        if (!username || !email || !password) {
            setError("Please fill in all the fields.");
            return;
        }

        try {
            const res = await axios.post('/api/register', {
                name: username,
                email,
                password
            }, { withCredentials: true });

            if (res.data.success === true) {
                navigate('/login');
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (err) {
            setError("Server error. Please try again later.");
        }
    }
    function login(e){
      navigate('/login');
    }
    function register(e) {
        e.preventDefault();
        send();
        setUsername('');
        setEmail('');
        setPassword('');
    }

    return (
        <div className="h-screen w-full bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center py-10 gap-10">
            <div className='w-full flex justify-end items-center gap-1 px-10'>
                <div className='4xl'>Already have a Account?</div>
                <button className=' bg-blue-500 rounded-2xl text-md my-4 px-4 text-white py-1' onClick={(e) => login(e)}>Login</button>
            </div>
            <form onSubmit={register} className="bg-white shadow-2xl p-10 rounded-2xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Register</h1>

                {error && (
                    <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
                )}

                <div className="mb-5">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
}

export default Register;
