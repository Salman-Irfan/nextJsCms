import { NextResponse } from "next/server";
import pool from "@/lib/mySqlDbConn";
import { writeFile } from "fs/promises";

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function POST(request: any) {
	try {
		let message = ""
		const formData = await request.formData();
		// console.log(formData);
		const insertId = formData.get("insertId");
		const galleryPictures = formData.getAll("galleryPicture");
		// console.log(insertId);
		// console.log(galleryPictures);
		const connection = await pool.getConnection();
		if (galleryPictures) {
			for (const galleryPicture of galleryPictures) {
				// convet file into buffer
				const byteData = await galleryPicture.arrayBuffer();
				const buffer = Buffer.from(byteData);
				// define path to which we want to store the file
				// Extract file extension from the original filename
				const fileExtension = galleryPicture.name.split(".").pop();
				const fileName = galleryPicture.name.split(".")[0];
				const currentDate = Date.now();
				const newFileName = `listItem_${fileName}_${currentDate}.${fileExtension}`;
				const path = `public/listItems/${newFileName}`;
				const fileLink = `/listItems/${newFileName}`; // save this fileLink in sql db
				// console.log(fileLink);
				// save it in public folder
				const saved = await writeFile(path, buffer);
				// Insert data into photos table with fileLink
				const [result] = await connection.query(
					"INSERT INTO photos (listing_id, photo_url) VALUES (?, ?)",
					[insertId, fileLink]
				);
				if (result){
					message = "gallery photos uploaded successfully"
				}
			}
		}
		connection.release();
		return NextResponse.json({
			success: true,
			message: message
		});
	} catch (error) {
		console.error("Error creating category:", error);
		return NextResponse.json({
			success: false,
			error: error,
		});
	}
}
