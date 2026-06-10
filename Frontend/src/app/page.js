"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import TranscriptPanel from "@/components/TranscriptPanel";
import VoiceVisualizer from "@/components/VoiceVisualizer";

export default function Home() {
  const [messages, setMessages] = useState([]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="grid grid-cols-12 h-[calc(100vh-64px)]">
        <div className="col-span-3 border-r border-zinc-800">
          <TranscriptPanel messages={messages} />
        </div>

        <div className="col-span-6 flex items-center justify-center">
          <VoiceVisualizer
            messages={messages}
            setMessages={setMessages}
          />
        </div>

        <div className="col-span-3 border-l border-zinc-800">
          {/* <ActivityPanel /> */}
        </div>
      </div>
    </main>
  );
}