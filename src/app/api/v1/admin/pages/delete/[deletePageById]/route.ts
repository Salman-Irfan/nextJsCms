import { NextResponse } from "next/server";
import pool from "@/lib/mySqlDbConn";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Define the expected structure of the response
interface DeleteResponse {
	success: boolean;
	message?: string;
	deletedPage?: {
		id: number;
		page_name: string;
		page_title: string;
		page_content: string;
	};
}

// Define the structure of the 'content' parameter
interface DeleteContent {
	params: {
		deletePageById: string;
	};
}

// Controller function to handle the DELETE request
export async function DELETE(
	request: any,
	content: DeleteContent
): Promise<NextResponse> {
	try {
		// Extract page ID from the 'content' parameter
		const pageId = content.params.deletePageById;

		// Establish a database connection
		const connection = await pool.getConnection();

		// try-catch block for the database delete
		try {
			// Retrieve the page values before deleting
			const [getPageResult] = await connection.query<RowDataPacket[]>(
				"SELECT * FROM pages WHERE id = ?",
				[pageId]
			);

			// Check if the page exists
			if (getPageResult.length === 0) {
				const response: DeleteResponse = {
					success: false,
					message: "Page not found or not deleted.",
				};
				return NextResponse.json(response);
			}

			// Save the page values before deleting
			const deletedPage: DeleteResponse["deletedPage"] = {
				id: getPageResult[0].id,
				page_name: getPageResult[0].page_name,
				page_title: getPageResult[0].page_title,
				page_content: getPageResult[0].page_content,
				// Add other properties as needed
			};

			// Delete the page from the pages table
			const [deleteResult] = await connection.query<ResultSetHeader>(
				"DELETE FROM pages WHERE id = ?",
				[pageId]
			);

			// Check if the delete was successful
			if (deleteResult.affectedRows === 0) {
				const response: DeleteResponse = {
					success: false,
					message: "Page not found or not deleted.",
				};
				return NextResponse.json(response);
			}

			const response: DeleteResponse = {
				success: true,
				message: "Page deleted successfully.",
				deletedPage: deletedPage,
			};

			return NextResponse.json(response);
		} catch (error) {
			console.error("Error deleting page:", error);

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
