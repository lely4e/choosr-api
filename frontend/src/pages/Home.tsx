import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"

export default function Home() {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    const { user } = useUser();
    
    if (!user) {
      navigate("/login");
    } else {
      navigate("/add-poll");
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-12 max-w-5xl mx-auto text-center space-y-8">
      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
        Make Group Decisions{" "}
        <span className="text-orange-500">Effortlessly</span>
      </h1>

      <p className="text-gray-600 max-w-3xl mx-auto text-lg sm:text-xl">
        Create polls, share product links, and let your team vote on the best
        option. Perfect for event planning, team gifts, and group purchases.
      </p>

      <button
        onClick={handleCreateEvent}
        className="bg-linear-to-r from-orange-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:opacity-90 transition"
      >
        Create Your First Poll
      </button>

      {/* How it Works */}
      <div className="w-full max-w-3xl space-y-4 text-left">
        <h2 className="text-2xl font-bold text-gray-700">How it works</h2>
        <h3 className="text-lg font-medium text-gray-600">
          Create a poll - Share with others - Decide together
        </h3>
        <p className="text-gray-500">
          Add options or products in seconds - Invite friends or teammates to
          vote - See results and comments in real time
        </p>
      </div>

      {/* Use Cases */}
      <div className="w-full max-w-3xl space-y-4 text-left">
        <h2 className="text-2xl font-bold text-gray-700">Use cases</h2>
        <h3 className="text-lg text-gray-600 space-y-2 flex flex-col">
          <span>🎉 Event planning</span>
          <span>🎁 Group gifts</span>
          <span>🛍️ Shared purchases</span>
          <span>👥 Team decisions</span>
        </h3>
      </div>
    </div>
  );
}
