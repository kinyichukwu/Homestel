import React, { useContext, useRef, useEffect } from "react";
import { UserContext } from "../../context/user.context";
import { ChatContext } from "../../context/chat.context";
import profile from "../../assets/Pic.png";
import profile2 from "../../assets/profile2.svg";

const UserChatMessage = ({ message }) => {
  const { currentUser } = useContext(UserContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="my-2">
      <p
        ref={ref}
        className={`w-fit  ${
          message.senderId === currentUser.uid
            ? "max-w-[88%] bg-[#54007bf0] ml-auto"
            : "max-w-[70%] bg-[#A445D1] mr-auto"
        }  text-[#fff] px-[1.25rem] py-[0.62rem] rounded-3xl  rounded-bl-none`}
      >
        <p>{message.text}</p>
      </p>
    </div>
  );
};

export default UserChatMessage;
