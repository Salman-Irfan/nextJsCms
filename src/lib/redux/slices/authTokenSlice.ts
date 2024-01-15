// /lib/redux/slices/authTokenSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AuthTokenState {
	token: string | null;
}

// Function to get the initial state from local storage
const getInitialState = (): AuthTokenState => {
	const storedToken = localStorage.getItem("token");
	return {
		token: storedToken ? storedToken : null,
	};
};

const initialState: AuthTokenState = getInitialState();

export const authTokenSlice = createSlice({
	name: "authToken",
	initialState,
	reducers: {
		setAuthToken: (state, action) => {
			state.token = action.payload;
		},
		clearAuthToken: (state) => {
			state.token = null;
		},
	},
});

export const { setAuthToken, clearAuthToken } = authTokenSlice.actions;

export default authTokenSlice.reducer;
