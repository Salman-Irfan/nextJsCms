import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

// Define the structure of the 'content' parameter
interface Content {
	params: {
		listingId: number;
	};
}

// Controller function to handle the GET request for a specific page record
export async function GET(
	request: any,
	content: Content
): Promise<NextResponse> {
	try {
		// Extract page ID from the 'content' parameter
		const listingId = content.params.listingId;
		// Establish a database connection
		const connection = await pool.getConnection();

		// Execute SQL query to fetch the page record and join with categories and cities tables
		const [results] = await connection.query<RowDataPacket[]>(
			"SELECT listings.*, categories.name as category_name, cities.name as city_name, cities.country " +
				"FROM listings " +
				"LEFT JOIN categories ON listings.category_id = categories.id " +
				"LEFT JOIN cities ON listings.city_id = cities.id " +
				"WHERE listings.id = ? AND listings.deleted_at IS NULL",
			[listingId]
		);

		connection.release();

		// Check if the result contains any records
		if (results.length === 0) {
			return NextResponse.json({
				success: false,
				message: `listing id ${listingId} not found`,
			});
		}
		// Fetch photo URLs
		const [photosResult] = await connection.query<RowDataPacket[]>(
			"SELECT photo_url FROM photos WHERE listing_id = ?",
			[listingId]
		);
		// if photo urls found
		if (photosResult.length > 0) {
			results[0].photoUrls = photosResult.map((photo) => photo.photo_url);
		}
		// Fetch video URLs
		const [videosResult] = await connection.query<RowDataPacket[]>(
			"SELECT video_url FROM videos WHERE listing_id = ?",
			[listingId]
		);
		// if video urls found
		if (videosResult.length > 0) {
			results[0].videoUrls = videosResult.map((video) => video.video_url);
		}
		// Return the JSON response
		return NextResponse.json({
			success: true,
			results: results,
		});
	} catch (error) {
		// Handle errors and return an error response
		console.error(error);
		return NextResponse.json({ success: false, error: error });
	}
}
