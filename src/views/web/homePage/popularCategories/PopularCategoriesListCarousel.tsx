"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Link from 'next/link';
import getApiService from '@/services/apiServices/getApiService/getApiService';
import BASE_URL from '@/constants/client/baseUrl/baseUrl';
import APIV from '@/constants/client/apiv/apiv';
import endPoints from '@/constants/client/endPoints/endPoints';

interface Listing {
    listing_id: number;
    photos: string[]; // Assuming photos is an array of strings
    title: string;
    category_id: string;
    category_name: string;
    // Add other properties as needed
}

const PopularCategoriesListCarousel: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await axios.get("http://localhost:3000/api/v1/lists/fetch-all-lists");
                const response = await getApiService(`${endPoints.FETCH_ALL_LISTS}`)
                // console.log(response)
                const data = response.data;

                if (data.success) {
                    setListings(data.listings);
                } else {
                    console.error("API request failed");
                }
            } catch (error) {
                console.error("Error fetching data from API", error);
            }
        };

        fetchData();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 500,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <>
            <div className="container my-4">
                {listings.length > 0 && (
                    <Slider {...settings} >
                        {listings.map((listing) => (
                            <Link href={`/category/${listing.category_id}`}>
                                <div key={listing.listing_id}
                                    className='group relative cursor-pointer'
                                >
                                    <div className='mx-4'>
                                        <img src={listing.photos[0]} alt={listing.title}
                                            className="transition-transform transform scale-100 group-hover:scale-105"
                                        />
                                    </div>
                                    {/* Display the category_name below the image */}
                                    <p className="mt-2 mx-4 text-center font-bold text-xl text-indigo-700">
                                        {listing.category_name}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </Slider>
                )}
            </div>
        </>
    );
};

export default PopularCategoriesListCarousel;
