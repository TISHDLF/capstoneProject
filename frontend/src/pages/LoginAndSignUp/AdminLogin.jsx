import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import  axios  from 'axios';
import Cookies from 'js-cookie'

const AdminLogin = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    function handeAdminLogin(event) {
        event.preventDefault();

        axios.post('http://localhost:5000/users/adminlogin', {username, role, password})
            .then(response => {
                const user = response.data.user;

                if (!user) {
                    setError('Invalid Credentials');
                    return;
                } 


                console.log(user)
                Cookies.set('user', JSON.stringify(user), { expires: 30 }); 
                const dashboardPath = user.role === 'admin' ? '/dashboard' : '/testhvhomepage';
                navigate(dashboardPath);
                
            })
            .catch((err) => {
                const errorMessage =
                err.response?.data?.error || 
                err.response?.data?.message || 
                'Login Failed: Incorrect Username or Password';
                setError(errorMessage);
                console.error('Login error:', errorMessage);
            });
    }

    return (
        <div className='grid grid-cols-[60%_40%] place-items-center h-screen overflow-hidden'>
            <div className='block items-center box-border w-auto h-100% overflow-hidden'>
            <img src="src/assets/stray-cat.jpg" alt="stray-cat" />
            </div>
            <div className='flex flex-col items-center gap-10 w-100% min-w-[200px] h-auto bg-[#FFF] p-15 rounded-[25px] shadow-md'> 
                <div className='max-w-[250px]'>
                    <img src="src/assets/whiskerwatchlogo-vertical.png" alt="" />
                </div>
                <form onSubmit={handeAdminLogin} className='flex flex-col items-center gap-8'>
                    <input type="text" placeholder='Username' value={username} onChange={(event) => setUsername(event.target.value)} className='border-b-2 border-b-[#977655] p-2' />
                    <select value={role} onChange={(event) => setRole(event.target.value)} className='border-b-2 border-b-[#977655] w-full p-2'>
                        <option value="" disabled hidden>Select a role</option>
                        <option value="admin"> Admin </option>
                        <option value="head_volunteer" > Head Volunteer </option>
                    </select>
                    <input type="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} className='border-b-2 border-b-[#977655] p-2' />

                    <div className='flex gap-2'>
                        <button className='bg-[#DC8801] text-[#FFF] w-30 text-center p-2 rounded-[25px] cursor-pointer active:bg-[#977655]'> Log In </button>
                        <Link to="/login" replace className='border-2 border-[#DC8801] text-[#DC8801] w-30 text-center p-2 rounded-[25px] active:bg-[#977655] active:text-[#FFF] active:border-[#977655]'> Cancel </Link>
                    </div>
                </form>
                    {error && (
                    <div className='mb-4 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-[14px]'>
                        {error}
                    </div>
                    )}
            </div>
        </div>
    )
}

export default AdminLogin