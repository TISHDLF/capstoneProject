import React from 'react'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useLocation, useParams } from 'react-router-dom'

import NavigationBar from '../../components/NavigationBar'
import Footer from '../../components/Footer'
import SideNavigation from '../../components/SideNavigation'


// TODO: Add certificate view 
// Certicate to be emailed upon successful adoption

const Profile = () => {
    const location = useLocation();
    const [profile, setProfile] = useState([]);
    const [updateProfile, setUpdateProfile] = useState(false);
    const [originalProfile, setOriginalProfile] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/profile`, {
                    withCredentials: true
                }); 
                const res = JSON.stringify(response.data)
                console.log('User fetched: ', response.data)

                setProfile(response.data);
            } catch (err) {
                 console.error('Error fetching user:', err.response?.data || err.message);
            }
        }
        fetchProfile()
    }, [])


    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview immediately
        const previewUrl = URL.createObjectURL(file);

        // Set temporary preview and store file
        setProfile(prev => ({
            ...prev,
            profile_image: previewUrl, // Show preview immediately
            _newFile: file,             // Store actual file to upload later
            old_image: prev.profile_image // Keep track of old filename
        }));
    };

    const handleSave = async () => {

        try {
            const formData = new FormData();

            // Append text fields
            formData.append('firstname', profile.firstname);
            formData.append('lastname', profile.lastname);
            formData.append('address', profile.address);
            formData.append('email', profile.email);
            formData.append('birthday', profile.birthday);
            formData.append('badge', profile.badge); // if needed

            // If there's a new file, include it
            if (profile._newFile) {
                formData.append('profile_image', profile._newFile);
                formData.append('old_image', profile.old_image || '');
            }

            const response = await axios.patch('http://localhost:5000/user/profile/update', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("Profile updated:", response.data);

            URL.revokeObjectURL(profile.profile_image); 


            // AFTER REPLACING SOME INFOS ON THE UPDATE VIEW, REFETCH THE DATA TO SEE CHANGES ON THE READ VIEW
            const updated = await axios.get('http://localhost:5000/user/profile', { withCredentials: true });

            setProfile(updated.data);
            setOriginalProfile(updated.data);
            setUpdateProfile(false);

        } catch (err) {
            console.error("Failed to update profile", err);
        }
    };

    const profileUpdateWindow = () => {
        if (updateProfile) {
            // User is canceling the edit
            setProfile(originalProfile); // Restore the original
        } else {
            // User is starting the edit
            setOriginalProfile(profile); // Save current state before editing
        }
        setUpdateProfile(prev => !prev);
    }


    useEffect(() => {
        return () => {
            if (profile.profile_image?.startsWith('blob:')) {
                URL.revokeObjectURL(profile.profile_image);
            }
        };
    }, []);


    

    return (
        <div className='flex flex-col min-h-screen pb-10'>
            <NavigationBar />

            <div className='grid grid-cols-[80%_20%] h-full'>
                <div className='flex flex-col pl-50 p-10'>
                    {/* ALL CONTENTS HERE */}
                    <div className='grid grid-cols-[20%_80%] bg-[#FFF] rounded-[12px] overflow-hidden'>
                        <div className='flex flex-col gap-10 pt-10'>
                            <div className='flex flex-row justify-between items-center p-3 bg-[#FFF] rounded-tr-[20px] rounded-br-[20px] shadow-md'>
                                <label className='font-bold text-[#DC8801]'>My Profile</label>
                                <div className='flex items-center justify-center w-[30px] h-auto'> 
                                    <img src="/src/assets/icons/account.png" alt="white clipboard" className='w-full h-auto '/>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col bg-[#FFF] p-10 gap-5'>
                            <div className='flex flex-col gap-4 bg-[#FDF5D8] p-10 rounded-[15px] shadow-md'>
                                {/* MAIN PROFILE */}

                                {!updateProfile && (
                                    <>
                                        {profile && (
                                            <div className='relative flex flex-row gap-5'>
                                                <div className='flex w-[250px] h-[200px] bg-[#B5C04A] rounded-sm p-2'>
                                                    <img src={`http://localhost:5000/FileUploads/${profile.profile_image}` || '/src/assets/UserProfile/default_profile_image.jpg'} alt="" className='w-full h-full object-cover'/>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <div className='flex flex-row gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                        <label className='font-bold'>Name:</label>
                                                        <label>{`${profile.firstname} ${profile.lastname}`}</label>
                                                    </div>
                                                    <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                        
                                                        <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                            <div className='w-[30px] h-auto'>
                                                                <img src="/src/assets/icons/location-orange.png" alt="" />
                                                            </div> 
                                                            Address: 
                                                        </label>
                                                        <label> {profile.address} </label>
                                                    </div>
                                                    <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                        <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                            <div className='w-[30px] h-auto'>
                                                                <img src="/src/assets/icons/email-orange.png" alt="" />
                                                            </div> 
                                                            Email: 
                                                        </label>
                                                        <label>{profile.email}</label>
                                                    </div>
                                                    <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                        <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                            <div className='w-[30px] h-auto'>
                                                                <img src="/src/assets/icons/birthday-cake.png" alt="" />
                                                            </div> 
                                                            Birthday: 
                                                        </label>
                                                        <label>{profile.birthday}</label>
                                                    </div>
                                                    <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                        <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                            <div className='w-[30px] h-auto'>
                                                                <img src="/src/assets/icons/badge-orange.png" alt="" />
                                                            </div> 
                                                            Badge: 
                                                        </label>
                                                        <label>{profile.badge}</label>
                                                    </div>
                                                    <label className='leading-tight text-[14px] pt-4 pb-2 text-[#645e5f]'>
                                                        You've received the <strong>Snuggle Scout</strong> badge! You're cuddly corners and warming hearts along the way. <br/>
                                                        Thanks for your growing support! Your cozy contributions don't go unnoticed!
                                                    </label>
                                                </div>
                                                <div className='absolute bottom-0 left-0 flex flex-row gap-2'>
                                                    <button onClick={profileUpdateWindow} className='bg-[#B5C04A] min-w-[90px] p-2 rounded-[10px] text-[#000] hover:bg-[#CFDA34] active:bg-[#B5C04A]'>Edit Profile</button>
                                                </div>              
                                            </div>     
                                        )}
                                    </>
                                )}

                                {updateProfile && (
                                    <>
                                    {profile && (
                                        <form onSubmit={handleSave} className='relative flex flex-row gap-5'>
                                            <div className='relative flex w-[250px] h-[200px] bg-[#B5C04A] rounded-sm p-2'>
                                                <label htmlFor="profile_image" className='absolute bottom-3 left-3 bg-[#DC8801] rounded-[15px] cursor-pointer  pl-2 pr-2'>
                                                    <label htmlFor="profile_image" className='cursor-pointer text-[#FFF] text-[12px]'>{!profile.profile_image ? 'Add Photo' : 'Replace'}</label>
                                                    <input type="file" onChange={handleImageChange}
                                                    accept='image/jpeg, image/png' id="profile_image" hidden/>
                                                </label>
                                                <img src={
                                                    profile.profile_image?.startsWith('blob:') 
                                                    ? profile.profile_image
                                                    : profile.profile_image
                                                        ? `http://localhost:5000/FileUploads/${profile.profile_image}`
                                                        : '/src/assets/UserProfile/default_profile_image.jpg'} alt="" 
                                                className='w-full h-full object-cover'/>
                                            </div>
                                            
                                            <div className='flex flex-col'>
                                                <div className='flex flex-row w-full gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                    <div className='flex items-center gap-2'>
                                                        <label className='font-bold'>Firstname:</label>
                                                        {/* <label>{`${profile.firstname} ${profile.lastname}`}</label> */}
                                                        <input type="text" className='w-full' value={profile.firstname || ''}
                                                        onChange={(e) => setProfile((prev) => ({...prev, firstname: e.target.value}))}/>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <label className='font-bold'>Lastname:</label>
                                                        <input type="text" className='w-full' value={profile.lastname || ''} 
                                                        onChange={(e) => setProfile((prev) => ({...prev, lastname: e.target.value}))}/>
                                                    </div>
                                                </div>
                                                <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                    
                                                    <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                        <div className='w-[30px] h-auto'>
                                                            <img src="/src/assets/icons/location-orange.png" alt="" />
                                                        </div> 
                                                        Address: 
                                                    </label>
                                                    <input type="text" value={profile.address || ''} className='w-full'
                                                    onChange={(e) => setProfile((prev) => ({...prev, address: e.target.value}))}/>
                                                </div>
                                                <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                    <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                        <div className='w-[30px] h-auto'>
                                                            <img src="/src/assets/icons/email-orange.png" alt="" />
                                                        </div> 
                                                        Email: 
                                                    </label>
                                                    <input type="text" value={profile.email} className='w-full'
                                                    onChange={(e) => setProfile((prev) => ({...prev, email: e.target.value}))}/>
    
                                                </div>
                                                <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                    <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                        <div className='w-[30px] h-auto'>
                                                            <img src="/src/assets/icons/birthday-cake.png" alt="" />
                                                        </div> 
                                                        Birthday: 
                                                    </label>
                                                    <input type="date" value={profile.birthday} 
                                                    onChange={(e) => setProfile((prev) => ({...prev, birthday: e.target.value}))}/>
                                                </div>
                                                <div className='flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2'>
                                                    <label className='flex flex-row items-center font-bold gap-[5px]'>
                                                        <div className='w-[30px] h-auto'>
                                                            <img src="/src/assets/icons/badge-orange.png" alt="" />
                                                        </div> 
                                                        Badge: 
                                                    </label>
                                                    <label>{profile.badge}</label>
                                                </div>
                                                <label className='leading-tight text-[14px] pt-4 pb-2 text-[#645e5f]'>
                                                    You've received the <strong>Snuggle Scout</strong> badge! You're cuddly corners and warming hearts along the way. <br/>
                                                    Thanks for your growing support! Your cozy contributions don't go unnoticed!
                                                </label>
                                            </div>
                                            <div className='absolute bottom-0 left-0 flex flex-row gap-2'>
                                                <button type='submit' className='bg-[#B5C04A] min-w-[90px] p-2 rounded-[10px] text-[#000] hover:bg-[#CFDA34] active:bg-[#B5C04A] cursor-pointer'>Save</button>
                                                <button type='button' onClick={profileUpdateWindow} className='bg-[#DC8801] min-w-[90px] p-2 rounded-[10px] text-[#000] hover:bg-[#fe9f07] active:bg-[#977655] cursor-pointer'>Cancel</button>
                                            </div>              
                                        </form>    
    
                                    )}
                                    </>
                                )}
                                
                            </div>

                            <div className='flex flex-col gap-4 bg-[#FDF5D8] p-10 rounded-[15px] shadow-md'>
                                {/* WHISKER METER */}
                                Badge Design Here
                                <progress className='w-full 
                                    [&::-webkit-progress-bar]:rounded-lg 
                                    [&::-webkit-progress-value]:rounded-lg 
                                    [&::-webkit-progress-bar]:bg-slate-300 
                                    [&::-webkit-progress-value]:bg-[#B5C04A]
                                    [&::-moz-progress-bar]:bg-green-400' value="50" max="100">
                                    100%
                                </progress>
                            </div>
                        </div>
                    </div>
                </div>
                <SideNavigation />
            </div>
            <Footer />
        </div>
    )
}

export default Profile