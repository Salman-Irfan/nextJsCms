import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

interface ListItemResponse {
	success: boolean;
	listItem?: {
		id: number;
		user_id: number;
		category_id: number;
		title: string;
		description: string;
		photos: string[];
		videos: string[];
	};
	message?: string;
}

interface Content {
	params: {
		fetchListById: number;
	};
}

// Controller function to handle the GET list item by id
export async function GET(request: any, content: Content) {
	try {
		// Extract list ID from the 'content' parameter
		const listId = content.params.fetchListById;

		// Establish a database connection
		const connection = await pool.getConnection();

		// Fetch details for the list item
		const [listItemResult] = await connection.query<RowDataPacket[]>(
			"SELECT l.id as list_id, l.user_id, l.category_id, l.title, l.description, " +
				"u.user_name, c.name as category_name " +
				"FROM listings l " +
				"JOIN users u ON l.user_id = u.id " +
				"JOIN categories c ON l.category_id = c.id " +
				"WHERE l.id = ?",
			[listId]
		);

		// Check if the list item exists
		if (listItemResult.length === 0) {
			return NextResponse.json({
				success: false,
				message: "List item not found with the provided ID",
			});
		}

		// Extract details from the result
		const listItem: ListItemResponse["listItem"] = {
			id: listItemResult[0].list_id,
			user_id: listItemResult[0].user_id,
			category_id: listItemResult[0].category_id,
			title: listItemResult[0].title,
			description: listItemResult[0].description,
			photos: [],
			videos: [],
		};

		// Fetch photo URLs
		const [photosResult] = await connection.query<RowDataPacket[]>(
			"SELECT photo_url FROM photos WHERE listing_id = ?",
			[listId]
		);
		listItem.photos = photosResult.map((photo) => photo.photo_url);

		// Fetch video URLs
		const [videosResult] = await connection.query<RowDataPacket[]>(
			"SELECT video_url FROM videos WHERE listing_id = ?",
			[listId]
		);
		listItem.videos = videosResult.map((video) => video.video_url);

		// Release the database connection
		connection.release();

		// Return the successful response with list item details
		return NextResponse.json({
			success: true,
			listItem: listItem,
		});
	} catch (error) {
		// Handle errors and return an error response
		console.error(error);
		return NextResponse.json({
			success: false,
			error: error,
		});
	}
}
