const port = import.meta.env.VITE_API_URL
const API_community = {
    postCommunity: `${port}/client/check/postcommunity`,
    getCommunity: `${port}/client/check/getPostCommunity`,
    postEvent: `${port}/client/check/postEvents`,
}
export default API_community