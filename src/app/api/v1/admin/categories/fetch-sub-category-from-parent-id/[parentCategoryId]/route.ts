import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

// Define the structure of the 'content' parameter
interface Content {
	params: {
		parentCategoryId: number;
	};
}

// get all categories with parent_category_id is user defined
// Fetch all categories with parent_category_id is user defined
export async function GET(request: any, content: Content) {
	try {
		// Extract category ID from the 'content' parameter
		const parentCategoryId = content.params.parentCategoryId;
		console.log(parentCategoryId);

		const connection = await pool.getConnection();

		try {
			// Fetch categories based on user-defined parentCategoryId
			const [subCategoriesResult] = await connection.query<
				RowDataPacket[]
			>("SELECT * FROM categories WHERE parent_category_id = ?", [
				parentCategoryId,
			]);

			// If no categories found, return an error response
			if (subCategoriesResult.length === 0) {
				return NextResponse.json({
					success: false,
					message:
						"Categories not found for the specified parent category ID",
				});
			}

			// Map the categories
			const categories = subCategoriesResult.map((category) => ({
				id: category.id,
				parent_category_id: category.parent_category_id,
				name: category.name,
			}));

			// Return the JSON response with categories
			return NextResponse.json({
				success: true,
				categories: categories,
			});
		} finally {
			// Ensure the connection is always released
			connection.release();
		}
	} catch (error) {
		console.error("Error retrieving categories:", error);
		return NextResponse.json({
			success: false,
			message: error,
		});
	}
}
