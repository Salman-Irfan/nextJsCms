import pool from "@/lib/mySqlDbConn";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

interface Content {
    params: {
        fetchAllListsByCategoryId: number;
    };
}

// Controller function to handle the GET request
export async function GET(request: any, content: Content): Promise<NextResponse> {
    try {
        // Extract category ID from the 'content' parameter
        const categoryId = content.params.fetchAllListsByCategoryId;

        // Establish a database connection
        const connection = await pool.getConnection();

        // Query to fetch all listings by category ID
        const listingsQuery = `
            SELECT 
                l.id AS listing_id,
                l.title,
                l.description,
                c.id AS category_id,
                c.name AS category_name
            FROM listings l
            LEFT JOIN categories c ON l.category_id = c.id
            WHERE l.category_id = ?
        `;

        // Execute the listings query
        const [listingsResults] = await connection.execute<RowDataPacket[]>(listingsQuery, [categoryId]);

        // Fetch photos and videos for each listing
        const listingsWithMedia = await Promise.all(
            listingsResults.map(async (listing) => {
                // Query to fetch photos for a listing
                const photosQuery = `
                    SELECT photo_url
                    FROM photos
                    WHERE listing_id = ?
                `;

                // Query to fetch videos for a listing
                const videosQuery = `
                    SELECT video_url
                    FROM videos
                    WHERE listing_id = ?
                `;

                // Execute photo and video queries
                const [photosResults] = await connection.execute<RowDataPacket[]>(photosQuery, [listing.listing_id]);
                const [videosResults] = await connection.execute<RowDataPacket[]>(videosQuery, [listing.listing_id]);

                // Add photos and videos to the listing object
                return {
                    ...listing,
                    photos: photosResults.map((photo) => photo.photo_url),
                    videos: videosResults.map((video) => video.video_url),
                };
            })
        );

        // Release the database connection
        connection.release();

        // Return the results as a JSON response
        return NextResponse.json({
            success: true,
            listings: listingsWithMedia,
        });
    } catch (error) {
        // Handle errors and return an error response
        console.error(error);
        return NextResponse.json({
            success: false,
            error,
        });
    }
}
