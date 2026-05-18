import { useState } from "react";

export default function HealthAssistant() {
  const [messages, setMessages] = useState([
    {
      text: "Hi 👋 I’m Paramarsh. Ask me anything about your health.",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-3xl flex flex-col gap-6">

        {/* CHAT BOX */}
        <div className="bg-white/30 backdrop-blur-2xl border border-white/40 
        rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] 
        h-[460px] p-6 flex flex-col gap-4 overflow-y-auto">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-xs transition-all duration-300 hover:scale-[1.02] ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    : "bg-white/60 backdrop-blur-md text-gray-800 shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/30 
        shadow-[0_10px_30px_rgba(0,0,0,0.1)] 
        rounded-full px-5 py-3 flex items-center gap-3">

          <input
            type="text"
            placeholder="Ask your health question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
          />

          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 
            text-white px-6 py-2 rounded-full 
            shadow-md hover:scale-105 transition"
          >
            Send
          </button>

        </div>

      </div>
    </div>
  );
}