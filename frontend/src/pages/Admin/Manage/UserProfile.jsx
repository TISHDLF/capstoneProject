import React, {useState, useEffect} from 'react';
import AdminSideBar from '../../../components/AdminSideBar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    
    const { user_id } = useParams();
    const [profile, setProfile] = useState({
        user_id: '',
        firstname: '',
        lastname: '',
        profile_image: '/src/assets/UserProfile/default_profile_image.jpg',
        role:'regular',
        email:'',
        contactnumber:'',
        birthday:'',
        address: ''
    });

    const [profileImage, setProfileImage] = useState('');

    useEffect(() => {
        if (!user_id) return;
        const fetchUserProfile = async () => {
            try {   
                const response = await axios.get(`http://localhost:5000/manage/userprofile/${user_id}`);
                setProfile(response.data);
                // setoriginalUserprofile(response.data);

                console.log(response.data)
            } catch(err) {
                console.error('Error fetch user data: ', err);
            }
        }
        fetchUserProfile();
    }, [user_id]);


    return (
        <div className='relative flex flex-col h-screen'>
            <div className='grid grid-cols-[20%_80%] overflow-x-hidden'>
                <AdminSideBar />
                <div className='flex flex-col items-center p-10 min-h-screen gap-5 mx-auto overflow-y-scroll'>
                    <div className='flex flex-row justify-start w-full border-b-2 border-b-[#525252]'>
                    <label className='font-bold text-[24px]'>User Profile</label>
                    </div>

                    {profile && (
                        <form className='flex flex-col bg-[#FFF] gap-4 p-5 rounded-[15px] shadow-lg w-full h-auto'>
                            <div className='flex w-full items-center justify-end gap-5'>
                                <div className='flex gap-2 items-center'> 
                                    <label className='text-[14px] text-[#595959]'>User ID:</label>
                                    <label className='text-[16px] text-[#2F2F2F] font-bold'>{user_id}</label>
                                </div>
                                <div className='flex gap-2 items-center'> 
                                    <label className='text-[14px] text-[#595959]'>Account Created:</label>
                                    <label className='text-[16px] text-[#2F2F2F] font-bold'>{profile.created_at}</label>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <label className='text-[14px] text-[#595959]'>Last Updated:</label>
                                    <label className='text-[16px] text-[#2F2F2F] font-bold'>{(profile.created_at == profile.updated_at) ? profile.updated_at : 'No updates  ' }</label>
                                </div>
                            </div>

                            <div className='flex gap-3 items-center'>
                                <div className='flex w-[250px] h-[250px] object-fit rounded-[10px] overflow-hidden'>
                                    <img src={profile.profile_image || '/src/assets/UserProfile/default_profile_image.jpg'} alt="User profile image" className="w-full h-full object-cover"/>
                                </div>

                            </div>

                            <div className='flex items-center justify-between w-full gap-4 pt-2'>
                                <div className='flex flex-col gap-1 justify-start w-full'>
                                    <label className='text-[14px] text-[#595959]'>First name</label>
                                    <input type="text" placeholder='Add first name' className='text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                    value={profile?.firstname || ''} onChange={(e) => setProfile((prev) => ({...prev, firstname:e.target.value}))}/>
                                </div>

                                <div className='flex flex-col gap-1 justify-start w-full'>
                                    <label className='text-[14px] text-[#595959]'>Last name</label>
                                    <input type="text" placeholder='Add last name' className='text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                    value={profile?.lastname || ''} onChange={(e) => setProfile((prev) => ({...prev, lastname: e.target.value}))}/>
                                </div>
                                <div className='flex flex-col gap-1 justify-start w-full'>
                                    <label className='text-[14px] text-[#595959]'>Role</label>
                                    <select name="" id="" className='text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                    value={profile?.role || ''} onChange={(e) => setProfile((prev) => ({...prev, role:e.target.value}))}>
                                        <option hidden>Select a role</option>
                                        <option value="regular">Basic</option>
                                        <option value="head_volunteer">Head Volunteer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className='flex items-center justify-between w-full gap-4 pt-2'>
                                <div className='flex flex-col gap-1 justify-start w-full'>
                                    <label className='text-[14px] text-[#595959]'>Email</label>
                                    <input type="email" placeholder='Add Email' className='text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                    value={profile?.email || ''} onChange={(e) => setProfile((prev) => ({...prev, email:e.target.value}))}/>
                                </div>
                                <div className='flex flex-col gap-1 justify-start w-full'>
                                    <label className='text-[14px] text-[#595959]'>Contact No.</label>
                                    <input type="number" placeholder='Add contact number' className='appearance-none text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                    value={profile?.contactnumber || ''} onChange={(e) => setProfile((prev) => ({...prev, contactnumber: e.target.value}))}/>
                                </div>
                                <div className='flex flex-col gap-1 justify-start w-full'>
                                    <label className='text-[14px] text-[#595959]'>Birthday</label>
                                    <input type="date" className='text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                    value={profile?.birthday} onChange={(e) => setProfile((prev) => ({...prev, birthday: e.target.value}))}/>
                                </div>
                            </div>

                            <div className='flex flex-col gap-1 justify-start w-full'>
                                <label className='text-[14px] text-[#595959]'>Address</label>
                                <input type="email" placeholder='Add Address' className='text-[16px] text-[#2F2F2F] font-bold p-3 border-1 border-[#CCCCCC] rounded-[10px]'
                                value={profile?.address || ''} onChange={(e) => setProfile((prev) => ({...prev, address: e.target.value}))}/>
                            </div>
                            
                            <div className='flex flex-col gap-1 justify-start'>
                                <label className='text-[14px] text-[#595959]'>Adoption History</label>
                                <a href='/src/assets/UserProfile/(01 Laboratory Exercise 1 - ARG) Angelo Cabangal - Game Development.pdf' target='_blank' className='flex items-center justify-between self-start min-w-[300px] gap-3 p-2 pl-4 pr-4 bg-[#FDF5D8] text-[#2F2F2F] rounded-[10px] hover:underline border-dashed border-2 border-[#595959]'>
                                View Certificate
                                <div className='w-[25px] h-auto'>
                                    <img src="/src/assets/icons/document-black.png" alt="" />
                                </div>
                                </a>
                            </div>

                            <div className='flex w-full justify-end gap-2'> 
                                <button type='submit' className='bg-[#B5C04A] text-[#FFF] font-bold p-2 pl-4 pr-4 cursor-pointer rounded-[10px] active:bg-[#CFDA34]'>Save Changes</button>
                                <button type='button' className='bg-[#DC8801] text-[#FFF] font-bold p-2 pl-4 pr-4 cursor-pointer rounded-[10px] active:bg-[#977655]'>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserProfile