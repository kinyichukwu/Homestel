import React, { useContext, useState, useEffect } from "react";
import SavedHostelCard from "./SavedHostelCard";
import SettingsNav from "./SettingsNav";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user.context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import HostelCard from "../hostel-components/HostelCard";
import SavedPropertyCard from "./SavedPropertyCard";
import { ClipLoader } from "react-spinners";

const AddedProperty = ({ setEdit }) => {
  // import data from firebase
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [loading, setloading] = useState(true);
  const [hostels, sethostels] = useState(null);
  const [apartments, setapartments] = useState(null);
  const [a, seta] = useState(null);

  useEffect(() => {
    const usersPropertyAddedReference = async (user) => {
      console.log(user);
      const hostelsData = [];
      const apartmentsData = [];
      try {
        const q = query(
          collection(db, "hostel"),
          where("sellersID", "==", user?.uid)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No matching documents.");
        } else {
          querySnapshot.forEach((doc) => {
            hostelsData.push({ ...doc.data(), id: doc.id });
          });
        }

        // get data for apartments
        const q2 = query(
          collection(db, "property"),
          where("sellersID", "==", user?.uid)
        );
        const querySnapshot2 = await getDocs(q2);

        if (querySnapshot2.empty) {
          console.log("No matching documents.");
        } else {
          querySnapshot2.forEach((doc) => {
            apartmentsData.push({ ...doc.data(), id: doc.id });
          });
        }
        sethostels(hostelsData);
        setapartments(apartmentsData);
      } catch (error) {
        console.log(error);
      } finally {
        if (user || a) {
          setloading(false);
        }
        seta(true);
      }
    };

    usersPropertyAddedReference(currentUser);
  }, [currentUser]);

  return (
    <>
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <ClipLoader />
        </div>
      ) : (
        <>
          <SettingsNav title="Added Property" navigation="/user/settings" />

          <section className="flex max-md:flex-col mb-[14rem] lg:mb-0">
            <div className="w-[20%] h-screen max-md:w-full max-md:relative  max-md:h-fit fixed p-5 max-md:p-0 py-4 bg-[#54007B]/[3%] md:block hidden">
              <div className="mb-10 max-md:mb-0 max-md:flex max-md:items-center">
                <p className="font-semibold text-[15px] mb-4 max-md:hidden">
                  Filter
                </p>
                <p className="bg-[#54007B]/10 hover:bg-[#54007B]/10 max-md:text-white max-md:bg-[#A445D1] max-md:w-[50%]  cursor-pointer rounded-md p-3 mb-2 max-md:rounded-none text-[#1a0623] max-md:text-center">
                  Male Hostel
                </p>
                <p className=" max-md:w-[50%] hover:bg-[#54007B]/10  text-[#1a0623] cursor-pointer rounded-md p-3 mb-2 max-md:text-center max-md:rounded-none">
                  Female Hostel
                </p>
              </div>
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
            </div>
            <div className="w-[80%] ml-[20%] max-md:w-full max-md:ml-0 p-5">
              <h3 className="text-xl font-bold flex items-center gap-x-2">
                Settings{" "}
                <span className="font-medium text-[16px]">
                  &gt; Added Property
                </span>{" "}
              </h3>
              <div className="grid grid-cols-3 max-md:grid-cols-1 gap-5 my-5">
                {hostels?.map((item, i) => (
                  <SavedHostelCard key={i} data={item} setEdit={setEdit} />
                ))}
                {apartments?.map((item, i) => (
                  <SavedPropertyCard key={i} data={item} setEdit={setEdit} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default AddedProperty;
