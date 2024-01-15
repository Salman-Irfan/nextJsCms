import { NextResponse } from "next/server";
import pool from "@/lib/mySqlDbConn";

export async function POST(request: any) {
	try {
		// Catching input
		const payload = await request.json();
		// destructuring on payload
		const { insertId, videoUrls } = payload;
		// if video urls exists
		if (videoUrls.length > 0) {
			const connection = await pool.getConnection();
			// loop through the video urls
			for (const videoUrl of videoUrls) {
				// Insert data into videos table with fileLink
				const [result] = await connection.query(
					"INSERT INTO videos (listing_id, video_url) VALUES (?, ?)",
					[insertId, videoUrl]
				);
			}
			connection.release();
		}
		return NextResponse.json({
			success: true,
			payload: payload,
            message: 'video urls added successfully'
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			success: false,
			error: error,
		});
	}
}
