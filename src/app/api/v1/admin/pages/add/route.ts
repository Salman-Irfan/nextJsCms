import { NextResponse } from "next/server";
import slugify from "slugify";
import pool from "@/lib/mySqlDbConn";

interface Page {
	page_name: string;
	page_title: string;
	page_content: string;
	seo_title: string;
	seo_description: string;
	seo_keywords: string;
}

export async function POST(request: { json: () => Promise<Page> }) {
	try {
		// Catching input
		const payload = await request.json();

		// Destructuring payload to get necessary data
		const { page_name, page_title, page_content, seo_title, seo_description, seo_keywords } = payload;

		// Generate a slug from the page name
		const page_slug = slugify(page_name, { lower: true });

		// Add the page to the database
		const connection = await pool.getConnection();
		const [result] = await connection.query(
			"INSERT INTO pages (page_name, page_slug, page_title, page_content, seo_title, seo_description, seo_keywords) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[
				page_name,
				page_slug,
				page_title,
				page_content,
				seo_title,
				seo_description,
				seo_keywords,
			]
		);
		connection.release();

		return NextResponse.json({
			success: true,
			message: "Page added successfully",
			data: {
				page_name,
				page_slug,
				page_title,
				page_content,
				seo_title,
				seo_description,
				seo_keywords,
			},
		});
	} catch (error) {
		console.error("Error creating page:", error);
		return NextResponse.json({
			success: false,
			error: error,
		});
	}
}
