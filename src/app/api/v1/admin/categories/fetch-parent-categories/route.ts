import { RowDataPacket } from "mysql2";
import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";

// get all categories with parent_category_id is null
export async function GET() {
    try {
		const connection = await pool.getConnection();
		// Fetch all categories with parent_category_id is null
		const [parentCategoriesResult] = await connection.query<RowDataPacket[]>(
			"SELECT * FROM categories WHERE parent_category_id IS NULL"
		);
        connection.release();

        const categories = parentCategoriesResult.map((category) => ({
			id: category.id,
			parent_category_id: category.parent_category_id,
			name: category.name,
		}));
        return NextResponse.json({
			success: true,
			categories: categories,
		});
	} catch (error) {
        console.error("Error retrieving categories:", error);
		return NextResponse.json({ success: false, message: error });
    }
}
