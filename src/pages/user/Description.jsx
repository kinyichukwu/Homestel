import { useContext, useState } from "react";
import Rooms from "../data/rooms";
import stuff from "../data/house";
import { BsBookmark } from "react-icons/bs";
import { HiLocationMarker } from "react-icons/hi";
import { IoIosCall } from "react-icons/io";
import {
  BiDollar,
  BiMessage,
  BiMessageDetail,
  BiPhoneCall,
  BiSend,
  BiSolidBookmarkAlt,
  BiVideo,
} from "react-icons/bi";
import { BsBookmarkFill } from "react-icons/bs";
import blue from "../../assets/blue-couch.png";
import dots from "../../assets/dots.png";
import SettingsNav from "../../components/settings/SettingsNav";
import AppartmentCard from "../../components/appartment-components/AppartmentCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { ChatContext } from "../../context/chat.context";
import { UserContext } from "../../context/user.context";
import { toast } from "react-toastify";
import { NavContext } from "../../context/showNav.context";

//  <BsBookmark />

const Description = () => {
  const [place] = useState(Rooms);
  const [sendMessage, setsendMessage] = useState(false);
  const [loading, setloading] = useState(true);
  const [data, setdata] = useState({});
  const [SimilarProperty, setSimilarProperty] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();

  const getSlug =
    location.pathname.split("/")[location.pathname.split("/").length - 1];

  const { settopNav, setBottomNavBar } = useContext(NavContext);

  useEffect(() => {
    // fetch data from firebase
    setloading(true);

    settopNav(false);

    setBottomNavBar(true);

    const fetchApartment = async () => {
      try {
        const response = await getDoc(doc(db, "property", getSlug));

        if (response.exists()) {
          setdata(response.data());
          console.log(response.data());
        } else {
          toast.error("Apartment not found");
          navigate("/user/apartment");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    fetchApartment();

    const fetchHostels = async () => {
      try {
        const response = await getDocs(collection(db, "property"));
        const data = response.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setSimilarProperty(data);
      } catch (error) {
        setError(error);
      } finally {
        setloading(false);
      }
    };

    fetchHostels();
  }, [getSlug]);

  const {
    address,
    capacityDetails,
    extraDescription,
    gender,
    hostelLocation,
    image,
    personalInfo,
    sellersID,
    type,
    video,
  } = data;

  const { dispatch } = useContext(ChatContext);

  // create chat collection for each seller
  const { currentUser } = useContext(UserContext);

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    if (!currentUser) {
      toast.error("Please login to continue");
      return;
    }

    setloading(true);

    const combinedId =
      currentUser.uid > sellersID
        ? currentUser.uid + sellersID
        : sellersID + currentUser.uid;

    console.clear();
    console.log(currentUser.uid, "current user");
    console.log(sellersID, "sellers id");
    console.log(combinedId, "combinedId");
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      const usersData = await getDoc(doc(db, "users", currentUser.uid));
      const sellersData = await getDoc(doc(db, "users", sellersID));

      if (!usersData.exists()) {
        toast.error("Please update your profile to continue");
        navigate("/user/settings/personalInfo");
        return;
      }

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: sellersID,
            displayName: sellersData.data().Name,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", sellersID), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: usersData.data().Name,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }

      dispatch({
        type: "CHANGE_USER",
        payload: {
          uid: sellersID,
          displayName: sellersData.data().Name,
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }

    navigate(`/user/messages/chat/${combinedId}`);
  };

  return (
    <>
      {loading ? (
        <div className="h-screen flex justify-center items-center ">
          <ClipLoader />
        </div>
      ) : (
        <section>
          <SettingsNav
            title="Hostels on Campus"
            navigation="/user/apartment"
            rightSide={<BsBookmark />}
          />

          {loading ? (
            <div className="h-[80vh] flex justify-center items-center">
              <ClipLoader color="#54007B" size={50} />
            </div>
          ) : (
            <>
              <div className="md:flex md:justify-center mb-4">
                <img
                  src={data?.image}
                  alt="blue-couch"
                  className="w-full md:w-[50%] "
                />
              </div>

              <div className="flex justify-center mb-5">
                <img src={dots} alt="dots" />
              </div>

              <div className="bg-[#f6f6f6]  rounded-3xl mx-3 mb-5">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4 ">
                    <div>
                      <p className="font-semibold text-[ 0.9375rem]">
                        {data?.capacityDetails?.bedRoomNo} bed Rm,{" "}
                        {data?.hostelLocation},{" "}
                        {data?.address?.split("")?.slice(0, 1)?.join("")}...
                      </p>
                      <p className=" text-xs opacity-70">
                        {data?.gender || "Apartment"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-60 flex items-center text-[0.6875rem]">
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
                        {data?.hostelLocation}
                      </p>
                      <p className="font-semibold text-sm text-right  ">
                        {data?.price || ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-x-3">
                    <button className="flex bg-[#54007B] w-[50%] text-white p-3 rounded-2xl items-center justify-center gap-x-1 text-sm">
                      <BiPhoneCall size={16} />
                      <p className="text-xs">Call</p>
                    </button>
                    <button
                      className="flex w-[50%] p-3 rounded-2xl items-center justify-center gap-x-1 border-[1px] border-[#54007B] bg-transparent text-[#54007B] text-sm"
                      onClick={() => {
                        handleSelect();
                      }}
                    >
                      <BiMessage size={16} />
                      <p className="text-xs">Message</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className=" bg-[#F6F6F6] mx-3 md:mx-auto py-8 mb-5 lg:max-w-lg md:py-10 rounded-xl px-6">
                <div className="flex items-center pl-4 pb-6 ">
                  <HiLocationMarker className="text-[1.2rem] md:text-[1.5rem] text-gray-600 mr-2 " />
                  <h3 className=" text-[0.9375rem] font-semibold">Location</h3>
                </div>

                <div>
                  <p className=" text-gray-600 pl-4 text-[0.875rem]">
                    {data?.address},{" "}
                    <span className="text-gray-800">
                      {data?.hostelLocation}
                    </span>{" "}
                  </p>
                </div>
              </div>

              <div className=" bg-[#F6F6F6] mx-3 md:mx-auto py-8 mb-5 lg:max-w-lg md:py-10 rounded-xl px-6">
                <div className="flex items-center pl-4 pb-6 ">
                  <BiVideo className="text-[1.2rem] md:text-[1.5rem] text-gray-600 mr-2 " />
                  <h3 className=" text-[0.9375rem] font-semibold">
                    Video Link
                  </h3>
                </div>

                <div>
                  <p className=" text-gray-600 pl-4 text-[0.875rem]">
                    <a
                      href={data?.video}
                      className="text-[#54007B] whitespace-nowrap"
                    >
                      {data?.video.split("").slice(0, 20).join("")}...
                    </a>
                  </p>
                </div>
              </div>

              <div className=" mx-4 md:max-w-lg  md:mx-auto  mb-10">
                {place.map((items) => {
                  const { id, furniture, number, dataName } = items;
                  return (
                    <div
                      key={id}
                      className="bg-[#F6F6F6] mb-4 flex justify-between items-center rounded-xl  py-3 pl-[1.5rem] pr-[0.52rem]"
                    >
                      <p className="text-[#1A0823] font-semibold ">
                        {furniture}
                      </p>

                      <span className=" w-[30%] text-center flex-grow-0 inline-block py-2 px-5 rounded-3xl bg-[#E8E8E8] text-[#54007B] font-semibold min-w-[7.5rem]">
                        <input
                          value={data?.capacityDetails[dataName]}
                          className="border-none bg-transparent outline-none w-full text-center"
                          type="text"
                          placeholder="0"
                        />
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-[#897F8D] border-solid border-[0.1rem] px-6 py-4 mb-5 rounded-3xl mx-4 md:mx-20">
                <p className="text-gray-600">{data.extraDescription}</p>
              </div>

              <div>
                <p className="underline decoration-[#54007B] text-[#1A0823] text-[1.2rem] font-bold ml-6 mb-10">
                  Similar property
                </p>
              </div>

              <div className="grid grid-cols-1 mx-3  md:grid-cols-3 gap-12 md:mx-9 mb-[16rem] md:mb-0">
                {SimilarProperty?.slice(0, 4).map((data, i) => {
                  return (
                    <AppartmentCard
                      key={i}
                      item={data}
                      doNotHideContact={true}
                    />
                  );
                })}
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
};

export default Description;
