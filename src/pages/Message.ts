export interface User {
    id: number;
    name: string;
    avatar: string;
}

export interface Message {
    id: number;
    chat_room_id: number;
    user_id: number;
    content: string;
    is_deleted: boolean;
    createdAt: string;   // ISO date string
    updatedAt: string;   // ISO date string
    User: User;
}
