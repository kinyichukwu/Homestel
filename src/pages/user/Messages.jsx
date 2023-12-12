import React, { useContext, useState, useEffect, useLayoutEffect } from "react";
import SettingsNav from "../../components/settings/SettingsNav";
import {
  BsFillChatTextFill,
  BsFillTelephoneFill,
  BsTelephone,
} from "react-icons/bs";
import { BiMessage } from "react-icons/bi";
import { NavContext } from "../../context/showNav.context";
import profile from "../../assets/Pic.png";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user.context";
import { ChatContext } from "../../context/chat.context";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import UserChatMessage from "../../components/message/UserChatMessage";
import Input from "../../components/message/Input";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function OpenMessage() {
  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);

  useLayoutEffect(() => {
    settopNav(false);
    setBottomNavBar(false);
  }, []);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const chatOpen = location.pathname.split("/")[3] === "chat";
  console.log(chatOpen);

  // show messages when open
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
      setLoading(false);

      // change this when url is added
      if (doc.data()) {
      } else {
        navigate("/user/messages");
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  useEffect(() => {}, [location.pathname.split("/")[4]]);

  return (
    <section
      className={`relative h-screen w-full ${chatOpen ? "" : " max-md:hidden"}`}
      style={
        window.innerWidth < 768
          ? {
              height: "fill-available",
              height: "-moz-available",
              height: "-webkit-fill-available",
            }
          : {}
      }
    >
      <SettingsNav
        navigation={"/user/messages"}
        title={"Messages"}
        extraClassName="md:hidden"
      />

      <div className="px-6 py-3 drop-shadow-lg shadow shadow-[#00000030]">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-x-3">
            <img
              src="https://previews.123rf.com/images/ornitopter/ornitopter1510/ornitopter151000203/46712414-lightning-letter-i.jpg "
              alt=""
              className=" rounded-full w-8 h-8"
            />
            <span className="text-[#1A0823] text-sm font-semibold">
              {data.user?.displayName}
            </span>
          </div>

          <BsTelephone className=" text-[#54007B]" />
        </nav>
      </div>

      <div className=" pt-9 px-5 pb-40 h-[78.5vh] overflow-auto">
        {loading ? (
          <div className=" flex justify-center">
            <ClipLoader className="mt-[30vh] " />
          </div>
        ) : messages?.length === 0 ? (
          <div className="text-center mt-[30vh] ">No chat found</div>
        ) : (
          messages.map((m) => <UserChatMessage message={m} key={m.id} />)
        )}
      </div>

      <Input />
    </section>
  );
}

const res = new Array(7).fill(0);

function MessageList() {
  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);

  useLayoutEffect(() => {
    settopNav(false);
    setBottomNavBar(true);
  }, []);

  const navigate = useNavigate();

  // get chats from firebase
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const { dispatch } = useContext(ChatContext);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser?.uid),
        (doc) => {
          setChats(doc.data());

          setLoading(false);
        }
      );

      return () => {
        unsub();
      };
    };

    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="flex md:h-screen">
      <div className=" max-md:w-full md:h-screen overflow-auto md:w-[30%] md:min-w-[350px]">
        <SettingsNav
          title={"All Messages"}
          rightSide={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              className="cursor-pointer"
            >
              <path
                d="M17.9429 12C19.519 12 21.0306 12.6261 22.1451 13.7406C23.2596 14.8551 23.8857 16.3667 23.8857 17.9429C23.8857 19.4149 23.3463 20.768 22.4594 21.8103L22.7063 22.0571H23.4286L28 26.6286L26.6286 28L22.0571 23.4286V22.7063L21.8103 22.4594C20.768 23.3463 19.4149 23.8857 17.9429 23.8857C16.3667 23.8857 14.8551 23.2596 13.7406 22.1451C12.6261 21.0306 12 19.519 12 17.9429C12 16.3667 12.6261 14.8551 13.7406 13.7406C14.8551 12.6261 16.3667 12 17.9429 12ZM17.9429 13.8286C15.6571 13.8286 13.8286 15.6571 13.8286 17.9429C13.8286 20.2286 15.6571 22.0571 17.9429 22.0571C20.2286 22.0571 22.0571 20.2286 22.0571 17.9429C22.0571 15.6571 20.2286 13.8286 17.9429 13.8286Z"
                fill="#54007B"
              />
            </svg>
          }
          navigation={"/user/apartment"}
          showLeft={false}
        />

        <div className="flex flex-col gap-[1rem] mt-[3.1rem] mb-[9rem]">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <ClipLoader />
            </div>
          ) : chats ? (
            Object?.entries(chats)
              ?.sort((a, b) => b[1].date - a[1].date)
              .map((chat) => {
                

                return (
                  <div
                    className="flex gap-[1.7rem] justify-start items-start cursor-pointer mx-[1.4rem] relative"
                    key={chat[0]}
                    onClick={() => {
                      handleSelect(chat[1].userInfo);

                      const removeUnread = async () => {
                        await updateDoc(
                          doc(db, "userChats", currentUser?.uid),
                          {
                            [chat[0] + ".unread"]: 0,
                          }
                        );
                      };
                      removeUnread();
                      navigate(`/user/messages/chat`);
                    }}
                  >
                    <img
                      src={profile}
                      alt=""
                      className="h-[3.25rem] w-[3.25rem] rounded-full"
                    />

                    {chat[1]?.unread ? (
                      <div className="absolute bg-red-600 rounded-full w-4 h-4 left-9"></div>
                    ) : (
                      ""
                    )}

                    <div className="">
                      <p className="text-black text-base font-bold mb-[0.25rem]">
                        {chat[1]?.userInfo?.displayName?.toUpperCase()}
                      </p>
                      <p className="text-[#5E5E5E] text-[0.625rem] font-normal">
                        {chat[1]?.lastMessage?.text}
                      </p>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="text-center mt-[30vh] ">Start chatting now</div>
          )}
        </div>
      </div>

      <OpenMessage />
    </div>
  );
}

const Messages = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, [window.innerWidth]);
  return (
    <Routes>
      <Route path="/" element={<MessageList />} />
      <Route
        path="chat/*"
        element={width < 768 ? <OpenMessage /> : <MessageList />}
      />
    </Routes>
  );
};

export default Messages;
