import JoinUsFormView from "@/views/web/joinUs/JoinUsFormView";
import React from "react";

const page = () => {
	return (
		<>
			<div className="container mx-auto my-8">
				<h1 className="text-3xl font-bold mb-4">Join us page</h1>
				<JoinUsFormView/>
			</div>
		</>
	);
};

export default page;
