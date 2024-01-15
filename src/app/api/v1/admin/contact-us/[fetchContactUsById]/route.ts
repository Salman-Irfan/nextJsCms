import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

// Define the expected structure of the response
interface ContactUsResponse {
	success: boolean;
	contactUsRecord?: {
		id: number;
		user_name: string;
		email: string;
		phone: string;
		message: string;
		created_at: Date;
		updated_at: Date;
	};
	message?: string;
}

// Define the structure of the 'content' parameter
interface Content {
	params: {
		fetchContactUsById: number;
	};
}

// Controller function to handle the GET request for a specific contact_us record
export async function GET(
	request: any,
	content: Content
): Promise<NextResponse> {
	try {
		// Extract contact_us ID from the 'content' parameter
		const contactUsId = content.params.fetchContactUsById;

		// Establish a database connection
		const connection = await pool.getConnection();

		// Execute SQL query to fetch the contact_us record based on its ID
		const [results] = await connection.query<RowDataPacket[]>(
			"SELECT * FROM contact_us WHERE id = ? AND deleted_at IS NULL",
			[contactUsId]
		);

		connection.release();

		// Check if the result contains any records
		if (results.length === 0) {
			const response: ContactUsResponse = {
				success: false,
				message: "Contact Us record not found",
			};
			return NextResponse.json(response);
		}

		// Map the result to the desired structure
		const contactUsRecord: ContactUsResponse["contactUsRecord"] = {
			id: results[0].id,
			user_name: results[0].user_name,
			email: results[0].email,
			phone: results[0].phone,
			message: results[0].message,
			created_at: results[0].created_at,
			updated_at: results[0].updated_at,
		};

		// Build the final response
		const response: ContactUsResponse = {
			success: true,
			contactUsRecord,
		};

		// Return the JSON response
		return NextResponse.json(response);
	} catch (error) {
		// Handle errors and return an error response
		console.error(error);
		return NextResponse.json({ success: false, error: error });
	}
}
