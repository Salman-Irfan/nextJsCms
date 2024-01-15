import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

// Define the expected structure of the response
interface CityResponse {
	success: boolean;
	city?: {
		id: number;
		name: string;
		country?: string;
	};
	message?: string;
}

// Define the structure of the 'content' parameter
interface Content {
	params: {
		fetchCityById: number;
	};
}

// Controller function to handle the GET request
export async function GET(
	request: any,
	content: Content
): Promise<NextResponse> {
	try {
		// Extract city ID from the 'content' parameter
		const cityId = content.params.fetchCityById;

		// Establish a database connection
		const connection = await pool.getConnection();

		// Logic to get category by ID from the database
		const [cityResult] = await connection.query<RowDataPacket[]>(
			"SELECT * FROM cities WHERE cities.id = ?",
			[cityId]
		);

		// Release the database connection
		connection.release();

		// If no category found, return an error response
		if (cityResult.length === 0) {
			const response: CityResponse = {
				success: false,
				message: "City not found",
			};
			return NextResponse.json(response);
		}

		// Map the database result to the desired structure
		const city: CityResponse["city"] = {
			id: cityResult[0].id,
			name: cityResult[0].name,
			country: cityResult[0].country,
			// Include additional properties if needed
		};

		

		// Build the final response
		const response: CityResponse = {
			success: true,
			city: city,
		};

		// Return the JSON response
		return NextResponse.json(response);
	} catch (error) {
		// Handle errors and return an error response
		console.error(error);
		return NextResponse.json({
			success: false,
			error,
		});
	}
}
