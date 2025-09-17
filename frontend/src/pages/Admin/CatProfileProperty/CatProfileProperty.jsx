import React, { useState, useEffect } from "react";
import AdminSideBar from "../../../components/AdminSideBar";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const CatProfileProperty = () => {
  const location = useLocation();
  const { cat_id } = useParams();

  const [catprofile, setCatprofile] = useState({
    cat_id: "",
    name: "",
    gender: "Male",
    age: "",
    adoption_status: "Available",
    sterilization_status: "Intact",
    description: "",
    date_created: "",
    date_updated: "",
  });

  const [originalCatprofile, setOriginalCatprofile] = useState(null);

  const [catImage, setCatImage] = useState([]);
  const [catImagePreview, setCatImagePreview] = useState([]); // preview before upload
  const [uploaderVisible, setUploaderVisible] = useState(false);

  // Fetch profile
  useEffect(() => {
    if (!cat_id) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cats/${cat_id}`
        );
        setCatprofile(response.data);
        setOriginalCatprofile(response.data);
      } catch (err) {
        console.error("Error fetching cat:", err);
      }
    };

    fetchProfile();
  }, [cat_id]);

  // Checks if profile modified
  const isProfileModified = () => {
    return JSON.stringify(catprofile) !== JSON.stringify(originalCatprofile);
  };

  // Update profile
  const handleCatProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/cats/${cat_id}`,
        {
          name: catprofile.name,
          gender: catprofile.gender,
          age: catprofile.age,
          adoption_status: catprofile.adoption_status,
          sterilization_status: catprofile.sterilization_status,
          description: catprofile.description,
        }
      );

      console.log("Update success:", response.data);
      setOriginalCatprofile(catprofile); // reset original
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
    }
  };

  // Handle selecting new images (not uploaded yet)
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setCatImagePreview((prev) => [...prev, ...newFiles]);
  };

  // Toggle uploader
  const handleImageUploaderWindow = () => {
    if (uploaderVisible) {
      setCatImagePreview([]); // clear previews when closing
    }
    setUploaderVisible(!uploaderVisible);
  };

  // Upload new images
  const handleUploadImages = async (cat_id) => {
    try {
      const formData = new FormData();
      catImagePreview.forEach(({ file }) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        `http://localhost:5000/upload/catimages/${cat_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        console.log("Image uploaded successfully!");
        setCatImagePreview([]);
        setUploaderVisible(false);
        await fetchCatImage();
      }
    } catch (err) {
      console.error("Image upload failed: ", err.response?.data || err.message);
    }
  };

  // Fetch cat images
  const fetchCatImage = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/image/${cat_id}`);
      const imageUrls = response.data.map((filename) => ({
        filename,
        url: `http://localhost:5000/FileUploads/${filename}`,
      }));
      setCatImage(imageUrls);
    } catch (err) {
      console.error("Error fetching cat Image:", err);
    }
  };

  // Delete image
  const handleDeleteImage = async (filename) => {
    try {
      await axios.delete(`http://localhost:5000/image/${filename}`);
      console.log(`Deleted image: ${filename}`);
      fetchCatImage();
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  useEffect(() => {
    if (!cat_id) return;
    fetchCatImage();
  }, [cat_id]);

  return (
    <div className="relative flex flex-col h-screen">
      <div className="grid grid-cols-[20%_80%] overflow-x-hidden">
        <AdminSideBar />

        <div className="relative flex flex-col items-center p-10 min-h-screen gap-3 overflow-y-scroll">
          <div className="flex w-full items-center justify-between">
            <label className="text-[26px] font-bold text-[#2F2F2F] pl-2">
              CAT PROFILE
            </label>

            <Link
              to="/catprofilecreate"
              className="flex flex-row items-center justify-center gap-3 p-3 pl-6 pr-6 bg-[#B5C04A] text-[#FFF] rounded-[15px] hover:bg-[#CFDA34] active:bg-[#B5C04A]"
            >
              Create New
            </Link>
          </div>

          {catprofile && (
            <form
              onSubmit={handleCatProfileUpdate}
              className="flex flex-col gap-4 w-full h-auto bg-[#FFF] p-7 rounded-[20px]"
            >
              {/* Dates */}
              <div className="flex flex-row justify-end gap-6 pb-2">
                <div className="flex items-center gap-2">
                  <label className="text-[14px]">Date created:</label>
                  <label className="text-[14px] font-bold">
                    {catprofile.date_created}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[14px]">Date updated:</label>
                  <label className="text-[14px] font-bold">
                    {catprofile.date_created === catprofile.date_updated
                      ? "No updates"
                      : catprofile.date_updated}
                  </label>
                </div>
              </div>

              {/* Name / Cat ID */}
              <div className="flex flex-row justify-between pb-2 border-b-1 border-b-[#CFCFCF]">
                <div className="flex flex-col">
                  <label className="text-[16px] text-[#595959]">Name</label>
                  <input
                    type="text"
                    placeholder="Add name"
                    className="font-bold text-[#2F2F2F] text-[20px] p-2 rounded-[10px] border-2 border-[#CFCFCF]"
                    value={catprofile.name || ""}
                    onChange={(e) =>
                      setCatprofile((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col items-end">
                  <label className="text-[16px] text-[#595959]">Cat ID</label>
                  <label className="font-bold text-[#2F2F2F] text-[20px]">
                    {catprofile.cat_id}
                  </label>
                </div>
              </div>

              {/* Age/Gender/Sterilization/Adoption */}
              <div className="flex flex-row justify-between gap-3 w-full">
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-[16px] text-[#595959]">Age</label>
                  <input
                    type="number"
                    placeholder="Input Age here"
                    value={catprofile.age || ""}
                    onChange={(e) =>
                      setCatprofile((prev) => ({
                        ...prev,
                        age: e.target.value,
                      }))
                    }
                    className="appearance-none p-2 text-[#2F2F2F] rounded-[10px] border-2 border-[#CFCFCF] font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-[16px] text-[#595959]">Gender</label>
                  <select
                    value={catprofile.gender || ""}
                    onChange={(e) =>
                      setCatprofile((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="p-[10px] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-[16px] text-[#595959]">
                    Sterilization Status
                  </label>
                  <select
                    value={catprofile.sterilization_status || ""}
                    onChange={(e) =>
                      setCatprofile((prev) => ({
                        ...prev,
                        sterilization_status: e.target.value,
                      }))
                    }
                    className="p-[10px] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]"
                  >
                    <option value="Intact">Intact</option>
                    <option value="Neutered">Neutered</option>
                    <option value="Spayed">Spayed</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-[16px] text-[#595959]">
                    Adoption Status
                  </label>
                  <select
                    value={catprofile.adoption_status || ""}
                    onChange={(e) =>
                      setCatprofile((prev) => ({
                        ...prev,
                        adoption_status: e.target.value,
                      }))
                    }
                    className="p-[10px] rounded-[10px] border-2 border-[#CFCFCF] font-bold text-[#2F2F2F]"
                  >
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Adopted">Adopted</option>
                  </select>
                </div>
              </div>

              {/* Adoption History (static for now) */}
              <div className="flex flex-col gap-1">
                <label className="text-[16px] text-[#595959]">
                  Adoption history
                </label>
                <div className="flex flex-row justify-between p-2 rounded-[10px] border-2 bg-[#F2F2F2]">
                  <div className="flex flex-row gap-5">
                    <label className="text-[#595959]">Adopter: </label>
                    <label className="text-[#2F2F2F] font-bold">
                      Angelo M. Cabangal
                    </label>
                  </div>
                  <div className="flex flex-row gap-5">
                    <label className="text-[#595959]">Date Adopted: </label>
                    <label className="text-[#2F2F2F] font-bold">00/00/00</label>
                  </div>
                  <div className="flex flex-row gap-5">
                    <label className="text-[#595959]">Contact #: </label>
                    <label className="text-[#2F2F2F] font-bold">
                      09084853419
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label className="text-[#595959] font-bold">Description</label>
                <textarea
                  rows={5}
                  className="border-2 border-[#CFCFCF] resize-none rounded-[15px] p-2"
                  value={catprofile.description || ""}
                  onChange={(e) =>
                    setCatprofile((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the cat here"
                />
              </div>

              {/* Images Section */}
              {!uploaderVisible && (
                <div className="flex flex-col gap-2 border-1 border-[#a3a3a3] p-3 rounded-[15px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[20px] font-bold text-[#2F2F2F]">
                      IMAGES
                    </label>
                    <button
                      onClick={handleImageUploaderWindow}
                      type="button"
                      className="flex items-center gap-2 bg-[#2F2F2F] text-[#FFF] p-2 pl-4 pr-4 rounded-[25px] cursor-pointer active:bg-[#595959]"
                    >
                      <div className="w-[20px] h-auto">
                        <img
                          src="/src/assets/icons/admin-icons/setting_white.png"
                          alt="settings"
                        />
                      </div>
                      Manage Images
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2 w-full">
                    {catImage.map((imageURL, index) => (
                      <div
                        key={index}
                        className="relative flex items-center max-w-[250px] h-[250px] rounded-[10px] overflow-hidden bg-[#CCCCCC]"
                      >
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(imageURL.filename)}
                          className="absolute top-2 right-2 bg-[#DC8801] text-[#FFF] p-1 pl-2 pr-2 rounded-[15px] cursor-pointer active:bg-[#2F2F2F]"
                        >
                          Delete
                        </button>
                        <img
                          src={imageURL.url}
                          alt={`Cat ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploaderVisible && (
                <div className="flex flex-col gap-2 border-1 border-[#a3a3a3] p-3 rounded-[15px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[20px] font-bold text-[#2F2F2F]">
                      IMAGES
                    </label>
                    <label
                      htmlFor="image"
                      className="flex items-center gap-2 bg-[#2F2F2F] text-[#FFF] p-2 pl-4 pr-4 rounded-[25px] cursor-pointer active:bg-[#595959]"
                    >
                      <div className="w-[15px] h-auto">
                        <img src="/src/assets/icons/add-white.png" alt="add" />
                      </div>
                      <input
                        type="file"
                        name="image"
                        id="image"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      Add
                    </label>
                  </div>

                  {catImagePreview.length === 0 ? (
                    <label className="flex justify-center text-[#DC8801]">
                      Upload a new Image here.
                    </label>
                  ) : (
                    <div className="grid grid-cols-5 gap-2 w-full min-h-[250px]">
                      {catImagePreview.map((preview, index) => (
                        <div
                          key={index}
                          className="relative flex items-center max-w-[250px] h-[250px] rounded-[10px] overflow-hidden"
                        >
                          <img
                            src={preview.preview}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 w-full">
                    <button
                      type="button"
                      onClick={() => handleUploadImages(cat_id)}
                      className="flex items-center justify-center gap-2 bg-[#B5C04A] text-[#FFF] font-bold p-2 pl-4 pr-4 min-w-[80px] rounded-[25px] cursor-pointer active:bg-[#595959]"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleImageUploaderWindow}
                      type="button"
                      className="flex items-center gap-2 bg-[#2F2F2F] text-[#FFF] font-bold p-2 pl-4 pr-4 rounded-[25px] cursor-pointer active:bg-[#595959]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Save Profile Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={
                    isProfileModified()
                      ? "p-2 pl-4 pr-4 bg-[#DC8801] text-[#FFF] font-bold w-auto rounded-[15px] hover:bg-[#FFB235] active:bg-[#DC8801]"
                      : "hidden"
                  }
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatProfileProperty;
