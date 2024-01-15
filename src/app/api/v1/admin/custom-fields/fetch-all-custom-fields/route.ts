import { RowDataPacket } from "mysql2";
import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";

// get all categories
export async function GET() {
	try {
		const connection = await pool.getConnection();

		// Fetch all categories with parent category names
		const [customFields] = await connection.query<RowDataPacket[]>(
			"SELECT * FROM custom_fields"
		);

		connection.release();

		return NextResponse.json({
			success: true,
			customFields: customFields,
		});
	} catch (error) {
		console.error("Error retrieving categories:", error);
		return NextResponse.json({ success: false, message: error });
	}
}
