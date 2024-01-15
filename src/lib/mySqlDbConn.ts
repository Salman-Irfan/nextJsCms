import HOST from "@/constants/host";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
	host: HOST,
	user: "root",
	password: "",
	database: "next_js_khudi_pakistan",
	waitForConnections: true,
	connectionLimit: 10000, // can you change it to unlimited
	queueLimit: 0,
});

export default pool;

