import React, { useContext, useEffect, useRef, useState } from "react";
import { BiBot } from "react-icons/bi";
import {
  BsArrowsAngleContract,
  BsArrowsAngleExpand,
  BsSend,
} from "react-icons/bs";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useClickAway } from "react-use";
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase/firebase.utils";
import { UserContext } from "../context/user.context";
import { v4 as uuid } from "uuid";
import { BeatLoader } from "react-spinners";
import { Link } from "react-router-dom";

const AIBot = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { currentUser } = useContext(UserContext);
  const [message, setmessage] = useState("");
  const modalRef = useRef();
  const [isTyping, setisTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesRef = useRef(null);
  const [hostels, setHostels] = useState([]);
  const [apartments, setApartments] = useState([]);

  const fetchHostels = async () => {
    try {
      onSnapshot(collection(db, "hostel"), (docs) => {
        docs.forEach((e) => {
          if (!hostels.includes({ ...e.data(), id: e.id })) {
            setHostels([...hostels, { ...e.data(), id: e.id }]);
          }
        });
      });
    } catch (error) {
    } finally {
    }
  };
  const fetchApartments = async () => {
    try {
      onSnapshot(collection(db, "apartment"), (docs) => {
        docs.forEach((e) => {
          if (!apartments.includes({ ...e.data(), id: e.id })) {
            setApartments([...apartments, { ...e.data(), id: e.id }]);
          }
        });
      });
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchHostels();
    fetchApartments();
  }, []);

  useClickAway(modalRef, () => {
    setModalIsOpen(false);
  });

  const sendMessage = async (userMessage) => {
    console.log(hostels);
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
    setMessages([
      ...messages,
      {
        id: uuid(),
        text: userMessage,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      },
    ]);
    setisTyping(true);
    await updateDoc(doc(db, "aichats", currentUser?.uid), {
      messages: arrayUnion({
        id: uuid(),
        text: userMessage,
        senderId: currentUser?.uid,
        date: Timestamp.now(),
      }),
    });
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: `${userMessage}(instruction: you are an assistant embedded to a site (Campushostels) for suggesting apartments or hostels based on json data given to you, you are to be friendly. I am going to give you an array of data and you to return an exact object in that array back to me that tallies with the user's description. This is the data for hostels ${JSON.stringify(
                  hostels
                )} and that for apartments ${JSON.stringify(
                  apartments
                )}. When suggesting, add \n for new lines`,
              },
            ],
            model: "gpt-3.5-turbo",
          }),
        }
      );
      setmessage("");
      const data = await response.json();
      await updateDoc(doc(db, "aichats", currentUser.uid), {
        messages: arrayUnion({
          id: uuid(),
          text: data.choices[0].message.content.trim(),
          senderId: "ai",
          date: Timestamp.now(),
        }),
      });
      setisTyping(false);
    } catch (error) {
      console.log(error);
      setisTyping(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const unSub = onSnapshot(doc(db, "aichats", currentUser.uid), (doc) => {
      doc.exists() &&
        doc.data().messages &&
        doc.data().messages !== undefined &&
        setMessages(doc.data().messages);
      messagesRef.current?.scrollIntoView({ behavior: "smooth" });
      setLoading(false);
    });

    return () => {
      unSub();
    };
  }, []);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, modalIsOpen]);

  const replacedTxt = (text) => {
    const hostelRegex = /\{hostels - (.*?)\}/g;
    let lastIndex = 0;
    const replacedText = [];
    let match;

    while ((match = hostelRegex.exec(text)) !== null) {
      const hostelId = match[1];
      const textBeforeMatch = text.substring(lastIndex, match.index);

      replacedText.push(
        <span key={`text-${lastIndex}`}>{textBeforeMatch}</span>
      );
      replacedText.push(
        <Link
          key={`link-${match.index}`}
          to={`/user/hostels/description/3I14miGCLWwHCl3Q6vhi/${hostelId}`}
        >
          Hostel Link
        </Link>
      );

      lastIndex = hostelRegex.lastIndex;
    }

    replacedText.push(
      <span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>
    );
    return replacedText;
  };

  return (
    <div className="fixed bottom-10 right-10 max-md:right-5 z-[99999] flex flex-col items-end max-w-[350px] max-md:max-w-[90%] w-full max-md:bottom-[7rem]">
      {modalIsOpen && (
        <div
          ref={modalRef}
          className={`bg-white w-full max-md:right-0 rounded-xl overflow-hidden border shadow-xl mb-3`}
        >
          <div className="flex px-4 py-4 justify-between items-center bg-[#54007B]">
            <p className="font-semibold text-white">AI assistant</p>
            <IoClose
              className="cursor-pointer"
              onClick={() => setModalIsOpen(false)}
              color="white"
              size={20}
            />
          </div>
          <div className="">
            <div ref={messagesRef} className="h-[300px] overflow-y-auto">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <BeatLoader color="#54007B" size={13} />
                </div>
              ) : !loading && messages.length < 1 ? (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-sm">No messages with assistant</p>
                </div>
              ) : (
                <div className="p-3">
                  {messages.map((data, id) => {
                    return (
                      <div
                        className={
                          data.senderId == currentUser.uid
                            ? `flex justify-end`
                            : `w-fit`
                        }
                        key={id}
                      >
                        <pre
                          className={
                            data.senderId == currentUser.uid
                              ? `text-[13px] text-white bg-[#54007B] p-3 mb-3 rounded-tl-xl rounded-b-xl w-fit max-w-[90%] whitespace-pre-wrap`
                              : `text-[13px] p-3 mb-3 bg-black/5 rounded-tr-xl rounded-br-xl rounded-bl-xl w-fit max-w-[90%] whitespace-pre-wrap`
                          }
                        >
                          {replacedTxt(data.text)}
                        </pre>
                      </div>
                    );
                  })}
                  {isTyping && (
                    <div className="p-3 mb-3 bg-black/5 rounded-tr-xl rounded-br-xl rounded-bl-xl w-fit">
                      <BeatLoader size={8} color="#54007B" />
                    </div>
                  )}
                </div>
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(message);
              }}
              className="flex p-2 px-3.5 gap-2 border-t"
            >
              <input
                value={message}
                onChange={(e) => setmessage(e.target.value)}
                className="flex-1 text-sm outline-none border-none"
                placeholder="Ask me!"
                type="text"
              />
              <button
                disabled={message.trim().length < 1 ? true : false}
                type="submit"
                className={`h-[30px] flex items-center justify-center rounded-full text-white w-[30px] bg-[#54007B] ${
                  message.trim().length < 1 ? "opacity-60" : "opacity-100"
                }`}
              >
                <BsSend size={13} />
              </button>
            </form>
          </div>
        </div>
      )}
      <div
        onClick={() => setModalIsOpen(!modalIsOpen)}
        className="bg-[#54007B] w-[60px] h-[60px] flex items-center justify-center text-[25px] rounded-full hover:shadow-xl cursor-pointer"
      >
        <BiBot color="white" />
      </div>
    </div>
  );
};

export default AIBot;
