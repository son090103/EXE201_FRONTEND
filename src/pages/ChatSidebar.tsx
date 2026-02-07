import { X, Minus, Square } from "lucide-react";
import { useState } from "react";
import type { Chat } from "../model/chat";

type ChatSidebarProps = {
    chat: Chat;
    onClose: () => void;
};

export default function ChatSidebar({ chat, onClose }: ChatSidebarProps) {
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <div
            className={`
                fixed bottom-0 right-4
                w-80
                bg-white
                border border-gray-200
                rounded-t-2xl
                shadow-2xl
                flex flex-col
                z-50
                transition-all duration-300
                ${isMinimized ? "h-12" : "h-[420px]"}
            `}
        >
            {/* HEADER */}
            <div
                className="
                    flex items-center justify-between
                    px-4 py-3
                    border-b
                    cursor-pointer
                "
                onClick={() => isMinimized && setIsMinimized(false)}
            >
                <div className="flex items-center gap-2 min-w-0">
                    <img
                        src={chat.avatar || "https://i.pravatar.cc/100"}
                        alt={chat.name}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold text-sm truncate">
                        {chat.name}
                    </span>
                </div>

                <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Minimize */}
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="text-gray-500 hover:text-gray-800"
                        title={isMinimized ? "Restore" : "Minimize"}
                    >
                        {isMinimized ? <Square size={16} /> : <Minus size={16} />}
                    </button>

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800"
                        title="Close"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* BODY + INPUT (ẨN KHI MINIMIZE) */}
            {!isMinimized && (
                <>
                    {/* BODY */}
                    <div className="flex-1 overflow-y-auto px-3 py-2 text-sm text-gray-700">
                        <div className="text-center text-gray-400 mt-20">
                            Chưa có tin nhắn
                        </div>
                    </div>

                    {/* INPUT */}
                    <div className="p-3 border-t">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="
                                    flex-1
                                    rounded-full
                                    border
                                    px-4 py-2
                                    text-sm
                                    focus:outline-none
                                    focus:border-gray-900
                                "
                            />
                            <button
                                className="
                                    px-4 py-2
                                    rounded-full
                                    bg-gray-900
                                    text-white
                                    text-sm
                                    hover:bg-gray-800
                                "
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
