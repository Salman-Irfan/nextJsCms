import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

// get
export async function GET() {
	try {
		const connection = await pool.getConnection();
		const [users] = await connection.query<RowDataPacket[]>(
			"SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id"
		);
		connection.release();

		// Sanitize user objects (remove passwords) before sending the response
		const sanitizedUsers = users.map((user) => {
			const { password, ...sanitizedUser } = user;
			return sanitizedUser;
		});

		return NextResponse.json({
			success: true,
			users: sanitizedUsers,
		});
	} catch (error) {
		console.error("Error retrieving users:", error);
		return NextResponse.json({ success: false, message: error });
	}
}
