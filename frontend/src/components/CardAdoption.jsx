import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pic from "../assets/SampleCatPic.png";

const CardAdoption = () => {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch("http://localhost:5000/cats/catlist");
        const data = await response.json();

        const catsWithImages = data.map((cat) => ({
          ...cat,
          imageUrl: cat.thumbnail
            ? `http://localhost:5000/uploads/cats/${cat.thumbnail}`
            : "/default-cat.png",
        }));

        setCats(catsWithImages);
      } catch (error) {
        console.error("Failed to fetch cats:", error);
      }
    };

    fetchCats();
  }, []);

  return (
    <div className="flex gap-6 md:gap-10 flex-wrap justify-center pb-10">
      {cats.map((cat) => (
        <div
          key={cat.cat_id}
          className="rounded-2xl shadow-2xl hover:shadow-xl transition-shadow duration-300 w-full sm:w-72 max-w-sm"
        >
          <img
            src={cat.imageUrl}
            alt={cat.name}
            className="rounded-t-2xl w-full h-48 object-cover"
          />
          <div className="p-4 md:p-5">
            <p className="text-left pb-2 font-semibold text-base md:text-lg">
              {cat.name}
            </p>

            <div className="grid grid-cols-2 gap-3 md:gap-4 text-left text-xs md:text-sm">
              <div className="flex gap-2 col-span-2 items-center">
                <span>Gender:</span>
                <div className="bg-yellow-600 text-white rounded-lg px-2 py-0.5 text-xs">
                  {cat.gender}
                </div>
              </div>
              <div>Age: {cat.age || "Unknown"}</div>
              <div className="flex gap-2 col-span-2 items-center">
                <span>Status:</span>
                <div className="bg-yellow-600 text-white rounded-lg px-2 py-0.5 text-xs">
                  {cat.sterilization_status}
                </div>
              </div>
              <div>Size: {cat.size || "N/A"}</div>
            </div>

            <div className="pt-4">
              <Link
                to={`/catprofile/${cat.cat_id}`}
                className="inline-block w-full md:w-auto text-center bg-[#B5C04A] text-white px-4 py-2 rounded-xl hover:bg-lime-600 text-sm md:text-base"
              >
                View More
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardAdoption;
