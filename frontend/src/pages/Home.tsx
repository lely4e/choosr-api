import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { type FC, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon, ConfettiIcon, PencilLineIcon, PlusIcon, ThumbsUpIcon, UsersThreeIcon } from "@phosphor-icons/react";

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
      icon: PencilLineIcon,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      label: "INVITE FRIENDS",
      step: "02",
      icon: UsersThreeIcon,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "ADD OPTIONS",
      step: "03",
      icon: PlusIcon,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      label: "VOTE",
      step: "04",
      icon: ThumbsUpIcon,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      label: "CELEBRATE",
      step: "05",
      icon: ConfettiIcon,
      bgColor: "bg-pink-100",
      iconColor: "text-pink-500",
    },
  ];

  return (
    <>
      {/* Mini preview cards — floating on the side */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-1/3 right-0 md:flex flex-col gap-4 z-10"
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
        {/* Main content — centered ballot box */}
        <div className="relative min-h-screen flex justify-center px-8 pt-10">
          <div className="relative max-w-5xl w-full">
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

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="text-5xl md:text-8xl font-black leading-[1.05] mb-4 text-left"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >

                <span
                  style={{
                    position: "relative",
                    display: "inline-block",
                    color: "#B0B6CC",
                  }}
                >
                  Keep debating.

                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{
                      delay: 1.2,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "60%",
                      height: 6,
                      background: "#E63946",
                      transform: "translateY(-50%) rotate(-1.5deg)",
                      display: "block",
                      transformOrigin: "left center",
                    }}
                  />
                </span>

                <br />
                <span className="bg-linear-to-r from-[#ff6a00] to-[#ec4899] bg-clip-text text-transparent">
                  Start celebrating.
                </span>

                <div className="flex gap-12.5">
                  <div
                    className="flex-2 relative inline-block text-4xl md:text-6xl font-black leading-[1.4] text-left text-[#7f88ab]"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    <span className="block w-fit relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-full before:bg-amber-200 before:mix-blend-multiply">
                      <span className="relative">[ Decision </span>
                    </span>

                    <span className="block w-fit relative -mt-5 md:-mt-9 before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[90%] before:bg-amber-200 before:mix-blend-multiply"> 
                      <span className="relative">infrastructure for</span>
                    </span>

                    <span className="block w-fit relative -mt-5 md:-mt-9 before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[90%] before:bg-amber-200 before:mix-blend-multiply">
                      <span className="relative">the indecisive ]</span>
                    </span>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="w-1/4 flex  text-[6px] md:text-xs leading-relaxed mt-auto text-left font-light"
                  >

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="flex text-xs mt-2 ">
                      The fastest way to turn “any gift ideas?” into the perfect
                      surprise 🎉
                      <br />
                    </motion.p>
                  </motion.p>
                </div>
              </motion.h2>

              {/* Steps */}
              <div className="grid grid-cols-5 gap-2 mb-10 mt-10">
                {steps.map((item, i) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 1, duration: 0.5 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="bg-white rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group"
                    >
                      <div className="absolute top-2 right-2 text-[10px] font-black text-[#F25E0D]/40">
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
                        className={`absolute bottom-0 left-0 right-0 h-1  opacity-0 group-hover:opacity-100 transition-opacity`}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="bg-[#dadde9] rounded-2xl p-6 text-[#737791]"
              >
                <p className="font-serif italic leading-relaxed mb-2 ">
                  "We spent 3 hours deciding on a group gift. Never again."
                </p>
                <p className="text-sm">- Everyone, Eventually</p>
              </motion.div>
            </motion.div>
          </div >
        </div >

      </motion.div >

      {/* CTA — OUTSIDE rotating container so it stays fixed */}
      < motion.div
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
            className="relative bg-linear-to-r from-[#ff6a00] to-[#ec4899] rounded-full px-10 py-6
                 text-white font-black text-xl shadow-2xl
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
              <ArrowRightIcon weight="bold" className="w-7 h-7" />
            </motion.span>
          </button>

        </motion.div>
      </motion.div >
    </>
  );
};

export default Home;
