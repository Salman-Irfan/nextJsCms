import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

// Define the expected structure of the response
interface CategoryResponse {
	success: boolean;
	category?: {
		id: number;
		name: string;
		parent_category_id: number | null;
		parent_category_name?: string;
	};
	message?: string;
}

// Define the structure of the 'content' parameter
interface Content {
	params: {
		fetchCategoryById: number;
	};
}

// Controller function to handle the GET request
export async function GET(
	request: any,
	content: Content
): Promise<NextResponse> {
	try {
		// Extract category ID from the 'content' parameter
		const categoryId = content.params.fetchCategoryById;

		// Establish a database connection
		const connection = await pool.getConnection();

		// Logic to get category by ID from the database
		const [categoryResult] = await connection.query<RowDataPacket[]>(
			"SELECT c.*, pc.name as parent_category_name FROM categories c LEFT JOIN categories pc ON c.parent_category_id = pc.id WHERE c.id = ?",
			[categoryId]
		);

		// Release the database connection
		connection.release();

		// If no category found, return an error response
		if (categoryResult.length === 0) {
			const response: CategoryResponse = {
				success: false,
				message: "Category not found",
			};
			return NextResponse.json(response);
		}

		// Map the database result to the desired structure
		const category: CategoryResponse["category"] = {
			id: categoryResult[0].id,
			name: categoryResult[0].name,
			parent_category_id: categoryResult[0].parent_category_id,
			// Include additional properties if needed
		};

		// Include parent_category_name if parent_category_id is not null
		if (categoryResult[0].parent_category_id !== null) {
			category.parent_category_name =
				categoryResult[0].parent_category_name;
		}

		// Build the final response
		const response: CategoryResponse = {
			success: true,
			category: category,
		};

		// Return the JSON response
		return NextResponse.json(response);
	} catch (error) {
		// Handle errors and return an error response
		console.error(error);
		return NextResponse.json({
			success: false,
			error,
		});
	}
}
