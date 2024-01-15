// controllers/pages/[fetchPageById].ts

import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

// Define the expected structure of the response
interface PageResponse {
    success: boolean;
    pageRecord?: {
        id: number;
        page_name: string;
        page_title: string;
        page_content: string;
        status: string;
        seo_title: string;
        seo_description: string;
        seo_keywords: string;
        created_at: Date;
        updated_at: Date;
    };
    message?: string;
}

// Define the structure of the 'content' parameter
interface Content {
    params: {
        fetchPageById: number;
    };
}

// Controller function to handle the GET request for a specific page record
export async function GET(
    request: any,
    content: Content
): Promise<NextResponse> {
    try {
        // Extract page ID from the 'content' parameter
        const pageId = content.params.fetchPageById;

        // Establish a database connection
        const connection = await pool.getConnection();

        // Execute SQL query to fetch the page record based on its ID
        const [results] = await connection.query<RowDataPacket[]>(
            "SELECT * FROM pages WHERE id = ? AND deleted_at IS NULL",
            [pageId]
        );

        connection.release();

        // Check if the result contains any records
        if (results.length === 0) {
            const response: PageResponse = {
                success: false,
                message: "Page record not found",
            };
            return NextResponse.json(response);
        }

        // Map the result to the desired structure
        const pageRecord: PageResponse["pageRecord"] = {
            id: results[0].id,
            page_name: results[0].page_name,
            page_title: results[0].page_title,
            page_content: results[0].page_content,
            status: results[0].status,
            seo_title: results[0].seo_title,
            seo_description: results[0].seo_description,
            seo_keywords: results[0].seo_keywords,
            created_at: results[0].created_at,
            updated_at: results[0].updated_at,
        };

        // Build the final response
        const response: PageResponse = {
            success: true,
            pageRecord,
        };

        // Return the JSON response
        return NextResponse.json(response);
    } catch (error) {
        // Handle errors and return an error response
        console.error(error);
        return NextResponse.json({ success: false, error: error });
    }
}
