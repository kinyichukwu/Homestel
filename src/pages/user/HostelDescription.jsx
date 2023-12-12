import { useContext, useEffect, useState } from "react";
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
} from "react-icons/bi";
import { BsBookmarkFill } from "react-icons/bs";
import blue from "../../assets/blue-couch.png";
import dots from "../../assets/dots.png";
import SettingsNav from "../../components/settings/SettingsNav";
import AppartmentCard from "../../components/appartment-components/AppartmentCard";
import { useLocation, useNavigate } from "react-router-dom";
import HostelCard from "../../components/hostel-components/HostelCard";
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
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { UserContext } from "../../context/user.context";
import { ChatContext } from "../../context/chat.context";
import { NavContext } from "../../context/showNav.context";

//  <BsBookmark />

const HostelDescription = () => {
  const [place] = useState(Rooms);
  const [sendMessage, setsendMessage] = useState(false);

  const [loading, setloading] = useState(false);
  const [data, setdata] = useState({
    gender: "",
    hostelName: "",
    roomNumber: { price: "", manPerRoom: "", bathroomNo: "", RoomNo: "" },
    space: "",
    type: "",
    id: "",
  });
  const [SimilarProperty, setSimilarProperty] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();
  const { settopNav, setBottomNavBar } = useContext(NavContext);

  const getSlug =
    location.pathname.split("/")[location.pathname.split("/").length - 1];

  useEffect(() => {
    // fetch data from firebase
    setloading(true);

    settopNav(false);
    setBottomNavBar(true);

    const fetchApartment = async () => {
      try {
        const response = await getDoc(doc(db, "hostel", getSlug));

        if (response.exists()) {
          setdata({ ...response.data() });
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
        const response = await getDocs(collection(db, "hostel"));
        const data = response.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setSimilarProperty(data);
      } catch (error) {
      } finally {
        setloading(false);
      }
    };

    fetchHostels();
  }, [getSlug]);

  const { gender, hostelName, roomNumber, space, type, id, sellersID } = data;
  const { price, manPerRoom, bathroomNo, RoomNo } = data?.roomNumber;

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
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      const usersData = await getDoc(doc(db, "users", currentUser.uid));
      const sellersData = await getDoc(doc(db, "users", sellersID));

      if (!usersData.data()) {
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
            navigation="/user/hostels"
            rightSide={<BsBookmark />}
          />

          <div className="flex justify-center mb-5 bg-[#F0CFFF] min-h-[18vh]"></div>

          <div className="bg-[#f6f6f6]  rounded-3xl mx-3 mb-5">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4 ">
                <div>
                  <p className="font-semibold">{hostelName} HALL</p>
                  <p className="text-sm opacity-70">Buy {space}</p>
                </div>
                <div>
                  <p className="text-sm opacity-60">
                    Room no.: <span className="opacity-[100%]">{RoomNo}</span>
                  </p>
                  <p className="font-semibold text-sm">{manPerRoom} Man Room</p>
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
                  {" "}
                  <BiMessage size={16} />
                  <p className="text-xs">Message</p>
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className="underline decoration-[#54007B] text-[#1A0823] text-[1.2rem] font-bold ml-6 mb-10 mt-8">
              Similar Hostels
            </p>
          </div>

          <div className="grid grid-cols-1 mx-3  md:grid-cols-3 gap-12 md:mx-9 mb-[16rem] md:mb-0">
            {SimilarProperty?.slice(0, 3).map((data, i) => {
              return <HostelCard data={data} />;
            })}
          </div>
        </section>
      )}
    </>
  );
};

export default HostelDescription;
