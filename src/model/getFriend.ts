export interface GetFriend {
    id: number
    user_id: number,
    friend_id: number,
    status: string,
    createdAt: string,
    friend: {
        id: number,
        name: string,
        email: string,
        avatar: string,
        isOnline: boolean
    }
}
