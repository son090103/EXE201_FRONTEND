const API_call = async (url: string) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API_call error:", error);
        throw error;
    }
};
export default API_call