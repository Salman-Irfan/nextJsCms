import { NextResponse } from "next/server";
import pool from "@/lib/mySqlDbConn";

export async function POST(request: { json: () => any }) {
    try {
		// catching input
		const payload = await request.json();
		const { category_id, title, name, type, placeholder } = payload;
		// Validate the request parameters
		if (!category_id || !title || !name || !type || !placeholder) {
			return NextResponse.json({
				success: false,
				message: "all fields are required",
			});
		}
        const connection = await pool.getConnection();
        const [result] = await connection.query(
			"INSERT INTO custom_fields ( category_id, title, name, type, placeholder) VALUES (?, ?, ?, ?, ?)",
			[category_id, title, name, type, placeholder]
		);
        connection.release();
        return NextResponse.json({
			success: true,
			message: "Custom field created successfully",
			data: payload,
		});
	} catch (error) {
        console.error("Error creating category:", error);
		return NextResponse.json({
			success: false,
			error: error,
		});
    }
}
