// LoadingModal.jsx
import React from "react";

const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
      <div className="relative bg-white rounded-2xl shadow-lg  flex flex-col items-center">
        <img
          src="src/assets/cats/loadingGIF.GIF" // Put your gif inside /public folder
          alt="Loading..."
          className="w-50 h-50 rounded-2xl"
        />
        <p className="mt-4 text-gray-700 font-medium absolute bottom-3">
          Processing...
        </p>
      </div>
    </div>
  );
};

export default LoadingModal;
