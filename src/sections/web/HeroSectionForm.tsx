import React from "react";
import { RiSearch2Line } from "react-icons/ri";

const HeroSectionForm = () => {
	return (
		<>
			<form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
				<div className="mb-4">
					<label
						htmlFor="keyword"
						className="block text-gray-700 text-sm font-bold mb-2">
						Keyword
					</label>
					<input
						type="text"
						id="keyword"
						name="keyword"
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="category"
						className="block text-gray-700 text-sm font-bold mb-2">
						Category
					</label>
					<div className="relative">
						<input
							type="text"
							id="category"
							name="category"
							className="w-full p-2 border border-gray-300 rounded-md"
						/>
						<div className="absolute right-2 top-2 text-gray-500">
							<RiSearch2Line />
						</div>
					</div>
				</div>

				<div className="mb-4">
					<label
						htmlFor="city"
						className="block text-gray-700 text-sm font-bold mb-2">
						City
					</label>
					<div className="relative">
						<input
							type="text"
							id="city"
							name="city"
							className="w-full p-2 border border-gray-300 rounded-md"
						/>
						<div className="absolute right-2 top-2 text-gray-500">
							<RiSearch2Line />
						</div>
					</div>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700">
					Find Provider
				</button>
			</form>
		</>
	);
};

export default HeroSectionForm;
