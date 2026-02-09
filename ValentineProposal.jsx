import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Heart, Mail, Music } from "lucide-react";

const SAD_EMOJIS = ["No", "🥺", "😭", "💔", "Why?"];
const HEART_COUNT = 18;

const getRandom = (min, max) => Math.random() * (max - min) + min;

const getNoButtonPosition = () => {
  const padding = 16;
  const maxWidth = Math.max(window.innerWidth - 120, padding);
  const maxHeight = Math.max(window.innerHeight - 60, padding);

  return {
    left: getRandom(padding, maxWidth),
    top: getRandom(padding, maxHeight),
  };
};

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
  const [noTextIndex, setNoTextIndex] = useState(0);
  const [noPosition, setNoPosition] = useState({ left: 120, top: 280 });
  const [selectedGift, setSelectedGift] = useState(null);
  const [showBurst, setShowBurst] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const hearts = useMemo(() => createHearts(), []);

  useEffect(() => {
    const isTouchDevice =
      typeof window !== "undefined" &&
      (window.matchMedia("(hover: none)").matches ||
        navigator.maxTouchPoints > 0);

    setIsTouch(isTouchDevice);
  }, []);

  const handleNoInteraction = () => {
    setYesScale((prev) => prev + 0.5);

    if (isTouch) {
      setNoTextIndex((prev) => (prev + 1) % SAD_EMOJIS.length);
    } else {
      setNoPosition(getNoButtonPosition());
    }
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
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100 text-rose-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&family=Quicksand:wght@400;600&display=swap');
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
                <img
                  src="https://placehold.co/320x240?text=Cute+Bear+GIF"
                  alt="Cute bear"
                  className="h-52 w-72 rounded-2xl object-cover shadow-lg"
                />
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
                  className="absolute rounded-full border border-rose-300 bg-white px-6 py-2 text-base font-semibold text-rose-500 shadow-md sm:static"
                  style={
                    isTouch
                      ? {}
                      : {
                          left: `${noPosition.left}px`,
                          top: `${noPosition.top}px`,
                        }
                  }
                  onMouseEnter={!isTouch ? handleNoInteraction : undefined}
                  onClick={isTouch ? handleNoInteraction : undefined}
                  whileHover={isTouch ? {} : { scale: 1.05 }}
                >
                  {SAD_EMOJIS[noTextIndex]}
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
                  Three surprises are waiting just for you.
                </p>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <button
                  className="group rounded-2xl border border-rose-100 bg-white/90 p-6 text-left shadow-lg transition hover:-translate-y-1"
                  onClick={() => openGift("letter")}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                    <Mail className="h-6 w-6 text-rose-600" />
                  </div>
                  <h3
                    className="text-xl font-semibold text-rose-600"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    The Letter
                  </h3>
                  <p className="mt-2 text-sm text-rose-500">
                    A note sealed with all my love.
                  </p>
                </button>

                <button
                  className="group rounded-2xl border border-rose-100 bg-white/90 p-6 text-left shadow-lg transition hover:-translate-y-1"
                  onClick={() => openGift("bouquet")}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                    <Heart className="h-6 w-6 text-rose-600" />
                  </div>
                  <h3
                    className="text-xl font-semibold text-rose-600"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    The Bouquet
                  </h3>
                  <p className="mt-2 text-sm text-rose-500">
                    Roses that shimmer just for you.
                  </p>
                </button>

                <button
                  className="group rounded-2xl border border-rose-100 bg-white/90 p-6 text-left shadow-lg transition hover:-translate-y-1"
                  onClick={() => openGift("song")}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                    <Music className="h-6 w-6 text-rose-600" />
                  </div>
                  <h3
                    className="text-xl font-semibold text-rose-600"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    The Song
                  </h3>
                  <p className="mt-2 text-sm text-rose-500">
                    Our love song on repeat.
                  </p>
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
                <div className="rounded-3xl border border-amber-100 bg-amber-50 p-8 shadow-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h3
                      className="text-3xl text-rose-600"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      My Heartfelt Letter
                    </h3>
                    <span className="text-3xl">🕯️</span>
                  </div>
                  <div className="flex items-center gap-3 text-rose-500">
                    <Mail className="h-5 w-5" />
                    <span className="text-sm">Sealed with a wax heart</span>
                  </div>
                  <p
                    className="mt-6 text-lg text-rose-600"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    You make my days brighter, my nights softer, and my heart
                    feel like it&apos;s floating. Thank you for being my favorite
                    person, my comfort, and my sweetest adventure.
                  </p>
                </div>
              )}

              {selectedGift === "bouquet" && (
                <div className="rounded-3xl border border-rose-100 bg-white/90 p-8 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h3
                      className="text-3xl text-rose-600"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      Bouquet of Forever
                    </h3>
                    <span className="text-3xl">💐</span>
                  </div>
                  <motion.div
                    className="mt-8 flex items-center justify-center"
                    animate={{
                      backgroundPositionX: ["0%", "100%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 via-rose-100 to-amber-100 shadow-inner">
                      <motion.span
                        className="absolute text-6xl"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🌹
                      </motion.span>
                      <motion.span
                        className="absolute text-4xl"
                        style={{ top: 24, right: 36 }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2.4, repeat: Infinity }}
                      >
                        ✨
                      </motion.span>
                      <motion.span
                        className="absolute text-4xl"
                        style={{ bottom: 20, left: 40 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2.6, repeat: Infinity }}
                      >
                        ✨
                      </motion.span>
                    </div>
                  </motion.div>
                </div>
              )}

              {selectedGift === "song" && (
                <div className="rounded-3xl border border-rose-100 bg-white/90 p-8 shadow-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-rose-600">
                        Our Love Song
                      </h3>
                      <p className="text-sm text-rose-400">Playlist: You + Me</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                      <Music className="h-6 w-6 text-rose-600" />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-rose-50 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-rose-500">0:45</span>
                      <span className="text-sm text-rose-500">3:18</span>
                    </div>
                    <div className="mt-3 h-3 w-full rounded-full bg-rose-200/70">
                      <div className="relative h-3 w-2/3 rounded-full bg-rose-400">
                        <div className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-rose-500 shadow">
                          <Heart className="h-7 w-7 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-6">
                      <button className="rounded-full bg-rose-200 p-3 text-rose-600">
                        ▷
                      </button>
                      <button className="rounded-full bg-rose-500 p-3 text-white">
                        ❚❚
                      </button>
                    </div>
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
