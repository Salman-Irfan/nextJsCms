import { NextResponse } from "next/server";
import pool from "@/lib/mySqlDbConn";
import { ResultSetHeader } from "mysql2";
import slugify from "slugify";

// Define the expected structure of the response
interface PutResponse {
	success: boolean;
	message?: string;
	data?: object;
}

// Define the structure of the 'content' parameter
interface PutContent {
	params: {
		updatePageById: string;
	};
}

// Define the structure of the request payload
interface PageUpdatePayload {
	page_name: string;
	page_title: string;
	page_content: string;
	seo_title: string;
	seo_description: string;
	seo_keywords: string;
}

// Controller function to handle the PUT request
export async function PUT(
	request: any,
	content: PutContent
): Promise<NextResponse> {
	try {
		// Extract page ID from the 'content' parameter
		const pageId = content.params.updatePageById;

		// Catching input
		const payload: PageUpdatePayload = await request.json();

		// Destructuring payload to get necessary data
		const { page_name, page_title, page_content, seo_title, seo_description, seo_keywords } = payload;

		// Generate a slug from the page name
		const page_slug = slugify(page_name, { lower: true });

		// Establish a database connection
		const connection = await pool.getConnection();

		// try-catch block for the database update
		try {
			// Update the page in the 'pages' table
			const [updateResult] = await connection.query<ResultSetHeader>(
				"UPDATE pages SET page_name = ?, page_title = ?, page_content = ?, page_slug = ?, seo_title = ?, seo_description = ?, seo_keywords = ? WHERE id = ?",
				[page_name, page_title, page_content, page_slug, seo_title, seo_description, seo_keywords, pageId]
			);

			// Check if the update was successful
			if (updateResult.affectedRows === 0) {
				const response: PutResponse = {
					success: false,
					message: "Page not found or data was not updated.",
				};
				return NextResponse.json(response);
			}

			const response: PutResponse = {
				success: true,
				message: "Page data updated successfully.",
				data: payload
			};

			return NextResponse.json(response);
		} catch (error) {
			console.error("Error updating page data:", error);

			return NextResponse.json({
				success: false,
				error: error,
			});
		} finally {
			// Release the database connection
			connection.release();
		}
	} catch (error) {
		// Handle errors and return an error response
		console.error(error);
		return NextResponse.json({
			success: false,
			error: error,
		});
	}
}
