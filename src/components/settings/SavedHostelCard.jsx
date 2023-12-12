import { BsFillPencilFill, BsStar, BsTrashFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { db } from "../../utils/firebase/firebase.utils";
import { UserContext } from "../../context/user.context";
import { useContext } from "react";
import { toast } from "react-toastify";
import { deleteDoc, doc } from "firebase/firestore";

const SavedHostelCard = ({ data, setEdit }) => {
  const navigate = useNavigate();
  const { gender, hostelName, roomNumber, space, type, id } = data;
  const { price, manPerRoom, bathroomNo, RoomNo } = data.roomNumber;
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const deleteHostel = async (currentUser, data) => {
    const docRef = await doc(db, "hostel", data?.id);

    if (currentUser?.uid !== data?.sellersID) {
      toast.error(
        "You are not authorized to delete this hostel as you are not the owner😎"
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this hostel?")) {
      await deleteDoc(docRef)
        .then(() => {
          toast.success("Hostel deleted successfully");
          window.location.reload();
        })
        .catch((e) => {
          toast.error("An error occured");
          console.log(e);
        });
    }
  };

  const handelPromotion = () => {
    if (
      !data?.promotedTill ||
      new Date(data?.promotedTill?.toDate()) < new Date()
    ) {
      navigate(`promote/${data?.type}/${id}`);
    } else if (new Date(data?.promotedTill?.toDate()) > new Date()) {
      toast.info(
        `You have promoted this property already, please wait till the promotion expires to promote again 😎 " ${data?.promotedTill
          ?.toDate()
          .toLocaleDateString()}"`
      );
    }
  };

  return (
    <div className="bg-[#f6f6f6] p-6 rounded-2xl relative">
      <BsTrashFill
        size={15}
        className="absolute right-2 top-2  cursor-pointer"
        color="red"
        onClick={() => deleteHostel(currentUser, data)}
      />
      <div className="flex items-center justify-between mb-4 cursor-pointer">
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
      <h3 className="text-[#54007B] font-bold text-xl mb-3">N {price}</h3>
      <div className="flex items-center gap-x-3">
        <button
          className="flex w-[50%] p-3.5 rounded-xl items-center justify-center gap-x-2 border-[1px] border-[#54007B] bg-transparent text-[#54007B] text-sm"
          onClick={() => {
            navigate(`edit/hostel/${id}`);
            setEdit(data);
          }}
        >
          <BsFillPencilFill size={20} />
          <p className="text-sm">Edit</p>
        </button>

        <button
          className="flex bg-[#54007B] w-[50%] text-white p-3.5 rounded-xl items-center justify-center gap-x-2 text-sm"
          onClick={handelPromotion}
        >
          <BsStar size={18} color="#fff" />
          <p className="text-sm">Promote</p>
        </button>
      </div>
    </div>
  );
};

export default SavedHostelCard;
