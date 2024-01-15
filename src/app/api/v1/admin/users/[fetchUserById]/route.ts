import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

interface UserResponse {
	success: boolean;
	user?: Record<string, any>; // Adjust the type based on your user model
	message?: string;
}

interface Content {
	params: {
		fetchUserById: any;
	};
}

// get user by ID
export async function GET(request: any, content: Content) {
	try {
		const userId = content.params.fetchUserById;
		const connection = await pool.getConnection();
		const [userResult] = await connection.query<RowDataPacket[]>(
			"SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?",
			[userId]
		);
		connection.release();
            // if no user found
		if (userResult.length === 0) {
			return NextResponse.json({
				success: false,
				message: "User not found with the provided ID",
			});
		}

		// Sanitize user object (remove password) before sending the response
		const { password, ...sanitizedUser } = userResult[0];

		return NextResponse.json({
			success: true,
			user: sanitizedUser,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({
			success: false,
			error: error,
		});
	}
}
