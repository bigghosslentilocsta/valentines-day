import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Heart, Mail, Music } from "lucide-react";

const HEART_COUNT = 18;

const getRandom = (min, max) => Math.random() * (max - min) + min;

const createHearts = () =>
  Array.from({ length: HEART_COUNT }, () => ({
    x: `${getRandom(0, 100).toFixed(2)}%`,
    size: getRandom(18, 42),
    duration: getRandom(10, 22),
    delay: getRandom(0, 8),
    opacity: getRandom(0.4, 0.9),
  }));

export default function ValentineProposal() {
  const [phase, setPhase] = useState("proposal");
  const [yesScale, setYesScale] = useState(1);
  const [selectedGift, setSelectedGift] = useState(null);
  const [showBurst, setShowBurst] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const hearts = useMemo(() => createHearts(), []);

  useEffect(() => {
    const scriptId = "tenor-embed";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = "https://tenor.com/embed.js";
    document.body.appendChild(script);
  }, []);

  const handleNoInteraction = () => {
    setYesScale((prev) => prev + 0.5);
  };

  const triggerConfetti = async () => {
    try {
      const module = await import("canvas-confetti");
      const confetti = module.default || module;
      confetti({
        particleCount: 220,
        spread: 110,
        origin: { y: 0.6 },
      });
    } catch (error) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 1400);
    }
  };

  const handleYes = () => {
    triggerConfetti();
    setPhase("success");
  };

  const openGift = (giftId) => {
    setSelectedGift(giftId);
    setPhase("gift");
  };

  const closeGift = () => {
    setSelectedGift(null);
    setPhase("success");
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100 text-rose-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&family=Pacifico&family=Quicksand:wght@400;600&display=swap');
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        {hearts.map((heart, index) => (
          <motion.span
            key={`heart-${index}`}
            className="absolute select-none"
            style={{
              left: heart.x,
              fontSize: `${heart.size}px`,
              opacity: heart.opacity,
            }}
            initial={{ y: "120%" }}
            animate={{ y: "-20%" }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            ❤️
          </motion.span>
        ))}
      </div>

      <AnimatePresence>
        {showBurst && (
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 0.9, scale: 1.2 }}
            exit={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="grid grid-cols-3 gap-6 text-5xl">
              {Array.from({ length: 9 }, (_, index) => (
                <span key={`burst-${index}`}>💖</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <AnimatePresence mode="wait">
          {phase === "proposal" && (
            <motion.section
              key="proposal"
              className="w-full max-w-xl rounded-3xl border border-rose-200/60 bg-white/80 p-6 text-center shadow-xl backdrop-blur"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 flex justify-center">
                <div className="w-full max-w-xs overflow-hidden rounded-2xl shadow-lg">
                  <div
                    className="tenor-gif-embed"
                    data-postid="16853072990359579489"
                    data-share-method="host"
                    data-aspect-ratio="1.23333"
                    data-width="100%"
                  >
                    <a href="https://tenor.com/view/cute-gif-16853072990359579489">
                      Cute Sticker
                    </a>
                    from
                    <a href="https://tenor.com/search/cute-stickers">
                      Cute Stickers
                    </a>
                  </div>
                </div>
              </div>
              <h1
                className="mb-8 text-3xl font-bold text-rose-600 sm:text-4xl"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Will you be my Valentine? 💖
              </h1>

              <div className="relative flex flex-col items-center justify-center gap-4 sm:flex-row">
                <motion.button
                  className="flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-3 text-lg font-semibold text-white shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: yesScale }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  onClick={handleYes}
                >
                  <Heart className="h-5 w-5 fill-white" />
                  Yes!
                </motion.button>

                <motion.button
                  className="rounded-full border border-rose-300 bg-white px-6 py-2 text-base font-semibold text-rose-500 shadow-md"
                  onClick={handleNoInteraction}
                  whileHover={{ scale: 1.05 }}
                >
                  No
                </motion.button>
              </div>

              <p className="mt-8 text-sm text-rose-500/80">
                Tip: try to catch the &quot;No&quot; button if you dare.
              </p>
            </motion.section>
          )}

          {phase === "success" && (
            <motion.section
              key="success"
              className="w-full max-w-4xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-3xl border border-rose-200/60 bg-white/85 p-8 text-center shadow-xl backdrop-blur">
                <h2
                  className="text-3xl font-bold text-rose-600 sm:text-4xl"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  Yay! See you on Feb 14th! 🌹
                </h2>
                <p className="mt-3 text-rose-500">
                  Choose a mystery box to reveal your surprise.
                </p>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <button
                  className="group rounded-2xl border border-rose-100 bg-white/90 p-6 text-center shadow-lg transition hover:-translate-y-1"
                  onClick={() => openGift("letter")}
                >
                  <div className="mb-4 text-4xl">🎁</div>
                  <h3
                    className="text-2xl text-rose-600"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                  >
                    Mystery Box 1
                  </h3>
                </button>

                <button
                  className="group rounded-2xl border border-rose-100 bg-white/90 p-6 text-center shadow-lg transition hover:-translate-y-1"
                  onClick={() => openGift("bouquet")}
                >
                  <div className="mb-4 text-4xl">🎁</div>
                  <h3
                    className="text-2xl text-rose-600"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                  >
                    Mystery Box 2
                  </h3>
                </button>

                <button
                  className="group rounded-2xl border border-rose-100 bg-white/90 p-6 text-center shadow-lg transition hover:-translate-y-1"
                  onClick={() => openGift("song")}
                >
                  <div className="mb-4 text-4xl">🎁</div>
                  <h3
                    className="text-2xl text-rose-600"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                  >
                    Mystery Box 3
                  </h3>
                </button>
              </div>
            </motion.section>
          )}

          {phase === "gift" && (
            <motion.section
              key="gift"
              className="relative w-full max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <button
                className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-rose-500 shadow"
                onClick={closeGift}
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>

              {selectedGift === "letter" && (
                <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-amber-50 p-8 shadow-xl">
                  <div className="pointer-events-none absolute inset-0 opacity-50" />
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent 0px, transparent 24px, rgba(251, 191, 36, 0.25) 24px, rgba(251, 191, 36, 0.25) 25px)",
                    }}
                  />
                  <span className="pointer-events-none absolute left-6 top-6 text-2xl">🌸</span>
                  <span className="pointer-events-none absolute right-6 top-10 text-2xl">🌷</span>
                  <span className="pointer-events-none absolute bottom-6 left-10 text-2xl">🌼</span>

                  <div className="relative">
                    <div className="mb-6 flex items-center justify-between">
                      <h3
                        className="text-4xl text-rose-600"
                        style={{ fontFamily: "'Pacifico', cursive" }}
                      >
                        A Letter for You
                      </h3>
                      <Mail className="h-6 w-6 text-rose-400" />
                    </div>
                    <p
                      className="text-2xl leading-relaxed text-rose-600"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      You make my days brighter, my nights softer, and my heart
                      feel like it&apos;s floating. Thank you for being my favorite
                      person, my comfort, and my sweetest adventure.
                    </p>
                  </div>
                </div>
              )}

              {selectedGift === "bouquet" && (
                <div className="rounded-3xl border border-rose-100 bg-white/90 p-8 text-center shadow-xl">
                  <h3
                    className="text-4xl text-rose-600"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                  >
                    This is for you
                  </h3>
                  <p
                    className="mt-2 text-xl text-rose-500"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    I love you
                  </p>
                  <motion.div
                    className="mt-8 flex items-center justify-center"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  >
                    <img
                      src="/bouquet.png"
                      alt="Bouquet"
                      className="h-64 w-auto max-w-full drop-shadow-xl"
                    />
                  </motion.div>
                </div>
              )}

              {selectedGift === "song" && (
                <div className="rounded-3xl border border-rose-100 bg-white/90 p-8 text-center shadow-xl">
                  <h3
                    className="text-4xl text-rose-600"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                  >
                    A song for you
                  </h3>
                  <p
                    className="mt-2 text-xl text-rose-500"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    Play song
                  </p>
                  <div className="mt-6 flex flex-col items-center gap-4">
                    <button
                      className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-2 text-white shadow"
                      onClick={togglePlay}
                    >
                      <Music className="h-5 w-5" />
                      {isPlaying ? "Pause" : "Play"}
                    </button>
                    <audio
                      ref={audioRef}
                      src="/Love%20song.mp3"
                      onEnded={() => setIsPlaying(false)}
                    />
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
