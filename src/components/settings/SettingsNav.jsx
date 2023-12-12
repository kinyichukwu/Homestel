import React from "react";
import { useNavigate } from "react-router-dom";

const SettingsNav = ({
  title,
  navigation,
  rightSide,
  showLeft,
  extraClassName = "",
}) => {
  const navigate = useNavigate();


  

  return (
    <nav
      className={`flex justify-between sticky top-0 z-[999] bg-white items-center py-[1.44rem] px-6 lg:px-8 shadow-md ${extraClassName}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="27"
        viewBox="0 0 27 27"
        fill="none"
        className={`cursor-pointer ${showLeft ? "invisible" : " "}`}
        onClick={() => navigate(-1)}
      >
        <path
          d="M24.9999 12.6111V15.3889H8.33321L15.9721 23.0278L13.9999 25L2.99988 14L13.9999 3L15.9721 4.97222L8.33321 12.6111H24.9999Z"
          fill="#1A0823"
        />
      </svg>

      <span className="">{title}</span>

      {rightSide ? (
        rightSide
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="27"
          height="27"
          viewBox="0 0 27 27"
          fill="none"
          className=" invisible"
        >
          <path
            d="M24.9999 12.6111V15.3889H8.33321L15.9721 23.0278L13.9999 25L2.99988 14L13.9999 3L15.9721 4.97222L8.33321 12.6111H24.9999Z"
            fill="#1A0823"
          />
        </svg>
      )}
    </nav>
  );
};

export default SettingsNav;
