import {
  BiSolidBookmark,
  BiSolidHome,
  BiSolidMessage,
  BiSolidMessageDetail,
} from "react-icons/bi";
import { IoAddCircle } from "react-icons/io5";
import { BsGearFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { NavContext } from "../context/showNav.context";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase/firebase.utils";

const BottomNavBar = () => {
  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);

  const { currentUser } = useContext(UserContext);
  const [chats, setChats] = useState({});

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser?.uid),
        (doc) => {
          setChats(doc.data());
        }
      );

      return () => {
        unsub();
      };
    };

    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  return BottomNavBar ? (
    <div className="md:hidden w-full shadow-2xl rounded-tr-xl rounded-tl-xl bottom-0 justify-evenly fixed p-5 flex z-[999] bg-white">
      <Link to={""} className="flex flex-col items-center gap-y-1">
        <BiSolidHome className="text-[#54007B]/50" size={25} />
        <p className="text-[13px] text-[#54007B]/50">Home</p>
      </Link>
      <Link to={"/user/book"} className="flex flex-col items-center gap-y-1">
        <BiSolidBookmark className="text-[#54007B]/50" size={25} />
        <p className="text-[13px] text-[#54007B]/50">Booked</p>
      </Link>
      <Link to={"/user/sell"} className="flex flex-col items-center gap-y-1">
        <IoAddCircle className="text-[#54007B]/50" size={25} />
        <p className="text-[13px] text-[#54007B]/50">Sell</p>
      </Link>
      <Link
        to={"/user/messages"}
        className="flex flex-col items-center gap-y-1 relative"
      >
        <BiSolidMessageDetail className="text-[#54007B]/50" size={25} />
        <p className="text-[13px] text-[#54007B]/50">Messages</p>

        <ShowIcon chats={chats} />
      </Link>
      <Link
        to={"/user/settings"}
        className="flex flex-col items-center gap-y-1"
      >
        <BsGearFill className="text-[#54007B]/50" size={25} />
        <p className="text-[13px] text-[#54007B]/50">Settings</p>
      </Link>
    </div>
  ) : (
    <></>
  );
};

export default BottomNavBar;

const ShowIcon = ({ chats }) => {
  let x = 0;
  Object?.entries(chats)
    ?.sort((a, b) => b[1].date - a[1].date)
    .map((chat) => {
      if (chat[1]?.unread) {
        x += chat[1].unread;
      }
    });
  console.log(x);

  return (
    <>
      {x > 0 && (
        <div className="absolute bg-red-600 rounded-full w-4 h-4 left-9"></div>
      )}
    </>
  );
};
