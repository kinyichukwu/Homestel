import { useContext } from "react";
import {
  BiDollar,
  BiEdit,
  BiSolidBookmarkAlt,
  BiSolidMegaphone,
} from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user.context";
import { toast } from "react-toastify";
import { db } from "../../utils/firebase/firebase.utils.js";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

const HostelCard = ({ data }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const { gender, hostelName, roomNumber, space, type, id } = data;
  const { price, manPerRoom, bathroomNo, RoomNo } = data.roomNumber;

  const handelPromotion = () => {
    if (
      !data?.promotedTill ||
      new Date(data?.promotedTill?.toDate()) < new Date()
    ) {
      navigate(
        `/user/settings/addedproperty/promote/${data?.type}/${data?.id}`
      );
    } else if (new Date(data?.promotedTill?.toDate()) > new Date()) {
      toast.info(
        `You have promoted this property already, please wait till the promotion expires to promote again 😎 " ${data?.promotedTill
          ?.toDate()
          .toLocaleDateString()}"`
      );
    }
  };

  return (
    <div className="bg-[#f6f6f6] p-6 rounded-2xl w-full">
      <div
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => navigate(`description/${id}`)}
      >
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
      <h3
        className="text-[#54007B] font-bold text-xl mb-3"
        onClick={() => navigate("description")}
      >
        N {price}
      </h3>

      {currentUser?.uid !== data.sellersID ? (
        <div className="flex items-center gap-x-3">
          <button className="flex bg-[#54007B] w-[50%] text-white p-3 rounded-2xl items-center cursor-pointer justify-center gap-x-1 text-sm">
            <BiDollar size={16} />
            <p className="text-xs">View Contact</p>
          </button>

          <button
            className="flex w-[50%] p-3 rounded-2xl items-center justify-center gap-x-1 border-[1px] border-[#54007B] bg-transparent text-[#54007B] text-sm"
            onClick={async () => {
              if (data?.bookedBy?.includes(currentUser?.uid)) {
                const docRef = doc(db, "hostel", data.id);
                const userRef = doc(db, "users", currentUser?.uid);
                await updateDoc(docRef, {
                  bookedBy: arrayRemove(currentUser?.uid),
                });

                await updateDoc(userRef, {
                  bookedProperty: arrayRemove(data.id),
                });

                toast.success("Unbooked Successfully 😁");
              } else {
                const docRef = doc(db, "hostel", data.id);
                const userRef = doc(db, "users", currentUser?.uid);
                await updateDoc(docRef, {
                  bookedBy: arrayUnion(currentUser?.uid),
                });

                await updateDoc(userRef, {
                  bookedProperty: arrayUnion(data.id),
                });

                toast.success("Booked Successfully 😁");
              }

              window.location.reload();
            }}
          >
            <BiSolidBookmarkAlt size={16} />

            {data?.bookedBy?.includes(currentUser?.uid) ? (
              <p className="text-xs">Unbook</p>
            ) : (
              <p className="text-xs">Book</p>
            )}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-x-3">
          <button
            onClick={() => navigate(`/user/settings/addedproperty`)}
            className="flex bg-[#54007B] w-[50%] text-white p-3 rounded-2xl items-center cursor-pointer justify-center gap-x-1 text-sm"
          >
            <BiEdit size={16} />
            <p className="text-xs">View more</p>
          </button>
          <button
            className="flex w-[50%] p-3 rounded-2xl items-center justify-center gap-x-1 border-[1px] cursor-pointer border-[#54007B] bg-transparent text-[#54007B] text-sm"
            onClick={() => handelPromotion()}
          >
            <BiSolidMegaphone size={16} />
            <p className="text-xs">Promote</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default HostelCard;
