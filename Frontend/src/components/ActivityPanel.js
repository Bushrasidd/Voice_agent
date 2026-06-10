export default function ActivityPanel() {
  return (
    <div className="h-full p-6">
      <h2 className="text-cyan-400 mb-6 font-semibold">
        REALTIME ACTIVITY
      </h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span>Speech → Text</span>
          <span>120ms</span>
        </div>

        <div className="flex justify-between">
          <span>LLM</span>
          <span>640ms</span>
        </div>

        <div className="flex justify-between">
          <span>Text → Speech</span>
          <span>180ms</span>
        </div>
      </div>
    </div>
  );
}