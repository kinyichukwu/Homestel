import React, { useContext, useLayoutEffect, useEffect, useState } from "react";
import SettingsNav from "./SettingsNav";
import RoundedCheckboxGroup from "../utilities/RoundedCheckboxGroup";
import { NavContext } from "../../context/showNav.context";
import { useLocation } from "react-router-dom";

import EditSellOffCampusHostel from "./Edit/EditSellOffCampusHostel";
import EditAddNewProperty from "./Edit/EditAddNewProperty";

import SettingsInput from "../settings/Input";
import { AiOutlineClose } from "react-icons/ai";
import { Spinner } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useAddNewProperty } from "../../context/AddNewProperty";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user.context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import axios from "axios";

const AddedPropertyPromote = ({ propertyToPromote }) => {
  // bot nav
  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);

  useLayoutEffect(() => {
    settopNav(false);
    setBottomNavBar(true);
  }, []);

  const { pathname } = useLocation();

  //   pathname.split("/")[5] === "hostel", pathname.split("/")[5] === "offCampusHostel", pathname.split("/")[5] === "offCampus"

  return (
    <>
      <PromoteProperty propertyToPromote={propertyToPromote} />
    </>
  );
};

export default AddedPropertyPromote;

const defaultInfo = {
  Name: "",
  PhoneNo: "",
  WhatsappNo: "",
  ExtraInfo: "",
};

const PromoteProperty = ({ propertyToPromote }) => {
  const { adding, addProperty, addHostel, editHostel } = useAddNewProperty();
  const [propertyInfo, setPropertyInfo] = useState(defaultInfo);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [i, seti] = useState(0);
  const locations = [
    "Promote for 1 day (₦500)    ",
    "Promote for 3 days (₦1,500)",
    "Promote for 7 days (₦3,000)",
    "Promote for 14 days (₦5,000)",
    "Promote for 30 days (₦10,000)",
    "Promote for 60 days (₦20,000)",
    "Promote for 90 days (₦30,000)",
  ];
  const amm = [
    "₦500",
    "₦1,500",
    "₦3,000",
    "₦5,000",
    "₦10,000",
    "₦20,000",
    "₦30,000",
  ];

  const chiAmm = [
    "NGN500",
    "NGN1500",
    "NGN3000",
    "NGN5000",
    "NGN10000",
    "NGN20000",
    "NGN30000",
  ];

  const days = [1, 3, 7, 14, 30, 60, 90];

  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const { pathname } = useLocation();

  const promoteProperty = async (selectedLocation) => {
    setLoading(true);

    if (!currentUser?.uid) {
      toast.error("You need to be logged in to promote your property");
      navigate("/auth/register");
      return;
    }

    if (!selectedLocation || !pathname.split("/")[6]) {
      toast.error("Please select a plan to promote your property");
      return;
    }

    // try {
    //   console.log(currentUser?.email, currentUser?.phoneNumber);
    //   const res = await axios.post(
    //     "https://chi-money-api.vercel.app/payment/initiate",
    //     {
    //       amount: chiAmm[i],
    //       payerEmail: currentUser?.email,
    //       phone: currentUser?.phoneNumber,
    //       name: currentUser?.displayName,
    //       // reference: pathname.split("/")[6],
    //       redirect_url: `https://homestel.vercel.app/user/apartment/`,
    //       // value_in_usd: pathname
    //     }
    //   );

    //   console.log(res.data);
    //   toast.success(
    //     "Payment Initiated, kindly go to your chimoney account to complete payment"
    //   );
    // } catch (err) {}

    // check if doc is in firebase

    await promotePropertyDb(pathname.split("/")[5]);

    async function promotePropertyDb(pType) {
      try {
        const colRef = await doc(
          db,
          `${pType === "onCampus" ? "hostel" : "property"}`,
          pathname.split("/")[6]
        );

        await updateDoc(colRef, {
          promotedTill: new Date(
            new Date().setDate(new Date().getDate() + days[i])
          ),
        })
          .then(async () => {
            toast.success(` Promoted Successfully 😁`);
          })
          .catch((e) => {
            toast.error("An error occured");
            console.log(e);
          });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <SettingsNav
        title="Post Advert"
        navigation="/user/settings/addedproperty"
      />
      <div className="px-6 pt-[1.69rem] max-w-[700px] w-full mx-auto pb-[4rem]">
        <div className="">
          <hr className="text-[#00000011] my-2 " />
          <p className="text-[#1A0823] font-semibold mb-[0.7rem]">
            Select Plan
          </p>

          <label className="block text-sm  font-medium text-[#1a0823b7] underline">
            Basic
          </label>
          {locations.slice(0, 4).map((location, index) => {
            return (
              <p
                key={index}
                onClick={() => {
                  setSelectedLocation(location);
                  seti(index);
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
            Pro (Extra Perks include Social Media Promotion)
          </label>

          {locations.slice(4, locations?.length).map((location, index) => {
            return (
              <p
                key={index}
                onClick={() => {
                  setSelectedLocation(location);
                  seti(index + 4);
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

          <button
            disabled={loading || adding}
            onClick={() => promoteProperty(selectedLocation)}
            className="py-[0.9rem] text-center w-full mt-12 mb-4 rounded-2xl bg-[#54007B] flex items-center justify-center text-white font-medium hover:bg-[#54007bbf] disabled:opacity-60 active:bg-[#54007B]"
          >
            {loading || adding ? (
              <BeatLoader size={14} color="white" />
            ) : (
              "Promote Property ⭐"
            )}
          </button>

          <p className="mb-20 text-center opacity-90 text-sm">
            Powered by{" "}
            <a
              className="text-[#54007B] cursor-pointer"
              href="https://chimoney.io/"
            >
              Chimoney
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
