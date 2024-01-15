"use client"
import Sidebar from '@/components/admin/Sidebar'
import VideoGallery from '@/views/admin/listings/VideoGallery';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { BsArrowLeft, BsPencil } from 'react-icons/bs';
import { useSelector } from 'react-redux';

const page = ({ params }: any) => {
    // redux
    const authToken = useSelector((state: any) => state.authToken.token);
    // hooks
    const router = useRouter();
    const toast = useToast();
    // Check if authToken is null and redirect to /auth/admin/login
    if (!authToken) {
        // show alert toast notification from chakra ui
        toast({
            title: "Unauthorized Access",
            description: "You need to log in to access this page.",
            status: "warning",
            duration: 5000,
            isClosable: true,
        });
        router.push("/auth/admin/login");
        return null; // You may also render a loading state or something else here
    }
    const listingId = params.id
    // state variables
    // State to hold the fetched data
    const [listingDetails, setListingDetails] = useState<any>(null);
    const fetchListingDetails = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/v1/admin/lists/fetch-list-by-id/${listingId}`
            );

            // Update the state with the fetched data
            setListingDetails(response.data.results[0]);
        } catch (error) {
            console.error(error);
            // Handle errors and show a toast notification
            toast({
                title: 'Error fetching listing details',
                description: 'An error occurred while fetching listing details.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }
    useEffect(() => {
        // Fetch the listing details when the component mounts
        fetchListingDetails();
    }, [listingId])
    // Render loading or error state while fetching data
    if (!listingDetails) {
        return <p>Loading...</p>; // You can customize this loading state
    }

    return (
        <>
            <Sidebar />
            {/* parent div */}
            <div className="">
                <h1 className="text-2xl font-bold mb-4 text-slate-900 text-center">Listing Details</h1>
                {/* using Tailwind CSS responsive classes */}
                {/* Render details from the state */}
                <div className="bg-blue-800 flex">
                    <img className="h-80 w-3/5 shadow-xl" src={listingDetails.main_picture} alt={listingDetails.title} />
                    {/* now display listingDetails.title here */}
                    <div className="my-auto mx-auto">
                        {/* Display listingDetails.title */}
                        <h2 className="text-4xl font-bold text-white">{listingDetails.title}</h2>
                        {/* short description */}
                        <p className="text-lg text-gray-300">{listingDetails.short_description}</p>
                    </div>
                    {/* title, short description ends here */}
                </div>

                {/* description starts */}
                <div className="container lg:w-3/4 lg:ml-80 px-4 py-8 my-4">
                    <h2 className="text-2xl text-slate-700 my-8">About</h2>
                    <h2 className="text-4xl font-bold text-blue-800 my-8">{listingDetails.title}</h2>
                    {/* dislpaly listingDetails.description as html renderedhere */}
                    <div dangerouslySetInnerHTML={{ __html: listingDetails.description }} />
                    {/* description ends */}
                    {/* visit to website button start */}
                    <div className='my-8'>
                        <Link href={listingDetails.site_url} target='_blank'>
                            <Button
                                rightIcon={<ExternalLinkIcon />}
                                colorScheme='red' variant='solid'>
                                Visit Our Site
                            </Button>
                        </Link>
                    </div>
                    {/* visit to website button end */}
                </div>
                {/* Contact Info start */}
                <div className="container">
                    <h1 className="text-2xl ml-8 font-bold text-blue-800 my-8">Contact Information</h1>
                    <hr className='ml-8' />
                    <div className="flex container mx-auto px-4 my-4 py-4">
                        {/* map start */}
                        <div className="container border border-blue-500 mx-2 max-w-max">
                            <iframe src={listingDetails.map_url}
                                // frameborder="0" 
                                width="500" height="500"
                                // allowfullscreen="" 
                                loading="lazy"
                            // referrerpolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                        {/* map end */}
                        {/* contact grid start */}
                        <div className="border mx-2 flex-initial w-full justify-between">
                            <div className="grid grid-cols-2 gap-4 mt-16 mx-4">
                                {/* address start */}
                                <div className=''>
                                    <h3 className="text-1xl font-bold text-blue-900 my-2">Address</h3>
                                    <p className='text-slate-600'>{listingDetails.address}</p>
                                </div>
                                {/* address end */}
                                {/* phone start */}
                                <div className=''>
                                    <h3 className="text-1xl font-bold text-blue-900 my-2">Phone</h3>
                                    <p className='text-slate-600'>{listingDetails.phone}</p>
                                </div>
                                {/* phone end */}
                                {/* email start */}
                                <div className=''>
                                    <h3 className="text-1xl font-bold text-blue-900 my-2">Email</h3>
                                    <p className='text-slate-600'>{listingDetails.email}</p>
                                </div>
                                {/* email end */}
                                {/* web start */}
                                <div className=''>
                                    <h3 className="text-1xl font-bold text-blue-900 my-2">Web</h3>
                                    <p className='text-slate-600'>{listingDetails.site_url}</p>
                                </div>
                                {/* web end */}
                            </div>
                        </div>
                        {/* contact grid end */}
                    </div>
                </div>
                {/* Contact Info end */}
                {/* Gallery Start */}
                <div className="container">
                    <h1 className="text-2xl ml-8 font-bold text-blue-800 my-8">Gallery</h1>
                    <hr className='ml-8' />
                    {/* gallery flex start */}
                    <div className="flex flex-wrap ml-16">
                        {listingDetails.photoUrls.map((photoUrl: any, index: any) => (
                            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
                                <img
                                    src={photoUrl}
                                    alt={`${listingDetails.title}`}
                                    className="my-4 mx-4 h-48 w-full object-cover rounded-lg transition-transform transform hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                    {/* gallery flex end */}
                </div>
                {/* Gallery end */}
                {/* videos start */}
                <div className="container">
                    {/* <h1 className="text-2xl ml-8 font-bold text-blue-800 my-8">Videos</h1> */}
                    {/* <hr className='ml-8' /> */}
                    {/* <div className="flex flex-wrap ml-16"> */}
                    {/* loop through listingDetails.videoUrls array coming from an api.
                        this array contains the urls of youtube videos
                        in thumbnail display video image
                        and on click, navigate to the video link */}
                    <VideoGallery listingDetails={listingDetails} />
                    {/* </div> */}
                </div>
                {/* videos end */}
                {/* Category Start */}
                <div className="container mb-80">
                    <h1 className="text-2xl ml-8 font-bold text-blue-800 my-8">Category</h1>
                    <hr className='ml-8' />
                    {/* category start */}
                    <p className='text-slate-600 ml-16'>{listingDetails.category_name}</p>
                    {/* category end */}
                </div>
                {/* Category end */}
            </div>
        </>
    )
}

export default page