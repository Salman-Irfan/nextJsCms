import { NextResponse } from "next/server";
import { jwtVerify, JWTVerifyResult, JWTPayload } from "jose";

export function getLoggedInUserId(
	authorizationHeader: string | null
): Promise<number | undefined> {
	if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
		// You might want to handle this case according to your requirements
		throw new Error("Unauthorized - Missing or invalid bearer token");
	}

	const token = authorizationHeader.replace("Bearer ", "");

	// Validate and decode the token
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT secret is not defined");
	}

	const secretBuffer = new TextEncoder().encode(secret);
	return jwtVerify(token, secretBuffer).then(
		(decodedTokenResult) => decodedTokenResult.payload.userId as number
	);
}
