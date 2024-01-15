import { NextResponse } from "next/server";
import pool from "@/lib/mySqlDbConn";
import { ResultSetHeader } from "mysql2";
import { writeFile } from "fs/promises";

// Controller function to handle the PUT request
// ... (other imports and code)

// Controller function to handle the PUT request
export async function PUT(request: any, content: any) {
	const connection = await pool.getConnection();

	try {
		const listId = content.params.id;
		await connection.beginTransaction();
		let mainPictureLink = "";
		let galleryImageLink = "";
		let galleryImagesMesage = "";
		let videoUrlsMesage = "";
		const formData = await request.formData();
		// data extraction
		const category_id = formData.get("category_id");
		const title = formData.get("title");
		const description = formData.get("description");
		const shortDescription = formData.get("shortDescription");
		const address = formData.get("address");
		const twitter = formData.get("twitter");
		const map_url = formData.get("map_url");
		const linkedin = formData.get("linkedin");
		const youtube = formData.get("youtube");
		const instagram = formData.get("instagram");
		const facebook = formData.get("facebook");
		const site_url = formData.get("site_url");
		const city_id = formData.get("city_id");
		const tags = formData.get("tags");
		const user_name = formData.get("user_name");
		const email = formData.get("email");
		const phone = formData.get("phone");
		const is_featured = formData.get("is_featured");
		const mainPicture = formData.get("mainPicture");
		// gallery images
		// Iterate over formData keys
		const galleryImages: any = [];
		formData.forEach((value: any, key: any) => {
			// Check if the key corresponds to galleryImages
			if (key.startsWith("galleryImages[")) {
				galleryImages.push(value);
			}
		});
		// main image handling
		if (mainPicture && mainPicture.name) {
			const byteData = await mainPicture.arrayBuffer();
			const buffer = Buffer.from(byteData);
			// define path to which we want to store the file
			// Extract file extension from the original filename
			const fileExtension = mainPicture.name.split(".").pop();
			const fileName = mainPicture.name.split(".")[0];
			const currentDate = Date.now();
			const newFileName = `listItem_${fileName}_${currentDate}.${fileExtension}`;
			const path = `public/listItems/${newFileName}`;
			const fileLink = `/listItems/${newFileName}`; // save this fileLink in sql db
			// updation in db
			const [mainPictureresult] = await connection.query(
				"UPDATE listings SET main_picture = ? WHERE id = ?",
				[fileLink, listId]
			);
			// save it in public folder
			const saved = await writeFile(path, buffer);
		}

		// updation in db
		const [result] = await connection.query(
			"UPDATE listings SET category_id = ?, title = ?, description = ?, short_description = ?, address = ?, twitter = ?, map_url = ?, linkedin =?, youtube =?, instagram = ?, facebook = ?, site_url = ?, city_id = ?, tags = ?, user_name = ?, email = ?, phone = ?,  is_featured = ? WHERE id = ?",
			[
				category_id,
				title,
				description,
				shortDescription,
				address,
				twitter,
				map_url,
				linkedin,
				youtube,
				instagram,
				facebook,
				site_url,
				city_id,
				tags,
				user_name,
				email,
				phone,
				is_featured,
				listId,
			]
		);
			
		// update gallery pictures
		if (galleryImages && galleryImages.length > 0) {
			const [deletePhotoResult] = await connection.query(
				"DELETE FROM photos WHERE listing_id = ?",
				[listId]
			);
			for (let galleryImage of galleryImages) {
				const byteData = await galleryImage.arrayBuffer();
				const buffer = Buffer.from(byteData);
				// define path to which we want to store the file
				// Extract file extension from the original filename
				const fileExtension = galleryImage.name.split(".").pop();
				const fileName = galleryImage.name.split(".")[0];
				const currentDate = Date.now();
				const newFileName = `listItem_${fileName}_${currentDate}.${fileExtension}`;
				const path = `public/listItems/${newFileName}`;
				const fileLink = `/listItems/${newFileName}`; // save this fileLink in sql db
				galleryImageLink = fileLink;
				// save it in public folder
				const saved = await writeFile(path, buffer);
				// updation in photos table
				// insertion in db
				const [galleryUpdateResult] = await connection.query(
					"INSERT INTO photos (listing_id, photo_url) VALUES (?, ?)",
					[listId, galleryImageLink]
				);
				if (galleryUpdateResult) {
					galleryImagesMesage = "images update successfully";
				}
			}
		}
		// Delete existing video URLs for the specific listId
		const [deleteVideoResult] = await connection.query(
			"DELETE FROM videos WHERE listing_id = ?",
			[listId]
		);
		// update the existing video urls
		// capturing video urls
		const videoUrls: string[] = [];
		formData.forEach((value: any, key: any) => {
			if (key.startsWith("video")) {
				// Split the comma-separated string into an array of values
				const valuesArray = value.split(",");

				// Push each value into the videoUrls array
				videoUrls.push(...valuesArray);
			}
		});
		for (const videoUrl of videoUrls) {
			const [videoUpdateResult] = await connection.query(
				"INSERT INTO videos (listing_id, video_url) VALUES (?, ?)",
				[listId, videoUrl]
			);
			if (videoUpdateResult) {
				videoUrlsMesage = "video urls update successfully";
			}
		}
		// await connection.query("DELETE FROM videos WHERE listing_id = ?", [listId]);

		await connection.commit();

		return NextResponse.json({
			success: true,
			message: "List item updated successfully",
			result: result,
			galleryImagesMesage,
			videoUrlsMesage,
		});
	} catch (error) {
		await connection.rollback();
		console.error("Error updating list item:", error);

		return NextResponse.json({
			success: false,
			error: error,
		});
	} finally {
		connection.release();
	}
}
