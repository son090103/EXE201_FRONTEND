const port = import.meta.env.VITE_API_URL
const API_USER = {
    register: `${port}/client/notcheck/register`,
    login: `${port}/client/notcheck/login`,
    profile: `${port}/client/check/profile`,
    logout: `${port}/client/check/logout`,
    getUser: `${port}/client/check/users`,
    updateProfile: `${port}/client/check/updateProfile`,
    getUserProfile: `${port}/client/notcheck/getProfileUser`,
}
export default API_USER