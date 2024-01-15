import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import pool from "@/lib/mySqlDbConn";

// Define the expected structure of the response
interface PageRecord {
	page_name: string;
	page_title: string;
	page_content: string;
	status: string;
	seo_title: string;
	seo_description: string;
	seo_keywords: string;
	created_at: string;
	updated_at: string;
}

interface PageResponse {
	success: boolean;
	pageRecords?: PageRecord[];
	message?: string;
}

// Define the structure of the 'content' parameter
interface Content {
	params: {
		getPageBySlug: string;
	};
}


// Controller function to handle the GET request for a specific page record
export async function GET(
	request: any,
	content: Content
): Promise<NextResponse> {
	try {
		// Extract page slug from the 'content' parameter
		const pageSlug = content.params.getPageBySlug;

		// Establish a database connection
		const connection = await pool.getConnection();

		// Execute SQL query to fetch the page record based on its slug
		const [results] = await connection.query<RowDataPacket[]>(
			"SELECT * FROM pages WHERE page_slug = ? AND status = 'show' AND deleted_at IS NULL",
			[pageSlug]
		);

		connection.release();

		// Check if the result contains any records
		if (results.length === 0) {
			const response: PageResponse = {
				success: false,
				message: "Page record not found",
			};
			return NextResponse.json(response);
		}

		// Map the results to your desired structure
		const pageRecords: PageRecord[] = results.map((result) => ({
			page_name: result.page_name,
			page_title: result.page_title,
			page_content: result.page_content,
			status: result.status,
			seo_title: result.seo_title,
			seo_description: result.seo_description,
			seo_keywords: result.seo_keywords,
			created_at: result.created_at,
			updated_at: result.updated_at,
		}));

		// Build the final response
		const response: PageResponse = {
			success: true,
			pageRecords,
		};

		// Return the JSON response
		return NextResponse.json(response);
	} catch (error) {
		// Handle errors and return an error response
		console.error(error);
		return NextResponse.json({
			success: false,
			error: error,
		});
	}
}
