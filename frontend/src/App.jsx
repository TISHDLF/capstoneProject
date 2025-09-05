import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import CatCareGuides from "./pages/CatCareGuides";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/LoginAndSignUp/Login";
import CatCommunityNews from "./pages/Home/CatCommunityNews";
import Donate from "./pages/Donate";
import CatAdoption from "./pages/CatAdoption";
import Feeding from "./pages/Feeding";
import CommunityGuide from "./pages/CommunityGuide";
import AdminLogin from "./pages/LoginAndSignUp/AdminLogin";
import SignUp from "./pages/LoginAndSignUp/SignUp";
import CatProfile from "./pages/CatAdoption/CatProfile";
import AdopteeForm from "./pages/CatAdoption/AdopteeForm";

import Dashboard from "./pages/Admin/Dashboard";
import Profile from "./pages/Profile/Profile";
import AdminCatProfile from "./pages/Admin/AdminCatProfile";
import AdoptersAndVisitors from "./pages/Admin/AdoptersAndVisitors";
import Volunteers from "./pages/Admin/Volunteers";
import Manage from "./pages/Admin/Manage";
import AdoptersList from "./pages/Admin/Adopters/AdoptersList";
import AdopterApplication from "./pages/Admin/Adopters/AdopterApplication";
import FeedingVolunteers from "./pages/Admin/Feeding/FeedingVolunteers";
import FeedingApplications from "./pages/Admin/Feeding/FeedingApplications";
import AdminList from "./pages/Admin/Manage/AdminList";
import AllUsers from "./pages/Admin/Manage/AllUsers";
import Donation from "./pages/Admin/Feeding/Donation";
import CatProfileProperty from "./pages/Admin/CatProfileProperty/CatProfileProperty";
import HeadVolunteerMainPage from "./pages/HeadVolunteer/HeadVolunteerMainPage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />

        <Route path="home" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="login" element={<Login />} />
        <Route path="adminlogin" element={<AdminLogin />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="catcommunitynews" element={<CatCommunityNews />} />
        <Route path="aboutus" element={<AboutUs />} />
        <Route path="catcareguides" element={<CatCareGuides />} />
        <Route path="contactus" element={<ContactUs />} />
        <Route path="donate" element={<Donate />} />
        <Route path="catadoption" element={<CatAdoption />} />
        <Route path="catprofile" element={<CatProfile />} />
        <Route path="adopteeform" element={<AdopteeForm />} />
        <Route path="feeding" element={<Feeding />} />
        <Route path="communityguide" element={<CommunityGuide />} />

        {/* Admin */}
        <Route path="profile" element={<Profile />} />
        <Route path="admincatprofile" element={<AdminCatProfile />} />
        <Route path="catprofileproperty" element={<CatProfileProperty />} />

        <Route path="adoptersandvisitors" element={<AdoptersAndVisitors />} />
        <Route path="adopterslist" element={<AdoptersList />} />
        <Route path="adopterapplication" element={<AdopterApplication />} />

        <Route path="volunteers" element={<Volunteers />} />
        <Route path="feedingvolunteers" element={<FeedingVolunteers />} />
        <Route path="feedingapplications" element={<FeedingApplications />} />
        <Route path="donationadmin" element={<Donation />} />

        <Route path="manage" element={<Manage />} />
        <Route path="adminlist" element={<AdminList />} />
        <Route path="allusers" element={<AllUsers />} />

        {/* Head Volunteer */}
        <Route path="headvolunteerpage" element={<HeadVolunteerMainPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
