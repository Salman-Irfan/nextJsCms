
import pool from "@/lib/mySqlDbConn";
import { RowDataPacket } from "mysql2";

export async function getLoggedInUserRoleId(
	userId: number | unknown
): Promise<number | undefined> {
	const connection = await pool.getConnection();
	const [userResult] = (await connection.query(
		"SELECT role_id FROM users WHERE id = ?",
		[userId]
	)) as RowDataPacket[];

	connection.release();

	return userResult[0]?.role_id;
}
