import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CatBot = () => {
   const location = useLocation();
   const isLoginRoute = location.pathname === '/login';
   const isAboutUsRoute = location.pathname === '/aboutus';
   const isCatCareGuideRoute = location.pathname === '/catcareguides';
   const isContactUsRoute = location.pathname === '/contactus';
   const isCommunityGuidelinesRoute = location.pathname === '/communityguide';

   const [labelMessage, setLabelMessage] = useState(null);
   const [isLabelVisible, setIsLabelVisible] = useState(false);

   // State equivalent (using useState if needed, but here we use plain variables for simplicity)
   const loginMessage1 = `Welcome to WhiskerWatch! I'm Whisky, glad to have you!`;
   const loginMessage2 = "Login to your account and meet us, the cats of Siena!";
   const aboutMessage = "For more information about our community cats, please visit our FB page at https://www.facebook.com/sprcats";
   const catCareGuideMessage = "Cat Care Guide Message";
   const contactUsMessage = "You may reach out to us for any inquiries or assistance while visiting our FB page!";

   const CommunityGuidelinesMessage = "Community Guidelines Message";

  useEffect(() => {
      let timerIn;
      let timerOut;

      if (isLoginRoute) {
         timerIn = setTimeout(() => {
            setLabelMessage(<>{loginMessage1}<br/><br/>{loginMessage2}</>);
            setIsLabelVisible(true);
         }, 2000);

         timerOut = setTimeout(() => {
            setIsLabelVisible(false);
         }, 7000);

      } 
      else if (isAboutUsRoute) {
         timerIn = setTimeout(() => {
            setLabelMessage(<>{aboutMessage}</>);
            setIsLabelVisible(true);
         }, 2000);

         timerOut = setTimeout(() => {
            setIsLabelVisible(false);
         }, 7000);
      }
      else if (isCatCareGuideRoute) {
         timerIn = setTimeout(() => {
            setLabelMessage(<>{catCareGuideMessage}</>);
            setIsLabelVisible(true);
         }, 2000);

         timerOut = setTimeout(() => {
            setIsLabelVisible(false);
         }, 7000);
      }
      else if (isContactUsRoute) {
         timerIn = setTimeout(() => {
            setLabelMessage(<>{contactUsMessage}</>);
            setIsLabelVisible(true);
         }, 2000);

         timerOut = setTimeout(() => {
            setIsLabelVisible(false);
         }, 7000);
      } 
      else if (isCommunityGuidelinesRoute) {
         timerIn = setTimeout(() => {
            setLabelMessage(<>{CommunityGuidelinesMessage}</>)
            setIsLabelVisible(true)
         }, 2000);

         timerOut = setTimeout(() => {
            setIsLabelVisible(false)
         }, 7000)
      }


      return () => {
         if (timerIn) clearTimeout(timerIn);
         if (timerOut) clearTimeout(timerOut);

         setLabelMessage(null);
         setIsLabelVisible(false);
      };
  }, [isLoginRoute, isAboutUsRoute, isCatCareGuideRoute, isContactUsRoute, isCommunityGuidelinesRoute]);


  return (
    <div className="fixed bottom-5 right-5 flex flex-col justify-end items-end gap-2 z-50"> 

      <div className={`relative right-9 flex flex-col items-center justify-center text-[#000] max-w-[275px] h-auto bg-[#DC8801] p-4 rounded-bl-xl rounded-tl-xl rounded-tr-xl transition-opacity duration-300  ${isLabelVisible ? 'opacity-100' : 'opacity-0 hidden'}`}>
        <label className={`text-justify text-[#FFF] text-sm ${isLabelVisible ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {labelMessage || ''}
        </label>
      </div>

      <button className="flex items-center justify-center bg-[#cfda34] box-border max-w-[75px] h-auto rounded-[100%] p-[12px] active:scale-90">
        <img src="/src/assets/icons/CatBot.png" alt="Cat Bot"/>
      </button>

    </div>
  );
};

export default CatBot;