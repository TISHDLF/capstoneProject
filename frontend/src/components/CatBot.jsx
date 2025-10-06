import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const CatBot = () => {
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";
  const isAboutUsRoute = location.pathname === "/aboutus";
  const isCatCareGuideRoute = location.pathname === "/catcareguides";
  const isContactUsRoute = location.pathname === "/contactus";
  const isCommunityGuidelinesRoute = location.pathname === "/communityguide";

  const [labelMessage, setLabelMessage] = useState(null);
  const [isLabelVisible, setIsLabelVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const loginMessage1 = `Welcome to WhiskerWatch! I'm Whisky, glad to have you!`;
  const loginMessage2 = "Login to your account and meet us, the cats of Siena!";
  const aboutMessage =
    "For more information about our community cats, please visit our FB page at https://www.facebook.com/sprcats";
  const catCareGuideMessage = "Cat Care Guide Message";
  const contactUsMessage =
    "You may reach out to us for any inquiries or assistance while visiting our FB page!";
  const CommunityGuidelinesMessage = "Community Guidelines Message";

  useEffect(() => {
    let timerIn;
    let timerOut;

    if (isLoginRoute) {
      timerIn = setTimeout(() => {
        setLabelMessage(
          <>
            {loginMessage1}
            <br />
            <br />
            {loginMessage2}
          </>
        );
        setIsLabelVisible(true);
      }, 2000);

      timerOut = setTimeout(() => {
        setIsLabelVisible(false);
      }, 7000);
    } else if (isAboutUsRoute) {
      timerIn = setTimeout(() => {
        setLabelMessage(<>{aboutMessage}</>);
        setIsLabelVisible(true);
      }, 2000);

      timerOut = setTimeout(() => {
        setIsLabelVisible(false);
      }, 7000);
    } else if (isCatCareGuideRoute) {
      timerIn = setTimeout(() => {
        setLabelMessage(<>{catCareGuideMessage}</>);
        setIsLabelVisible(true);
      }, 2000);

      timerOut = setTimeout(() => {
        setIsLabelVisible(false);
      }, 7000);
    } else if (isContactUsRoute) {
      timerIn = setTimeout(() => {
        setLabelMessage(<>{contactUsMessage}</>);
        setIsLabelVisible(true);
      }, 2000);

      timerOut = setTimeout(() => {
        setIsLabelVisible(false);
      }, 7000);
    } else if (isCommunityGuidelinesRoute) {
      timerIn = setTimeout(() => {
        setLabelMessage(<>{CommunityGuidelinesMessage}</>);
        setIsLabelVisible(true);
      }, 2000);

      timerOut = setTimeout(() => {
        setIsLabelVisible(false);
      }, 7000);
    }

    return () => {
      if (timerIn) clearTimeout(timerIn);
      if (timerOut) clearTimeout(timerOut);

      setLabelMessage(null);
      setIsLabelVisible(false);
    };
  }, [
    isLoginRoute,
    isAboutUsRoute,
    isCatCareGuideRoute,
    isContactUsRoute,
    isCommunityGuidelinesRoute,
  ]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setIsLabelVisible(false);
    }
  };

  const quickLinks = [
    {
      label: "Visit Facebook",
      url: "https://www.facebook.com/sprcats",
      isExternal: true,
    },
    { label: "Cat Care Guide", path: "/catcareguides", isExternal: false },
    { label: "Contact Us", path: "/contactus", isExternal: false },
    {
      label: "Community Guidelines",
      path: "/communityguide",
      isExternal: false,
    },
  ];

  return (
    <>
      {/* Desktop CatBot - Hidden on mobile */}
      <div className="hidden md:flex fixed bottom-5 right-5 flex-col justify-end items-end gap-2 z-10">
        <div
          className={`relative right-9 flex flex-col items-center justify-center text-[#000] max-w-[275px] h-auto bg-[#DC8801] p-4 rounded-bl-xl rounded-tl-xl rounded-tr-xl transition-opacity duration-300  ${
            isLabelVisible ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <label
            className={`text-justify text-[#FFF] text-sm ${
              isLabelVisible ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            {labelMessage || ""}
          </label>
        </div>

        <button className="flex items-center justify-center bg-[#cfda34] box-border max-w-[75px] h-auto rounded-[100%] p-[12px] active:scale-90 hover:scale-105 transition-transform">
          <img src="/src/assets/icons/CatBot.png" alt="Cat Bot" />
        </button>
      </div>

      {/* Mobile CatBot - Shown only on mobile */}
      <div className="md:hidden fixed bottom-20 right-4 z-20">
        {/* Chat Panel */}
        {isChatOpen && (
          <div className="absolute bottom-20 right-0 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden mb-2">
            {/* Header */}
            <div className="bg-[#DC8801] p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-[#cfda34] rounded-full p-2">
                <img
                  src="/src/assets/icons/CatBot.png"
                  alt="Whisky"
                  className="w-full h-full"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">Whisky</h3>
                <p className="text-white text-xs opacity-90">
                  Your WhiskerWatch Guide
                </p>
              </div>
              <button
                onClick={toggleChat}
                className="text-white text-2xl hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* Message Content */}
            <div className="p-4 max-h-60 overflow-y-auto">
              {labelMessage ? (
                <div className="bg-[#fef8e2] p-3 rounded-xl mb-3">
                  <p className="text-sm text-gray-800">{labelMessage}</p>
                </div>
              ) : (
                <div className="bg-[#fef8e2] p-3 rounded-xl mb-3">
                  <p className="text-sm text-gray-800">
                    Hi there! I'm Whisky, your WhiskerWatch assistant. How can I
                    help you today?
                  </p>
                </div>
              )}

              {/* Quick Links */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-semibold mb-2">
                  QUICK LINKS
                </p>
                {quickLinks.map((link, index) =>
                  link.isExternal ? (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-[#f9f7dc] hover:bg-[#DC8801] hover:text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={index}
                      to={link.path}
                      className="block bg-[#f9f7dc] hover:bg-[#DC8801] hover:text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      onClick={() => setIsChatOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Need more help? Visit our{" "}
                <a
                  href="https://www.facebook.com/sprcats"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#DC8801] font-semibold"
                >
                  Facebook page
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Auto-popup message (when chat is closed) */}
        {!isChatOpen && isLabelVisible && (
          <div className="absolute bottom-20 right-0 w-64 bg-[#DC8801] p-3 rounded-2xl rounded-br-none shadow-lg mb-2 animate-bounce">
            <p className="text-white text-sm">{labelMessage}</p>
            <button
              onClick={toggleChat}
              className="mt-2 text-xs text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full"
            >
              Chat with me
            </button>
          </div>
        )}

        {/* Cat Bot Button */}
        <button
          onClick={toggleChat}
          className={`relative flex items-center justify-center bg-[#cfda34] box-border w-16 h-16 rounded-full p-3 shadow-lg transition-all ${
            isChatOpen
              ? "scale-90 rotate-12"
              : "scale-100 hover:scale-110 active:scale-95"
          }`}
        >
          <img
            src="/src/assets/icons/CatBot.png"
            alt="Cat Bot"
            className="w-full h-full"
          />
          {/* Notification dot */}
          {!isChatOpen && isLabelVisible && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>
      </div>
    </>
  );
};

export default CatBot;
