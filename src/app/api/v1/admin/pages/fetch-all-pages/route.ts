import { RowDataPacket } from "mysql2";
import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";

// get all pages
export async function GET(){
    try {
        const connection = await pool.getConnection();

		// Execute SQL query to fetch records from the 'contact_us' table where deleted_at is not null
		const [results] = await connection.query<RowDataPacket[]>(
			"SELECT * FROM pages WHERE deleted_at IS NULL"
		);

		connection.release();

		// Map the results to your desired structure
		const allPagesRecords = results.map((result) => ({
			id: result.id,
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

		return NextResponse.json({
			success: true,
			allPagesRecords,
		});
    } catch (error) {
        console.error("Error retrieving contact us records:", error);
		return NextResponse.json({ success: false, message: error });
    }
}