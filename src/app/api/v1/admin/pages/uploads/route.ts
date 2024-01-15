import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import fs from "fs";

export async function POST(request: any) {
	try {
		// Ensure the directory exists
		const directoryPath = "public/pages/uploads";
		if (!fs.existsSync(directoryPath)) {
			fs.mkdirSync(directoryPath, { recursive: true });
		}

		// Main controller logic
		const formData = await request.formData();
		const uploadField = formData.get("upload");
		const byteData = await uploadField.arrayBuffer();
		const buffer = Buffer.from(byteData);

		// Extract file extension from the original filename
		const fileExtension = uploadField.name.split(".").pop();
		const fileName = uploadField.name.split(".")[0];
		const currentDate = Date.now();
		const newFileName = `pages_${fileName}_${currentDate}.${fileExtension}`;
		const path = `public/pages/uploads/${newFileName}`;
		const fileLink = `/pages/uploads/${newFileName}`;

		// Save the file
		const saved = writeFile(path, buffer);


		// Return a JSON response indicating success
		return NextResponse.json({
			uploaded: 1,
			fileName: newFileName,
			url: fileLink,
		});
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json({
			success: false,
			error: "Unexpected error",
		});
	}
}
