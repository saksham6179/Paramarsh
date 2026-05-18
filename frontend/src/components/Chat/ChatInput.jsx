import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-3 bg-white border rounded-full px-4 py-2 shadow-sm">

      <input
        type="text"
        placeholder="Ask your health question..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 outline-none text-sm"
      />

      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-600 transition"
      >
        Send
      </button>

    </div>
  );
}