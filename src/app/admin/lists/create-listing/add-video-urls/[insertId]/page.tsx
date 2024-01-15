"use client"
import Sidebar from '@/components/admin/Sidebar'
import endPoints from '@/constants/client/endPoints/endPoints';
import postFormService from '@/services/apiServices/postFormService/postFormService';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const page = ({params}: any) => {
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
    const insertId = params.insertId;
    // State variables for video URLs
    const [videoUrls, setVideoUrls] = useState<string[]>(['', '', '']);
    // Handle form submission
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Filter out empty strings from the videoUrls array
        const filteredVideoUrls = videoUrls.filter(url => url.trim() !== '');
        // Create an object with videoUrls property
        const videosFormData = {
            insertId: insertId,
            videoUrls: filteredVideoUrls
        };

        console.log(videosFormData);
        if(videosFormData.videoUrls.length > 0){
            // api call
            try {
                const response = await postFormService(endPoints.ADD_VIDEO_URLS, videosFormData)
                console.log(response)
                if(response.data.success){
                    // Show success toast
                    toast({
                        title: "Video URLs Added",
                        description: "Video URLs added successfully.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });

                    // Redirect to '/admin/lists'
                    router.push('/admin/lists');
                } else {
                    // Show error toast if the API call was not successful
                    toast({
                        title: "Error",
                        description: "Failed to add video URLs. Please try again.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                // Show error toast if there's an exception
                toast({
                    title: "Error",
                    description: "An error occurred. Please try again.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                console.error(error);
            }
        }else{
            // Redirect to '/admin/lists'
            router.push('/admin/lists');
        }
    };

    return (
        <>
            <Sidebar />
            <div className="mx-32 mb-32">
                {/* bread crumb start */}
                <Breadcrumb
                    spacing="8px"
                    separator={<ChevronRightIcon color="gray.500" />}
                    textAlign="center"
                    bg="gray.100"
                    p="4"
                    borderRadius="md"
                    fontWeight="semibold"
                    fontSize="lg"
                >
                    {/* listing start */}
                    <BreadcrumbItem >
                        <BreadcrumbLink
                            href="/admin/lists/create-listing"
                            color="green.500"
                            _hover={{ color: 'green.600' }}
                        >
                            Listing Details
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {/* listing end */}

                    {/* main photo start */}
                    {/* <BreadcrumbItem>
                        <BreadcrumbLink color="green.500" _hover={{ color: 'green.600' }}>
                            Main Photo
                        </BreadcrumbLink>
                    </BreadcrumbItem> */}
                    {/* main photo end*/}

                    {/* Photos Gallery start */}
                    <BreadcrumbItem>
                        <BreadcrumbLink isCurrentPage color="green.500" _hover={{ color: 'green.600' }}>
                            Photos
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {/* Photos Gallery end */}

                    {/* Video Urls start */}
                    <BreadcrumbItem>
                        <BreadcrumbLink isCurrentPage color="blue.500" _hover={{ color: 'blue.600' }}>
                            Videos
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {/* Video Urls end */}
                </Breadcrumb>
                {/* bread crumb end */}
                <h1 className="text-2xl font-bold mb-4 text-slate-900 text-center">Upload Video URLs</h1>
                {/* Form */}
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    {/* Video URL Input Fields */}
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="mb-4">
                            <label htmlFor={`videoUrl${index}`} className="block text-sm font-medium text-gray-700">
                                Video URL {index+1}:
                            </label>
                            <input
                                type="text"
                                id={`videoUrl${index}`}
                                name={`videoUrl${index}`}
                                value={videoUrls[index]}
                                onChange={(e) => {
                                    const newVideoUrls = [...videoUrls];
                                    newVideoUrls[index] = e.target.value;
                                    setVideoUrls(newVideoUrls);
                                }}
                                className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                                placeholder='Optional'
                            />
                        </div>
                    ))}
                    {/* Buttons */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-green-500 text-white rounded-full px-6 py-2"
                        >
                            Complete
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default page