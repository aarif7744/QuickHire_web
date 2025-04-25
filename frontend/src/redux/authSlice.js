import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage if it exists
const persistedUser = JSON.parse(localStorage.getItem("user"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: persistedUser || null, // Use persisted user or set to null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        // Remove user from localStorage on logout
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;
