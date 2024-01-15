import { NextResponse } from "next/server";
import pool from "@/lib/mySqlDbConn";
import { getLoggedInUserId } from "@/utils/getLoggedInUserId";
import { getLoggedInUserRoleId } from "@/utils/getLoggedInUserRoleId";
import { ResultSetHeader } from "mysql2";
import { writeFile } from "fs/promises";

export async function POST(request: any) {
	try {
		// getting userId
		// const authorizationHeader = request.headers.get("Authorization");
		// const userId = await getLoggedInUserId(authorizationHeader);
		// Fetch role_id using the utility function
		// const loggedInUserRoleId = await getLoggedInUserRoleId(userId);

		// Check if loggedInUserRoleId is not 1 or 2, return unauthorized
		// if (
		// 	loggedInUserRoleId === undefined ||
		// 	![1, 2].includes(loggedInUserRoleId)
		// ) {
		// 	return NextResponse.json({
		// 		success: false,
		// 		message: "Unauthorized - User does not have the required role",
		// 	});
		// }

		// Start a transaction for atomicity
		const connection = await pool.getConnection();
		await connection.beginTransaction();
		// main controller logic
		// const payload = await request.json();
		// const {
		// 	category_id, // done
		// 	title, // done
		// 	description, // done
		// 	address, // done
		// 	twitter, // done
		// 	map_url, // done
		// 	linkedin, // done
		// 	youtube, // done
		// 	instagram, // done
		// 	facebook, // done
		// 	site_url, // done
		// 	city_id, // done
		// 	tags, // done
		// 	user_name,
		// 	email,
		// 	phone,
		// 	is_featured,
		// } = payload;
		// Validate the request parameters
		// if (!title || !description) {
		// 	return NextResponse.json({
		// 		success: false,
		// 		message: "title and  description are required",
		// 	});
		// }
		// insertion in db
		// const [result] = await connection.query(
		// 	"INSERT INTO listings (category_id, title, description, address, twitter, map_url, linkedin, youtube, instagram, facebook, site_url, city_id, tags, user_name,email, phone, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		// 	[
		// 		category_id,
		// 		title,
		// 		description,
		// 		address,
		// 		twitter,
		// 		map_url,
		// 		linkedin,
		// 		youtube,
		// 		instagram,
		// 		facebook,
		// 		site_url,
		// 		city_id,
		// 		tags,
		// 		user_name,
		// 		email,
		// 		phone,
		// 		is_featured,
		// 	]
		// );
		// const {insertId}:any = result
		const formData = await request.formData();

		// Access other form fields
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
		// const photo_urls = formData.getAll("photo_urls");
		// const video_urls = formData.getAll("video_urls");

		// console.log(
		// 	`category id: ${category_id}`,
		// 	`title: ${title}`,
		// 	description,
		// 	address,
		// 	twitter,
		// 	map_url,
		// 	linkedin,
		// 	youtube,
		// 	facebook,
		// 	instagram,
		// 	site_url,
		// 	city_id,
		// 	tags,
		// 	user_name,
		// 	email,
		// 	phone,
		// 	is_featured,
		// 	mainPicture
		// );
		// image handling
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
		// console.log(fileLink)
		// save it in public folder
		const saved = await writeFile(path, buffer);
		// insertion in db
		const [result] = await connection.query(
			"INSERT INTO listings (category_id, title, description, short_description, address, twitter, map_url, linkedin, youtube, instagram, facebook, site_url, city_id, tags, user_name,email, phone, is_featured, main_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
				fileLink,
			]
		);
		const { insertId }: any = result;
		// Iterate over files
		// if user uploads image files

		// Rest of your logic...

		// Validate the request parameters
		// if (!category_id || !title || !description) {
		// 	return NextResponse.json({
		// 		success: false,
		// 		message:
		// 			"You must have to fill category_id, title, and description",
		// 	});
		// }

		// try catch for db insert
		try {
			// Insert data into listings table
			// const [listingResult] = await connection.query<ResultSetHeader>(
			// 	"INSERT INTO listings (user_id, category_id, title, description) VALUES (?, ?, ?, ?);",
			// 	[userId, category_id, title, description]
			// );
			// Extracting insertId from the result
			// const insertId = listingResult.insertId;
			// Insert data into photos table
			// if (photo_urls) {
			// 	for (const photo_url of photo_urls) {
			// 		// Handle each file as needed
			// 		// You can process, save, or upload each file here
			// 		// convet file into buffer
			// 		const byteData = await photo_url.arrayBuffer();
			// 		const buffer = Buffer.from(byteData);
			// 		// define path to which we want to store the file
			// 		// Extract file extension from the original filename
			// 		const fileExtension = photo_url.name.split(".").pop();
			// 		const fileName = photo_url.name.split(".")[0];
			// 		const currentDate = Date.now();
			// 		const newFileName = `listItem_${fileName}_${currentDate}.${fileExtension}`;
			// 		const path = `public/listItems/${newFileName}`;
			// 		const fileLink = `listItems/${newFileName}`; // save this fileLink in sql db
			// 		console.log(fileLink);
			// 		// save it in public folder
			// 		const saved = await writeFile(path, buffer);
			// 		// Insert data into photos table with fileLink
			// 		await connection.query(
			// 			"INSERT INTO photos (listing_id, photo_url) VALUES (?, ?)",
			// 			[insertId, fileLink]
			// 		);
			// 	}
			// }
			// Insert data into videos table
			// for (const video_url of video_urls) {
			// 	await connection.query(
			// 		"INSERT INTO videos (listing_id, video_url) VALUES (?, ?)",
			// 		[insertId, video_url]
			// 	);
			// }
			// // Commit the transaction
			// await connection.commit();
			// return NextResponse.json({
			// 	success: true,
			// 	message: "List item created successfully",
			// 	data: payload,
			// 	result: result
			// });
		} catch (error) {
			// Rollback the transaction in case of an error
			await connection.rollback();
			console.error("Error creating list item:", error);
			return NextResponse.json({
				success: false,
				error: error,
			});
		} finally {
			// Release the connection
			connection.release();
		}
		// Commit the transaction
		await connection.commit();
		// Release the connection
		connection.release();
		return NextResponse.json({
			success: true,
			message: "List item created successfully",
			// data: payload,
			result: result,
			insertId: insertId,
		});
	} catch (error) {
		console.error("Error creating category:", error);
		return NextResponse.json({
			success: false,
			error: error,
		});
	}
}
