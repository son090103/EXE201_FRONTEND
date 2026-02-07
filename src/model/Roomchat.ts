import type { user } from "./user";

interface ChatRoomMember {
    chat_room_id: number;
    user_id: number;
    role: "member" | "admin" | "owner";
    createdAt: string;
    updatedAt: string;

    User?: user; // chỉ có khi include User
}

interface ChatRoom {
    id: number;
    type_room: "private" | "group";
    name: string;
    status: "active" | "inactive";
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
    members: ChatRoomMember[];
}
export interface ChatRoomUser {
    chat_room_id: number;
    user_id: number;
    role: "member" | "admin" | "owner";
    createdAt: string;
    updatedAt: string;

    Chat_room: ChatRoom;
}
