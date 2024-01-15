import { RowDataPacket } from "mysql2";
import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";

// Define the expected structure of the response
interface GetPageNamesResponse {
	success: boolean;
	pageNames?: string[];
	pageSlugs?: string[];
	message?: string;
}

// Controller function to handle the GET request
export async function GET(): Promise<NextResponse> {
	try {
		// Establish a database connection
		const connection = await pool.getConnection();

		// try-catch block for fetching page names
		try {
			// Fetch all page names from the pages table
			const [pageNamesResult] = await connection.query<RowDataPacket[]>(
				"SELECT page_name, page_slug FROM pages WHERE status = 'show'"
			);

			// Map the result to extract page names
			const pageNames: string[] = pageNamesResult.map(
				(row) => row.page_name
			);

			// Build the response
			const response: GetPageNamesResponse = {
				success: true,
				pageNames: pageNames,
			};

			// Return the JSON response
			return NextResponse.json(response);
		} catch (error) {
			console.error("Error fetching page names:", error);

			// Return an error response
			const response: GetPageNamesResponse = {
				success: false,
				message: "Error fetching page names",
			};

			return NextResponse.json(response);
		} finally {
			// Release the database connection
			connection.release();
		}
	} catch (error) {
		// Handle errors and return an error response
		console.error(error);
		return NextResponse.json({
			success: false,
			message: error,
		});
	}
}
