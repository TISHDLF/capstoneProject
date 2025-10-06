import React from "react";

const Burger = () => {
  return (
    <div>
      <button className="relative inline-block">
        <div>
          <img
            src="/src/assets/icons/burgericon.png"
            alt="burger"
            className="w-[30px] h-[30px]"
          />
        </div>
      </button>
    </div>
  );
};

export default Burger;
