import { useContext, useEffect, useLayoutEffect, useState } from "react";
import HostelCard from "../../components/hostel-components/HostelCard";
import { NavContext } from "../../context/showNav.context";
import { BeatLoader, ClipLoader } from "react-spinners";
import { db } from "../../utils/firebase/firebase.utils";
// chat collection for each seller imports
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  FieldPath,
} from "firebase/firestore";
import { UserContext } from "../../context/user.context";
import arrowDown from "../../assets/arrowDown.svg";
import home from "../../assets/home.svg";
import booked from "../../assets/booked.svg";
import plus from "../../assets/plus.svg";
import message from "../../assets/message.svg";
import settings from "../../assets/settings.svg";

import { calc } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { BsChevronDown } from "react-icons/bs";

const res = new Array(8).fill(0);
// active

const activeSpace =
  "bg-[#1a0623] max-md:w-[50%] text-white cursor-pointer rounded-md p-3 mb-2 max-md:text-center max-md:rounded-full text-[.8rem] mr-[.1rem]";
const inactiveSpace =
  "cursor-pointer max-md:w-[50%] rounded-md p-3 mb-2 text-[#1a0623] hover:bg-[#1a0623]/10 max-md:text-center max-md:rounded-full text-[.8rem] mr-[.1rem]";

const Hostels = () => {
  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);

  useLayoutEffect(() => {
    settopNav(true);
    setBottomNavBar(true);
  }, []);

  const hostelFilyer = ["Male Hostel", "Female Hostel"];
  const [selectedHostelFilter, setselectedHostelFilter] = useState(0);

  // fetch data from firestore
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const [active, setactive] = useState(1);

  const location = useLocation().pathname;

  useEffect(() => {
    setLoading(true);

    const fetchHostels = async () => {
      try {
        const response = await getDocs(collection(db, "hostel"));
        const data = response.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();

    console.log(location.split("/").includes("hostels"));

    if (
      location.split("/").includes("hostels") ||
      location.split("/").includes("apartment")
    ) {
      setactive(1);
    } else if (location.split("/").includes("book")) {
      setactive(2);
    } else if (location.split("/").includes("sell")) {
      setactive(3);
    } else if (location.split("/").includes("messages")) {
      setactive(4);
    } else if (location.split("/").includes("settings")) {
      setactive(5);
    }
  }, []);

  // filter fetched data into male hostels and apartment

  useEffect(() => {
    if (selectedHostelFilter === 0) {
      setLoading(true);
      setFilteredData(data.filter((ite, i) => ite?.gender === "MALE"));
    } else if (selectedHostelFilter === 1) {
      setLoading(true);
      setFilteredData(data.filter((ite, i) => ite?.gender === "FEMALE"));
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [selectedHostelFilter, data]);

  const activei =
    "bg-[#54007B]/10 hover:bg-[#54007B]/10 max-md:text-white max-md:bg-[#A445D1] max-md:w-[50%]  cursor-pointer rounded-md p-3 mb-2 max-md:rounded-none text-[#1a0623] max-md:text-center text-[.8rem]";

  const inactivei =
    " max-md:w-[50%] hover:bg-[#54007B]/10  text-[#1a0623] cursor-pointer rounded-md p-3 mb-2 max-md:text-center max-md:rounded-none text-[.8rem] ";

  return (
    <div className={topNav ? "max-md:pb-[88.5px]" : ""}>
      <section className="flex max-md:flex-col">
        <div className="w-[20%] md:hidden h-screen max-md:w-full max-md:relative  max-md:h-fit fixed  max-md:p-0 py-4 md:bg-[#54007B] bg-[#54007B]/[3%] overflow-auto md:pb-40">
          {/** dextop */}
          <div
            className="flex items-center gap-x-[.6rem] mt-[2.38rem] w-fit
           mb-[2.62rem] ml-[1.3rem] max-md:hidden px-[2.03rem] py-[1.03rem] bg-[#410060] rounded-[2.71875rem]"
          >
            <p className="text-white text-[1rem] font-bold">
              Hostels on Campus
            </p>
            <BsChevronDown size={20} color="white" />
          </div>
          {/** dextop */}

          <div className="flex flex-col gap-[1.19rem] max-md:hidden">
            <div
              className={`px-[2.66rem] gap-[0.5rem] flex items-center justify-start ${
                active === 1 ? "bg-[#911CC9]" : ""
              }`}
              onClick={() => setactive(1)}
            >
              <img src={home} alt="" />

              <p className="text-white text-[1.25rem] font-normal ">Home</p>
            </div>

            <div
              className={`px-[2.66rem] gap-[0.5rem] flex items-center justify-start cursor-pointer ${
                active === 2 ? "bg-[#911CC9]" : ""
              } `}
              onClick={() => setactive(2)}
            >
              <img src={booked} alt="" />

              <p className="text-white text-[1.25rem] font-normal ">Booked</p>
            </div>
            <div
              className={`px-[2.66rem] gap-[0.5rem] flex items-center justify-start cursor-pointer ${
                active === 3 ? "bg-[#911CC9]" : ""
              }`}
              onClick={() => setactive(3)}
            >
              <img src={plus} alt="" />

              <p className="text-white text-[1.25rem] font-normal ">Sell</p>
            </div>
            <div
              className={`px-[2.66rem] gap-[0.5rem] flex items-center justify-start cursor-pointer ${
                active === 4 ? "bg-[#911CC9]" : ""
              } `}
              onClick={() => setactive(4)}
            >
              <img src={message} alt="" />

              <p className="text-white text-[1.25rem] font-normal ">Messages</p>
            </div>
            <div
              className={`px-[2.66rem] gap-[0.5rem] flex items-center justify-start cursor-pointer ${
                active === 5 ? "bg-[#911CC9]" : ""
              }`}
              onClick={() => setactive(5)}
            >
              <img src={settings} alt="" />

              <p className="text-white text-[1.25rem] font-normal ">Settings</p>
            </div>
          </div>
        </div>

        <div className="w-[20%] h-screen max-md:w-full max-md:relative  max-md:h-fit fixed p-5 max-md:p-0 py-4 bg-[#54007B]/[3%]">
          <div className="max-md:flex">
            <p className="font-semibold text-[15px] mb-4 max-md:hidden">
              Filter
            </p>
            {hostelFilyer.map((item, i) => {
              return (
                <p
                  className={selectedHostelFilter === i ? activei : inactivei}
                  onClick={() => setselectedHostelFilter(i)}
                >
                  {item}
                </p>
              );
            })}
          </div>
          <div className="max-md:p-2 max-md:flex max-md:items-center md:mt-8"></div>
        </div>

        <div
          className="ml-[20%] max-md:w-full w-full max-md:ml-0 p-5"
          style={{
            width: calc("100% - 22rem"),
          }}
        >
          <h3 className="text-xl font-bold flex items-center gap-x-2">
            {hostelFilyer[selectedHostelFilter]}{" "}
          </h3>
          <div className="">
            {loading ? (
              <div className="h-[80vh] w-full mx-auto flex justify-center items-center">
                <BeatLoader color="#54007B" />
              </div>
            ) : !loading && filteredData.length < 1 ? (
              <div className="h-[80vh] w-full mx-auto flex justify-center items-center">
                <p>No {hostelFilyer[selectedHostelFilter]} found</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 max-md:grid-cols-1 max-xl:grid-cols-2 gap-5 my-5">
                {filteredData?.map((item, i) => {
                  return <HostelCard key={i} data={item} />;
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hostels;
