import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function History() {

  const { user } = useAuth();

  const navigate = useNavigate();

  const [conversations, setConversations] =
    useState([]);

  const [search, setSearch] =
    useState("");

  // =========================
  // FETCH HISTORY
  // =========================
  const fetchHistory =
    async () => {

      try {

        const res =
          await axios.get(
            `http://127.0.0.1:8000/api/ai/conversations/${user.id}`
          );

        setConversations(
          res.data || []
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    if (user) {

      fetchHistory();

    }

  }, [user]);

  // =========================
  // OPEN CHAT
  // =========================
  const openConversation =
    (conversation) => {

      localStorage.setItem(
        "activeAIConversation",
        JSON.stringify(conversation)
      );

      navigate("/assistant");

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

        fetchHistory();

      } catch (error) {

        console.log(error);

      }

    };

  // =========================
  // RENAME CHAT
  // =========================
  const renameConversation =
    async (
      conversationId,
      oldTitle
    ) => {

      const newTitle =
        prompt(
          "Enter new title",
          oldTitle
        );

      if (!newTitle) return;

      try {

        await axios.put(
          `http://127.0.0.1:8000/api/ai/conversation/${conversationId}`,
          {
            title: newTitle,
          }
        );

        fetchHistory();

      } catch (error) {

        console.log(error);

      }

    };

  // =========================
  // SEARCH
  // =========================
  const filtered =
    conversations.filter(
      (conversation) =>

        conversation?.title
          ?.toLowerCase()
          ?.includes(
            search.toLowerCase()
          )
    );

  return (

    <div className="flex justify-center mt-8 px-4">

      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-5xl font-bold text-black">
            AI History
          </h1>

          <p className="text-gray-600 mt-2 text-lg">
            Previous assistant conversations
          </p>

        </div>

        {/* SEARCH */}
        <div
          className="
          bg-white/40
          backdrop-blur-xl
          border border-white/30
          rounded-2xl
          shadow-lg
          p-4 mb-8
        "
        >

          <input
            type="text"

            placeholder="Search history..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="
            w-full bg-transparent
            outline-none text-gray-700
            placeholder-gray-500
          "
          />

        </div>

        {/* CHAT LIST */}
        <div className="grid gap-5">

          {filtered.map(
            (conversation) => {

              const lastMessage =
                conversation.messages?.[0];

              return (

                <div
                  key={conversation.id}

                  className="
                  bg-white/35
                  backdrop-blur-2xl
                  border border-white/40
                  rounded-3xl
                  p-6
                  shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                  hover:scale-[1.01]
                  transition-all duration-300
                "
                >

                  <div className="flex justify-between items-start">

                    {/* LEFT */}
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() =>
                        openConversation(
                          conversation
                        )
                      }
                    >

                      <h2 className="text-2xl font-semibold text-black">

                        {conversation.title ||
                          "New Health Chat"}

                      </h2>

                      <p className="text-gray-600 mt-3">

                        {lastMessage?.message ||
                          "No messages"}

                      </p>

                      <p className="text-gray-400 text-sm mt-4">

                        {new Date(
                          conversation.created_at
                        ).toLocaleString()}

                      </p>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-4 ml-5">

                      <button
                        onClick={() =>
                          renameConversation(
                            conversation.id,
                            conversation.title
                          )
                        }

                        className="
                        text-xl hover:scale-125
                        transition
                      "
                      >

                        ✏️

                      </button>

                      <button
                        onClick={() =>
                          deleteConversation(
                            conversation.id
                          )
                        }

                        className="
                        text-xl hover:scale-125
                        transition
                      "
                      >

                        🗑️

                      </button>

                    </div>

                  </div>

                </div>

              );

            }
          )}

        </div>

      </div>

    </div>

  );

}