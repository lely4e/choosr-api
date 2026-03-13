import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { type FC, useState } from "react";
import { motion } from "framer-motion";
import {
  PenLine,
  Users,
  Plus,
  ThumbsUp,
  PartyPopper,
  ArrowRight,
} from "lucide-react";

const Home: FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/add-poll");
    }
  };

  const steps = [
    {
      label: "CREATE POLL",
      step: "01",
      icon: PenLine,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-500",
      accentColor: "bg-orange-500",
    },
    {
      label: "INVITE FRIENDS",
      step: "02",
      icon: Users,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      accentColor: "bg-green-500",
    },
    {
      label: "ADD OPTIONS",
      step: "03",
      icon: Plus,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-500",
      accentColor: "bg-purple-500",
    },
    {
      label: "VOTE",
      step: "04",
      icon: ThumbsUp,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500",
      accentColor: "bg-blue-500",
    },
    {
      label: "CELEBRATE",
      step: "05",
      icon: PartyPopper,
      bgColor: "bg-pink-100",
      iconColor: "text-pink-500",
      accentColor: "bg-pink-500",
    },
  ];

  return (
    <>
      {/* Mini preview cards — floating on the side */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-1/3 right-8 md:flex flex-col gap-4 z-10"
      >
        {/* Small card example 1 */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 2 }}
          className="w-48 bg-white rounded-2xl p-4 shadow-lg cursor-pointer opacity-80"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#C8E6C9] rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
              <span className="text-[10px] font-bold text-gray-700">
                Active
              </span>
            </div>
          </div>
          <h4 className="font-bold text-sm text-gray-900 mb-1">
            Mike's Birthday 🎉
          </h4>
          <p className="text-xs text-gray-500 mb-3">Budget: $450</p>
          <div className="flex items-center gap-2 text-[10px] text-[#FF8A5B]">
            <span>8 votes</span>
            <span>•</span>
            <span>67%</span>
          </div>
        </motion.div>

        {/* Small card example 2 */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: -2 }}
          className="w-48 bg-white rounded-2xl p-4 shadow-lg cursor-pointer opacity-80"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#C8E6C9] rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
              <span className="text-[10px] font-bold text-gray-700">
                Active
              </span>
            </div>
          </div>
          <h4 className="font-bold text-sm text-gray-900 mb-1">
            Emma's Warm Party 🏡
          </h4>
          <p className="text-xs text-gray-500 mb-3">Budget: $380</p>
          <div className="flex items-center gap-2 text-[10px] text-[#FF8A5B]">
            <span>5 votes</span>
            <span>•</span>
            <span>42%</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Main rotating content */}
      <motion.div
        className="min-h-screen  relative"
        animate={{ rotate: isHovering ? -1.2 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Floating decorative shapes */}
        <div className="inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-[15%] w-24 h-24 rounded-full bg-[#FF8A5B]/10"
          />
          <motion.div
            animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-32 left-[10%] w-32 h-32 rounded-3xl bg-[#C8E6C9]/20"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-[5%] w-16 h-16 rounded-full bg-[#FF8A5B]/5"
          />
        </div>

        {/* Main content — centered ballot box */}
        <div className="relative min-h-screen flex justify-center px-8 pt-20">
          <div className="relative max-w-4xl w-full">
            {/* Main card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative bg-white rounded-4xl p-10 md:p-14 shadow-2xl"
            >
              {/* Active badge floating */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: -8 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-4 -right-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8E6C9] rounded-full shadow-lg"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]"
                />
                <span className="text-sm font-bold text-gray-700">
                  LIVE NOW
                </span>
              </motion.div>

              {/* Floating vote emojis */}
              <div className="absolute -top-10 -left-8 text-5xl">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0], y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  👍
                </motion.span>
              </div>
              <div className="absolute -bottom-6 -right-10 text-4xl">
                <motion.span
                  animate={{ rotate: [0, -12, 12, 0], y: [0, -8, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  ❤️
                </motion.span>
              </div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="text-5xl md:text-6xl font-black leading-[1.05] mb-4"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                <span className="text-gray-800">Stop debating.</span>
                <br />
                <span className="bg-linear-to-r from-[#FF8A5B] to-[#FF6A00] bg-clip-text text-transparent">
                  Start celebrating.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-x leading-relaxed mb-8"
              >
                The fastest way to turn “any gift ideas?” into the perfect
                surprise. 🎉
                <br />
                Real-time voting. Instant consensus. Zero regrets.
              </motion.p>

              {/* Steps */}

              <div className="grid grid-cols-5 gap-3 mb-10">
                {steps.map((item, i) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.08, duration: 0.5 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="bg-white rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group"
                    >
                      <div className="absolute top-1 right-1 text-[10px] font-black text-[#FF8A5B]/40">
                        {item.step}
                      </div>

                      <div
                        className={`absolute inset-0 ${item.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                      />

                      <div className="relative z-10 flex items-center justify-center mb-2">
                        <div
                          className={`${item.bgColor} rounded-xl p-2 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className={`w-7 h-7 ${item.iconColor}`} />
                        </div>
                      </div>

                      <div className="relative z-10 text-[10px] font-black tracking-wider text-gray-700">
                        {item.label}
                      </div>

                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 ${item.accentColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Ballot slot metaphor — rounded */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.3 }}
                className="w-full h-3 bg-gray-200 mb-8 rounded-full overflow-hidden relative"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    delay: 2.4,
                    duration: 2.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="h-full bg-linear-to-r from-[#ff6a00] to-[#ec4899] rounded-full"
                />
              </motion.div>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="bg-[#F5E6E8]/50 rounded-2xl p-6"
              >
                <p className="font-serif italic leading-relaxed mb-2">
                  "We spent 3 hours deciding on a group gift. Never again."
                </p>
                <p className="text-sm  font-medium">— Everyone, Eventually</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA — OUTSIDE rotating container so it stays fixed */}
      <motion.div
        initial={{ opacity: 0, x: 100, y: 50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("BUTTON CLICKED!"); // Debug log
              handleCreateEvent();
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="relative bg-linear-to-r from-[#FF8A5B] to-[#FF6A00] rounded-full px-10 py-6
                 text-white font-black text-xl tracking-tight shadow-2xl
                 hover:shadow-[0_12px_48px_rgba(255,138,91,0.5)]
                 transition-shadow duration-200
                 flex items-center gap-4 cursor-pointer"
          >
            <span>CREATE POLL</span>
            <motion.span
              animate={{ x: [0, 6, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-3xl"
            >
              <ArrowRight className="w-7 h-7" />
            </motion.span>
          </button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Home;
