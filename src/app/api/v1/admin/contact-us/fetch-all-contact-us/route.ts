import { RowDataPacket } from "mysql2";
import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";

// get all contact us
export async function GET() {
	try {
		const connection = await pool.getConnection();

		// Execute SQL query to fetch records from the 'contact_us' table where deleted_at is not null
		const [results] = await connection.query<RowDataPacket[]>(
			"SELECT * FROM contact_us WHERE deleted_at IS NULL"
		);

		connection.release();

		// Map the results to your desired structure
		const contactUsRecords = results.map((result) => ({
			id: result.id,
			user_name: result.user_name,
			email: result.email,
			phone: result.phone,
			message: result.message,
			created_at: result.created_at,
			updated_at: result.updated_at,
		}));

		return NextResponse.json({
			success: true,
			contactUsRecords,
		});
	} catch (error) {
		console.error("Error retrieving contact us records:", error);
		return NextResponse.json({ success: false, message: error });
	}
}
