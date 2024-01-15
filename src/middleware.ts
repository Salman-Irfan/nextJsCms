import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify, JWTVerifyResult, JWTPayload } from "jose";

export const middleware = async (request: NextRequest) => {
	// Check if the request is for the "add-user" API

	// Check for the presence of the Authorization header
	const authorizationHeader = request.headers.get("Authorization");

	// If the Authorization header is not present or doesn't have a bearer token, deny access
	if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
		return NextResponse.json({
			message: "Unauthorized - Missing or invalid bearer token",
		});
	}

	// Extract the token from the Authorization header
	const token = authorizationHeader.replace("Bearer ", "");

	try {
		// Validate and decode the token
		const secret = process.env.JWT_SECRET;
		// if not return
		if (!secret) {
			throw new Error("JWT secret is not defined");
		}

		// Convert the secret to Uint8Array
		const secretBuffer = new TextEncoder().encode(secret);

		// Use 'await' to wait for the Promise to resolve
		const decodedTokenResult = (await jwtVerify(
			token,
			secretBuffer
		)) as JWTVerifyResult<JWTPayload>;
		// Extract user information from the decoded token
		const { userId } = decodedTokenResult.payload;

		// Pass userId to the API route controller
	} catch (error) {
		console.error("Token validation error:", error);
		return NextResponse.json({
			message: "Unauthorized - Invalid bearer token",
		});
	}
};

export const config = {
	matcher: [
		// "/api/v1/admin/users:path*", 
		// "/api/v1/admin/lists/add-list"
	],
};
