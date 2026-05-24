import { useEffect, useRef, useState } from "react";

import { useLocation } from "react-router-dom";

import axios from "axios";

import { useAuth } from "../context/AuthContext";

import { getUserAvatar } from "../utils/avatar";

export default function Chats() {

  const { user } = useAuth();

  const location = useLocation();

  const incomingDoctor =
    location.state?.doctor;

  const [conversations, setConversations] =
    useState([]);

  const [activeConversation, setActiveConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const messagesEndRef =
    useRef();

  // =========================
  // FETCH CONVERSATIONS
  // =========================
  const fetchConversations =
    async () => {

      if (!user) return;

      try {

        const res =
          await axios.get(
            `http://127.0.0.1:8000/api/conversations/${user.id}`
          );

        setConversations(
          res.data
        );

        // PRESERVE ACTIVE CHAT
        if (
          activeConversation
        ) {

          const updated =
            res.data.find(
              (c) =>
                c.id ===
                activeConversation.id
            );

          if (updated) {

            setActiveConversation(
              updated
            );

          }

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  // =========================
  // FETCH MESSAGES
  // =========================
  const fetchMessages =
    async (
      conversationId
    ) => {

      try {

        const res =
         await axios.get(
          `http://127.0.0.1:8000/api/messages/${conversationId}`,
          {
            params: {
              user_id: user.id,
            },
          }
        );

        setMessages(
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
    async (
      conversation
    ) => {

      setActiveConversation(
        conversation
      );

      await fetchMessages(
        conversation.id
      );

    };

  // =========================
  // START CONVERSATION
  // =========================
  const startConversation =
    async () => {

      if (
        !incomingDoctor ||
        !user
      ) return;

      try {

        const res =
          await axios.post(
            "http://127.0.0.1:8000/api/start-conversation",
            {
              user_one_id:
                user.id,

              user_two_id:
                incomingDoctor.id,
            }
          );

        await fetchConversations();

        const convRes =
          await axios.get(
            `http://127.0.0.1:8000/api/conversations/${user.id}`
          );

        const fullConversation =
          convRes.data.find(
            (c) => c.id === res.data.id
          );

        if (fullConversation) {

          await openConversation(
            fullConversation
          );

        }

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

      try {

        await axios.post(
          "http://127.0.0.1:8000/api/send-message",
          {
            conversation_id:
              activeConversation.id,

            sender_id:
              user.id,

            message:
              input.trim(),
          }
        );

        setInput("");

        await fetchMessages(
          activeConversation.id
        );

        await fetchConversations();

      } catch (error) {

        console.log(error);

      }

    };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

    fetchConversations();

  }, [user]);

  // =========================
  // AUTO START CHAT
  // =========================
  useEffect(() => {

    if (
      incomingDoctor &&
      user
    ) {

      startConversation();

    }

  }, [incomingDoctor]);

  // =========================
  // AUTO REFRESH
  // =========================
  useEffect(() => {

    const interval =
      setInterval(() => {

        fetchConversations();

        if (
          activeConversation
        ) {

          fetchMessages(
            activeConversation.id
          );

        }

      }, 2000);

    return () =>
      clearInterval(
        interval
      );

  }, [activeConversation]);

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

        {/* SIDEBAR */}
        <div
          className="w-1/3 border-r border-white/30
          bg-white/20 backdrop-blur-xl flex flex-col"
        >

          <div className="p-4 font-semibold text-gray-700">
            Conversations
          </div>

          <div className="flex-1 overflow-y-auto">

            {loading ? (

              <div className="p-4 text-sm text-gray-500">
                Loading...
              </div>

            ) : conversations.length === 0 ? (

              <div className="p-4 text-sm text-gray-500">
                No conversations yet
              </div>

            ) : (

              conversations.map(
                (conversation) => {

                  const otherUser =
                    conversation.user_one.id ===
                    user.id
                      ? conversation.user_two
                      : conversation.user_one;

                  const lastMessage =
                    conversation.messages?.[0];

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
                      transition rounded-xl mx-2 mb-1 ${
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

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-2">

                          <p
                            className={`text-sm truncate ${
                              conversation.unread_count > 0
                                ? "font-bold text-black"
                                : "font-medium"
                            }`}
                          >
                            {otherUser.name}
                          </p>

                          {conversation.unread_count > 0 && (

                            <div
                              className="w-2.5 h-2.5
                              rounded-full bg-blue-500"
                            ></div>

                          )}

                        </div>

                        <div className="flex items-center justify-between">

                          <p
                            className={`text-xs truncate ${
                              conversation.unread_count > 0
                                ? "font-semibold text-black"
                                : "text-gray-500"
                            }`}
                          >
                            {lastMessage?.message ||
                              "Start chatting"}
                          </p>

                          {conversation.unread_count > 0 && (

                            <div
                              className="ml-2 min-w-[20px]
                              h-5 px-1 rounded-full
                              bg-blue-500 text-white
                              text-[10px] flex items-center
                              justify-center"
                            >
                              {conversation.unread_count}
                            </div>

                          )}

                        </div>

                      </div>

                    </div>

                  );

                }
              )

            )}

          </div>

        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col">

          {/* HEADER */}
          {activeConversation ? (

            <>
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

                      <div>

                        <h2 className="font-semibold">
                          {otherUser.name}
                        </h2>

                        <p className="text-xs text-gray-500">
                          {otherUser.available
                            ? "Available"
                            : "Offline"}
                        </p>

                      </div>
                    </>
                  );

                })()}

              </div>

              {/* MESSAGES */}
              <div
                className="flex-1 overflow-y-auto
                px-4 py-4 flex flex-col gap-3"
              >

                {messages.map(
                  (msg) => (

                    <div
                      key={msg.id}

                      className={`flex ${
                        msg.sender_id ===
                        user.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <div
                        className={`px-4 py-2 rounded-2xl
                        text-sm max-w-[70%]
                        shadow-sm ${
                          msg.sender_id ===
                          user.id
                            ? "bg-blue-500 text-white"
                            : "bg-white/80 text-gray-800"
                        }`}
                      >

                        <p>
                          {msg.message}
                        </p>

                        <p
                          className={`text-[10px] mt-1 ${
                            msg.sender_id ===
                            user.id
                              ? "text-blue-100"
                              : "text-gray-400"
                          }`}
                        >
                          {new Date(
                            msg.created_at
                          ).toLocaleTimeString(
                            [],
                            {
                              hour:
                                "2-digit",

                              minute:
                                "2-digit",
                            }
                          )}
                        </p>

                      </div>

                    </div>

                  )
                )}

                <div
                  ref={
                    messagesEndRef
                  }
                ></div>

              </div>

              {/* INPUT */}
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
                  onClick={
                    sendMessage
                  }

                  className="px-5 py-2 rounded-full
                  bg-blue-500 text-white text-sm"
                >
                  Send
                </button>

              </div>
            </>

          ) : (

            <div
              className="flex-1 flex items-center
              justify-center text-gray-500"
            >
              Select a conversation
            </div>

          )}

        </div>

      </div>

    </div>
  );
}