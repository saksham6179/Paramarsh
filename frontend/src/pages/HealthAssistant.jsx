import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function HealthAssistant() {

  const { user } = useAuth();

  const [conversations, setConversations] =
    useState([]);

  const [filteredConversations, setFilteredConversations] =
    useState([]);

  const [activeConversation, setActiveConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

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
            `http://127.0.0.1:8000/api/ai/conversations/${user.id}`
          );

        setConversations(
          res.data || []
        );

        setFilteredConversations(
          res.data || []
        );

      } catch (error) {

        console.log(error);

      }

    };

  // =========================
  // SEARCH
  // =========================
  useEffect(() => {

    const filtered =
      conversations.filter(
        (conversation) =>

          conversation?.title
            ?.toLowerCase()
            ?.includes(
              search.toLowerCase()
            )
      );

    setFilteredConversations(
      filtered
    );

  }, [search, conversations]);

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
            `http://127.0.0.1:8000/api/ai/messages/${conversationId}`
          );

        setMessages(
          res.data || []
        );

      } catch (error) {

        console.log(error);

      }

    };

  // =========================
  // CREATE CONVERSATION
  // =========================
  const createConversation =
    async () => {

      try {

        const res =
          await axios.post(
            "http://127.0.0.1:8000/api/ai/create-conversation",
            {
              user_id:
                user.id,
            }
          );

        const newConversation =
          res.data;

        setConversations(
          (prev) => [
            newConversation,
            ...prev,
          ]
        );

        setFilteredConversations(
          (prev) => [
            newConversation,
            ...prev,
          ]
        );

        setActiveConversation(
          newConversation
        );

        localStorage.setItem(
          `activeAIConversation_${user.id}`,
          JSON.stringify(
            newConversation
          )
        );

        setMessages([
          {
            sender:
              "assistant",

            message:
              "Hi 👋 I’m Paramarsh. Ask me anything about your health.",

            created_at:
              new Date(),
          },
        ]);

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

      localStorage.setItem(
        `activeAIConversation_${user.id}`,
        JSON.stringify(conversation)
      );

      await fetchMessages(
        conversation.id
      );

    };

  // =========================
  // DELETE CHAT
  // =========================
  const deleteConversation =
    async (
      conversationId
    ) => {

      try {

        await axios.delete(
          `http://127.0.0.1:8000/api/ai/conversation/${conversationId}`
        );

        const updated =
          conversations.filter(
            (conversation) =>
              conversation.id !==
              conversationId
          );

        setConversations(
          updated
        );

        setFilteredConversations(
          updated
        );

        if (
          activeConversation?.id ===
          conversationId
        ) {

          setActiveConversation(
            null
          );

          setMessages([]);

          localStorage.removeItem(
            `activeAIConversation_${user.id}`
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  // =========================
  // RENAME CHAT
  // =========================
  const renameConversation =
    async (
      conversationId
    ) => {

      const newTitle =
        prompt(
          "Enter new conversation title"
        );

      if (!newTitle) return;

      try {

        await axios.put(
          `http://127.0.0.1:8000/api/ai/conversation/${conversationId}`,
          {
            title:
              newTitle,
          }
        );

        fetchConversations();

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
        !activeConversation ||
        loading
      ) return;

      const messageText =
        input.trim();

      const tempUserMessage = {

        sender:
          "user",

        message:
          messageText,

        created_at:
          new Date(),
      };

      setMessages(
        (prev) => [
          ...prev,
          tempUserMessage,
        ]
      );

      setInput("");

      setLoading(true);

      try {

        const res =
          await axios.post(
            "http://127.0.0.1:8000/api/ai/send-message",
            {
              conversation_id:
                activeConversation.id,

              message:
                messageText,
            }
          );

        if (res.data.reply) {

          setMessages(
            (prev) => [
              ...prev,
              res.data.reply,
            ]
          );

        }

        fetchConversations();

      } catch (error) {

        console.log(error);

        setMessages(
          (prev) => [
            ...prev,
            {
              sender:
                "assistant",

              message:
                "Something went wrong while contacting AI.",

              created_at:
                new Date(),
            },
          ]
        );

      } finally {

        setLoading(false);

      }

    };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

    if (!user) return;

    fetchConversations();

    const savedConversation =
      localStorage.getItem(
        `activeAIConversation_${user.id}`
      );

    if (savedConversation) {

      try {

        const parsed =
          JSON.parse(
            savedConversation
          );

        setActiveConversation(
          parsed
        );

        fetchMessages(
          parsed.id
        );

      } catch (error) {

        console.log(error);

        localStorage.removeItem(
          `activeAIConversation_${user.id}`
        );

      }

    }

  }, [user]);

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages, loading]);

  if (!user) return null;

  return (

    <div className="flex justify-center mt-8 px-4 relative">

      {/* FLOATING NEW CHAT BUTTON */}
      <button
        onClick={
          createConversation
        }

        className="
        fixed bottom-10 right-10
        w-20 h-20 rounded-full
        bg-gradient-to-r
        from-blue-500 to-indigo-500
        text-white text-5xl
        shadow-[0_15px_40px_rgba(59,130,246,0.4)]
        hover:scale-110
        transition-all duration-300
        z-50
      "
      >

        +

      </button>

      <div className="w-full max-w-3xl flex flex-col gap-6">

        {/* CHAT BOX */}
        <div
          className="
          bg-white/30
          backdrop-blur-2xl
          border border-white/40
          rounded-3xl
          shadow-[0_20px_60px_rgba(0,0,0,0.1)]
          h-[460px]
          p-6
          flex
          flex-col
          gap-4
          overflow-y-auto
        "
        >

          {!activeConversation ? (

            <div
              className="
              flex flex-col
              justify-center
              items-center
              h-full
              text-center
            "
            >

              <div className="text-6xl mb-4">
                🩺
              </div>

              <h2 className="text-2xl font-bold text-gray-700">
                Paramarsh AI
              </h2>

              <p className="text-gray-500 mt-2">
                Click + to start a new health chat
              </p>

            </div>

          ) : (

            <>
              {messages
                .filter((msg) => msg)
                .map((msg, index) => (

                  <div
                    key={index}

                    className={`flex ${
                      msg?.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`px-4 py-3 rounded-2xl
                      text-sm max-w-xs
                      transition-all duration-300
                      hover:scale-[1.02] shadow-md ${
                        msg?.sender === "user"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                          : "bg-white/60 backdrop-blur-md text-gray-800"
                      }`}
                    >

                      <p className="whitespace-pre-line leading-7">
                        {msg?.message}
                      </p>

                      <p
                        className={`text-[11px] mt-3 ${
                          msg?.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >

                        {msg?.created_at
                          ? new Date(
                              msg.created_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}

                      </p>

                    </div>

                  </div>

                ))}

              {/* LOADING */}
              {loading && (

                <div className="flex justify-start">

                  <div
                    className="
                    px-5 py-4 rounded-2xl
                    bg-white/60 backdrop-blur-md
                    text-gray-700 shadow-md text-sm
                  "
                  >

                    Typing...

                  </div>

                </div>

              )}

              <div ref={messagesEndRef}></div>

            </>
          )}

        </div>

        {/* INPUT */}
        {activeConversation && (

          <div
            className="
            bg-white/40
            backdrop-blur-xl
            border border-white/30
            shadow-[0_10px_30px_rgba(0,0,0,0.1)]
            rounded-full
            px-5 py-3
            flex items-center gap-3
          "
          >

            <input
              type="text"

              placeholder="Ask your health question..."

              value={input}

              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }

              onKeyDown={(e) =>
                e.key === "Enter" &&
                sendMessage()
              }

              className="
              flex-1 bg-transparent
              outline-none text-sm
              text-gray-700
              placeholder-gray-500
            "
            />

            <button
              onClick={
                sendMessage
              }

              disabled={loading}

              className="
              bg-gradient-to-r
              from-blue-500 to-indigo-600
              text-white px-6 py-2
              rounded-full shadow-md
              hover:scale-105 transition
            "
            >

              Send

            </button>

          </div>

        )}

      </div>

    </div>

  );

}