import React, { useState } from "react";
import AdminSideBar from "../../../components/AdminSideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CatProfileCreate = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [sterilization_status, setSterilizationStatus] = useState("");
  const [adoption_status, setAdoptionStatus] = useState("");
  const [description, setDescription] = useState("");

  const [catImage, setCatImage] = useState([]); // actual files
  const [catImagePreview, setCatImagePreview] = useState([]); // preview URLs

  const navigate = useNavigate();

  const catCreate = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/cat/create", {
        name,
        age,
        gender,
        sterilization_status,
        adoption_status,
        description,
      });

      if (response.status === 201 || response.status === 200) {
        const cat_id = response.data.cat_id;

        // Upload images after creating profile
        if (catImage.length > 0) {
          await handleUploadImages(cat_id);
        }

        navigate(`/catprofileproperty/${cat_id}`);
      }
    } catch (err) {
      console.error("Error creating cat profile:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    // store file
    setCatImage((prev) => [...prev, file]);

    // create preview
    const reader = new FileReader();
    reader.onload = () => {
      setCatImagePreview((prev) => [...prev, reader.result]);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = (indexToDelete) => {
    setCatImage((prev) => prev.filter((_, index) => index !== indexToDelete));
    setCatImagePreview((prev) =>
      prev.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleUploadImages = async (cat_id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/catimages/${cat_id}`,
        {
          cat_id: cat_id,
          images: catImagePreview,
        }
      );

      if (response.status === 200) {
        console.log("Image uploaded successfully!");
        setCatImage([]);
      }
    } catch (error) {
      console.error(
        "Image upload failed:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="relative flex flex-col h-screen">
      <div className="grid grid-cols-[20%_80%] overflow-x-hidden">
        <AdminSideBar />

        <div className="relative flex flex-col items-center p-10 min-h-screen gap-3 overflow-y-scroll">
          <div className="flex w-full items-center justify-between">
            <label className="text-[26px] font-bold text-[#2F2F2F] pl-2">
              CREATE CAT PROFILE
            </label>
          </div>

          <form
            onSubmit={catCreate}
            className="flex flex-col gap-4 w-full h-auto bg-[#FFF] p-7 rounded-[20px]"
          >
            {/* Name */}
            <div className="flex flex-row justify-between pb-2 border-b-1 border-b-[#CFCFCF]">
              <div className="flex flex-col">
                <label className="text-[#595959]">Name</label>
                <input
                  type="text"
                  placeholder="Add name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold"
                />
              </div>
            </div>

            {/* Age/Gender/Sterilization/Adoption */}
            <div className="flex flex-row justify-between gap-3 w-full ">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-[#595959]">Age</label>
                <input
                  type="number"
                  placeholder="Input Age here"
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="appearance-none p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="text-[#595959]">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold"
                >
                  <option hidden>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="text-[#595959]">Sterilization Status</label>
                <select
                  value={sterilization_status}
                  onChange={(e) => setSterilizationStatus(e.target.value)}
                  required
                  className="p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold"
                >
                  <option hidden>Select status</option>
                  <option value="Intact">Intact</option>
                  <option value="Neutered">Neutered</option>
                  <option value="Spayed">Spayed</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="text-[#595959]">Adoption Status</label>
                <select
                  value={adoption_status}
                  onChange={(e) => setAdoptionStatus(e.target.value)}
                  className="p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold"
                >
                  <option hidden>Select status</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="text-[#595959] font-bold">Description</label>
              <textarea
                rows={5}
                className="border-2 border-[#CFCFCF] resize-none rounded-[15px] p-2"
                placeholder="Describe the cat here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col w-full gap-2 p-5 rounded-[10px] border border-[#a3a3a3] bg-[#FDF5D8]">
              <div className="flex w-full gap-2 justify-between border-b border-b-[#595959] pb-2">
                <label className="text-[18px] font-bold text-[#2F2F2F]">
                  UPLOAD NEW IMAGE
                </label>
                <label
                  htmlFor="catImageUpload"
                  className="p-2 pl-4 pr-4 bg-[#2F2F2F] text-white rounded-[10px] cursor-pointer hover:bg-[#595959]"
                >
                  Add Image
                  <input
                    type="file"
                    accept="image/*"
                    id="catImageUpload"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="grid grid-cols-5 gap-2 w-full min-h-[200px]">
                {catImagePreview.map((img, index) => (
                  <div
                    key={index}
                    className="relative flex items-center bg-[#595959] max-w-[250px] h-[250px] rounded-[10px] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 p-1 px-4 bg-white text-[#2F2F2F] font-bold rounded-[10px] cursor-pointer"
                    >
                      Delete
                    </button>
                    <img
                      src={img}
                      alt={`uploaded-${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="p-2 px-4 bg-[#DC8801] text-white font-bold rounded-[15px] hover:bg-[#FFB235]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CatProfileCreate;
