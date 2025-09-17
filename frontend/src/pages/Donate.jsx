import React, { useState } from "react";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";
import SideNavigation from "../components/SideNavigation";
import Footer from "../components/Footer";
import CatBot from "../components/CatBot";
import { useSession } from "../context/SessionContext";

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

      const res = await axios.post(
        "http://localhost:5000/api/donations",
        formData, // ✅ donator_id is handled in backend
        { withCredentials: true }
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
                {/* Form Fields */}
                <label>What do you want to donate?*</label>
                <div className="flex flex-row gap-3 w-full justify">
                  <label
                    htmlFor="checkMoney"
                    className="flex flex-row gap-2 p-3 rounded-[10px] border-1 border-[#444]"
                  >
                    <input
                      type="checkbox"
                      id="checkMoney"
                      value="Money"
                      checked={formData.donationType.includes("Money")}
                      onChange={handleCheckboxChange}
                    />
                    Money
                  </label>
                  <label
                    htmlFor="checkFood"
                    className="flex flex-row gap-2 p-3 rounded-[10px] border-1 border-[#444]"
                  >
                    <input
                      type="checkbox"
                      id="checkFood"
                      value="Food"
                      checked={formData.donationType.includes("Food")}
                      onChange={handleCheckboxChange}
                    />
                    Food
                  </label>
                  <label
                    htmlFor="checkItem"
                    className="flex flex-row gap-2 p-3 rounded-[10px] border-1 border-[#444]"
                  >
                    <input
                      type="checkbox"
                      id="checkItem"
                      value="Items"
                      checked={formData.donationType.includes("Items")}
                      onChange={handleCheckboxChange}
                    />
                    Items
                  </label>
                  <label
                    htmlFor="checkOthers"
                    className="flex flex-row gap-2 p-3 rounded-[10px] border-1 border-[#444]"
                  >
                    <input
                      type="checkbox"
                      id="checkOthers"
                      value="Others"
                      checked={formData.donationType.includes("Others")}
                      onChange={handleCheckboxChange}
                    />
                    Others
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end pl-5 pr-5">
              <div className="flex flex-row">
                <label>
                  if <strong>money</strong>, please specify the amount and scan
                  the Q code:
                </label>
              </div>
              <div className="flex flex-row items-center justify-end gap-3">
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
                  className="font-bold p-3 rounded-[10px] bg-[#DC8801] text-[#FFF] shadow-md hover:bg-[#ffb030] active:bg-[#DC8801]"
                >
                  Click here to view QR Code
                </button>
                <div className="hidden"> QR Code </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 p-5 pt-0 pb-20">
              <div className="flex flex-col gap-3 justify-between">
                <div className="flex flex-col">
                  <label>
                    if <strong>food</strong>, please specify:
                  </label>
                  <div className="flex flex-row gap-3">
                    <label
                      htmlFor="wet"
                      className="flex flex-row gap-2 p-3 rounded-[10px] border-1 border-[#444]"
                    >
                      <input
                        type="radio"
                        name="foodType"
                        id="wet"
                        value="Wet Food"
                        checked={formData.foodType === "Wet Food"}
                        onChange={handleChange}
                      />
                      Wet Food
                    </label>
                    <label
                      htmlFor="dry"
                      className="flex flex-row gap-2 p-3 rounded-[10px] border-1 border-[#444]"
                    >
                      <input
                        type="radio"
                        name="foodType"
                        id="dry"
                        value="Dry Food"
                        checked={formData.foodType === "Dry Food"}
                        onChange={handleChange}
                      />
                      Dry Food
                    </label>
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

              {/* If Items */}
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
