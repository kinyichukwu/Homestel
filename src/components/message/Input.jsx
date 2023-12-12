import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/chat.context";
import {
  arrayUnion,
  doc,
  increment,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { UserContext } from "../../context/user.context";
import { BsFillChatTextFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

const Input = () => {
  const [text, setText] = useState("");

  const { currentUser } = useContext(UserContext);
  const { data } = useContext(ChatContext);

  console.log(currentUser?.uid);

  const navigate = useNavigate();

  const handleSend = async () => {
    if (text === "") return;
    console.log(data.chatId);
    if (
      !data.chatId ||
      data.chatId === null ||
      data.chatId === undefined ||
      data.chatId === "null"
    ) {
      toast.error("Please select a user to chat with");
      return;
    }

    if (!currentUser) {
      toast.error("Please login to send message");
      navigate("/auth/login");
    }

    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
      [data.chatId + ".unread"]: increment(1),
    });

    setText("");
  };

  return (
    <div className="flex items-center absolute w-full bottom-0 bg-white">
      <input
        type="text"
        placeholder="Type message here "
        onChange={(e) => setText(e.target.value)}
        value={text}
        className="px-5 py-3 w-full   border-0 shadow outline-none text-[#464646b7] "
      />
      <BsFillChatTextFill
        className=" text-[#A445D1] mx-2 cursor-pointer"
        size={35}
        onClick={handleSend}
      />
    </div>
  );
};

export default Input;
