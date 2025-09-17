import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pic from "../assets/SampleCatPic.png";
const CardAdoption = () => {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cats");
        const data = await response.json();

        // Fetch images for each cat
        const catsWithImages = await Promise.all(
          data.map(async (cat) => {
            try {
              const imgRes = await fetch(
                `http://localhost:5000/upload/catimages/${cat.cat_id}`
              );
              const imgData = await imgRes.json();

              // Get the first image (or fallback placeholder)
              const imageUrl =
                imgData.length > 0 ? imgData[0].url : "/default-cat.png";

              return { ...cat, imageUrl };
            } catch (err) {
              console.error(`Failed to fetch image for cat ${cat.cat_id}`, err);
              return { ...cat, imageUrl: "/default-cat.png" };
            }
          })
        );

        setCats(catsWithImages);
      } catch (error) {
        console.error("Failed to fetch cats:", error);
      }
    };

    fetchCats();
  }, []);

  return (
    <div className="flex gap-10 flex-wrap justify-center pb-10">
      {cats.map((cat) => (
        <div
          key={cat.cat_id}
          className="rounded-2xl shadow-2xl hover:shadow-xl transition-shadow duration-300 w-72"
        >
          <img
            src={cat.imageUrl}
            alt={cat.name}
            className="rounded-t-2xl w-full h-48 object-cover"
          />
          <div className="p-5 ">
            <p className="text-left pb-2 font-semibold">{cat.name}</p>

            <div className="grid grid-cols-2 gap-4 text-left text-sm">
              <div className="flex gap-2 col-span-2">
                Gender:{" "}
                <div className="bg-yellow-600 text-white rounded-lg px-2">
                  {cat.gender}
                </div>
              </div>
              <div>Age: {cat.age || "Unknown"}</div>
              <div className="flex gap-2 col-span-2">
                Status:
                <div className="bg-yellow-600 text-white rounded-lg px-2">
                  {cat.sterilization_status}
                </div>
              </div>
              <div>Size: {cat.size || "N/A"}</div>
            </div>

            <div className="pt-4">
              <Link
                to={`/cat/${cat.cat_id}`}
                className="bg-[#B5C04A] text-white px-4 py-2 rounded-xl hover:bg-lime-600"
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
