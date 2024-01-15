// pages/index.js
"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Grid,
    Text,
    Image,
    Badge,
    VStack,
    HStack,
    Container,
} from '@chakra-ui/react';
import getApiService from '@/services/apiServices/getApiService/getApiService';
import endPoints from '@/constants/client/endPoints/endPoints';
import Link from 'next/link';

// interfaces.ts

interface Listing {
    listing_id: number;
    title: string;
    description: string;
    category_id: number;
    category_name: string;
    photos: string[];
    // Add any other properties you expect in the listing
}

interface ApiResponse {
    success: boolean;
    listings: Listing[];
    // Add any other properties you expect in the API response
}


const page = ({ params }: any) => {
    const [listings, setListings] = useState<Listing[]>([]);
    const categoryId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getApiService(`${endPoints.FETCH_ALL_LISTS_BY_CATEGORY_ID}/${categoryId}`);
                const data: ApiResponse = response.data;

                if (data.success) {
                    setListings(data.listings);
                } else {
                    console.error('API request failed');
                }
            } catch (error) {
                console.error('Error fetching data from API', error);
            }
        };

        fetchData();
    }, [categoryId]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {listings.map((listing) => (
                <Link href={`/category/list/${listing.listing_id}`} className="">
                    <div
                        key={listing.listing_id}
                        className="group w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden cursor-pointer"
                    >
                        {/* Display image of 0 index only */}
                        {listing.photos[0] && (

                            <img
                                className="p-8 rounded-t-lg object-cover w-full group-hover:opacity-75 transition-opacity"
                                src={`/${listing.photos[0]}`}
                                alt={listing.title}
                            />

                        )}

                        <div className="px-5 py-3">
                            <div className="flex items-center mb-3">
                                {/* Display listing title here */}
                                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-500">
                                    {listing.title}
                                </h5>
                                {/* Display category_name here */}
                                <p className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                                    {listing.category_name}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                {/* Display description here */}
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    {listing.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default page;

