import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../model/user";
interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<UserState["user"]>) => {
            // cách viết trên là phá vỡ cấu trúc détructoring
            state.user = action.payload;
        },
        updateAvatar: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.avatar = action.payload;
            }
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const { loginSuccess, logout, updateAvatar } = userSlice.actions;
export default userSlice.reducer;
