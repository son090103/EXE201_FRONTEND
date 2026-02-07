const port = import.meta.env.VITE_API_URL
const API_FRIEND = {
    postFriend: `${port}/client/check/friend`,
    getFriends: `${port}/client/check/friends`,
    sentFriend: `${port}/client/check/sentfriends`,
    addFriends: `${port}/client/check/acceptFriend`,
    friendPrimary: `${port}/client/check/friendPrimary`,
}
export default API_FRIEND