"use client"
import Sidebar from "@/components/admin/Sidebar";
import { useSelector } from "react-redux";
import React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";

const page = () => {
	// redux
	const authToken = useSelector((state: any) => state.authToken.token);
	// hooks
	const router = useRouter();
	const toast = useToast();
	// Check if authToken is null and redirect to /auth/admin/login
	if (!authToken) {
		// show alert toast notification from chakra ui
		toast({
			title: "Unauthorized Access",
			description: "You need to log in to access this page.",
			status: "warning",
			duration: 5000,
			isClosable: true,
		});
		router.push("/auth/admin/login");
		return null; // You may also render a loading state or something else here
	}
	return (
		<>
			<Sidebar />
		</>
	);
};

export default page;
