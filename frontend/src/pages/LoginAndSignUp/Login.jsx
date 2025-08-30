import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import  axios  from 'axios';

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  function handleLogin(event) {
    event.preventDefault();

    // axios.post('http://localhost:5000/users/login', {email, password})
    //   .then(response => {
    //      const user = response.data.user;

    //     localStorage.setItem('user', JSON.stringify(user))
    //     console.log('login data: ', user);

    //     navigate('/home');
    //   }).catch(error => {
    //     console.error('Login Failed: ', error.response?.data || error.message)
    //   });

    axios.post('http://localhost:5000/users/login', {email, password})
      .then(response => {
         const user = response.data.user;

        // Set the user data in cookies
        Cookies.set('user', JSON.stringify(user), { expires: 7 }); // Expires in 7 days

        console.log('login data: ', user);

        navigate('/home');
      }).catch(error => {
        console.error('Login Failed: ', error.response?.data || error.message);
      });
  };


  return (
    <div className='grid grid-cols-[60%_40%] place-items-center h-screen overflow-hidden'>
        <div className='block items-center box-border w-auto h-100% overflow-hidden'>
          <img src="src/assets/stray-cat.jpg" alt="stray-cat" />
        </div>

        <div className='flex flex-col items-center gap-10 w-100% max-h-100% bg-[#FFF] p-20 rounded-[25px] shadow-md'>
          <div className='w-[250px] max-w-auto'>
            <img src="src/assets/whiskerwatchlogo-vertical.png" alt="" />
          </div>
          
          <form onSubmit={handleLogin} className="flex flex-col items-center gap-10">
          <input
            type="email"
            id="userEmail"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="border-b-2 border-b-[#A8784F] p-2"
          />
          <input
            type="password"
            id="userPassword"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            className="border-b-2 border-b-[#A8784F] p-2"
          />
          <div className="flex flex-col items-center">
            <div className="flex flex-row gap-1 justify-stretch">
              <button
                type="submit"
                className="bg-[#B5C04A] text-[#FFF] p-[10px] w-30 rounded-[50px] active:bg-[#CFDA34] cursor-pointer"
              >
                Log in
              </button>
              <Link
                to="/signup"
                className="bg-amber-600 text-[#FFF] p-[10px] w-30 text-center rounded-[50px] active:bg-[#977655]"
              >
                Sign Up
              </Link>
            </div>
            <Link to="/adminlogin" className="pt-4 active:text-[#977655] hover:underline">
              Log in as Admin
            </Link>
          </div>
        </form>
          {/* {userEmail && <p>Logged in as: {userEmail}</p>}
          {error && <p>Error: {error}</p>} */}
          
        </div>

    </div>

    
  )
}

export default Login


