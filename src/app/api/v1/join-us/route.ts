import { NextResponse } from "next/server";
import pool from "@/lib/mySqlDbConn";

interface JoinUsRequest {
	user_name: string;
	email: string;
	phone: string;
	message?: string;
}

export async function POST(request: { json: () => Promise<JoinUsRequest> }) {
	try {
		// Catching input
		const payload = await request.json();

		// Destructuring payload to get necessary data
		const { user_name, email, phone, message } = payload;

		// Make an API to save data in the 'join_us' table
		const connection = await pool.getConnection();
		await connection.query(
			"INSERT INTO join_us (user_name, email, phone, message) VALUES (?, ?, ?, ?)",
			[user_name, email, phone, message]
		);
		connection.release();

		return NextResponse.json({
			success: true,
			message: "Data saved successfully",
            data: payload
		});
	} catch (error) {
		console.error("Error creating contact record:", error);
		return NextResponse.json({
			success: false,
			error: error,
		});
	}
}
