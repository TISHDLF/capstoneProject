import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import  axios  from 'axios';



const SignUp = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [contactnumber, setContactNumber] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const HandleSignUp = async(event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const samePassword = 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#B5C04A]';
        const diffPassword = 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#d23f07]';
        if (password !== confirmPassword) {
            setPasswordMatchError(true);
            setError('Password do not match!') ;
            setLoading(false);
            return;
        } else {
            setPasswordMatchError(false);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/users/signup', {
                firstname, 
                lastname, 
                contactnumber, 
                birthday, 
                email, 
                username, 
                address,
                password,
            });

            console.log('Signup response:', res.data);
            
            if (res.status === 201 || res.status === 200) {
                console.log('Signup successful: ', res.data);
                navigate('/login');
            }
        } catch(error) {
            setError(error.response?.data?.error || 'An error occurred during signup');
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    }

    const maxlength = 11;

    return (
        <div className='grid grid-cols-[50%_50%] place-items-center h-screen overflow-hidden'> 
            <div className='block items-center box-border w-auto h-100% overflow-hidden'>
                <img src="src/assets/stray-cat.jpg" alt="stray-cat" />
            </div>

            <div className='flex flex-col gap-8 items-center bg-[#FFF] p-12 rounded-[25px] shadow-md'>
                <div className='max-w-[200px]'>
                    <img src="src/assets/whiskerwatchlogo-vertical.png" alt="" />
                </div>
                <form onSubmit={HandleSignUp} className='grid grid-cols-2 gap-5'>
                    <input type="text" placeholder='First Name' value={firstname} onChange={(e) => setFirstname(e.target.value)} required className='border-b-2 border-b-[#A8784F] p-2' />
                    <input type="text" placeholder='last Name' value={lastname} onChange={(e) => setLastname(e.target.value)} required className='border-b-2 border-b-[#A8784F] p-2' />
                    <input type="tel" placeholder='Contact Number' maxLength={11} value={contactnumber}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Allow only digits
                        if (value.length <= 11) {
                            setContactNumber(value);
                        }
                    }} required className='[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [appearance:textfield] border-b-2 border-b-[#A8784F] p-2' />
                    <div className='flex gap-2 items-center'>
                        <label className='text-[#737373]'> Date of Birth </label>
                        <input type="date" placeholder='Date of Birth' value={birthday} onChange={(e) => setBirthday(e.target.value)} required className='border-b-2 border-b-[#A8784F] p-2' />
                    </div>
                    <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required className='border-b-2 border-b-[#A8784F] p-2' />
                    <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required className='border-b-2 border-b-[#A8784F] p-2' />
                    <input type="text" placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} required className='border-b-2 border-b-[#A8784F] p-2 col-span-2' />
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required
                        className={password === confirmPassword ? 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#B5C04A]' : 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#000000]'} />
                    <input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                        className={password === confirmPassword ? 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#B5C04A]' : 'border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#d23f07]'} />
                
                    <div className='flex flex-col items-center gap-3 col-span-2'>
                        <label>{error}</label>
                        <button type='Submit' disabled={loading} className='p-2 bg-[#B5C04A] w-[125px] text-[#FFF] rounded-[50px] active:bg-[#CFDA34] cursor-pointer'> {loading ? 'Signing Up...' : 'Sign Up'} </button>
                        <label htmlFor="">
                            Already a member of WhiskerWatch?
                            <Link to="/login" className='font-normal md:font-bold hover:underline text-[#B5C04A]'> Log in </Link>
                            instead!
                            </label>
                    </div>

                </form>
                
            </div>
        </div>
  )
}

export default SignUp