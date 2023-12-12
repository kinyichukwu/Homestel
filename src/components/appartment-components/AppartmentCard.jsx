import React, { useContext, useLayoutEffect } from "react";
import { BiDollar, BiSolidBookmarkAlt } from "react-icons/bi";
import { NavContext } from "../../context/showNav.context";
import { useNavigate } from "react-router-dom";

function AppartmentCard({ doNotHideContact, item, i }) {
  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);

  useLayoutEffect(() => {
    settopNav(false);
    setBottomNavBar(true);
  }, []);

  const navigate = useNavigate();

  const {
    image,
    personalInfo,
    address,
    hostelLocation,
    video,
    extraDescription,
    capacityDetails,
    type,
    id,
  } = item;

  return (
    <div key={i} className="bg-[#f6f6f6]   rounded-3xl">
      <img
        src={image}
        className="h-[7.7rem] w-full object-cover cursor-pointer  rounded-t-3xl"
        onClick={() => navigate(`description/${id}`)}
      />

      <div className="p-6">
        <div
          className="flex items-center cursor-pointer justify-between mb-4 "
          onClick={() => navigate("description")}
        >
          <div>
            <p className="font-semibold">
              {capacityDetails.bedRoomNo} bed Rm, {hostelLocation},{" "}
              {address.split("").slice(0, 1).join("")}...
            </p>
            <p className=" text-xs opacity-70">{item?.gender || "Apartment"}</p>
          </div>
          <div>
            <p className="text-sm opacity-60 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 9.725C9.62112 9.725 9.25776 9.58013 8.98985 9.32227C8.72194 9.06441 8.57143 8.71467 8.57143 8.35C8.57143 7.98533 8.72194 7.63559 8.98985 7.37773C9.25776 7.11987 9.62112 6.975 10 6.975C10.3789 6.975 10.7422 7.11987 11.0102 7.37773C11.2781 7.63559 11.4286 7.98533 11.4286 8.35C11.4286 8.53057 11.3916 8.70937 11.3198 8.87619C11.248 9.04301 11.1428 9.19459 11.0102 9.32227C10.8775 9.44995 10.72 9.55123 10.5467 9.62033C10.3734 9.68944 10.1876 9.725 10 9.725ZM10 4.5C8.93913 4.5 7.92172 4.90562 7.17157 5.62764C6.42143 6.34965 6 7.32892 6 8.35C6 11.2375 10 15.5 10 15.5C10 15.5 14 11.2375 14 8.35C14 7.32892 13.5786 6.34965 12.8284 5.62764C12.0783 4.90562 11.0609 4.5 10 4.5Z"
                  fill="#897F8D"
                />
              </svg>{" "}
              {hostelLocation}
            </p>
            <p className="font-semibold text-sm text-right">N250,000</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[#54007B] font-bold text-xl ">N 70,000</h3>
          <p className=" text-[0.5rem] opacity-70 text-[#FF1010] my-auto font-semibold">
            11 others have booked
          </p>
        </div>

        <div className="flex items-center gap-x-3">
          <button
            className="flex bg-[#54007B] w-[50%] text-white p-3 rounded-2xl items-center cursor-pointer justify-center gap-x-1 text-sm"
            onClick={() => navigate("description")}
          >
            <BiDollar size={16} />
            <p className="text-xs">View Contact</p>
          </button>
          <button className="flex w-[50%] p-3 rounded-2xl items-center justify-center gap-x-1 border-[1px] border-[#54007B] bg-transparent text-[#54007B] text-sm">
            <BiSolidBookmarkAlt size={16} />
            <p className="text-xs">Unbook</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppartmentCard;
