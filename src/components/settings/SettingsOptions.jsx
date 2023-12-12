import React, { useContext, useEffect, useLayoutEffect } from "react";
import SettingsInput from "./Input";
import Profile from "../../assets/profile1.svg";
import Profile1 from "../../assets/profile2.svg";
import HomeIcon from "../../assets/settingsHome.svg";
import SettingsNav from "./SettingsNav";
import { NavContext } from "../../context/showNav.context";
import { useNavigate } from "react-router-dom";
import { signOutUser } from "../../utils/firebase/firebase.utils";

const SettingsOptions = () => {
  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);

  useLayoutEffect(() => {
    settopNav(false);
    setBottomNavBar(true);
  }, []);

  const navigate = useNavigate();
  return (
    <>
      <SettingsNav title="Settings" navigation="/user/apartment" />
      <div className="isolate  px-6 py-3 lg:px-8 settings-input ">
        <form className="mx-auto mt-3 max-w-xl sm:mt-4">
          <div
            className="mt-4 flex px-4 py-2 rounded-2xl shadow-sm profile-white-color  hover:bg-slate-100"
            onClick={() => navigate("personalInfo")}
          >
            <img src={Profile} alt="" />
            <button className="block w-full py-2.5 text-center text-sm color-p  focus:scale-103 ">
              Profile
            </button>
          </div>
          <div
            className="mt-4 flex px-4 py-2 rounded-2xl shadow-sm profile-white-color  hover:bg-slate-100"
            onClick={() => navigate("addedproperty")}
          >
            <img src={HomeIcon} alt="" />
            <button className="block w-full py-2.5 text-center text-sm color-p  focus:scale-103 ">
              View Added property
            </button>
          </div>

          <div
            className="mt-4 flex bg-color-p hover:opacity-60 px-4 py-2 rounded-2xl "
            onClick={async () => {
              await signOutUser();

              navigate("/auth/register");
            }}
          >
            <img src={Profile1} alt="" />
            <button
              type="button"
              className="block w-full  text-center text-sm text-white shadow-sm focus:scale-103"
            >
              Log Out
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SettingsOptions;
