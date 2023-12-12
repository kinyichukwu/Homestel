import { toast } from "react-toastify";
import SettingsInput from "./Input";
import SettingsNav from "./SettingsNav";
import { UserContext } from "../../context/user.context";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { db } from "../../utils/firebase/firebase.utils";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { NavContext } from "../../context/showNav.context";

const defaultInfo = {
  Name: "",
  PhoneNo: "",
  WhatsappNo: "",
  Birthday: "",
};

const SettingsPersonalInfo = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [personalInfo, setpersonalInfo] = useState(defaultInfo);
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      const checkIfPersonalInfoExist = async () => {
        const userDocRef = doc(db, "users", currentUser.uid);

        const userSnapshot = await getDoc(userDocRef);
        const data = userSnapshot.data();

        setpersonalInfo((prev) => ({ ...data }));

        if (!userSnapshot.exists()) {
          // navigate to profile
          toast.info("Kindly Input your personal info");
        }
      };

      checkIfPersonalInfoExist();
    } else {
      navigate("/auth/login");
    }
  }, [currentUser]);

  console.log(personalInfo);

  const submitPersonalInfo = async (e) => {
    e.preventDefault();
    // check data
    if (
      !personalInfo.Name ||
      !personalInfo.PhoneNo ||
      !personalInfo.WhatsappNo ||
      !personalInfo.Birthday
    ) {
      toast.warn("Please Fill all the data");
      return;
    }

    if (
      personalInfo.PhoneNo.length !== 11 ||
      (personalInfo.PhoneNo.length === 14 &&
        personalInfo.PhoneNo.split("")[0] !== "+")
    ) {
      toast.warn("Please input a valid phone number ✈");
      return;
    }

    if (
      personalInfo.WhatsappNo.length !== 11 ||
      (personalInfo.WhatsappNo.length === 14 &&
        personalInfo.WhatsappNo.split("")[0] !== "+")
    ) {
      toast.warn("Please input a valid whatsapp number 🚗");
      return;
    }

    const bDay = personalInfo.Birthday.split("/");

    if (bDay.length !== 3) {
      toast.warn("Please input a valid birthday  Eg: 12/07/03 😏");
      return;
    }
    setloading(true);

    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);

      try {
        await setDoc(userDocRef, {
          ...personalInfo,
          email: currentUser.email,
        });
        setpersonalInfo(defaultInfo);
        toast.success("Personal Info Saved");
        navigate("/user/hostels");
      } catch (error) {
        console.log("error creating the user", error.message);
        toast.error("Error occured when saving");
      }
    } else {
      toast.warn("Kindly Login First");
      navigate("/auth/login");
    }
    setloading(false);
  };

  // bottom nav
  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);

  useLayoutEffect(() => {
    settopNav(false);
    setBottomNavBar(true);
  }, []);

  return (
    <>
      <SettingsNav title="Settings" navigation="/user/settings" />

      <div className="isolate px-6 py-3 lg:px-8 settings-input">
        <form
          className="mx-auto mt-3 max-w-xl sm:mt-4 mb-[14rem] lg:mb-0"
          onSubmit={submitPersonalInfo}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold leading-6 personal-info ">
                Personal Info
              </label>
            </div>
          </div>

          <SettingsInput
            title={"Name"}
            placeholder={"John Doe"}
            value={personalInfo.Name}
            change={(data) =>
              setpersonalInfo((prev) => ({ ...prev, Name: data }))
            }
          />
          <SettingsInput
            title={"Phone No."}
            placeholder={"09174629477"}
            value={personalInfo.PhoneNo}
            change={(data) =>
              setpersonalInfo((prev) => ({ ...prev, PhoneNo: data }))
            }
          />
          <SettingsInput
            title={"Whatsapp No. "}
            placeholder={"09174629477"}
            value={personalInfo.WhatsappNo}
            change={(data) =>
              setpersonalInfo((prev) => ({ ...prev, WhatsappNo: data }))
            }
          />
          <SettingsInput
            title={"Birthday"}
            placeholder={"DD/MM/YY"}
            value={personalInfo.Birthday}
            change={(data) =>
              setpersonalInfo((prev) => ({ ...prev, Birthday: data }))
            }
          />

          <div className="mt-8">
            <button
              className="block w-full rounded-2xl bg-color-p px-4 py-4 
                       text-center text-sm text-white shadow-sm hover:opacity-60 
                       focus:scale-103"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SettingsPersonalInfo;
