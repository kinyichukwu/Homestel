import {
  BiDollar,
  BiEdit,
  BiSolidBookmarkAlt,
  BiSolidMegaphone,
} from "react-icons/bi";
import AddNewProperty from "../../components/appartment-components/AddNewProperty";
import AddNewPropertyOptions from "../../components/appartment-components/AddNewPropertyOptions";
import SettingsNav from "../../components/settings/SettingsNav";

import React, { useContext, useEffect, useState } from "react";
import NoBooked from "../../components/booked-components/NoBooked";
import AppartmentCard from "../../components/appartment-components/AppartmentCard";
import { NavContext } from "../../context/showNav.context";
import { useNavigate } from "react-router-dom";
import { arrayUnion } from "firebase/firestore";

import { db } from "../../utils/firebase/firebase.utils";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { BeatLoader, ClipLoader } from "react-spinners";
import { UserContext } from "../../context/user.context";
import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNavBar";

function NoBookedAppartment() {
  return (
    <NoBooked
      text="Oops Nothing matches your search on Hostel"
      extraText="Try checking spelling"
    />
  );
}

const res = new Array(8).fill();

const Apartment = () => {
  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    settopNav(true);
    setBottomNavBar(true);
  }, []);

  const navigate = useNavigate();

  // active
  const active =
    "bg-[#54007B]/10 hover:bg-[#54007B]/10 max-md:text-white max-md:bg-[#A445D1] max-md:w-[50%]  cursor-pointer rounded-md p-3 mb-2 max-md:rounded-none text-[#1a0623] max-md:text-center text-[.8rem]";

  const inactive =
    " max-md:w-[50%] hover:bg-[#54007B]/10  text-[#1a0623] cursor-pointer rounded-md p-3 mb-2 max-md:text-center max-md:rounded-none text-[.8rem] ";

  const hostelFilyer = ["Male Hostel", "Apartment", "Female Hostel"];
  const [selectedHostelFilter, setselectedHostelFilter] = useState(0);

  // fetch data from firestore
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setLoading(true);

    const fetchHostels = async () => {
      try {
        const response = await getDocs(collection(db, "property"));
        const data = response.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setData(data);
        setFilteredData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  // filter fetched data into male hostels and apartment

  useEffect(() => {
    if (selectedHostelFilter === 1) {
      setLoading(true);
      setFilteredData(data.filter((ite, i) => ite?.type === "offCampus"));
    } else if (selectedHostelFilter === 2) {
      setLoading(true);
      setFilteredData(
        data.filter(
          (ite, i) =>
            ite?.type === "offCampusHostel" && ite?.gender === "FEMALE"
        )
      );
    } else {
      setLoading(true);
      setFilteredData(
        data.filter(
          (ite, i) => ite?.type === "offCampusHostel" && ite?.gender === "MALE"
        )
      );
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [selectedHostelFilter, data]);

  return (
    <>
      {!currentUser && <NavBar />}
      <div className={topNav ? "max-md:pb-[88.5px]" : ""}>
        <section>
          <section className="flex max-md:flex-col">
            <div className="w-[20%] h-screen max-md:w-full max-md:relative  max-md:h-fit fixed p-5 max-md:p-0 py-4 bg-[#54007B]/[3%]">
              <div className="mb-10 max-md:mb-0 max-md:flex max-md:items-center">
                <p className="font-semibold text-[15px] mb-4 max-md:hidden">
                  Filter
                </p>
                {hostelFilyer.map((item, i) => {
                  return (
                    <p
                      key={i}
                      className={selectedHostelFilter === i ? active : inactive}
                      onClick={() => setselectedHostelFilter(i)}
                    >
                      {item}
                    </p>
                  );
                })}
              </div>
              {false && (
                <div className="max-md:p-2 max-md:flex max-md:items-center">
                  <p className="font-semibold text-[15px] mb-4 max-md:hidden">
                    Spaces
                  </p>
                  <p className="cursor-pointer max-md:w-[50%] rounded-md p-3 mb-2 text-[#1a0623] hover:bg-[#1a0623]/10 max-md:text-center max-md:rounded-full">
                    Squatting spaces
                  </p>
                  <p className="bg-[#1a0623] max-md:w-[50%] text-white cursor-pointer rounded-md p-3 mb-2 max-md:text-center max-md:rounded-full">
                    Bed spaces
                  </p>
                </div>
              )}
            </div>

            <div className="w-[80%] ml-[20%] max-md:w-full max-md:ml-0 p-5">
              {loading ? (
                <div className="h-[80vh] w-full mx-auto flex justify-center items-center">
                  <BeatLoader color="#54007B" />
                </div>
              ) : !loading && filteredData.length < 1 ? (
                <div className="h-[80vh] w-full mx-auto flex justify-center items-center">
                  <p>No {hostelFilyer[selectedHostelFilter]} found</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1 gap-5 my-5">
                  {filteredData?.map((item, i) => {
                    // rem gender
                    const {
                      image,
                      address,
                      hostelLocation,
                      capacityDetails,
                      id,
                    } = item;

                    return (
                      <div key={i} className="bg-[#f6f6f6]   rounded-3xl">
                        <img
                          src={image}
                          className="h-[7.7rem] w-full object-cover cursor-pointer  rounded-t-3xl"
                          onClick={() =>
                            navigate(`/user/apartment/description/${id}`)
                          }
                        />

                        <div className="p-6">
                          <div
                            className="flex items-center cursor-pointer justify-between mb-4 "
                            onClick={() =>
                              navigate(`/user/apartment/description/${id}`)
                            }
                          >
                            <div>
                              <p className="font-semibold">
                                {capacityDetails.bedRoomNo} bed Rm,{" "}
                                {hostelLocation},{" "}
                                {address.split("").slice(0, 1).join("")}...
                              </p>
                              <p className=" text-xs opacity-70">
                                {item?.gender || "Apartment"}
                              </p>
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
                              {/* <p className="font-semibold text-sm text-right">
                                N
                                {Intl.NumberFormat("en-US").format(
                                  Number(capacityDetails.price)
                                )}
                              </p> */}
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-[#54007B] font-bold text-xl ">
                              N{" "}
                              {Number(capacityDetails.price)
                                ? Intl.NumberFormat("en-US").format(
                                    Number(capacityDetails.price)
                                  )
                                : 0}
                            </h3>
                            <p className=" text-[0.5rem] opacity-70 text-[#FF1010] my-auto font-semibold">
                              11 others have booked
                            </p>
                          </div>

                          {currentUser?.uid !== item.sellersID ? (
                            <div className="flex items-center gap-x-3">
                              <button className="flex bg-[#54007B] w-[50%] text-white p-3 rounded-2xl items-center cursor-pointer justify-center gap-x-1 text-sm">
                                <BiDollar size={16} />
                                <p className="text-xs">View Contact</p>
                              </button>
                              <button className="flex w-[50%] p-3 rounded-2xl items-center justify-center gap-x-1 border-[1px] border-[#54007B] bg-transparent text-[#54007B] text-sm">
                                <BiSolidBookmarkAlt size={16} />
                                <p className="text-xs">Unbook</p>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-x-3">
                              <button onClick={()=>navigate(`/user/settings/addedproperty`)} className="flex bg-[#54007B] w-[50%] text-white p-3 rounded-2xl items-center cursor-pointer justify-center gap-x-1 text-sm">
                                <BiEdit size={16} />
                                <p className="text-xs">View more</p>
                              </button>
                              <button className="flex w-[50%] p-3 rounded-2xl items-center justify-center gap-x-1 border-[1px] border-[#54007B] bg-transparent text-[#54007B] text-sm">
                                <BiSolidMegaphone size={16} />
                                <p className="text-xs">Promote</p>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/**Apartment card */}
                </div>
              )}
            </div>
          </section>
        </section>
      </div>
      {!currentUser && <BottomNav />}
    </>
  );
};

export default Apartment;
