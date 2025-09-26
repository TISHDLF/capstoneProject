import React from "react";

const NotificationModal = ({ onClose }) => {
  return (
    <div className="absolute top-18 right-34 justify-center">
      <div className="w-60 h-80 bg-white shadow-2xl rounded-tl-3xl rounded-bl-3xl rounded-br-3xl rounded-tr-[2px] p-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✖
        </button>

        {/* Content */}
        <div className="grid grid-cols-1 gap-2 mt-6">
          <p className="text-sm text-gray-700">Sample notification</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
