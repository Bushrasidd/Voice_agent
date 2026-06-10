"use client";

import { useState, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL 

export default function VoiceVisualizer({ messages, setMessages }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("Click the grid to start talking");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  // ── Step 1: send audio blob → /transcribe → get text ──────────────────────
  const transcribeAudio = async (blob) => {
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    const res = await fetch(`${API_BASE}/transcribe`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(`Transcription failed: ${res.status}`);
    const data = await res.json();
    return data.text; // e.g. "What is the capital of France?"
  };

  // ── Step 2: send text → /chat → get LLM answer ────────────────────────────
  const askLLM = async (text) => {
    const res = await fetch(`${API_BASE}/chat?q=${encodeURIComponent(text)}`);
    if (!res.ok) throw new Error(`LLM request failed: ${res.status}`);
    const data = await res.json();
    return data.answer;
  };

  // ── Called once recorder stops ─────────────────────────────────────────────
  const handleRecordingComplete = async (blob) => {
    setIsProcessing(true);
    setStatusText("Transcribing...");

    try {
      const userText = await transcribeAudio(blob);

      if (!userText) {
        setStatusText("Couldn't catch that. Try again.");
        return;
      }

      // Append user message immediately so the transcript feels responsive
      setMessages((prev) => [...prev, { role: "You", content: userText }]);
      setStatusText("Thinking...");

      const answer = await askLLM(userText);

      setMessages((prev) => [...prev, { role: "Assistant", content: answer }]);
      setStatusText("Click the grid to start talking");
    } catch (err) {
      console.error(err);
      setStatusText("Something went wrong. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Recording controls ─────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        handleRecordingComplete(blob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setStatusText("🎙️ Listening...");
    } catch (err) {
      console.error(err);
      setStatusText("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isProcessing) return; // block clicks while processing
    isRecording ? stopRecording() : startRecording();
  };

  // ── Dot grid ───────────────────────────────────────────────────────────────
  const size = 15;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        onClick={toggleRecording}
        className={`cursor-pointer border rounded-xl p-10 transition-all duration-300 ${
          isProcessing
            ? "border-zinc-600 opacity-50 cursor-not-allowed"
            : "border-zinc-800 hover:border-cyan-500"
        }`}
      >
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0,0.5fr))` }}
        >
          {Array.from({ length: size * size }).map((_, index) => {
            const row = Math.floor(index / size);
            const col = index % size;
            const center = size / 2;
            const distance = Math.sqrt(
              Math.pow(row - center, 2) + Math.pow(col - center, 2)
            );
            const active = distance < 2;

            return (
              <div
                key={index}
                className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  active
                    ? isRecording
                      ? "bg-cyan-400 shadow-[0_0_12px_#22d3ee]"
                      : isProcessing
                      ? "bg-yellow-400 shadow-[0_0_12px_#facc15]"
                      : "bg-cyan-500"
                    : "bg-zinc-700"
                }`}
              />
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-zinc-400">{statusText}</p>
    </div>
  );
}

// "use client";

// import { useState, useRef } from "react";

// export default function VoiceVisualizer() {
//   const [isRecording, setIsRecording] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);
//   const streamRef = useRef(null);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });

//       streamRef.current = stream;

//       const recorder = new MediaRecorder(stream);

//       chunksRef.current = [];

//       recorder.ondataavailable = (event) => {
//         chunksRef.current.push(event.data);
//       };

//       recorder.onstop = () => {
//         const audioBlob = new Blob(chunksRef.current, {
//           type: "audio/webm",
//         });

//         console.log("Audio Blob:", audioBlob);
//       };

//       recorder.start();

//       mediaRecorderRef.current = recorder;
//       setIsRecording(true);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current?.stop();

//     streamRef.current?.getTracks().forEach((track) => {
//       track.stop();
//     });

//     streamRef.current = null;

//     setIsRecording(false);
//   };
  
//   const toggleRecording = () => {
//   if (isRecording) {
//     stopRecording();
//   } else {
//     startRecording();
//   }
// };

//   const size = 15;

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <div
//         onClick={toggleRecording}
//         className="cursor-pointer border border-zinc-800 rounded-xl p-10 hover:border-cyan-500 transition-all duration-300"
//       >
//         <div
//           className="grid gap-3"
//           style={{
//             gridTemplateColumns: `repeat(${size}, minmax(0,0.5fr))`,
//           }}
//         >
//           {Array.from({ length: size * size }).map((_, index) => {
//             const row = Math.floor(index / size);
//             const col = index % size;

//             const center = size / 1;

//             const distance = Math.sqrt(
//               Math.pow(row - center, 2) +
//               Math.pow(col - center, 2)
//             );

//             const active = distance < 2;

//             return (
//               <div
//                 key={index}
//                 className={`w-1 h-1 rounded-full transition-all duration-300 ${active
//                     ? isRecording
//                       ? "bg-cyan-400 shadow-[0_0_12px_#22d3ee]"
//                       : "bg-cyan-500"
//                     : "bg-zinc-700"
//                   }`}
//               />
//             );
//           })}
//         </div>
//       </div>

//       <p className="mt-6 text-zinc-400">
//         {isRecording
//           ? "🎙️ Listening..."
//           : "Click the grid to start talking"}
//       </p>
//     </div>
//   );
// }