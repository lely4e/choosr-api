import React, { useEffect, useState } from "react";
import type { Poll } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import {
  Share2,
  ShoppingBagIcon,
  Clock,
  Dot,
  X,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import Modal from "../components/Modal";
import CreateCard from "../components/CreateCard";

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
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.detail || "Unauthorized");
          console.error("Unauthorized:", data);
          return;
        }

        setPolls(data);
        console.log("Polls fetched:", data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Failed to fetch poll: ${error.message}`);
          console.error(`Failed to fetch poll: ${error.message}`);
        } else {
          toast.error("Failed to fetch poll!");
          console.error("Failed to fetch poll!", error);
        }
      }
    };

    getPolls();
  }, []);

  useEffect(() => {
    const getSharedPolls = async () => {
      try {
        const response = await authFetch(`${API_URL}/activities`);
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.detail || "Unauthorized");
          console.error("Unauthorized:", data);
          return;
        }

        setSharedPolls(data);
        console.log("Shared Polls fetched:", data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Failed to fetch poll: ${error.message}`);
          console.error(`Failed to fetch poll: ${error.message}`);
        } else {
          toast.error("Failed to fetch poll!");
          console.error("Failed to fetch poll!", error);
        }
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Failed to copy: ${error.message}`);
        console.error(`Failed to copy: ${error.message}`);
      } else {
        toast.error("Failed to copy!");
        console.error("Failed to copy!", error);
      }
    }
  };

  return (
    <>
      {/* wrap-title-poll */}
      <div className="flex justify-between items-start mr-5 text-center">
        <div className="flex flex-col items-center mx-auto">
          <h1 className="px-5 text-[1.5em] leading-[1.1] font-black mb-2 mt-16">
            Polls & Picks
          </h1>
          <span className="m-2 text-[#737791] font-serif italic">
            View, manage, and collaborate on your polls.
          </span>
        </div>
      </div>

      <div className="w-full flex">
        {sharedPolls && sharedPolls.length > 0 && (
          <div
            className={`group relative inline-flex  rounded-3xl px-6 py-3 ml-4 mt-6 cursor-pointer items-center gap-2
            ${openSharedPolls
                ? "bg-linear-to-r from-[#FF8A5B] to-[#FF6A00] text-white shadow-lg shadow-orange-500/30 scale-105"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-400 hover:text-orange-500 hover:shadow-md"
              }`}
            onClick={() => setOpenSharedPollls((prev) => !prev)}
          >
            Shared With Me{" "}
            {openSharedPolls ? (
              <ChevronUp size={20} strokeWidth={2} />
            ) : (
              <ChevronDown size={20} strokeWidth={2} />
            )}
          </div>
        )}
      </div>
      {/* wrap-poll */}
      <div className="mx-auto flex px-4 justify-center">
        {/* poll-grid */}
        {openSharedPolls && sharedPolls && sharedPolls.length > 0 && (
          <div className="grid gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {sharedPolls.map((poll) => (
              // card
              <div
                key={poll.uuid}
                className="box-content bg-white/50 backdrop-blur-md rounded-[30px] p-6 cursor-pointer 
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full 
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
                onClick={(e) => {
                  navigate(`/polls/${poll.uuid}`);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="pb-2.5 flex justify-between items-start gap-5 m-0">
                  {/* active-button */}
                  <div className="flex items-center justify-between mr-3">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: poll.active ? "#C8E6C9" : "#FFCDD2",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: poll.active ? "#4CAF50" : "#F44336",
                        }}
                      />
                      <span className="text-[10px] font-bold text-gray-700">
                        {poll.active ? "Active" : "Closed"}
                      </span>
                    </div>
                  </div>
                  <Share2
                    size={20}
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
                    <X
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShare(null);
                      }}
                      className="cursor-pointer"
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
                        <Check
                          size={20}
                          strokeWidth={2}
                          style={{ color: "white" }}
                        />
                      ) : (
                        <Copy size={20} strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </Modal>

                <h3 className="text-left m-0 font-bold text-3xl text-black ">
                  {poll.title}
                </h3>
                {/* poll-text */}
                <p className="flex justify-between items-start gap-5 mt-2.5 text-sm text-black">
                  Budget: ${poll.budget}
                </p>

                {/* poll-description */}
                {poll.description && (
                  <p className="flex text-left  mt-2.5 text-sm text-[#737791] font-serif italic">
                    {poll.description}
                  </p>
                )}

                {/* deadline */}
                <p className="flex items-center mt-auto mb-5 gap-2 ml-0 text-[12px] text-[#EA7317]">
                  <ShoppingBagIcon size={14} strokeWidth={1.5} />{" "}
                  {poll.total_products}{" "}
                  {poll.total_products === 1 ? "item" : "items"}
                  <span>
                    <Dot className="mx-1" color="#F25E0D" size={14} />
                  </span>
                  {poll.deadline ? (
                    <>
                      <Clock size={14} strokeWidth={1.5} />
                      <span>{poll.deadline}</span>
                    </>
                  ) : (
                    <>
                      <Clock size={14} strokeWidth={1.5} />
                      <span>No deadline</span>
                    </>
                  )}
                </p>
                <button
                  className="bg-purple-300/50 rounded-[20px] flex items-center py-1 text-[0.7rem] 
                  text-[#356d8a] border-none mb-3 justify-center"
                >
                  created by {poll.created_by}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full flex">
        {/* {polls && polls.length > 0 && ( */}
        <div
          className={`group relative inline-flex  rounded-3xl px-6 py-3 ml-4 mt-14 cursor-pointer items-center gap-2
            ${openPolls
              ? "bg-linear-to-r from-[#FF8A5B] to-[#FF6A00] text-white shadow-lg shadow-orange-500/30 scale-105"
              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-400 hover:text-orange-500 hover:shadow-md"
            }`}
          onClick={() => setOpenPollls((prev) => !prev)}
        >
          My Polls{" "}
          {openPolls ? (
            <ChevronUp size={20} strokeWidth={2} />
          ) : (
            <ChevronDown size={20} strokeWidth={2} />
          )}
        </div>
        {/* )} */}
      </div>
      {/* wrap-poll */}
      <div className="mx-auto flex px-4 justify-center">
        {/* poll-grid */}
        {openPolls && polls.length > 0 && (
          <div className="grid gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {polls.map((poll) => (
              // card
              <div
                key={poll.uuid}
                className="box-content bg-white/50 backdrop-blur-md rounded-[30px] p-6 cursor-pointer 
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full 
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
                onClick={(e) => {
                  navigate(`/polls/${poll.uuid}`);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="pb-2.5 flex justify-between items-start gap-5 m-0">
                  {/* active-button */}
                  <div className="flex items-center justify-between mr-3">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: poll.active ? "#C8E6C9" : "#FFCDD2",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: poll.active ? "#4CAF50" : "#F44336",
                        }}
                      />
                      <span className="text-[10px] font-bold text-gray-700">
                        {poll.active ? "Active" : "Closed"}
                      </span>
                    </div>
                  </div>

                  <Share2
                    size={20}
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
                    <X
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShare(null);
                      }}
                      className="cursor-pointer"
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
                        <Check
                          size={20}
                          strokeWidth={2}
                          style={{ color: "white" }}
                        />
                      ) : (
                        <Copy size={20} strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </Modal>

                <h3 className="text-left m-0 font-bold text-3xl text-black ">
                  {poll.title}
                </h3>
                {/* poll-text */}
                <p className="flex justify-between items-start gap-5 mt-2.5 text-sm text-black">
                  Budget: ${poll.budget}
                </p>

                {/* poll-description */}
                {poll.description && (
                  <p className="flex text-left  mt-2.5 text-sm text-[#737791] font-serif italic">
                    {poll.description}
                  </p>
                )}

                {/* deadline */}
                <p className="flex items-center mt-auto mb-5 gap-2 ml-0 text-[12px] text-[#EA7317]">
                  <ShoppingBagIcon size={14} strokeWidth={1.5} />{" "}
                  {poll.total_products}{" "}
                  {poll.total_products === 1 ? "item" : "items"}
                  <span>
                    <Dot className="mx-1" color="#F25E0D" size={14} />
                  </span>
                  {poll.deadline ? (
                    <>
                      <Clock size={14} strokeWidth={1.5} />
                      <span>{poll.deadline}</span>
                    </>
                  ) : (
                    <>
                      <Clock size={14} strokeWidth={1.5} />
                      <span>No deadline</span>
                    </>
                  )}
                </p>
              </div>
            ))}

            {/* create-card */}
            <CreateCard />
          </div>
        )}
        {/* create-card */}
        {polls.length === 0 && (
          <div className="grid gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <CreateCard />
          </div>
        )}
      </div>
    </>
  );
};

export default Polls;
