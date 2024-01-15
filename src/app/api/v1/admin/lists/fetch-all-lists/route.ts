import { RowDataPacket } from "mysql2";
import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";

// get all listings
export async function GET() {
	try {
		const connection = await pool.getConnection();
		// Fetch all clistings with parent category names
		const [listingsResult] = await connection.query<RowDataPacket[]>(
			`SELECT l.id, l.title, l.main_picture, l.user_name, l.city_id, c.name AS city_name, c.country, l.created_at
            FROM listings l
            JOIN cities c ON l.city_id = c.id`
		);
		connection.release();
		const listings = listingsResult.map((listing) => ({
			id: listing.id,
			title: listing.title,
			main_picture: listing.main_picture,
			user_name: listing.user_name,
			city_id: listing.city_id,
			city_name: listing.city_name,
			country: listing.country,
			created_at: listing.created_at,
		}));
		return NextResponse.json({
			success: true,
			listings: listings,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			success: true,
			error: error,
		});
	}
}
