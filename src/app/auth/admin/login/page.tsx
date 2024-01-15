"use client"
import AdminLoginFormView from "@/views/web/adminLoginForm/AdminLoginFormView";
import { useRouter } from "next/navigation";
import React from "react";
import {  useSelector } from "react-redux";

const page = () => {
	// redux
	const authToken = useSelector((state: any) => state.authToken.token);
	const router = useRouter();
	// Check if authToken is null and redirect to /auth/admin/login
	if (authToken) {
		router.push("/admin");
		return null; // You may also render a loading state or something else here
	}
	return (
		<>
			<div className="container mx-auto my-8">
				<h1 className="text-3xl font-bold mb-4">Admin Login Form</h1>
				<AdminLoginFormView />
			</div>
			
		</>
	);
};

export default page;
