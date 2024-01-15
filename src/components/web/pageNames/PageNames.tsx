"use client"
import { useEffect, useState } from "react";
import slugify from "slugify";
import { Text, Skeleton } from "@chakra-ui/react";
import getApiService from "@/services/apiServices/getApiService/getApiService";
import Link from "next/link";
import endPoints from "@/constants/client/endPoints/endPoints";

interface PageNamesResponse {
	success: boolean;
	pageNames?: string[];
	message?: string;
}

const PageNames = () => {
	const [data, setData] = useState<PageNamesResponse | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getApiService(endPoints.GET_PAGE_NAMES); // calling api
				setData(response.data);
			} catch (error: any) {
				setError(error); // Explicitly type 'error' as 'Error'
			}
		};

		fetchData();
	}, []);

	if (error) {
		console.error("Error fetching page names:", error);
		return null;
	}
	
	if (!data) {
		// Show a loading skeleton while waiting for the data
		return (
			<>
				{[1, 2, 3].map((key) => (
					<Skeleton key={key} height="20px" width="80px" mx={4} />
				))}
			</>
		);
	}

	return (
		<>
			{data.success &&
				data.pageNames &&
				data.pageNames.map((pageName) => (
					// <Text key={pageName} mx={4}>
					// 	<Link href={`/${slugify(pageName, { lower: true })}`}>
					// 		{pageName}
					// 	</Link>
					// </Text>
					// server side rendering
					<Text key={pageName} mx={4}>
						<Link href={`/server/${slugify(pageName, { lower: true })}`}>
							{pageName}
						</Link>
					</Text>
				))}
		</>
	);
};

export default PageNames;
