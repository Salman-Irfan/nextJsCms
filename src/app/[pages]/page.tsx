"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@chakra-ui/react";
import getPageContentService from "@/services/apiServices/getPageContentService/getPageContentService";

// Define the type interface for a single page record
interface PageRecord {
	created_at: string;
	page_content: string;
	page_name: string;
	page_title: string;
	status: string;
	updated_at: string;
}

// Define the type interface for the API response
interface PageApiResponse {
	success: boolean;
	pageRecords?: PageRecord[];
}

// Define the type interface for the params object
interface PageParams {
	pages: string;
}

// ... (existing imports)

const Page: React.FC<{ params: PageParams }> = ({ params }) => {
	const [data, setData] = useState<PageApiResponse | undefined>();
	const [isLoading, setIsLoading] = useState(true);
	const slugName = params.pages;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getPageContentService(slugName);
				console.log(response.data);
				setData(response.data);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [slugName]);

	return (
		<>
			{/* <h1>{slugName}</h1> */}
			{isLoading ? (
				<>
					<Skeleton height="20px" my="10px" />
					<Skeleton height="20px" my="10px" />
				</>
			) : (
				// Display page title and page content here only
				data?.success &&
				data?.pageRecords && (
					<>
						<h2>{data.pageRecords[0].page_title}</h2>
						{/* Render HTML content using dangerouslySetInnerHTML */}
						{/* <p>{data.pageRecords[0].page_content}</p> */}
						<div dangerouslySetInnerHTML={{ __html: data.pageRecords[0].page_content }} />
					</>
				)
			)}
		</>
	);
};

export default Page;

