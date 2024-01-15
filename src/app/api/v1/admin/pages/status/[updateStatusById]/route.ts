import { NextResponse } from "next/server";
import pool from "@/lib/mySqlDbConn";
import { ResultSetHeader } from "mysql2";

interface PageStatus {
	status: string;
}

// Updated request interface for the POST controller
interface PostRequest {
	json: () => Promise<PageStatus>;
}

// Define the expected structure of the response
interface PatchResponse {
	success: boolean;
	message?: string;
}

// Define the structure of the 'content' parameter
interface PatchContent {
	params: {
		updateStatusById: string;
	};
}

// Controller function to handle the PATCH request
export async function PATCH(
	request: PostRequest,
	content: PatchContent
): Promise<NextResponse> {
	try {
		// Extract page ID from the 'content' parameter
		const pageId = content.params.updateStatusById;

		// Catching input
		const payload = await request.json();

		// Destructuring payload to get necessary data
		const { status } = payload;

		// Validate the request parameters
		if (status !== "show" && status !== "hide") {
			const response: PatchResponse = {
				success: false,
				message: "Invalid status. Status must be 'show' or 'hide'.",
			};
			return NextResponse.json(response);
		}

		// Establish a database connection
		const connection = await pool.getConnection();

		// try-catch block for the database update
		try {
			// Update the status in the pages table
			const [updateResult] = await connection.query<ResultSetHeader>(
				"UPDATE pages SET status = ? WHERE id = ?",
				[status, pageId]
			);

			// Check if the update was successful
			if (updateResult.affectedRows === 0) {
				const response: PatchResponse = {
					success: false,
					message: "Page not found or status was not updated.",
				};
				return NextResponse.json(response);
			}

			const response: PatchResponse = {
				success: true,
				message: "Page status updated successfully.",
			};

			return NextResponse.json(response);
		} catch (error) {
			console.error("Error updating page status:", error);

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
