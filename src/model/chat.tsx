export interface Chat {
    id: number;
    name: string;
    avatar: string;
    lastMessage?: string;
    unread?: number;
    isOnline?: boolean;
}
