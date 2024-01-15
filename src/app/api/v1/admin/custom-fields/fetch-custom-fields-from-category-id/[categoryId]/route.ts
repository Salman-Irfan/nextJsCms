import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

// Define the structure of the 'content' parameter
interface Content {
	params: {
		categoryId: number;
	};
}

// Controller function to handle the GET request
export async function GET(
	request: any,
	content: Content
): Promise<NextResponse> {
	try {
		// Extract city ID from the 'content' parameter
		const customFieldId = content.params.categoryId;

		// Establish a database connection
		const connection = await pool.getConnection();

		// Logic to get category by ID from the database
		const [customFieldResult] = await connection.query<RowDataPacket[]>(
			"SELECT * FROM custom_fields WHERE custom_fields.category_id = ?",
			[customFieldId]
		);

		// Release the database connection
		connection.release();

		// If no category found, return an error response
		if (customFieldResult.length === 0) {
			return NextResponse.json({
				success: false,
				message: "Custom Field not found",
			});
		}

		// Return the JSON response
		return NextResponse.json({
			success: true,
			customFieldResult: customFieldResult,
		});
	} catch (error) {
		// Handle errors and return an error response
		console.error(error);
		return NextResponse.json({
			success: false,
			error,
		});
	}
}
