import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import saltRounds from "@/constants/bcryptJs/saltRounds";
import {
	ExistingUserResult,
	checkExistingUser,
} from "@/utils/existingUserUtils";

import { getLoggedInUserRoleId } from "@/utils/getLoggedInUserRoleId";
import { getLoggedInUserId } from "@/utils/getLoggedInUserId";

// post
export async function POST(request: { json: () => any; headers: Headers }) {
	let connection; // Declare connection variable outside try block

	try {
		const payload = await request.json();
		const authorizationHeader = request.headers.get("Authorization");
		const userId = await getLoggedInUserId(authorizationHeader);
		// Fetch role_id using the utility function
		const loggedInUserRoleId = await getLoggedInUserRoleId(userId);

		// Check if loggedInUserRoleId is not 1 or 2, return unauthorized
		if (
			loggedInUserRoleId === undefined ||
			![1, 2].includes(loggedInUserRoleId)
		) {
			return NextResponse.json({
				success: false,
				message: "Unauthorized - User does not have the required role",
			});
		}

		// Continue with the rest of your logic...
		const { name, email, password, phone, gender, country, role_id } =
			await payload;

		// Check if user already exists - separate utility file
		const {
			exists: userExists,
			message: existingUserMessage,
		}: ExistingUserResult = await checkExistingUser(email, phone);

		// Now send a specific response regarding email, phone, or both
		if (userExists) {
			return NextResponse.json({
				success: false,
				message: existingUserMessage,
			});
		}

		// Hash the password using bcrypt
		const hashedPassword = await bcrypt.hashSync(password, saltRounds);

		connection = await pool.getConnection(); // Move connection definition here

		const insertResult = await connection.query(
			"INSERT INTO users (name, email, password, phone, gender, country, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[name, email, hashedPassword, phone, gender, country, role_id]
		);

		connection.release();

		// Create a sanitized user object without the password
		const sanitizedUser = { ...payload, password: undefined };

		return NextResponse.json({
			success: true,
			message: `Data added successfully`,
			user: sanitizedUser,
		});
	} catch (error) {
		console.error("Error adding data:", error);
		if (connection) {
			connection.release(); // Release connection in case of an error
		}
		return NextResponse.json({ success: false, message: error });
	}
}
