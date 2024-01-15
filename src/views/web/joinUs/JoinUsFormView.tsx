"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { format } from "libphonenumber-js";
import { useToast } from "@chakra-ui/react";

import {
	Flex,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Button,
} from "@chakra-ui/react";
import endPoints from "@/constants/client/endPoints/endPoints";
import postFormService from "@/services/apiServices/postFormService/postFormService";

interface JoinUsFormValues {
	user_name: string;
	email: string;
	phone: string;
	message: string;
}

const JoinUsFormView: React.FC = () => {
	// hooks
	const toast = useToast();
	// form hooks
	const { register, handleSubmit, setValue, formState } =
		useForm<JoinUsFormValues>();
	// state variables
	const [selectedCountry, setSelectedCountry] = useState("PK");
	// on form submit
	const onSubmit = async (data: JoinUsFormValues) => {
		// Format the phone number using libphonenumber-js
		const formattedPhoneNumber = format(
			data.phone,
			selectedCountry,
			"International"
		);
		const contactFormData = { ...data, phone: formattedPhoneNumber };
		// api call
		const response = await postFormService(
			endPoints.POST_JOIN_US,
			contactFormData
		);
		console.log(response.data.success);
		if (response.data.success == true) {
			// Show success toast
			toast({
				title: "Form submitted successfully!",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Flex direction="column" maxW="400px" mx="auto">
				<FormControl mb={4}>
					<FormLabel htmlFor="user_name">Name</FormLabel>
					<Input
						{...register("user_name", {
							required: "Name is required",
						})}
						border="2px"
						borderColor="#006699"
					/>
				</FormControl>

				<FormControl mb={4}>
					<FormLabel htmlFor="email">Email</FormLabel>
					<Input
						type="email"
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
								message: "Invalid email address",
							},
						})}
						border="2px"
						borderColor="#006699"
					/>
				</FormControl>

				<FormControl mb={4}>
					<FormLabel htmlFor="phone">Phone</FormLabel>
					<PhoneInput
						{...register("phone", {
							required: "Phone number is required",
						})}
						defaultCountry="PK"
						value={register("phone").value} // define typescript type
						onChange={(value) => {
							setValue("phone", value); // Use setValue to update form state, type
							setSelectedCountry(value?.country || ""); // type
						}}
						name="phone"
						style={{
							border: "2px solid #006699",
							borderRadius: "0.375rem",
							padding: "0.5rem", // Add padding to show the country code
						}}
					/>
				</FormControl>

				<FormControl mb={4}>
					<FormLabel htmlFor="message">Message</FormLabel>
					<Textarea
						rows={4}
						{...register("message", {
							required: "Message is required",
						})}
						border="2px"
						borderColor="#006699"
					/>
				</FormControl>

				<Button
					type="submit"
					isLoading={formState.isSubmitting}
					bgColor="#006699">
					Submit
				</Button>
			</Flex>
		</form>
	);
};

export default JoinUsFormView;
