import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillPencilFill, BsStar, BsTrashFill } from "react-icons/bs";
import { UserContext } from "../../context/user.context";
import { db } from "../../utils/firebase/firebase.utils";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { BiEdit, BiSolidMegaphone } from "react-icons/bi";

const SavedPropertyCard = ({ data, i, setEdit }) => {
  const navigate = useNavigate();
  const {
    image,
    personalInfo,
    address,
    hostelLocation,
    video,
    extraDescription,
    capacityDetails,
    type,
    id,
  } = data;

  const { currentUser, setCurrentUser } = useContext(UserContext);

  const deleteAppartment = async (currentUser, data) => {
    const docRef = await doc(db, "property", data?.id);

    if (currentUser?.uid !== data?.sellersID) {
      toast.error(
        "You are not authorized to delete this Appartment as you are not the owner😎"
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this Appartment?")) {
      await deleteDoc(docRef)
        .then(() => {
          toast.success("Appartment deleted successfully");
          window.location.reload();
        })
        .catch((e) => {
          toast.error("An error occured");
          console.log(e);
        });
    }
  };

  console.log(new Date(data?.promotedTill?.toDate()) > new Date());

  return (
    <div key={i} className="bg-[#f6f6f6]   rounded-3xl relative">
      <div
        className="absolute right-2 top-2 bg-white rounded-full"
        onClick={() => deleteAppartment(currentUser, data)}
      >
        <BsTrashFill size={15} className="  cursor-pointer m-2" color="red" />
      </div>

      <img
        src={image}
        className="h-[7.7rem] w-full object-cover cursor-pointer  rounded-t-3xl"
      />

      <div className="p-6">
        <div className="flex items-center cursor-pointer justify-between mb-4 ">
          <div>
            <p className="font-semibold">
              {capacityDetails.bedRoomNo} bed Rm, {hostelLocation},{" "}
              {address.split("").slice(0, 1).join("")}...
            </p>
            <p className=" text-xs opacity-70">{data?.gender || "Apartment"}</p>
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
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[#54007B] font-bold text-xl ">N 70,000</h3>
        </div>

        <div className="flex items-center gap-x-3">
          <button
            onClick={() => {
              navigate(`edit/${data?.type}/${id}`);
              setEdit(data);
            }}
            className="flex bg-[#54007B] w-[50%] text-white p-3 rounded-2xl items-center cursor-pointer justify-center gap-x-2 text-sm"
          >
            <BiEdit size={16} />
            <p className="text-xs">Edit</p>
          </button>
          <button
            className="flex bg-[#54007B] w-[50%] text-white p-3 rounded-2xl items-center cursor-pointer justify-center gap-x-2 text-sm"
            onClick={() => {
              if (
                !data?.promotedTill ||
                new Date(data?.promotedTill?.toDate()) < new Date()
              ) {
                navigate(`promote/${data?.type}/${id}`);
              }else if(new Date(data?.promotedTill?.toDate()) > new Date()){
                toast.info(`You have promoted this property already, please wait till the promotion expires to promote again 😎 " ${data?.promotedTill?.toDate().toLocaleDateString()}"`)
              }
            }}
          >
            <BsStar size={16} color="#fff" />
            <p className="text-xs">Promote</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedPropertyCard;
