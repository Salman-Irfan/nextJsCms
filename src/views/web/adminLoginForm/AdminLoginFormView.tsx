"use client";
import endPoints from "@/constants/client/endPoints/endPoints";
import {
	setAuthToken,
	clearAuthToken,
} from "@/lib/redux/slices/authTokenSlice";

import postFormService from "@/services/apiServices/postFormService/postFormService";
import { Button, Flex, FormControl, Input, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminLoginFormView = () => {
	// redux
	const authToken = useSelector((state: any) => state.authToken.token);
	const dispatch = useDispatch();
	// hooks
	const toast = useToast();
	const router = useRouter();
	// state variables
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// input events
	const handleEmailChange = (e: any) => {
		setEmail(e.target.value);
	};
	// password change
	const handlePasswordChange = (e: any) => {
		setPassword(e.target.value);
	};
	// form submission
	const handleAdminLogin = async (e: any) => {
		e.preventDefault();
		const adminLoginFormData = { email, password };
		try {
			const response = await postFormService(
				endPoints.ADMIN_LOGIN_FORM,
				adminLoginFormData
			);
			// if token & admin role
			if (
				response.data.token &&
				(response.data.user.role_id === 1 ||
					response.data.user.role_id === 2)
			) {
				// show toast notification from chakta UI
				toast({
					title: "Login Successful",
					description: "You have successfully logged in.",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
				// save this token in browser local storage
				localStorage.setItem("token", response.data.token);
				dispatch(setAuthToken(response.data.token)); // Dispatch the setAuthToken action
				// if redux store has auth token, the redirect it to /admin route
				router.push("/admin");
			}
		} catch (error) {
			// Handle error and show error toast if needed
			console.log(error);
			toast({
				title: "Login Error",
				description: "An error occurred during login.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};
	return (
		<>
			<form onSubmit={handleAdminLogin}>
				<Flex direction="column" maxW="400px" mx="auto">
					{/* email */}
					<FormControl mb={4}>
						<Input
							placeholder="Email"
							type="email"
							value={email}
							onChange={handleEmailChange}
						/>
					</FormControl>
					{/* password */}
					<FormControl mb={4}>
						<Input
							placeholder="Password"
							type="password"
							value={password}
							onChange={handlePasswordChange}
						/>
					</FormControl>
					{/* submit */}
					<Button
						type="submit"
						// isLoading={formState.isSubmitting}
						bgColor="#006699">
						Submit
					</Button>
				</Flex>
			</form>
			
		</>
	);
};

export default AdminLoginFormView;
