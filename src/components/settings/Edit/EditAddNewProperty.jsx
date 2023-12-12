import React, { useContext, useEffect, useRef, useState } from "react";
import SettingsNav from "../../settings/SettingsNav";
import RoundedCheckboxGroup from "../../utilities/RoundedCheckboxGroup";
import SettingsInput from "../../settings/Input";
import { AiOutlineClose } from "react-icons/ai";
import { Spinner } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useAddNewProperty } from "../../../context/AddNewProperty";
import { UserContext } from "../../../context/user.context";
import { useNavigate } from "react-router-dom";

const defaultInfo = {
  Name: "",
  PhoneNo: "",
  WhatsappNo: "",
  ExtraInfo: "",
};

const EditAddNewProperty = ({ propertyToEdit }) => {
  const { adding, addProperty, editProperty } = useAddNewProperty();
  const [propertyInfo, setPropertyInfo] = useState(defaultInfo);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const locations = ["CHEMIST", "PAKO", "ABULE OJA", "BARIGA", "IWIYA"];
  const [selectedLocation, setSelectedLocation] = useState("");
  const [address, setAddress] = useState("");
  const [extraDescription, setExtraDescription] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState("");
  const [loading, setLoading] = useState(false);
  const [roomNumbers, setRoomNumbers] = useState({
    price: 0,
    kitchen: 0,
    bedRoomNo: 0,
    manPerRoom: 0,
    bathroomNo: 0,
  });

  const imageRef = useRef(null);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    let data;
    try {
      setLoading(true);
      await fetch("https://pysavant-dstorage.cyclic.app/upload", {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        data = await res.json();
        setLoading(false);
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }

    return data;
  };

  const submitProperty = async () => {
    if (!currentUser) {
      toast.error("Please Login to continue");
      navigate("/auth/login");
      return;
    }

    if (propertyToEdit === null) {
      toast.error("Please select a property to edit");
      navigate("/user/settings/addedproperty");
      return;
    }

    if (
      selectedLocation == "" ||
      address == "" ||
      extraDescription == "" ||
      propertyInfo.Name == "" ||
      propertyInfo.WhatsappNo == "" ||
      propertyInfo.PhoneNo == ""
    ) {
      toast.error("Please Fill in all fields");
    } else if (!image) {
      toast.error("Please upload an image and a video of the apartment");
    } else if (address.length === 0) {
      toast.error("Please Kindly add the apartment address");
    } else {
      const imageLink = await uploadFile(image);

      await editProperty(
        {
          address,
          hostelLocation: selectedLocation,
          image: imageLink,
          video: video,
          personalInfo: propertyInfo,
          extraDescription,
          capacityDetails: roomNumbers,
          type: "offCampus",
          sellersID: currentUser?.uid,
        },
        propertyToEdit.id,
        currentUser?.uid
      );
    }
  };

  useEffect(() => {
    if (propertyToEdit !== null) {
      setSelectedLocation(propertyToEdit.hostelLocation);
      setPropertyInfo(propertyToEdit.personalInfo);
      setExtraDescription(propertyToEdit.extraDescription);
      setRoomNumbers(propertyToEdit.capacityDetails);
      setAddress(propertyToEdit.address);
      setVideo(propertyToEdit.video);
    }
  }, []);

  return (
    <>
      <SettingsNav title="Added Property" navigation="/user/sell" />
      <div className="px-6 pt-[1.69rem] pb-[4rem] max-w-[700px] w-full mx-auto">
        <div className="">
          {/**images */}
          {/** <AddPropertyImage></AddPropertyImage> */}
          <div className="my-3 text-center">
            <input
              ref={imageRef}
              onChange={(e) => setImage(e.target.files[0])}
              hidden
              type="file"
              accept="image/*"
            />

            {!image ? (
              <div
                onClick={() => imageRef.current.click()}
                className="w-full bg-[#F0CFFF] rounded-3xl mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  className=" mx-auto"
                >
                  <g opacity="0.5">
                    <path
                      d="M15.7222 21.8333L18.7778 25.5L23.0556 20L28.5556 27.3333H11.4444L15.7222 21.8333ZM31 28.5556V11.4444C31 10.0878 29.9 9 28.5556 9H11.4444C10.7961 9 10.1744 9.25754 9.71596 9.71596C9.25754 10.1744 9 10.7961 9 11.4444V28.5556C9 29.2039 9.25754 29.8256 9.71596 30.284C10.1744 30.7425 10.7961 31 11.4444 31H28.5556C29.2039 31 29.8256 30.7425 30.284 30.284C30.7425 29.8256 31 29.2039 31 28.5556Z"
                      fill="#54007B"
                    />
                  </g>
                </svg>
              </div>
            ) : (
              <div className="h-[200px] relative overflow-hidden rounded-xl mb-2">
                <AiOutlineClose
                  onClick={() => setImage(null)}
                  size={20}
                  color="white"
                  className="absolute z-40 top-2 right-2 bg-red-600 w-[30px] h-[30px] p-1.5 items-center justify-center flex rounded-full"
                />
                <img
                  className="h-[100%] w-full object-cover"
                  src={URL.createObjectURL(image)}
                  alt=""
                />
              </div>
            )}

            <p className="text-[#1A0823] opacity-80">Add Image</p>
          </div>
          {/** video */}
          <hr className="text-[#00000011] my-2 " />
          {/** video */}
          <div className="my-3 text-center">
            <input
              type="text"
              placeholder={"Youtube or Facebook Video Link"}
              value={video}
              onChange={(e) => setVideo(e.target.value)}
              className="block w-full px-3.5 py-2 color-text settings-input-input  placeholder:color-text sm:text-sm sm:leading-6 rounded-2xl outline-none"
            />
            <p className="text-[#1A0823] opacity-80 mt-2">Add Video</p>
          </div>

          <hr className="text-[#00000011] my-2 " />

          {/** <AddPropertyVideo></AddPropertyVideo>*/}
          <hr className="text-[#00000011] my-2 " />

          <p className="text-[#1A0823] font-semibold mb-[0.7rem]">
            Select Or Type Hostel Location [ PAKO ]
          </p>

          {locations.map((location, index) => {
            return (
              <p
                key={index}
                onClick={() => setSelectedLocation(location)}
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
          {/**  allow iusers to input  a particular location */}
          <input
            className="text-[#1A0823]  w-full  p-[0.62rem] outline-none border-[#89579d] border"
            type="text"
            placeholder="Enter Location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value.toUpperCase())}
          />

          <hr className="text-[#00000011] my-4 " />

          <p className="text-[#1A0823] font-semibold mb-[0.7rem]">
            Add address
          </p>

          <textarea
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="text-[#1A0823] opacity-60  w-full rounded-2xl p-[0.62rem] outline-none border-[#897F8D] border h-28"
            placeholder="23 Fourth Avenue street, pako akoka Lagos, you can as wll input more contents there’s enough space, cool right "
          />

          <hr className="text-[#00000011] my-2 " />

          <div className="flex justify-between items-center ">
            <p className="text-[#1A0823] font-semibold ">Bed Room No.</p>

            <span className=" w-[30%] text-center flex-grow-0 inline-block py-2 px-5 rounded-3xl bg-[#E8E8E8] text-[#54007B] font-semibold min-w-[7.5rem]">
              <input
                value={roomNumbers.bedRoomNo}
                className="border-none bg-transparent outline-none w-full text-center no-spinner"
                type="number"
                placeholder="0"
                onChange={(e) =>
                  setRoomNumbers((prev) => ({
                    ...prev,
                    bedRoomNo: e.target.value,
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
            <p className="text-[#1A0823] font-semibold ">Bath Room No.</p>

            <span className=" w-[30%] text-center flex-grow-0 inline-block py-2 px-5 rounded-3xl bg-[#E8E8E8] text-[#54007B] font-semibold min-w-[7.5rem]">
              <input
                value={roomNumbers.bathroomNo}
                className="border-none bg-transparent outline-none w-full text-center no-spinner"
                type="number"
                placeholder="0"
                onChange={(e) =>
                  setRoomNumbers((prev) => ({
                    ...prev,
                    bathroomNo: e.target.value,
                  }))
                }
              />
            </span>
          </div>
          <hr className="text-[#00000011] my-2 " />
          <div className="flex justify-between items-center ">
            <p className="text-[#1A0823] font-semibold ">Kitchen</p>

            <span className=" w-[30%] text-center flex-grow-0 inline-block py-2 px-5 rounded-3xl bg-[#E8E8E8] text-[#54007B] font-semibold min-w-[7.5rem]">
              <input
                value={roomNumbers.kitchen}
                className="border-none bg-transparent outline-none w-full text-center no-spinner"
                type="number"
                placeholder="0"
                onChange={(e) =>
                  setRoomNumbers((prev) => ({
                    ...prev,
                    kitchen: e.target.value,
                  }))
                }
              />
            </span>
          </div>
          <hr className="text-[#00000011] my-2 " />
          <div className="flex justify-between items-center ">
            <p className="text-[#1A0823] font-semibold ">Price</p>

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
            disabled={loading || adding}
            onClick={() => submitProperty()}
            className="py-[0.9rem] text-center w-full my-12 mb-4 rounded-2xl bg-[#54007B] flex items-center justify-center text-white font-medium hover:bg-[#54007bbf] disabled:opacity-60 active:bg-[#54007B]"
          >
            {loading || adding ? (
              <BeatLoader size={14} color="white" />
            ) : (
              "Save Property"
            )}
          </button>
          <button
            disabled={loading || adding}
            onClick={() => submitProperty()}
            className="py-[0.9rem] text-center w-full rounded-2xl bg-red-500 flex items-center justify-center text-white font-medium hover:bg-red-700 disabled:opacity-60 active:bg-red-700"
          >
            {loading || adding ? (
              <BeatLoader size={14} color="white" />
            ) : (
              "Delete Property"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditAddNewProperty;
