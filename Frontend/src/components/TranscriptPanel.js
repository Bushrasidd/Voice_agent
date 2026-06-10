export default function TranscriptPanel({ messages }) {
  return (
    <div className="p-6">
      <h2 className="text-cyan-400 mb-6">
        TRANSCRIPT
      </h2>

      {messages.map((msg, index) => (
        <div key={index} className="mb-4">
          <div className="text-cyan-400">
            {msg.role}
          </div>

          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  );
}