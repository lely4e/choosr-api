import React, { useEffect, useState } from "react";
import type { Poll } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import Modal from "../components/Modal";
import CreateCard from "../components/CreateCard";
import { CalendarBlankIcon, CalendarCheckIcon, CalendarIcon, CaretDownIcon, CaretUpIcon, CheckIcon, DotIcon, LinkIcon, ShareFatIcon, ShoppingCartSimpleIcon, XIcon } from "@phosphor-icons/react";
import { daysLeft, getTimeLeftPercentage } from "../utils/date";
import { motion } from "framer-motion";

const Polls: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [sharedPolls, setSharedPolls] = useState<Poll[]>([]);

  const [openSharedPolls, setOpenSharedPollls] = useState(true);
  const [openPolls, setOpenPollls] = useState(true);

  const navigate = useNavigate();

  const [share, setShare] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const getPolls = async () => {
      try {
        const response = await authFetch(`${API_URL}/polls`);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          toast.error(data?.detail || "Failed to fetch polls");
          console.error("Failed to fetch polls:", data);
          return;
        }

        setPolls(data.items);
        console.log("Polls fetched:", data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        toast.error(message);
        console.error("Failed to fetch polls:", error);
      }
    };

    getPolls();
  }, []);

  useEffect(() => {
    const getSharedPolls = async () => {
      try {
        const response = await authFetch(`${API_URL}/activities`);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          toast.error(data?.detail || "Failed to fetch shared polls");
          console.error("Failed to fetch shared polls:", data);
          return;
        }

        setSharedPolls(data);
        console.log("Shared Polls fetched:", data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        toast.error(message);
        console.error("Failed to fetch shared polls:", error);
      }
    };

    getSharedPolls();
  }, []);

  const handleCopy = async (uuid: string) => {
    if (!uuid) return;
    const linkToCopy = `${window.location.origin}/polls/${uuid}`;

    try {
      await navigator.clipboard.writeText(linkToCopy);
      setCopied(uuid);
      toast.success("Link copied to clipboard!", { duration: 2000 });
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      console.error("Failed to copy:", error);
    }
  };

  return (
    <>
      {/* wrap-title-poll */}
      <motion.div className="flex justify-between items-start mr-5 text-center"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}>
        <div className="flex flex-col items-center mx-auto">
          <h1 className="px-5 text-[1.5em] leading-[1.1] font-black mb-2 mt-16">
            Polls & Picks
          </h1>
          <span className="m-2 text-[#737791] font-serif italic">
            View, manage, and collaborate on your polls.
          </span>
        </div>
      </motion.div>

      <motion.div className="w-full flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}>
        {sharedPolls && sharedPolls.length > 0 && (
          <div
            className={`group relative inline-flex  rounded-3xl px-6 py-3 ml-4 mt-6 cursor-pointer items-center gap-2 text-[14px]
            ${openSharedPolls
                ? "bg-linear-to-r from-[#FF8A5B] to-[#FF6A00] text-white shadow-lg shadow-orange-500/30 scale-105"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-400 hover:text-orange-500 hover:shadow-md"
              }`}
            onClick={() => setOpenSharedPollls((prev) => !prev)}
          >
            Shared With Me{" "}
            {openSharedPolls ? (
              <CaretUpIcon size={20} strokeWidth={2} weight="bold" />
            ) : (
              <CaretDownIcon size={20} strokeWidth={2} weight="bold" />
            )}
          </div>
        )}
      </motion.div>
      {/* wrap-poll */}
      <motion.div className="mx-auto flex px-4 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}>
        {/* poll-grid */}
        {openSharedPolls && sharedPolls && sharedPolls.length > 0 && (
          <div className="grid gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {sharedPolls.map((poll) => (
              // card
              <div
                key={poll.uuid}
                className="box-content bg-white/50 backdrop-blur-md rounded-[30px] p-6 cursor-pointer 
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full 
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)] hover:bg-white/80"
                onClick={(e) => {
                  navigate(`/polls/${poll.uuid}`);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="pb-2.5 flex justify-between items-start gap-5 m-0">
                  {/* active-button */}
                  <div className="flex items-center justify-between mr-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full -rotate-6"
                      style={{ backgroundColor: poll.active ? '#C8E6C9' : '#FFCDD2' }}>

                      <div className="relative w-1.5 h-1.5">
                        {poll.active && (
                          <div className="absolute inset-0 rounded-full animate-ping"
                            style={{ backgroundColor: '#4CAF50', opacity: 0.6 }} />
                        )}
                        <div className="relative w-1.5 h-1.5 rounded-full "
                          style={{ backgroundColor: poll.active ? '#4CAF50' : '#F44336' }} />
                      </div>

                      <span className="text-[10px] font-bold text-gray-700 tracking-[0.5px]">
                        {poll.active ? "Active" : "Closed"}
                      </span>
                    </div>
                  </div>

                  <ShareFatIcon
                    size={18}
                    strokeWidth={1.5}
                    className="hover:text-[#F25E0D]"
                    onClick={(e) => {
                      setShare(poll.uuid);
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                </div>

                <Modal
                  isOpen={share === poll.uuid}
                  onClose={() => setShare(null)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg mb-4.5 text-center ">
                      Your event link for{" "}
                      <span className="text-[#F25E0D]">{poll.title}</span> is
                      ready to share! 🎉
                    </h3>
                    <XIcon
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShare(null);
                      }}
                      className="cursor-pointer"
                      size={20}
                      weight="bold"
                    />
                  </div>
                  <div className="flex">
                    <input
                      className="border-0 border-b border-[#F25E0D] bg-transparent text-[#737791] pl-2.5 text-base w-125 h-12 "
                      id={poll.uuid}
                      value={`${window.location.origin}/polls/${poll.uuid}`}
                      readOnly
                    />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopy(poll.uuid);
                      }}
                      className={` px-4  border-[#F25E0D] hover:bg-black h-12 hover:text-white transition-colors rounded-full
                             ${copied === poll.uuid
                          ? "bg-[#B0B6CC]"
                          : "bg-[#F25E0D] text-white cursor-pointer"
                        }
                           `}
                    >
                      {copied === poll.uuid ? (
                        <CheckIcon
                          size={16}
                          strokeWidth={2}
                          style={{ color: "white" }}
                          weight="bold"
                        />
                      ) : (
                        <LinkIcon size={16} strokeWidth={2} weight="bold" />
                      )}
                    </button>
                  </div>
                </Modal>

                <h3 className={`text-left m-0 font-bold text-3xl
                ${poll.active ?
                    " text-black "
                    :
                    "text-[#B0B6CC]"}`}
                >
                  {poll.title}
                </h3>

                {/* poll-text */}
                <p className={`flex justify-between items-start gap-5 mt-2.5 text-sm 
                      ${poll.active ?
                    " text-black "
                    :
                    "text-[#B0B6CC]"}`}
                >
                  Budget: ${poll.budget}
                </p>

                {/* poll-description */}
                {poll.description && (
                  <p className={`flex text-left  mt-2.5 text-sm font-serif italic
                    ${poll.active ?
                      "text-[#737791]"
                      :
                      "text-[#B0B6CC]"}`}
                  >
                    {poll.description}
                  </p>
                )}

                {/* progress bar */}
                <div className="mt-auto w-full h-1 bg-[#e5e7eb] rounded-full overflow-hidden my-1.5 mb-1">
                  <div
                    className="h-full bg-linear-to-br from-[#ff6a00] to-[#ec4899] transition-[width] duration-300"
                    style={{
                      width: `${getTimeLeftPercentage(poll)}%`,
                    }}
                  />
                </div>

                {/* total products */}
                <div className="flex items-center mt-1 mb-5 gap-2 ml-0 text-[12px] text-[#EA7317] justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCartSimpleIcon size={14} strokeWidth={1.5} weight="fill" />{" "}
                    {poll.total_products}{" "}
                    {poll.total_products === 1 ? "item" : "items"}
                  </div>

                  <span>
                    <DotIcon className="mx-1" color="#F25E0D" size={20} weight="bold" />
                  </span>

                  <div className="flex items-center gap-2">
                    {poll.deadline ? (
                      daysLeft(poll) > 0 ? (
                        <>
                          <CalendarIcon size={14} strokeWidth={1.5} weight="fill" />
                          <span>
                            {daysLeft(poll)}{" "}
                            {daysLeft(poll) === 1 ? "day left" : "days left"}
                          </span>
                        </>
                      ) : (
                        <div className="text-[#B0B6CC]">
                          <CalendarCheckIcon size={14} strokeWidth={1.5} weight="fill" />
                          <span>Finished</span>
                        </div>
                      )
                    ) : (
                      <>
                        <CalendarBlankIcon size={14} strokeWidth={1.5} />
                        <span>No deadline</span>
                      </>
                    )}
                  </div>

                </div>

                <button
                  className="flex items-center text-[#ba4cea] text-[0.7rem] px-5 py-2.5 bg-[#efd6ff] rounded-full
                   border-none mb-3 justify-center "
                >
                  <div className="flex items-center gap-2">
                    {/* <UserCircleIcon size={14} strokeWidth={2.0} weight="fill" />  */}
                       <img
                                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${poll.user_id}`}
                                alt="avatar"
                                className="w-5"
                            />
                    created by {poll.created_by}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div className="w-full flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}>
        {/* {polls && polls.length > 0 && ( */}
        <div
          className={`group relative inline-flex  rounded-3xl px-6 py-3 ml-4 mt-14 cursor-pointer items-center gap-2 text-[14px]
            ${openPolls
              ? "bg-linear-to-r from-[#FF8A5B] to-[#FF6A00] text-white shadow-lg shadow-orange-500/30 scale-105"
              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-400 hover:text-orange-500 hover:shadow-md"
            }`}
          onClick={() => setOpenPollls((prev) => !prev)}
        >
          My Polls{" "}
          {openPolls ? (
            <CaretUpIcon size={20} strokeWidth={2} weight="bold" />
          ) : (
            <CaretDownIcon size={20} strokeWidth={2} weight="bold" />
          )}
        </div>
        {/* )} */}
      </motion.div>
      {/* wrap-poll */}
      <motion.div className="mx-auto flex px-4 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}>
        {/* poll-grid */}
        {openPolls && polls.length > 0 && (
          <div className="grid gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {polls.map((poll) => (
              // card
              <div
                key={poll.uuid}
                className="box-content bg-white/50 backdrop-blur-md rounded-[30px] p-6 cursor-pointer 
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full 
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)] hover:bg-white/80"
                onClick={(e) => {
                  navigate(`/polls/${poll.uuid}`);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="pb-2.5 flex justify-between items-start gap-5 m-0">
                  {/* active-button */}
                  <div className="flex items-center justify-between mr-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full -rotate-6"
                      style={{ backgroundColor: poll.active ? '#C8E6C9' : '#FFCDD2' }}>

                      <div className="relative w-1.5 h-1.5">
                        {poll.active && (
                          <div className="absolute inset-0 rounded-full animate-ping"
                            style={{ backgroundColor: '#4CAF50', opacity: 0.6 }} />
                        )}
                        <div className="relative w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: poll.active ? '#4CAF50' : '#F44336' }} />
                      </div>

                      <span className="text-[10px] font-bold text-gray-700 ">
                        {poll.active ? "Active" : "Closed"}
                      </span>
                    </div>
                  </div>

                  <ShareFatIcon
                    size={18}
                    strokeWidth={1.5}
                    // weight="fill"
                    className="hover:text-[#F25E0D]"
                    onClick={(e) => {
                      setShare(poll.uuid);
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                </div>

                <Modal
                  isOpen={share === poll.uuid}
                  onClose={() => setShare(null)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg mb-4.5 text-center ">
                      Your event link for{" "}
                      <span className="text-[#F25E0D]">{poll.title}</span> is
                      ready to share! 🎉
                    </h3>
                    <XIcon
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShare(null);
                      }}
                      className="cursor-pointer"
                      size={20}
                      weight="bold"
                    />
                  </div>
                  <div className="flex">
                    <input
                      className="border-0 border-b border-[#F25E0D] bg-transparent text-[#737791] pl-2.5 text-base w-125 h-12 "
                      id={poll.uuid}
                      value={`${window.location.origin}/polls/${poll.uuid}`}
                      readOnly
                    />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopy(poll.uuid);
                      }}
                      className={` px-4  border-[#F25E0D] hover:bg-black h-12 hover:text-white transition-colors rounded-full
                              ${copied === poll.uuid
                          ? "bg-[#B0B6CC]"
                          : "bg-[#F25E0D] text-white cursor-pointer"
                        }
                          `}
                    >
                      {copied === poll.uuid ? (
                        <CheckIcon
                          size={16}
                          strokeWidth={2}
                          style={{ color: "white" }}
                          weight="bold"
                        />
                      ) : (
                        <LinkIcon size={16} strokeWidth={2} weight="bold" />
                      )}
                    </button>
                  </div>
                </Modal>


                <h3 className={`text-left m-0 font-bold text-3xl
                ${poll.active ?
                    " text-black "
                    :
                    "text-[#B0B6CC]"}`}
                >
                  {poll.title}
                </h3>

                {/* poll-text */}
                <p className={`flex justify-between items-start gap-5 mt-2.5 text-sm 
                      ${poll.active ?
                    " text-black "
                    :
                    "text-[#B0B6CC]"}`}
                >
                  Budget: ${poll.budget}
                </p>

                {/* poll-description */}
                {poll.description && (
                  <p className={`flex text-left  mt-2.5 text-sm font-serif italic
                    ${poll.active ?
                      "text-[#737791]"
                      :
                      "text-[#B0B6CC]"}`}
                  >
                    {poll.description}
                  </p>
                )}

                {/* progress bar */}
                <div className="mt-auto w-full h-1 bg-[#e5e7eb] rounded-full overflow-hidden my-1.5 mb-1">
                  <div
                    className="h-full bg-linear-to-br from-[#ff6a00] to-[#ec4899] transition-[width] duration-300"
                    style={{
                      width: `${getTimeLeftPercentage(poll)}%`,
                    }}
                  />
                </div>

                {/* total products */}
                <div className="flex items-center mt-1 mb-5 gap-2 ml-0 text-[12px] text-[#EA7317] justify-between">
                  <div className="flex items-center gap-2">
                    {poll.active ?
                      <>
                        <ShoppingCartSimpleIcon size={14} strokeWidth={1.5} weight="fill" />{" "}
                        {poll.total_products}{" "}
                        {poll.total_products === 1 ? "item" : "items"}
                      </>
                      :
                      <>
                        <ShoppingCartSimpleIcon size={14} strokeWidth={1.5} weight="fill" className="text-[#B0B6CC]" />{" "}
                        <span className="text-[#B0B6CC]">{poll.total_products}{" "}
                          {poll.total_products === 1 ? "item" : "items"}</span>
                      </>}
                  </div>

                  <span>
                    <DotIcon size={20} weight="bold" className={`mx-1 
                    ${daysLeft(poll) > 1 ?
                        "text-[#F25E0D]"
                        :
                        "text-[#B0B6CC]"}
                    `} />
                  </span>

                  <div className="flex items-center gap-2">
                    {poll.deadline ? (
                      daysLeft(poll) > 0 ? (
                        <>
                          <CalendarIcon size={14} strokeWidth={1.5} weight="fill" />
                          <span>
                            {daysLeft(poll)}{" "}
                            {daysLeft(poll) === 1 ? "day left" : "days left"}
                          </span>
                        </>
                      ) : (
                        <>
                          <CalendarCheckIcon size={14} strokeWidth={1.5} weight="fill" className="text-[#B0B6CC]" />
                          <span className="text-[#B0B6CC]">Finished</span>
                        </>
                      )
                    ) : (
                      <>
                        <CalendarBlankIcon size={14} strokeWidth={1.5} />
                        <span>No deadline</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* create-card */}
            <CreateCard address={"/add-poll"} text={"Create Poll"} />
          </div>
        )}
        {/* create-card */}
        {polls.length === 0 && (
          <div className="grid gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <CreateCard address={"/add-poll"} text={"Create Poll"} />
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Polls;
