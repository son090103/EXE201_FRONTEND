import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/userSlice";
import API_USER from "../services/user";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const handleLogout = async () => {
            try {
                await fetch(API_USER.logout, {
                    method: "POST",
                    credentials: "include", // ⭐ gửi cookie để backend xóa
                });
            } catch (error) {
                console.error("Logout error:", error);
            } finally {
                dispatch(logout());      // clear redux
                navigate("/");      // redirect
            }
        };

        handleLogout();
    }, [dispatch, navigate]);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>Logging out...</h2>
        </div>
    );
};

export default Logout;
