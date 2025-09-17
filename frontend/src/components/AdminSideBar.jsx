import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios';

const AdminSideBar = () => {
  

  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({ firstname: '', lastname: '', role: '' });
  const [profileImage, setProfileImage] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = Cookies.get('user');
      if (!loggedUser) {
        console.log('No logged in user yet!');
        setUser(loggedUser || { firstname: '', lastname: '', role: '' });
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(loggedUser);
      const userId = parsedUser.user_id;

      try {
        const response = await axios.get(`http://localhost:5000/user/logged?user_id=${userId}`);
        console.log(response.data.firstname, response.data.lastname);
        setUser(response.data);

        await profileImage();

      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.response?.data?.error || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    const profileImage = async () => {
      try {
        const profilImage = await axios.get(`http://localhost:5000/user/profile`, { withCredentials: true })
        setProfileImage(profilImage.data)
      }
      catch (err) {
        console.error('Error fetching image:', err);
        setError(err.response?.data?.error || 'Failed to fetch image');
      }
    }

    fetchUser();
  }, []);

  
  const [isVisible, setIsvisible] = useState(false);
  const menuRef = useRef(null);
  const toggleVisibilityProfile = () => {
    setIsvisible(!isVisible);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsvisible(false); // Hide menu if click is outside
      }
    };

    // Add event listener when menu is visible
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible])


  // Handle dropdowns
  const [dropdown, setDropdown] = useState({
    adopters:false,
    feeding:false,
    manage:false,
  })

  const toggleDropdown = (dropdownKey) => {
    setDropdown((prev) => ({
      ...prev, 
      [dropdownKey]: !prev[dropdownKey],
    }))
  }


  const isLoggedIn = user.firstname && user.lastname;
  const handleLogout = () => {
    Cookies.remove('user')
    navigate('home', {replace: true})
  }


  
  const sideItemStyle = 'flex flex-col items-start gap-2 w-full h-auto pl-3 pt-2 pb-2 cursor-pointer bg-white border-2 border-white' ;
  const sideItemStyleCurrent = 'flex flex-col items-start gap-2 w-full h-auto pl-3 pt-2 pb-2 cursor-pointer border-2 border-white text-[#DC8801] bg-[#FDF5D8]';
  const sideItemDownCurrent = 'flex flex-col items-start gap-2 w-full h-auto pl-3 pt-2 pb-2 cursor-pointer border-2 border-white';

  const pageActive = 'flex w-full pl-20 pt-3 pb-2 hover:bg-[#FDF5D8] hover:text-[#DC8801] text-[#DC8801] bg-[#FDF5D8]';
  const pageInactive = 'bg-[#FFF] w-full pl-20 pt-3 pb-2 hover:text-[#DC8801]';

  return (
    <div className='relative flex flex-col w-auto h-screen bg-[#FFF] z-50 gap-2'>
      <div className='flex items-center justify-start gap-4  w-auto h-auto box-border pl-3 pr-12 pt-4 pb-4 cursor-pointer bg-white border-b-2 border-b-[#DC8801]'
      onClick={() => navigate('/dashboard')}> 
        <div className='flex justify-center items-center w-[120px] h-auto p-1'>
          <img src="/src/assets/whiskerwatchlogo-no textmarks.png" alt="account" />
        </div>
        <label className='font-bold text-[22px]'> DASHBOARD </label>
      </div>

      <div className='flex flex-col justify-between h-full p-3'>
        <div className='flex flex-col justify-center gap-1'>

          <Link to="/dashboard" className={location.pathname === "/dashboard" ? sideItemStyleCurrent : sideItemStyle}> 
            <div className='flex flex-row items-center gap-4'>
              <div className='flex justify-center items-center w-[30px] h-auto'>
                <img src="/src/assets/icons/admin-icons/sidedbar/dashboard.png" alt="account" />
              </div>
              <label className='cursor-pointer font-bold hover:text-[#DC8801]'> Overview </label>
            </div>
          </Link>
          
          {/* Donate */} 
          <Link to="/admincatprofile" className={location.pathname === "/admincatprofile" || location.pathname === '/catprofileproperty/:cat_id' ? sideItemStyleCurrent : sideItemStyle}> 
            <div className='flex flex-row items-center gap-4'>
              <div className='flex justify-center items-center w-[30px] h-auto'>
                <img src="/src/assets/icons/admin-icons/sidedbar/cat-profile.png" alt="account" />
              </div>
              <label className='cursor-pointer font-bold hover:text-[#DC8801]'> Cat Profiles </label>
            </div>
          </Link>

          {/* Cat Adoption */}
          <div className={location.pathname === "/adopterslist" || location.pathname === "/adopterapplication" ? sideItemDownCurrent :  sideItemStyle}>
            <div className='flex flex-row items-center justify-between w-full active:text-[#B5C04A]'>
              <div className='flex flex-row items-center gap-4'>
                <div className='flex justify-center items-center w-[30px] h-auto'>
                  <img src="/src/assets/icons/admin-icons/sidedbar/adopters-visitors.png" alt="account" />
                </div>
                <label className='cursor-pointer font-bold hover:text-[#DC8801]'> Adopters </label>
              </div>
              <button onClick={() => {toggleDropdown('adopters')}} 
              className='flex justify-center items-center w-[30px] h-auto p-[8px] rounded-[25px] hover:bg-[#FDF5D8] active:bg-[#FFF]'>
                <img src="/src/assets/icons/down-arrow-orange.png" alt="orange arrow" className={!dropdown.adopters ? 'rotate-0' : '-rotate-90'}/>
              </button>
            </div>

            {!dropdown.adopters && (
              <>
                <Link to="/adopterslist" className={location.pathname === "/adopterslist" || location.pathname === "/adopterslist/adopterview" ? pageActive : pageInactive}> Adopters List </Link> 
                <Link to="/adopterapplication" className={location.pathname === "/adopterapplication" || location.pathname === "/adopterapplication/adopterapplicationview" ? pageActive : pageInactive}> Applications</Link>
              </> 
            )} 
          </div>

          {/* Feeding */}
          <div to="/volunteers" className={location.pathname === "/feedingvolunteers" || location.pathname === "/feedingapplications" ? sideItemDownCurrent :  sideItemStyle}>
            <div className='flex flex-row items-center justify-between w-full active:text-[#B5C04A]'> 
              <div className='flex flex-row items-center gap-4'>
                <div className='flex justify-center items-center w-[30px] h-auto'>
                  <img src="/src/assets/icons/admin-icons/sidedbar/in-kind-donation-application.png" alt="account" />
                </div>
                <label className='cursor-pointer font-bold hover:text-[#DC8801]'> Feeding </label>
              </div>
              <button onClick={() => (toggleDropdown('feeding'))} className='flex justify-center items-center w-[30px] h-auto p-[8px] rounded-[25px] hover:bg-[#FDF5D8] active:bg-[#FFF]'>
                <img src="/src/assets/icons/down-arrow-orange.png" alt="orange arrow" className={!dropdown.feeding ? 'rotate-0' : '-rotate-90'}/>
              </button>
            </div>

            {!dropdown.feeding && (
              <>
                <Link to="/feedingvolunteers" className={location.pathname === "/feedingvolunteers" ? pageActive : pageInactive}> Feeding Volunteers</Link>
                <Link to="/feedingapplications" className={location.pathname === "/feedingapplications" || location.pathname === "/feedingapplications/feedingapplicationview" ? pageActive : pageInactive}> Applications</Link>
                <Link to="/donationadmin" className={location.pathname === "/donationadmin" ? pageActive : pageInactive}>Donations</Link>
              </>
            )}
          </div>

          {/* Manage */}
          <div className={location.pathname === "/adminlist" || location.pathname === "/allusers" ? sideItemDownCurrent :  sideItemStyle}>
            <div className='flex flex-row items-center justify-between w-full active:text-[#B5C04A]'>
              <div className='flex flex-row items-center gap-4'>
                <div className='flex justify-center items-center w-[30px] h-auto'>
                  <img src="/src/assets/icons/admin-icons/sidedbar/settings.png" alt="account" />
                </div>
                <label className='cursor-pointer font-bold hover:text-[#DC8801]'> Manage </label>
              </div>

              <button onClick={() => {toggleDropdown('manage')}} className='flex justify-center items-center w-[30px] h-auto p-[8px] rounded-[25px] hover:bg-[#FDF5D8] active:bg-[#FFF]'>
                <img src="/src/assets/icons/down-arrow-orange.png" alt="orange arrow" className={!dropdown.manage ? 'rotate-0' : '-rotate-90'}/>
              </button>
            </div>

            {!dropdown.manage && (
              <>
                <Link to="/adminlist" className={location.pathname === "/adminlist" ? pageActive : pageInactive}> Admin List</Link>
                <Link to="/allusers" className={location.pathname === "/allusers" || location.pathname === "/userprofile" ? pageActive : pageInactive}> All Users</Link>
              </>
            )}
          </div>
        </div>

        
        <div className='relative flex flex-row items-center justify-between p-3 gap-3 text-[#767d2c] shadow-lg bg-[#FF] rounded-[50px]'>
          <div className='flex flex-row items-center gap-3'>
            <div className="flex justify-center items-center w-[40px] h-[40px] rounded-[25px] overflow-hidden">
              <img src={`http://localhost:5000/FileUploads/${profileImage.profile_image}`
            || '/src/assets/icons/account.png'} alt="account" className='w-full h-full object-cover' />
            </div>
            <label>
              {loading
                ? 'Loading...'
                : user.firstname && user.lastname
                ? `${user.firstname} ${user.lastname}`
                : 'Guest'}
            </label>
          </div>

          <button onClick={toggleVisibilityProfile} className='flex justify-center items-center w-[30px] h-auto p-2 bg-[#f0f2c8] hover:bg-[#E3E697] active:bg-[#f0f2c8] rounded-[15px]'>
              <img src="/src/assets/icons/admin-icons/arrow-right.png" alt="" />
          </button>

          <div className="absolute left-75 bottom-12 flex flex-col w-full gap-2 box-border bg-[#FFF] shadow-md rounded-[15px] rounded-bl-[0px] overflow-hidden z-[9999]">
            
            {isLoggedIn && (
              <div ref={menuRef} className={isVisible ? 'flex flex-col w-full p-2 gap-2' : 'hidden'}>
                <Link to="/login" replace onClick={handleLogout} className={'text-[#000] text-center  p-3 pl-6 pr-6 w-full bg-[#f0f2c8] hover:bg-[#E3E697] active:bg-[#f0f2c8] active:text-[#FFF] rounded-[10px]'}>
                  <label className='w-full'>Log out</label>
                </Link>
              </div>
            )}
            
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default AdminSideBar