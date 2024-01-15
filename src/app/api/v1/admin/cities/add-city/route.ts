import { NextResponse } from 'next/server';
import pool from '@/lib/mySqlDbConn';

export async function POST(request: { json: () => any }) {
	try {
        // catching input
        const payload = await request.json();
		const { name, country } = payload;

		// Validate the request parameters
		if (!name) {
			return NextResponse.json({
				success: false,
				message: "city name is required" })
		}
        const connection = await pool.getConnection();
        const [result] = await connection.query(
			"INSERT INTO cities ( name, country) VALUES (?, ?)",
			[ name, country]
		);
		connection.release();
		
        return NextResponse.json({
			success: true,
			message: "Category created successfully",
			data: payload
		});
		
	} catch (error) {
		console.error("Error creating category:", error);
		return NextResponse.json({
			success: false,
			error: error,
		});
	}
}
