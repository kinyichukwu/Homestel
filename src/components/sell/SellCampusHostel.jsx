import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import SettingsNav from "../settings/SettingsNav";
import RoundedCheckboxGroup from "../utilities/RoundedCheckboxGroup";
import SettingsInput from "../settings/Input";
import { AiOutlineClose } from "react-icons/ai";
import { Spinner } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useAddNewProperty } from "../../context/AddNewProperty";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user.context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { NavContext } from "../../context/showNav.context";

const defaultInfo = {
  Name: "",
  PhoneNo: "",
  WhatsappNo: "",
  ExtraInfo: "",
};

const SellCampusHostel = () => {
  const {
    topNav,
    settopNav,
    BottomNavBar,
    setBottomNavBar,
    navText,
    setnavText,
  } = useContext(NavContext);

  const { adding, addProperty, addHostel } = useAddNewProperty();
  const [propertyInfo, setPropertyInfo] = useState(defaultInfo);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const locations = [
    "ENI NJOKU",
    "MARIRE",
    "JAJA",
    "BIOBAKU",
    "MAKAMA",
    "MADAM TINUBU",
    "FAGUWA",
    "MOREMI",
    "KOFO",
  ];

  const [selectedLocation, setSelectedLocation] = useState("");
  const [extraDescription, setExtraDescription] = useState("");
  const [gender, setgender] = useState("Male");
  const [loading, setLoading] = useState(false);
  const [roomNumbers, setRoomNumbers] = useState({
    price: 0,
    RoomNo: 0,
    manPerRoom: 0,
    bathroomNo: 0,
  });

  useLayoutEffect(() => {
    settopNav(false);
  }, []);

  const submitProperty = async () => {
    setLoading(true);
    if (!currentUser) {
      toast.error("Please Login to continue");
      navigate("/auth/login");
      return;
    }

    const usersData = await getDoc(doc(db, "users", currentUser.uid));

    if (!usersData.exists()) {
      toast.error("Please update your profile to continue");
      navigate("/user/settings/personalInfo");
      return;
    }

    if (
      selectedLocation == "" ||
      propertyInfo.Name == "" ||
      propertyInfo.WhatsappNo == "" ||
      propertyInfo.PhoneNo == ""
    ) {
      toast.error("Please Fill in all fields");
    } else {
      await addHostel({
        hostelName: selectedLocation,
        personalInfo: propertyInfo,
        extraDescription,
        roomNumber: roomNumbers,
        type: "onCampus",
        gender: gender,
        space: "bedspace",
        sellersID: currentUser?.uid,
      });
    }
    setLoading(false);
  };

  return (
    <>
      <SettingsNav title="Add Hostel" navigation="/user/sell" />
      <div className="md:flex px-6 pt-[1.69rem] pb-[4rem]">
        <div className="">
          <hr className="text-[#00000011] my-2 " />
          <p className="text-[#1A0823] font-semibold mb-[0.7rem]">
            Select Hostel
          </p>
          <label className="block text-sm  font-medium text-[#1a0823b7] underline">
            Male
          </label>
          {locations.slice(0, 4).map((location, index) => {
            return (
              <p
                key={index}
                onClick={() => {
                  setSelectedLocation(location);
                  setgender("MALE");
                }}
                className="text-base text-center my-2 p-2 cursor-pointer "
                style={{
                  background:
                    selectedLocation == location ? "#54007b" : "#f0cfff",
                  color: selectedLocation == location ? "#fff" : "#54007b",
                }}
              >
                {location}
              </p>
            );
          })}

          <label className="block text-sm  font-medium text-[#1a0823b7] underline">
            Female
          </label>

          {locations.slice(4, locations?.length).map((location, index) => {
            return (
              <p
                key={index}
                onClick={() => {
                  setSelectedLocation(location);
                  setgender("FEMALE");
                }}
                className="text-base text-center my-2 p-2 cursor-pointer "
                style={{
                  background:
                    selectedLocation == location ? "#54007b" : "#f0cfff",
                  color: selectedLocation == location ? "#fff" : "#54007b",
                }}
              >
                {location}
              </p>
            );
          })}

          <hr className="text-[#00000011] my-2 " />

          <div className="flex justify-between items-center ">
            <p className="text-[#1A0823] font-semibold ">Room No.</p>

            <span className=" w-[30%] text-center flex-grow-0 inline-block py-2 px-5 rounded-3xl bg-[#E8E8E8] text-[#54007B] font-semibold min-w-[7.5rem]">
              <input
                value={roomNumbers.RoomNo}
                className="border-none bg-transparent outline-none w-full text-center no-spinner"
                type="text"
                placeholder="G103"
                onChange={(e) =>
                  setRoomNumbers((prev) => ({
                    ...prev,
                    RoomNo: e.target.value,
                  }))
                }
              />
            </span>
          </div>

          <hr className="text-[#00000011] my-2 " />
          <div className="flex justify-between items-center">
            <p className="text-[#1A0823] font-semibold ">Man per room</p>

            <span className=" w-[30%] text-center flex-grow-0 inline-block py-2 px-5 rounded-3xl bg-[#E8E8E8] text-[#54007B] font-semibold min-w-[7.5rem]">
              <input
                value={roomNumbers.manPerRoom}
                className="border-none bg-transparent outline-none w-full text-center no-spinner"
                type="number"
                placeholder="0"
                onChange={(e) =>
                  setRoomNumbers((prev) => ({
                    ...prev,
                    manPerRoom: e.target.value,
                  }))
                }
              />
            </span>
          </div>

          <hr className="text-[#00000011] my-2 " />
          <div className="flex justify-between items-center ">
            <p className="text-[#1A0823] font-semibold ">Add Price (₦)</p>

            <span className=" w-[30%] text-center flex-grow-0 inline-block py-2 px-5 rounded-3xl bg-[#E8E8E8] text-[#54007B] font-semibold min-w-[7.5rem]">
              <input
                value={roomNumbers.price}
                className="border-none bg-transparent outline-none w-full text-center no-spinner"
                type="number"
                placeholder="0"
                onChange={(e) =>
                  setRoomNumbers((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
              />
            </span>
          </div>

          <hr className="text-[#00000011] my-2 " />

          <p className="text-[#1A0823] font-semibold mb-[0.7rem]">
            Extra Description
          </p>

          <textarea
            title="ExtraInfo"
            type="text"
            value={extraDescription}
            onChange={(e) => setExtraDescription(e.target.value)}
            className="text-[#1A0823] opacity-60  w-full rounded-2xl p-[0.62rem] outline-none border-[#897F8D] border h-28"
            placeholder="This is the perfect Hostel for you as a student looking for personal space and comfort, a personal bedroom plus personal bathtub"
          />

          <hr className="text-[#00000011] my-2 " />
          <p className="text-[#1A0823] font-semibold mb-[0.75rem] underline underline-offset-2 opacity-60">
            Personal Info
          </p>

          <SettingsInput
            title="Name"
            placeholder="Gabriel John"
            value={propertyInfo.Name}
            change={(data) =>
              setPropertyInfo((prev) => ({ ...prev, Name: data }))
            }
          />
          <SettingsInput
            title="Phone No."
            placeholder="09134629407"
            value={propertyInfo.PhoneNo}
            change={(data) =>
              setPropertyInfo((prev) => ({ ...prev, PhoneNo: data }))
            }
          />
          <SettingsInput
            title="Whatsapp No."
            placeholder="09134629407"
            value={propertyInfo.WhatsappNo}
            change={(data) =>
              setPropertyInfo((prev) => ({ ...prev, WhatsappNo: data }))
            }
          />
          <button
            disabled={loading}
            onClick={() => submitProperty()}
            className="py-[0.9rem] text-center w-full my-12 cursor-pointer rounded-2xl bg-[#54007B] flex items-center justify-center text-white font-medium hover:bg-[#54007bbf] disabled:opacity-60 active:bg-[#54007B]"
          >
            {loading ? (
              <BeatLoader size={14} color="white" />
            ) : (
              "Add New Property"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default SellCampusHostel;
