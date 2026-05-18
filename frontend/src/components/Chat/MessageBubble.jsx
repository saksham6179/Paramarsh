export default function MessageBubble({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      
      <div
        className={`px-4 py-2 rounded-xl max-w-xs text-sm shadow ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-white text-gray-800"
        }`}
      >
        {message.text}
      </div>

    </div>
  );
}