import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages }) {
  return (
    <div className="h-full overflow-y-auto px-6 py-6 space-y-4 bg-gray-50">

      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-400 text-center">
          <div>
            👋 Welcome to Paramarsh
            <div className="text-sm mt-1">
              Ask anything about your health
            </div>
          </div>
        </div>
      )}

      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}

    </div>
  );
}