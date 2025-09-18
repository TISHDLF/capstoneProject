import React, { useState } from "react";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";
import SideNavigation from "../components/SideNavigation";
import Footer from "../components/Footer";
import CatBot from "../components/CatBot";
import { useSession } from "../context/SessionContext";
import { QRCodeCanvas } from "qrcode.react"; // ✅ QR code library

const Donate = () => {
  const { user } = useSession();
  console.log("🔑 Current user from session:", user);

  const [formData, setFormData] = useState({
    donationType: [],
    amount: "",
    foodType: "",
    foodQuantity: 0,
    foodDescription: "",
    itemDescription: "",
    otherDescription: "",
  });

  const [showQR, setShowQR] = useState(false); // ✅ QR toggle
  const [proofImage, setProofImage] = useState(null); // ✅ Proof of payment

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      donationType: checked
        ? [...prev.donationType, value]
        : prev.donationType.filter((t) => t !== value),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProofImage(e.target.files[0]);
  };

  const incrementQuantity = () => {
    setFormData((prev) => ({ ...prev, foodQuantity: prev.foodQuantity + 1 }));
  };

  const decrementQuantity = () => {
    setFormData((prev) => ({
      ...prev,
      foodQuantity: prev.foodQuantity > 0 ? prev.foodQuantity - 1 : 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to donate!");
      return;
    }

    try {
      console.log("📦 Submitting donation payload:", formData);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => data.append(key, v));
        } else {
          data.append(key, value);
        }
      });

      if (proofImage) {
        data.append("proofImage", proofImage); // ✅ send proof of payment
      }

      const res = await axios.post(
        "http://localhost:5000/api/donations",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message);
    } catch (err) {
      console.error(
        "❌ Donation submit error:",
        err.response?.data || err.message
      );
      alert(
        "Failed to submit donation: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <CatBot />
      <NavigationBar />
      <div className="grid grid-cols-[80%_20%] h-full">
        <div className="flex flex-col pl-50 p-10">
          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col gap-5 pt-5 bg-[#FFF] rounded-[25px] w-full h-auto"
          >
            {/* Donation Type */}
            <div className="grid grid-cols-[20%_80%] place-items-center">
              <div className="flex items-center gap-5 p-4 bg-[#FDF5D8] shadow-md rounded-tr-[15px] rounded-br-[15px] w-full">
                <label className="flex flex-row font-bold text-[#DC8801]">
                  Donation Form
                </label>
                <div className="w-[40px] h-auto">
                  <img
                    src="src/assets/icons/clipboard-white.png"
                    alt="white clipboard"
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <label>What do you want to donate?*</label>
                <div className="flex flex-row gap-3 w-full justify">
                  {["Money", "Food", "Items", "Others"].map((type) => (
                    <label
                      key={type}
                      className="flex flex-row gap-2 p-3 rounded-[10px] border-1 border-[#444]"
                    >
                      <input
                        type="checkbox"
                        value={type}
                        checked={formData.donationType.includes(type)}
                        onChange={handleCheckboxChange}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Money Donation */}
            <div className="flex flex-col items-end pl-5 pr-5">
              <div className="flex flex-row">
                <label>
                  if <strong>money</strong>, please specify the amount and scan
                  the QR code:
                </label>
              </div>
              <div className="flex flex-col items-center justify-end gap-3">
                <div className="flex flex-row gap-3">
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Add amount"
                    className="flex flex-row gap-2 p-3 rounded-[10px] border-1 border-[#444] w-[150px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowQR(!showQR)}
                    className="font-bold p-3 rounded-[10px] bg-[#DC8801] text-[#FFF] shadow-md hover:bg-[#ffb030] active:bg-[#DC8801]"
                  >
                    {showQR ? "Hide QR Code" : "Click here to view QR Code"}
                  </button>
                </div>

                {showQR && (
                  <div className="mt-3 p-3 border rounded-lg bg-white shadow-md">
                    <QRCodeCanvas
                      value={
                        formData.amount
                          ? `GCash Payment - Amount: ₱${formData.amount}`
                          : "GCash Donation QR"
                      }
                      size={180}
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      level={"H"}
                      includeMargin={true}
                    />
                  </div>
                )}

                {/* Proof of Payment Upload */}
                <div className="flex flex-col items-center mt-3">
                  <label className="font-semibold text-[#444] mb-2">
                    Upload Proof of Payment:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="proofUpload"
                  />
                  <label
                    htmlFor="proofUpload"
                    className="cursor-pointer font-bold p-3 rounded-[10px] bg-[#4CAF50] text-[#FFF] shadow-md hover:bg-[#66bb6a] active:bg-[#4CAF50]"
                  >
                    {proofImage ? "Change Image" : "Add Image"}
                  </label>
                  {proofImage && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {proofImage.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Food / Items / Others */}
            <div className="grid grid-cols-2 gap-5 p-5 pt-0 pb-20">
              {/* Food Section */}
              <div className="flex flex-col gap-3 justify-between">
                <div className="flex flex-col">
                  <label>
                    if <strong>food</strong>, please specify:
                  </label>
                  <div className="flex flex-row gap-3">
                    {["Wet Food", "Dry Food"].map((type) => (
                      <label
                        key={type}
                        className="flex flex-row gap-2 p-3 rounded-[10px] border-1 border-[#444]"
                      >
                        <input
                          type="radio"
                          name="foodType"
                          value={type}
                          checked={formData.foodType === type}
                          onChange={handleChange}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label>Quantity</label>
                  <div className="grid grid-cols-3 place-items-center rounded-[10px] border-1 border-[#DC8801]">
                    <button
                      type="button"
                      onClick={incrementQuantity}
                      className="flex items-center justify-center w-full p-3 cursor-pointer hover:bg-[#FDF5D8] object-contain rounded-tl-[10px] rounded-bl-[10px] active:bg-[#ffd38d]"
                    >
                      <div className="w-[20px] h-auto">
                        <img src="src/assets/icons/plus.png" alt="add" />
                      </div>
                    </button>
                    <label className="w-full text-center p-2">
                      {formData.foodQuantity}
                    </label>
                    <button
                      type="button"
                      onClick={decrementQuantity}
                      className="flex justify-center w-full p-3 cursor-pointer hover:bg-[#FDF5D8] object-contain rounded-tr-[10px] rounded-br-[10px] active:bg-[#ffd38d]"
                    >
                      <div className="w-[25px] h-auto">
                        <img
                          src="src/assets/icons/trash-bin.png"
                          alt="remove"
                        />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label>Description:</label>
                  <textarea
                    name="foodDescription"
                    value={formData.foodDescription}
                    onChange={handleChange}
                    rows={5}
                    className="p-2 border-1 border-[#252525] rounded-[8px] resize-none"
                    placeholder="Add description here"
                  ></textarea>
                </div>
              </div>

              {/* Items / Others */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <label>
                    if <strong>items</strong>, please specify:
                  </label>
                  <textarea
                    name="itemDescription"
                    value={formData.itemDescription}
                    onChange={handleChange}
                    rows={5}
                    className="p-2 border-1 border-[#252525] rounded-[8px] resize-none"
                    placeholder="Add description here"
                  ></textarea>
                </div>

                <div className="flex flex-col">
                  <label>
                    if <strong>others</strong>, please specify:
                  </label>
                  <textarea
                    name="otherDescription"
                    value={formData.otherDescription}
                    onChange={handleChange}
                    rows={5}
                    className="p-2 border-1 border-[#252525] rounded-[8px] resize-none"
                    placeholder="Add description here"
                  ></textarea>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="absolute right-5 bottom-5 flex flex-row justify-center text-center w-[100px] bg-[#B5C04A] font-bold text-[#FFF] p-3 rounded-[15px] hover:bg-[#CFDA34] active:bg-[#B5C04A]"
            >
              Submit
            </button>
          </form>
        </div>
        <SideNavigation />
      </div>
      <Footer />
    </div>
  );
};

export default Donate;
