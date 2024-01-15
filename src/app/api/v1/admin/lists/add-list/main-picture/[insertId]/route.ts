import formidable from 'formidable';
import { NextResponse } from "next/server";
import pool from "@/lib/mySqlDbConn";
import { ResultSetHeader } from "mysql2";
import { writeFile } from "fs/promises";

// Define the expected structure of the response
interface PutResponse {
    success: boolean;
    message?: string;
    data?: object;
}

export const config = {
    api: {
        bodyParser: false,
    },
};

// Controller function to handle the PUT request
export async function PUT(request: any, content:any) {
    try {
        const connection = await pool.getConnection();
        const insertId = content.params.insertId;
        const formData = await request.formData();
        const mainPicture = await formData.get('mainPicture');
        console.log(mainPicture)
        // convet file into buffer
        const byteData = await mainPicture.arrayBuffer();
        const buffer = Buffer.from(byteData);
        // define path to which we want to store the file
        // Extract file extension from the original filename
        const fileExtension = mainPicture.name.split(".").pop();
        const fileName = mainPicture.name.split(".")[0];
        const currentDate = Date.now();
        const newFileName = `listItem_${fileName}_${currentDate}.${fileExtension}`;
        const path = `public/listItems/${newFileName}`;
        const fileLink = `/listItems/${newFileName}`; // save this fileLink in sql db
        // console.log(fileLink)
        // save it in public folder
        const saved = await writeFile(path, buffer);
        // Update the page in the 'pages' table
        const [updateMainPicture] = await connection.query<ResultSetHeader>(
            "UPDATE listings SET main_picture = ? WHERE id = ?",
            [fileLink, insertId]
        );
        connection.release();
        // Check if the update was successful
        if (updateMainPicture.affectedRows === 0) {
            const response: PutResponse = {
                success: false,
                message: "Page not found or data was not updated.",
            };
            return NextResponse.json(response);
        }
        // if success
        return NextResponse.json({
            success: true,
            message: `Main photo added successfully`,
            path: fileLink
        })
    } catch (error) {
        console.error("Error updating list item:", error);

        return NextResponse.json({
            success: false,
            error: error,
        });
    }
}