import { RowDataPacket } from "mysql2";
import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";

// get all join us
export async function GET() {
    try {
        const connection = await pool.getConnection();

		// Execute SQL query to fetch records from the 'join_us' table where deleted_at is not null
		const [results] = await connection.query<RowDataPacket[]>(
			"SELECT * FROM join_us WHERE deleted_at IS NULL"
		);

		connection.release();

		// Map the results to your desired structure
		const joinUsRecords = results.map((result) => ({
			id: result.id,
			user_name: result.user_name,
			email: result.email,
			phone: result.phone,
			message: result.message,
            status: result.status,
			created_at: result.created_at,
			updated_at: result.updated_at,
		}));

		return NextResponse.json({
			success: true,
			joinUsRecords,
		});
    } catch (error) {
        console.error("Error retrieving join us records:", error);
		return NextResponse.json({ success: false, message: error });
    }
}
