import { useState, useEffect, useRef } from "react";

const FloatingOrb = ({ style }) => (
  <div className="absolute rounded-full blur-3xl opacity-20 animate-pulse" style={style} />
);

function TypewriterText({ text, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setDisplayed("");
    setIdx(0);
  }, [text]);

  useEffect(() => {
    if (idx < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + text[idx]);
        setIdx((i) => i + 1);
      }, 12);
      return () => clearTimeout(timeout);
    } else if (idx === text.length && onDone) {
      onDone();
    }
  }, [idx, text]);

  return (
    <span>
      {displayed}
      {idx < text.length && (
        <span className="inline-block w-2 h-4 bg-orange-500 ml-1 animate-pulse" style={{ verticalAlign: "middle" }} />
      )}
    </span>
  );
}

function FireMeter({ score }) {
  const s = Math.min(10, Math.max(0, Number(score)));
  const color =
    s <= 3 ? "#ff2200" : s <= 6 ? "#ff6a00" : s <= 8 ? "#ffaa00" : "#00ff88";
  const label =
    s <= 2 ? "DISASTER" : s <= 4 ? "ROUGH" : s <= 6 ? "AVERAGE" : s <= 8 ? "DECENT" : "IMPRESSIVE";

  return (
    <div className="mb-8">
      <div className="flex items-end justify-between mb-2">
        <span className="text-xs text-gray-500 uppercase tracking-widest">Resume Score</span>
        <span className="font-black text-4xl" style={{ color, filter: `drop-shadow(0 0 10px ${color})` }}>
          {s}<span className="text-lg text-gray-500">/10</span>
        </span>
      </div>

      {/* Fire meter bar */}
      <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,69,0,0.2)" }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${s * 10}%`,
            background: `linear-gradient(90deg, #ff2200, ${color})`,
            boxShadow: `0 0 20px ${color}`,
          }} />
      </div>

      {/* Tick marks */}
      <div className="flex justify-between mt-1">
        {Array.from({ length: 11 }, (_, i) => (
          <div key={i} className="text-xs" style={{ color: i <= s ? color : "#333" }}>|</div>
        ))}
      </div>

      <div className="text-center mt-2 text-xs font-black tracking-widest" style={{ color }}>
        {label}
      </div>

      {/* Fire emojis */}
      <div className="flex justify-center gap-1 mt-2">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="text-sm transition-all duration-500"
            style={{ opacity: i < s ? 1 : 0.15, filter: i < s ? "drop-shadow(0 0 4px orange)" : "none" }}>
            🔥
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    setMounted(true);
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${3 + Math.random() * 6}s`,
        delay: `${Math.random() * 4}s`,
        scale: 0.5 + Math.random(),
      }))
    );
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8081";
const response = await fetch(`${backendUrl}/api/resume/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.status === "success") setResult(data);
      else setError(data.message);
    } catch {
      setError("Cannot reach backend. Is port 8081 running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith(".pdf")) setFile(dropped);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col items-center justify-center px-4 py-16"
      style={{ fontFamily: "'Courier New', monospace" }}>

      <FloatingOrb style={{ width: 600, height: 600, background: "radial-gradient(circle, #ff4500, transparent)", top: "-20%", left: "-10%", animationDuration: "8s" }} />
      <FloatingOrb style={{ width: 400, height: 400, background: "radial-gradient(circle, #ff6a00, transparent)", bottom: "-10%", right: "-5%", animationDuration: "6s", animationDelay: "2s" }} />
      <FloatingOrb style={{ width: 300, height: 300, background: "radial-gradient(circle, #ff2200, transparent)", top: "40%", right: "20%", animationDuration: "10s", animationDelay: "1s" }} />

      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "linear-gradient(#ff4500 1px, transparent 1px), linear-gradient(90deg, #ff4500 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      {particles.map(p => (
        <div key={p.id} className="absolute w-1 h-1 rounded-full bg-orange-500 opacity-30"
          style={{ left: p.left, top: p.top, transform: `scale(${p.scale})`, animation: `floatUp ${p.duration} ${p.delay} infinite alternate ease-in-out` }} />
      ))}

      <div className="absolute inset-0 pointer-events-none" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)"
      }} />

      <div className={`relative z-10 w-full max-w-2xl transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1 border border-orange-500 text-orange-500 text-xs tracking-widest uppercase rounded-full"
            style={{ boxShadow: "0 0 20px rgba(255,69,0,0.3)" }}>
            AI-Powered Brutality
          </div>
          <h1 className="text-7xl font-black uppercase tracking-tighter mb-3"
            style={{
              background: "linear-gradient(135deg, #ff4500 0%, #ff8c00 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(255,69,0,0.5))"
            }}>
            ROAST<br />ME
          </h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            Upload resume → Get destroyed → Improve
          </p>
        </div>

        {/* Upload zone */}
        {!result && (
          <>
            <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              className="relative cursor-pointer rounded-2xl p-12 text-center transition-all duration-300 mb-4"
              style={{
                border: dragOver ? "1px solid #ff4500" : "1px solid rgba(255,69,0,0.3)",
                background: dragOver ? "rgba(255,69,0,0.08)" : "rgba(255,255,255,0.02)",
                boxShadow: dragOver ? "0 0 60px rgba(255,69,0,0.2)" : "0 0 40px rgba(255,69,0,0.05)",
                backdropFilter: "blur(20px)"
              }}>
              {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-4 h-4 border-orange-500 opacity-60`}
                  style={{
                    borderTop: i < 2 ? "1px solid" : "none",
                    borderBottom: i >= 2 ? "1px solid" : "none",
                    borderLeft: i % 2 === 0 ? "1px solid" : "none",
                    borderRight: i % 2 === 1 ? "1px solid" : "none",
                  }} />
              ))}
              <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                onChange={(e) => setFile(e.target.files[0])} />
              <div className="text-5xl mb-4" style={{ filter: "drop-shadow(0 0 20px rgba(255,69,0,0.8))" }}>
                {file ? "📄" : "⬆"}
              </div>
              <div className="text-white font-bold text-lg mb-1">
                {file ? file.name : "DROP YOUR RESUME HERE"}
              </div>
              <div className="text-gray-600 text-xs tracking-widest uppercase">
                {file ? "Ready to be destroyed" : "PDF files only · Click or drag"}
              </div>
            </div>

            <button onClick={handleUpload} disabled={!file || loading}
              className="w-full py-4 font-black text-xl uppercase tracking-widest transition-all duration-300 rounded-xl"
              style={{
                background: !file || loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #ff4500, #ff6a00)",
                color: !file || loading ? "#444" : "white",
                border: "1px solid rgba(255,69,0,0.3)",
                boxShadow: file && !loading ? "0 0 40px rgba(255,69,0,0.4)" : "none",
                cursor: !file || loading ? "not-allowed" : "pointer"
              }}>
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  INCINERATING YOUR RESUME...
                </span>
              ) : "🔥 ROAST MY RESUME"}
            </button>
          </>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-xl text-red-400 text-sm text-center"
            style={{ background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,0,0,0.2)" }}>
            ⚠ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="rounded-2xl p-8 relative"
            style={{
              background: "rgba(255,69,0,0.04)",
              border: "1px solid rgba(255,69,0,0.3)",
              boxShadow: "0 0 80px rgba(255,69,0,0.1)",
              backdropFilter: "blur(20px)"
            }}>
            {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-4 h-4 border-orange-500 opacity-40`}
                style={{
                  borderTop: i < 2 ? "1px solid" : "none",
                  borderBottom: i >= 2 ? "1px solid" : "none",
                  borderLeft: i % 2 === 0 ? "1px solid" : "none",
                  borderRight: i % 2 === 1 ? "1px solid" : "none",
                }} />
            ))}

            {/* Score */}
            <FireMeter score={result.score} />

            <div className="flex items-center gap-3 mb-6">
              <div className="text-2xl" style={{ filter: "drop-shadow(0 0 10px rgba(255,69,0,1))" }}>🔥</div>
              <h2 className="text-orange-500 font-black text-xl uppercase tracking-widest">The Verdict</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500 to-transparent" />
            </div>

            <p className="text-gray-300 leading-relaxed text-sm" style={{ lineHeight: "1.9" }}>
              <TypewriterText text={result.roast} />
            </p>

            <div className="mt-6 pt-4 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-xs text-gray-600 uppercase tracking-widest">
                📄 {result.fileName} · {result.characters} chars
              </span>
              <button onClick={() => { setResult(null); setFile(null); }}
                className="text-xs text-orange-500 uppercase tracking-widest hover:text-orange-400 transition"
                style={{ border: "1px solid rgba(255,69,0,0.3)", padding: "6px 14px", borderRadius: "8px" }}>
                Roast Another →
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes floatUp {
          from { transform: translateY(0px) scale(1); opacity: 0.2; }
          to { transform: translateY(-20px) scale(1.2); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}