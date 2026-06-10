"use client";

import { useState, useRef } from "react";

export default function VoiceVisualizer() {
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        console.log("Audio Blob:", audioBlob);
      };

      recorder.start();

      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();

    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;

    setIsRecording(false);
  };
  
  const toggleRecording = () => {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
};

  const size = 15;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        onClick={toggleRecording}
        className="cursor-pointer border border-zinc-800 rounded-xl p-10 hover:border-cyan-500 transition-all duration-300"
      >
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0,0.5fr))`,
          }}
        >
          {Array.from({ length: size * size }).map((_, index) => {
            const row = Math.floor(index / size);
            const col = index % size;

            const center = size / 1;

            const distance = Math.sqrt(
              Math.pow(row - center, 2) +
              Math.pow(col - center, 2)
            );

            const active = distance < 2;

            return (
              <div
                key={index}
                className={`w-1 h-1 rounded-full transition-all duration-300 ${active
                    ? isRecording
                      ? "bg-cyan-400 shadow-[0_0_12px_#22d3ee]"
                      : "bg-cyan-500"
                    : "bg-zinc-700"
                  }`}
              />
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-zinc-400">
        {isRecording
          ? "🎙️ Listening..."
          : "Click the grid to start talking"}
      </p>
    </div>
  );
}