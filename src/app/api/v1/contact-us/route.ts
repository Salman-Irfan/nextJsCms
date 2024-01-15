import { NextResponse } from "next/server";
import pool from "@/lib/mySqlDbConn";

interface ContactUsPayload {
	user_name: string;
	email: string;
	phone: string;
	message: string;
}

export async function POST(request: { json: () => ContactUsPayload }) {
	try {
		// catching input
		const payload = await request.json();

		// Destructuring payload to get necessary data
		const { user_name, email, phone, message } = payload;

		// Validate the request parameters
		if (!user_name || !email || !phone || !message) {
			return NextResponse.json({
				success: false,
				message:
					"All fields (user_name, email, phone, message) are required",
			});
		}

		// Start a transaction for atomicity
		const connection = await pool.getConnection();
		await connection.beginTransaction();

		try {
			// Insert data into contact_us table
			await connection.query(
				"INSERT INTO contact_us (user_name, email, phone, message) VALUES (?, ?, ?, ?)",
				[user_name, email, phone, message]
			);

			// Commit the transaction
			await connection.commit();

			return NextResponse.json({
				success: true,
				message: "Contact record created successfully",
                data: payload
			});
		} catch (error) {
			// Rollback the transaction in case of an error
			await connection.rollback();
			console.error("Error creating contact record:", error);
			return NextResponse.json({
				success: false,
				error: error,
			});
		} finally {
			// Release the connection
			connection.release();
		}
	} catch (error) {
		console.error("Error creating contact record:", error);
		return NextResponse.json({
			success: false,
			error: error,
		});
	}
}
