import ContactUsFormView from "@/views/web/contactUs/ContactUsFormView";
import React from "react";

const page = () => {
	return (
		<>
			<div className="container mx-auto my-8">
				<h1 className="text-3xl font-bold mb-4">Contact Us</h1>
				<ContactUsFormView />
			</div>
		</>
	);
};

export default page;
