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
        setCats(data);
      } catch (error) {
        console.error("Failed to fetch cats:", error);
      }
    };

    fetchCats();
  }, []);

  return (
    <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-350">
      {cats.map((cat) => (
        <div
          key={cat.cat_id}
          className="rounded-2xl shadow-2xl hover:shadow-xl transition-shadow duration-300 w-72"
        >
          <img
            src={pic}
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
                className="bg-lime-500 text-white px-4 py-2 rounded-xl hover:bg-lime-600"
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
