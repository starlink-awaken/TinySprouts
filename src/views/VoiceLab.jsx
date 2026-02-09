import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, RotateCcw, ArrowLeft, Star } from 'lucide-react';
import { speak } from '../utils/voice';
import { playSfx } from '../utils/sfx';

const WORDS = ["大象", "小猫", "彩虹", "冰淇淋", "我爱妈妈"];

export function VoiceLab({ onBack }) {
  const [targetWord, setTargetWord] = useState(WORDS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        chunksRef.current = [];
        playSfx('ding');
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("无法访问麦克风");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const nextWord = () => {
    const next = WORDS[(WORDS.indexOf(targetWord) + 1) % WORDS.length];
    setTargetWord(next);
    setAudioUrl(null);
    speak(next);
  };

  return (
    <div className="fixed inset-0 bg-[#e0f2fe] z-50 flex flex-col items-center justify-center p-6">
      <button onClick={onBack} className="absolute top-6 left-6 p-3 bg-white rounded-2xl shadow-sm">
        <ArrowLeft size={24} className="text-slate-500" />
      </button>

      <div className="bg-white p-8 rounded-[3rem] shadow-xl text-center mb-10 w-full max-w-sm">
        <span className="text-sm font-bold text-slate-400 mb-2 block">请跟我读</span>
        <h2 className="text-5xl font-black text-slate-800 mb-4">{targetWord}</h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => speak(targetWord)}
          className="bg-brand-sky/20 text-brand-sky px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2"
        >
          <Play size={16} fill="currentColor" /> 示范发音
        </motion.button>
      </div>

      {/* Recording Visualizer */}
      <div className="h-24 flex items-center justify-center gap-1 mb-10">
        {isRecording && [...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [20, 60, 20] }}
            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
            className="w-3 bg-red-400 rounded-full"
          />
        ))}
        {!isRecording && audioUrl && (
          <div className="flex gap-4">
             <motion.button
               whileTap={{ scale: 0.9 }}
               onClick={playRecording}
               className="w-16 h-16 bg-[#94C973] rounded-full flex items-center justify-center text-white shadow-lg"
             >
               <Play size={32} fill="white" />
             </motion.button>
             <motion.button
               whileTap={{ scale: 0.9 }}
               onClick={nextWord}
               className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-lg"
             >
               <Star size={32} />
             </motion.button>
          </div>
        )}
      </div>

      {/* Controls */}
      <motion.button
        onPointerDown={startRecording}
        onPointerUp={stopRecording}
        whileTap={{ scale: 1.1 }}
        className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transition-colors ${
          isRecording ? 'bg-red-500' : 'bg-brand-sky'
        }`}
      >
        {isRecording ? <Square size={32} fill="white" className="text-white" /> : <Mic size={40} className="text-white" />}
      </motion.button>
      <p className="mt-4 text-slate-400 text-sm font-bold">按住录音，松开结束</p>
    </div>
  );
}
