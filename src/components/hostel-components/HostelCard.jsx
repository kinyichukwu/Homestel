import { BiDollar, BiSolidBookmarkAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const HostelCard = ({ data }) => {
  const navigate = useNavigate();
  console.log(data);
  const { gender, hostelName, roomNumber, space, type, id } = data;
  const { price, manPerRoom, bathroomNo, RoomNo } = data.roomNumber;
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
      <div className="flex items-center gap-x-3">
        <button className="flex bg-[#54007B] w-[50%] text-white p-3.5 rounded-xl items-center justify-center gap-x-2 text-sm">
          <BiDollar size={20} />
          <p className="text-sm">Buy Now</p>
        </button>
        <button className="flex w-[50%] p-3.5 rounded-xl items-center justify-center gap-x-2 border-[1px] border-[#54007B] bg-transparent text-[#54007B] text-sm">
          <BiSolidBookmarkAlt size={20} />
          <p className="text-sm">Book</p>
        </button>
      </div>
    </div>
  );
};

export default HostelCard;
