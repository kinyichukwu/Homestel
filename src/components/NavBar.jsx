import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { NavContext } from "../context/showNav.context";
import { UserContext } from "../context/user.context";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { useClickAway } from "react-use";
import logo from "../assets/Homestel.svg";

const NavBar = () => {
  const { topNav, settopNav, BottomNavBar, setBottomNavBar, navText } =
    useContext(NavContext);
  const { currentUser } = useContext(UserContext);
  const subNavRef = useRef();

  const [navMenu, setnavMenu] = useState(false);

  const [active, setactive] = useState(true);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/user/hostels") {
      setactive(false);
    } else if (location.pathname === "/user/apartment") {
      setactive(true);
    }
  }, [location.pathname]);

  useClickAway(subNavRef, () => {
    setnavMenu(false);
  });

  return topNav ? (
    <>
      <div
        className="w-full sticky top-0 shadow-xl bg-[#54007B] max-md:gap-y-3 
    justify-between max-md:flex-col max-md:items-start p-5 flex items-center gap-x-5 z-[999]"
      >
        <div className="flex items-center">
          <img src={logo} alt="" className="w-8" />
          <p className="text-white opacity-70">OMESTEL</p>
        </div>

        <div className="flex space-x-4 items-center w-full md:ml-5">
          <RxHamburgerMenu
            color="white"
            size={26}
            className="cursor-pointer"
            onClick={() => setnavMenu((prev) => !prev)}
          />

          <div className="flex bg-white w-[40%] max-md:w-full p-2 px-3 items-center gap-x-4 rounded-lg">
            <FiSearch color="#54007B" />
            <input
              type="text"
              className="outline-none w-full"
              placeholder="Search Hostels"
            />
          </div>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-x-6 max-md:hidden">
            <Link className="text-white" to={"/user/book"}>
              Booked
            </Link>
            <Link className="text-white" to={"/user/sell"}>
              Sell
            </Link>
            <Link className="text-white" to={"/user/messages"}>
              Messages
            </Link>
            <Link className="text-white" to={"/user/settings"}>
              Settings
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-x-4 max-md:hidden">
            <Link
              className="text-white text-[14px] bg-black/20 px-5 p-2 rounded-full"
              to={"/auth/login"}
            >
              Login
            </Link>
            <Link className="text-white text-[14px]" to={"/auth/register"}>
              Register
            </Link>
          </div>
        )}
      </div>

      {navMenu && (
        <div
          ref={subNavRef}
          className="absolute p-4 shadow-lg bg-white top-[7rem] w-[90%] left-[50%] translate-x-[-50%] rounded-2xl max-md:top-[8rem]"
          style={{ zIndex: 999 }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#1A0823] font-bold">Choose Category </span>

            <IoMdClose
              size={24}
              className="cursor-pointer"
              onClick={() => setnavMenu(false)}
            />
          </div>

          <div className="flex space-x-3 w-full">
            <div
              className={`p-[0.62rem]  ${
                active ? "bg-[#A445D1] text-white" : "text-[#1a0823be] bg-white"
              }  w-full text-[.8rem] font-medium rounded-2xl cursor-pointer text-center`}
              onClick={() => {
                setactive((prev) => !prev);

                setnavMenu(false);
                navigate("/user/apartment");
              }}
            >
              Off Campus
            </div>
            <div
              className={`p-[0.62rem]  ${
                !active
                  ? "bg-[#A445D1] text-white"
                  : "text-[#1a0823be] bg-white"
              }  w-full text-[.8rem] font-medium rounded-2xl cursor-pointer text-center`}
              onClick={() => {
                setactive((prev) => !prev);

                setnavMenu(false);
                navigate("/user/hostels");
              }}
            >
              On Campus
            </div>
          </div>

          {!currentUser && (
            <>
              <hr className="mt-[0.5rem] block"></hr>

              <span
                className="px-[1.25rem] py-[0.62rem] text-[#1A0823] font-normal block 
  cursor-pointer hover:text-[#1a0823ad] active:text-[#1A0823]"
                onClick={() => {
                  navigate("/auth/register");
                  setnavMenu(false);
                }}
              >
                Sign up
              </span>
              <hr className="mt-[0.5rem] block"></hr>
              <span
                onClick={() => {
                  navigate("/auth/login");
                  setnavMenu(false);
                }}
                className="px-[1.25rem] py-[0.62rem] text-[#1A0823] font-normal block 
  cursor-pointer hover:text-[#1a0823ad] active:text-[#1A0823]"
              >
                Log in
              </span>
            </>
          )}
        </div>
      )}

      <div
        ref={subNavRef}
        className="absolute p-4 shadow-lg bg-white top-[7rem] w-[90%] left-[50%] translate-x-[-50%] rounded-2xl max-md:top-[8rem] max-w-md"
        style={{ zIndex: 999 }}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#1A0823] font-bold">Roomate Alert </span>

          <IoMdClose
            size={24}
            className="cursor-pointer"
            onClick={() => setnavMenu(false)}
          />
        </div>

        <div className="flex space-x-3 w-full">
          <div
            className={`p-[0.62rem]  ${
              active ? "bg-[#A445D1] text-white" : "text-[#1a0823be] bg-white"
            }  w-full text-[.8rem] font-medium rounded-2xl cursor-pointer text-center`}
            onClick={() => {
              setactive((prev) => !prev);

              setnavMenu(false);
              navigate("/user/apartment");
            }}
          >
            Accept
          </div>
          <div
            className={`p-[0.62rem]  ${
              !active ? "bg-[#A445D1] text-white" : "text-[#1a0823be] bg-white"
            }  w-full text-[.8rem] font-medium rounded-2xl cursor-pointer text-center`}
            onClick={() => {
              setactive((prev) => !prev);

              setnavMenu(false);
              navigate("/user/hostels");
            }}
          >
            Reject
          </div>
        </div>

        <p className="mt-2">
          Hey there🧐, Our bots have found a roomate that should fit with you
          conciening the{" "}
        </p>
        
      </div>
    </>
  ) : (
    <></>
  );
};

export default NavBar;
