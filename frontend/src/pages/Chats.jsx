import { useLocation } from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import {
  useAuth,
} from "../context/AuthContext";

import {
  getUserAvatar,
} from "../utils/avatar";

export default function Chats() {

  const location = useLocation();

  const incomingDoctor =
    location.state?.doctor;

  const { user } =
    useAuth();

  const [conversations, setConversations] =
    useState([]);

  const [activeConversation, setActiveConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const messagesEndRef =
    useRef();

  // =========================
  // LOAD CONVERSATIONS
  // =========================
  useEffect(() => {

    if (!user) return;

    fetchConversations();

  }, [user]);


  // =========================
  // FETCH CONVERSATIONS
  // =========================
  const fetchConversations =
    async () => {

      try {

        const res =
          await axios.get(
            `http://127.0.0.1:8000/api/conversations/${user.id}`
          );

        setConversations(
          res.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  // =========================
  // OPEN CHAT
  // =========================
  const openConversation =
    async (conversation) => {

      setActiveConversation(
        conversation
      );

      try {

        const res =
          await axios.get(
            `http://127.0.0.1:8000/api/messages/${conversation.id}`
          );

        setMessages(
          res.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage =
    async () => {

      if (
        !input.trim() ||
        !activeConversation
      ) return;

      const otherUser =
        activeConversation.user_one.id ===
        user.id
          ? activeConversation.user_two
          : activeConversation.user_one;

      try {

        await axios.post(
          "http://127.0.0.1:8000/api/send-message",
          {
            sender_id: user.id,

            receiver_id:
              otherUser.id,

            message: input,
          }
        );

        setInput("");

        await openConversation(
          activeConversation
        );

        await fetchConversations();

      } catch (error) {

        console.log(error);

      }

    };

  // =========================
  // START NEW CHAT
  // =========================
  useEffect(() => {

  if (
    incomingDoctor &&
    user
  ) {

    createConversationIfNeeded();

  }

}, [incomingDoctor]);

const createConversationIfNeeded =
  async () => {

    try {

      await axios.post(
        "http://127.0.0.1:8000/api/send-message",
        {
          sender_id: user.id,

          receiver_id:
            incomingDoctor.id,

          message: " ",
        }
      );

      // FETCH UPDATED CONVERSATIONS
      const res =
        await axios.get(
          `http://127.0.0.1:8000/api/conversations/${user.id}`
        );

      setConversations(
        res.data
      );

      // FIND NEW CHAT
      const found =
        res.data.find((c) => {

          return (
            c.user_one.id ===
              incomingDoctor.id ||

            c.user_two.id ===
              incomingDoctor.id
          );

        });

      // OPEN IT
      if (found) {

        openConversation(found);

      }

    } catch (error) {

      console.log(error);

    }

  };


  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  if (!user) return null;

  return (
    <div className="flex justify-center mt-6 px-4">

      <div
        className="w-full max-w-6xl h-[75vh]
        flex bg-white/20 backdrop-blur-2xl
        border border-white/30 rounded-3xl
        shadow-[0_10px_40px_rgba(0,0,0,0.1)]
        overflow-hidden"
      >

        {/* LEFT */}
        <div
          className="w-1/3 border-r border-white/30
          bg-white/20 backdrop-blur-xl flex flex-col"
        >

          <div className="p-4 font-semibold text-gray-700">
            Conversations
          </div>

          <div className="flex-1 overflow-y-auto">

            {conversations.map(
              (conversation) => {

                const otherUser =
                  conversation.user_one.id ===
                  user.id
                    ? conversation.user_two
                    : conversation.user_one;

                const lastMessage =
                  conversation.messages[
                    conversation.messages.length - 1
                  ];

                return (

                  <div
                    key={conversation.id}

                    onClick={() =>
                      openConversation(
                        conversation
                      )
                    }

                    className={`flex items-center gap-3
                    px-4 py-3 cursor-pointer
                    transition rounded-xl mx-2 ${
                      activeConversation?.id ===
                      conversation.id
                        ? "bg-white/40 shadow"
                        : "hover:bg-white/30"
                    }`}
                  >

                    <img
                      src={getUserAvatar(
                        otherUser
                      )}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />

                    <div className="flex-1">

                      <p className="text-sm font-medium">
                        {otherUser.name}
                      </p>

                      <p className="text-xs text-gray-500 truncate">
                        {lastMessage?.message?.trim()}
                      </p>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col">

          {/* HEADER */}
          {activeConversation && (

            <div
              className="px-5 py-3 border-b
              border-white/30 bg-white/30
              flex items-center gap-3"
            >

              {(() => {

                const otherUser =
                  activeConversation.user_one.id ===
                  user.id
                    ? activeConversation.user_two
                    : activeConversation.user_one;

                return (
                  <>
                    <img
                      src={getUserAvatar(
                        otherUser
                      )}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />

                    <h2 className="font-semibold">
                      {otherUser.name}
                    </h2>
                  </>
                );

              })()}

            </div>

          )}

          {/* MESSAGES */}
          <div
            className="flex-1 overflow-y-auto
            px-4 py-4 flex flex-col gap-3"
          >

            {messages
              .filter(
                (msg) =>
                  msg.message?.trim() !== ""
              )
              .map((msg) => (

                <div
                  key={msg.id}

                  className={`flex flex-col ${
                    msg.sender_id ===
                    user.id
                      ? "items-end"
                      : "items-start"
                  }`}
                >

                  <div
                    className={`px-4 py-2 rounded-2xl
                    text-sm max-w-[70%] shadow-sm ${
                      msg.sender_id ===
                      user.id
                        ? "bg-blue-500 text-white"
                        : "bg-white/80 text-gray-800"
                    }`}
                  >
                    {msg.message?.trim()}
                  </div>

                  <span
                    className="text-[10px]
                    text-gray-400 mt-1"
                  >
                    {new Date(
                      msg.created_at
                    ).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>

                </div>

              ))}

            <div ref={messagesEndRef}></div>

          </div>

          {/* INPUT */}
          {activeConversation && (

            <div
              className="flex items-center gap-2
              px-4 py-3 border-t border-white/30
              bg-white/30"
            >

              <input
                value={input}

                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }

                placeholder="Type a message..."

                className="flex-1 px-4 py-2
                rounded-full bg-white/50
                outline-none text-sm"

                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  sendMessage()
                }
              />

              <button
                onClick={sendMessage}

                className="px-5 py-2 rounded-full
                bg-blue-500 text-white text-sm"
              >
                Send
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}