import pool from "@/lib/mySqlDbConn";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

// get all listings
export async function GET() {
	try {
		const connection = await pool.getConnection();

		// Fetch all listings with user and category information
		const [listingsResult] = await connection.query<RowDataPacket[]>(
			"SELECT l.id as listing_id, l.title, l.description, " +
				"u.id as user_id, u.user_name, " +
				"c.id as category_id, c.name as category_name " +
				"FROM listings l " +
				"JOIN users u ON l.user_id = u.id " +
				"JOIN categories c ON l.category_id = c.id"
		);

		// Iterate through the listings to fetch photo and video URLs
		const listingsWithMedia = await Promise.all(
			listingsResult.map(async (listing) => {
				// Fetch photo URLs
				const [photosResult] = await connection.query<RowDataPacket[]>(
					"SELECT photo_url FROM photos WHERE listing_id = ?",
					[listing.listing_id]
				);

				// Fetch video URLs
				const [videosResult] = await connection.query<RowDataPacket[]>(
					"SELECT video_url FROM videos WHERE listing_id = ?",
					[listing.listing_id]
				);

				// Append photo and video URLs to the listing
				return {
					...listing,
					photos: photosResult.map((photo) => photo.photo_url),
					videos: videosResult.map((video) => video.video_url),
				};
			})
		);

		connection.release();

		return NextResponse.json({
			success: true,
			listings: listingsWithMedia,
		});
	} catch (error) {
		console.error("Error retrieving listings:", error);
		return NextResponse.json({ success: false, message: error });
	}
}
