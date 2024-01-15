import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

// Define the expected structure of the response
interface JoinUsResponse {
	success: boolean;
	joinUsRecord?: {
		id: number;
		user_name: string;
		email: string;
		phone: string;
		message: string;
		status: string;
		created_at: Date;
		updated_at: Date;
	};
	message?: string;
}

// Define the structure of the 'content' parameter
interface Content {
	params: {
		fetchJoinUsById: number;
	};
}

// Controller function to handle the GET request for a specific contact_us record
export async function GET(
	request: any,
	content: Content
): Promise<NextResponse> {
    try {
		// Extract join_us ID from the 'content' parameter
		const joinUsId = content.params.fetchJoinUsById;

		// Establish a database connection
		const connection = await pool.getConnection();
		// Execute SQL query to fetch the contact_us record based on its ID
		const [results] = await connection.query<RowDataPacket[]>(
			"SELECT * FROM join_us WHERE id = ? AND deleted_at IS NULL",
			[joinUsId]
		);

		connection.release();
		// Check if the result contains any records
		if (results.length === 0) {
			const response: JoinUsResponse = {
				success: false,
				message: "Join Us record not found",
			};
			return NextResponse.json(response);
		}
		// Map the result to the desired structure
		const joinUsRecord: JoinUsResponse["joinUsRecord"] = {
			id: results[0].id,
			user_name: results[0].user_name,
			email: results[0].email,
			phone: results[0].phone,
			message: results[0].message,
			status: results[0].status,
			created_at: results[0].created_at,
			updated_at: results[0].updated_at,
		};
		// Build the final response
		const response: JoinUsResponse = {
			success: true,
			joinUsRecord,
		};

		// Return the JSON response
		return NextResponse.json(response);
	} catch (error) {
		// Handle errors and return an error response
		console.error(error);
		return NextResponse.json({ success: false, error: error });
	}
}
