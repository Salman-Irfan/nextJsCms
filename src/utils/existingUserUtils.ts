// userUtils.ts

import { RowDataPacket } from "mysql2";
import pool from "@/lib/mySqlDbConn";

export interface ExistingUserResult {
	exists: boolean;
	message: string;
}

export async function checkExistingUser(
	email: string,
	phone: string
): Promise<ExistingUserResult> {
	const [existingUser] = await pool.query<RowDataPacket[]>(
		"SELECT * FROM users WHERE email = ? OR phone = ?",
		[email, phone]
	);

	if (existingUser.length > 0) {
		const existingWithEmail = existingUser.some(
			(user) => user.email === email
		);
		const existingWithPhone = existingUser.some(
			(user) => user.phone === phone
		);

		if (existingWithEmail && existingWithPhone) {
			return {
				exists: true,
				message:
					"User with the same email and phone number already exists",
			};
		} else if (existingWithEmail) {
			return {
				exists: true,
				message: "User with the same email already exists",
			};
		} else if (existingWithPhone) {
			return {
				exists: true,
				message: "User with the same phone number already exists",
			};
		}
	}

	return { exists: false, message: "User does not exist" };
}
