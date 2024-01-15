import { NextResponse } from "next/server";
import pool from "@/lib/mySqlDbConn";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Define the expected structure of the response
interface DeleteResponse {
	success: boolean;
	message?: string;
	deletedList?: {
		id: number;
		title: string;
		description: string;
	};
}

// Define the structure of the 'content' parameter
interface DeleteContent {
	params: {
		listId: string;
	};
}

// Controller function to handle the DELETE request
export async function DELETE(
	request: any,
	content: DeleteContent
): Promise<NextResponse> {
	try {
		// Extract page ID from the 'content' parameter
		const listId = content.params.listId;

		// Establish a database connection
		const connection = await pool.getConnection();

		// try-catch block for the database delete
		try {
			// Retrieve the page values before deleting
			const [getListResult] = await connection.query<RowDataPacket[]>(
				"SELECT * FROM listings WHERE id = ?",
				[listId]
			);

			// Check if the page exists
			if (getListResult.length === 0) {
				const response: DeleteResponse = {
					success: false,
					message: "Listing not found or not deleted.",
				};
				return NextResponse.json(response);
			}

			// Save the page values before deleting
			const deletedList: DeleteResponse["deletedList"] = {
				id: getListResult[0].id,
				title: getListResult[0].title,
				description: getListResult[0].description,
				// Add other properties as needed
			};

			// Delete the page from the pages table
			const [deleteResult] = await connection.query<ResultSetHeader>(
				"DELETE FROM listings WHERE id = ?",
				[listId]
			);

			// Check if the delete was successful
			if (deleteResult.affectedRows === 0) {
				const response: DeleteResponse = {
					success: false,
					message: "List not found or not deleted.",
				};
				return NextResponse.json(response);
			}

			const response: DeleteResponse = {
				success: true,
				message: "Listing deleted successfully.",
				deletedList: deletedList,
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
