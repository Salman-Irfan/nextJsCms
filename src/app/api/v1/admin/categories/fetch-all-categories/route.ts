import { RowDataPacket } from "mysql2";
import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";

// get all categories
export async function GET() {
	try {
		const connection = await pool.getConnection();

		// Fetch all parent categories
		const [parentCategoriesResult] = await connection.query<
			RowDataPacket[]
		>("SELECT * FROM categories WHERE parent_category_id IS NULL");

		const categories = [];

		// Loop through each parent category
		for (const parentCategory of parentCategoriesResult) {
			// Add parent category to the list
			categories.push({
				id: parentCategory.id,
				parent_category_id: parentCategory.parent_category_id,
				name: parentCategory.name,
				parent_category_name: parentCategory.parent_category_name,
			});

			// Fetch and add its subcategories
			const [subCategoriesResult] = await connection.query<
				RowDataPacket[]
			>("SELECT * FROM categories WHERE parent_category_id = ?", [
				parentCategory.id,
			]);

			categories.push(...subCategoriesResult);
			
		}

		connection.release();

		return NextResponse.json({
			success: true,
			categories: categories,
		});
	} catch (error) {
		console.error("Error retrieving categories:", error);
		return NextResponse.json({ success: false, message: error });
	}
}
