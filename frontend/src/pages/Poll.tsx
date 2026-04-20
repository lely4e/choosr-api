import { useState } from "react";
import { useParams } from "react-router-dom";
import Search from "../components/Search";
import Ideas from "../components/Ideas";
import Products from "../components/Products";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import AddProductCard from "../components/AddProduct";
import HistoryPanel from "../components/HistoryPanel";
import { useHistory } from "../hooks/useHistory";
import { useActivities } from "../hooks/useActivities";
import { useProducts } from "../hooks/useProducts";
import { usePoll } from "../hooks/usePoll";
import PollCard from "../components/PollCard";
import PollEditForm from "../components/PollEditForm";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function PollPage() {
    const { user } = useUser();
    console.log("user", user);
    console.log("user id", user?.id);

    const { uuid } = useParams<{ uuid: string }>();

    const [showGiftIdeas, setShowGiftIdeas] = useState(false);
    const [showProducts, setShowProducts] = useState(true);

    const {
        history,
        openHistory,
        openHistoryDelete,
        setOpenHistoryDelete,
        handleToggleHistory,
        handleDeleteHistory,
        handleAddHistoryToIdeas,
        handleCopyHistory,
        copiedId,
    } = useHistory(uuid);

    const {
        activities,
        open,
        setOpen,
        handleAddSharedPoll,
        handleDeleteSharedPoll,
    } = useActivities();

    const {
        products,
        getProducts,
        setProducts,
        refreshProducts,
        sentinelRef,
        loadingMore,
        hasMore,
    } = useProducts(uuid);

    const {
        poll,
        isEditing,
        editedTitle,
        editedBudget,
        editedManuallyClosed,
        editedDescription,
        editedDeadline,
        setEditedTitle,
        setEditedBudget,
        setEditedDescription,
        setEditedDeadline,
        setEditedManuallyClosed,
        startEditing,
        cancelEditing,
        handleApplyUpdate,
        handleDeletePoll,
        handleCopy,
        copied,
        openPoll,
        setOpenPoll,
        share,
        setShare,
        showPollCard,
        setShowPollCard,
        openCard,
        setOpenCard,
        pollFormErrors,
    } = usePoll(uuid);

    if (!poll) {
        return (
            <div>
                <p>Loading poll...</p>
            </div>
        );
    }
    const handleShowIdeas = () => {
        setShowGiftIdeas((prev) => !prev);
        setShowProducts(true);
    };
    const handleShowEdit = () => {
        setShowPollCard(false);
        startEditing();
    };

    return (
        <>
            {/* Poll card section */}
            <div className="mx-auto flex justify-center px-4">
                {/* product-container */}
                <motion.div className="grid gap-6 w-full max-w-200 mt-10"
                        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0, duration: 0.6 }}>
                    <Link
                        to="/my-polls"
                        className="flex items-center gap-3 text-[#6366f1] hover:text-[#4F46E5] text-left text-[14px]"
                    >
                        <ArrowLeftIcon size={16} weight="bold" /> Back to polls
                    </Link>

                    {/* card-poll */}
                    {showPollCard && (
                        <PollCard
                            poll={poll}
                            uuid={uuid!}
                            user={user}
                            activities={activities}
                            products={products}
                            history={history}
                            isEditing={isEditing}
                            editedTitle={editedTitle}
                            editedManuallyClosed={editedManuallyClosed}
                            editedBudget={editedBudget}
                            open={open}
                            openPoll={openPoll}
                            share={share}
                            copied={copied}
                            setOpen={setOpen}
                            setOpenPoll={setOpenPoll}
                            setShare={setShare}
                            setEditedTitle={setEditedTitle}
                            setEditedManuallyClosed={setEditedManuallyClosed}
                            setEditedBudget={setEditedBudget}
                            startEditing={startEditing}
                            handleDeletePoll={handleDeletePoll}
                            handleAddSharedPoll={handleAddSharedPoll}
                            handleDeleteSharedPoll={handleDeleteSharedPoll}
                            handleCopy={handleCopy}
                            handleToggleHistory={handleToggleHistory}
                            handleShowIdeas={handleShowIdeas}
                            showGiftIdeas={showGiftIdeas}
                            handleShowEdit={handleShowEdit}
                        />
                    )}

                    {isEditing && (
                        <PollEditForm
                            editedTitle={editedTitle}
                            setEditedTitle={setEditedTitle}
                            editedBudget={editedBudget}
                            setEditedBudget={setEditedBudget}
                            editedManuallyClosed={editedManuallyClosed}
                            setEditedManuallyClosed={setEditedManuallyClosed}
                            editedDescription={editedDescription}
                            editedDeadline={editedDeadline}
                            setEditedDescription={setEditedDescription}
                            setEditedDeadline={setEditedDeadline}
                            cancelEditing={() => {
                                cancelEditing();
                                setShowPollCard(true);
                            }}
                            handleApply={async () => {
                                const success = await handleApplyUpdate();
                                if (success) setShowPollCard(true);
                            }}
                            errors={pollFormErrors}
                        />
                    )}
                </motion.div>
            </div>

            {history.length > 0 && openHistory && (
                <HistoryPanel
                    history={history}
                    uuid={poll.uuid}
                    openHistoryDelete={openHistoryDelete}
                    setOpenHistoryDelete={setOpenHistoryDelete}
                    onDelete={handleDeleteHistory}
                    onAddToIdeas={handleAddHistoryToIdeas}
                    onCopy={handleCopyHistory}
                    copiedId={copiedId}
                />
            )}

            <motion.div className="flex flex-col items-center "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}>
                {showGiftIdeas && (
                    <Ideas
                        getProducts={getProducts}
                        title={poll.title}
                        budget={poll.budget}
                    />
                )}
                <h1 className="text-[1.5em]  leading-tight pt-10 font-black">
                    Products
                </h1>
                <Search
                    getProducts={getProducts}
                    openCard={openCard}
                    setOpenCard={setOpenCard}
                />
            </motion.div>

            {openCard && <AddProductCard getProducts={getProducts} setOpenCard={setOpenCard} />}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}>
                {showProducts ? (
                    <Products
                        uuid={uuid}
                        products={products}
                        setProducts={setProducts}
                        getProducts={refreshProducts}
                        sentinelRef={sentinelRef}
                        loadingMore={loadingMore}
                        hasMore={hasMore}
                    />

                ) : (
                    ""
                )}</motion.div>
        </>
    );
}
