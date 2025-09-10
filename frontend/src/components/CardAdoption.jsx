import React from "react";
import { Link } from "react-router-dom";
import pic from "../assets/SampleCatPic.png";
const CardAdoption = () => {
  return (
    <div className="p-10">
      <div className=" rounded-2xl  shadow-2xl hover:shadow-xl transition-shadow duration-300 h-130 w-110 ">
        <img src={pic} alt="no picture  " className="rounded-t-2xl " />
        <div className="p-5">
          <div>
            <p className="text-left pb-2 font-semibold">Luna</p>
            <div className="grid grid-cols-2 gap-4 text-left p-2 pl-0 pr-0">
              <div>Gender:</div>
              <div>Age:</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left p-2 pl-0 pr-0">
              <div className="flex align-center  ">
                Status:{" "}
                {<div className="bg-yellow-600 rounded-lg p-1"> Spayed</div>}
              </div>
              <div>Size:</div>
            </div>
          </div>
          <p></p>
          <Link></Link>
        </div>
      </div>
    </div>
  );
};

export default CardAdoption;
