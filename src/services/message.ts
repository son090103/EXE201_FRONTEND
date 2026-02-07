const port = import.meta.env.VITE_API_URL
const API_MESSAGE = {
    postroom: `${port}/client/check/postRoomChat`,
    getRoom: `${port}/client/check/getRoomchat`,
    getMessage: `${port}/client/check/viewMessage`,
    postchat: `${port}/client/check/postMessage`,
    createGroup: `${port}/client/check/postGroupchat`,
    updateRoomType: `${port}/client/check/roomChat`,
    getgroup: `${port}/client/check/groupchat`,
    JoinGroup: `${port}/client/check/joinGroupChat`
}
export default API_MESSAGE