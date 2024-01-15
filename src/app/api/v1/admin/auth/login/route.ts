import { RowDataPacket } from "mysql2";
import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
	checkExistingUser,
	ExistingUserResult,
} from "@/utils/existingUserUtils";

// post
export async function POST(request: { json: () => any }) {
	try {
		const payload = await request.json();
		const { email, password } = await payload;

		// Check if user with the same email exists
		const {
			exists: userExists,
			message: existingUserMessage,
		}: ExistingUserResult = await checkExistingUser(email, "");
        // if user not found
		if (!userExists) {
			return NextResponse.json({
				success: false,
				message: "User not found with the provided email",
			});
		}
		// If user exists, fetch the hashed password from the database
		const [existingUser] = await pool.query<RowDataPacket[]>(
			"SELECT * FROM users WHERE email = ?",
			[email]
		);
		const hashedPasswordFromDatabase = existingUser[0].password;

		// Compare the provided password with the hashed password
		const isPasswordValid = await bcrypt.compare(
			password,
			hashedPasswordFromDatabase
		);
		// if password mismatch, return false
		if (!isPasswordValid) {
			return NextResponse.json({
				success: false,
				message: "Invalid credentials",
			});
		}
		// assign auth token using jwt npm library
		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			throw new Error("JWT secret is not defined");
		}
		const token = jwt.sign({ userId: existingUser[0].id }, jwtSecret);

		// Exclude the password field from the user details
		const { password: excludedPassword, ...userDetails } = existingUser[0];

		// Password is valid, you can proceed with further actions (e.g., generate tokens, log in the user, etc.)
		return NextResponse.json({
			success: true,
			message: "Login successful",
			token: token,
			user: userDetails,
		});
	} catch (error) {
		console.error("Error processing data:", error);
		return NextResponse.json({ success: false, message: error });
	}
}
