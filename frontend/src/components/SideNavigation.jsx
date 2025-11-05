import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useRef } from "react";

const SideNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({ firstname: "", lastname: "", role: "" });
  const [profileImage, setProfileImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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

  const toggleProfileMenu = () => {
    setIsvisible(!isVisible);
  };

  const isLoggedIn = user.firstname && user.lastname;
  // const isAdminOrHeadVolunteer = user.role === "admin" || user.role === "head_volunteer";

  // const dashboardPath = user.role === "admin"
  //   ? "/dashboard"
  //   : user.role === "head_volunteer"
  //   ? "/hvdashboard"
  //   : "/";
  
  const handleLogout = () => {
    Cookies.remove('user')
    navigate('/login', {replace: true})
  }

  const sideItemStyle =
    "relative flex items-center justify-start gap-4 min-w-[200px] w-full h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-6 pt-2 pb-2 cursor-pointer bg-white border-2 border-white shadow-md active:bg-[#fdf4d5] hover:text-[#DC8801]";
  const sideItemStyleCurrent =
    "relative flex items-center justify-start gap-4 min-w-[200px] w-full h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-6 pt-2 pb-2 cursor-pointer bg-white border-2 drop-shadow-md border-[#DC8801] text-[#DC8801]";

  return (
    <div ref={menuRef} className="fixed right-0 top-[20%] flex flex-col gap-4 min-w-[200px] h-auto">
      {/* Login or Signup button */}
      <div  onClick={toggleProfileMenu} className={ location.pathname === "/profile" ? sideItemStyleCurrent : sideItemStyle}>
        <div className="flex flex-row items-center gap-2">
          <div className="flex justify-center items-center w-[40px] h-[40px] rounded-[25px] overflow-hidden">
            <img src={profileImage?.profile_image
                  ? `http://localhost:5000/FileUploads/${profileImage.profile_image}`
                  : '/src/assets/icons/account.png'} alt="account" className="w-full h-full object-cover"
            />
          </div>
          <label className="cursor-pointer">
            {loading
              ? "Loading..."
              : user.firstname && user.lastname
              ? `${user.firstname} ${user.lastname}`
              : "Guest"}
          </label>
          <button
            className="grid place-items-center w-[35px] h-auto p-2 rounded-[25px] hover:bg-[#f9e390] active:bg-[#FFF]"
            onClick={toggleProfileMenu}
          >
            <img src="/src/assets/icons/down-arrow-orange.png" alt="" />
          </button>
        </div>
        {/* Dropdown for */}
      </div>

      <div
        className="absolute right-18 top-12 w-40 box-border bg-[#FFF] shadow-md rounded-[15px] rounded-tr-[0px] overflow-hidden z-[9999]"
        style={{ minHeight: "fit-content" }}
      >
        {isLoggedIn ? (
          <div className={isVisible ? "grid place-items-center gap-1 p-2" : "hidden"}>
            <Link to="/profile" className="text-[#000] p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]">
              My Profile
            </Link>

            {/* {isAdminOrHeadVolunteer && (
              <Link to={dashboardPath}  className="text-[#000] p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]">
                Dashboard
              </Link>
            )} */}

            <Link to="/login" className="text-[#000] p-3 pl-6 bg-[#fef8e2] pr-6 w-full hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]" onClick={handleLogout} replace >
              Log out
            </Link>
          </div>
        ) : (
          <div
            className={ isVisible ? "grid place-items-center gap-1 p-2" : "hidden"}>
            <Link to="/login" className="text-[#000] p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]" >
              Log in
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center gap-4 pl-12]">
        {/* Donate */}
        <Link to="/donate" className={ location.pathname === "/donate" ? sideItemStyleCurrent : sideItemStyle } >
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/donation.png" alt="donation" />
          </div>
          <label className="cursor-pointer"> Donate </label>
        </Link>

        {/* Cat Adoption */}
        <Link
          to="/catadoption"
          className={location.pathname === "/catadoption" ? sideItemStyleCurrent : sideItemStyle }>
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/paws.png" alt="cat adoption" />
          </div>
          <label className="cursor-pointer"> Cat Adoption </label>
        </Link>

        {/* Feeding */}
        <Link to="/feeding" className={ location.pathname === "/feeding" ? sideItemStyleCurrent : sideItemStyle }>
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/pet-food.png" alt="feeding" />
          </div>
          <label className="cursor-pointer"> Feeding </label>
        </Link>

        {/* Community Guidelines */}
        <Link to="/communityguide" className={location.pathname === "/communityguide" ? sideItemStyleCurrent : sideItemStyle }>
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/information.png" alt="information" />
          </div>
          <label className="cursor-pointer"> Community Guidelines </label>
        </Link>
      </div>
    </div>
  );
};

export default SideNavigation;
