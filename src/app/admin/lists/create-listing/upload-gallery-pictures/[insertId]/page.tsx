"use client"
import Sidebar from '@/components/admin/Sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';
import Dropzone from 'react-dropzone';
import { useState } from 'react';
import axios from 'axios';
import postFormService from '@/services/apiServices/postFormService/postFormService';
import endPoints from '@/constants/client/endPoints/endPoints';
import { ChevronRightIcon } from '@chakra-ui/icons';

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
    const insertId = params.insertId

    // State variables
    // State variables for handling file upload
    const [galleryPictures, setGalleryPictures] = useState<File[]>([]);
    // Handle file drop or selection for gallery pictures
    const handleGalleryDrop = (acceptedFiles: File[]) => {
        // Limit the number of gallery pictures to 5
        if (acceptedFiles.length > 5) {
            toast({
                title: 'Error',
                description: 'You can upload up to 5 gallery pictures.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setGalleryPictures(acceptedFiles);
    };
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Create a FormData object
        const formData:any = new FormData();
        formData.append(`insertId`, insertId)
        galleryPictures.map((file, index) => {
            formData.append(`galleryPicture`, file);
        });
        // api call
        try {
            // const response = await axios.post(`http://localhost:3000/api/v1/admin/lists/add-list/add-gallery-pictures`, formData)
            const response = await postFormService(endPoints.UPLOAD_GALLERY_PICTURES, formData)
            // Check if the API call was successful
            if (response.data.success) {
                // Show success toast notification
                toast({
                    title: 'Success',
                    description: 'Gallery photos uploaded successfully.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });

                // Redirect to a specific URL (change '/dashboard' to your desired URL)
                router.push(`/admin/lists/create-listing/add-video-urls/${insertId}`);
            } else {
                // Handle the case where the API call was not successful
                toast({
                    title: 'Error',
                    description: 'An error occurred while uploading gallery photos.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.log(error)
            // Handle the case where there's an error with the API call
            toast({
                title: 'Error',
                description: 'An error occurred. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        
    };
    return (
        <>
            <Sidebar />
            <div className="mx-8 md:mx-16 lg:mx-32 mb-16 lg:mb-32">
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
                        <BreadcrumbLink isCurrentPage color="blue.500" _hover={{ color: 'blue.600' }}>
                            Photos
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {/* Photos Gallery end */}

                    {/* Video Urls start */}
                    <BreadcrumbItem>
                        <BreadcrumbLink color="yellow.500" _hover={{ color: 'yellow.600' }}>
                            Videos
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {/* Video Urls end */}
                </Breadcrumb>
                {/* bread crumb end */}
                <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-900 text-center">
                    Upload Gallery Pictures
                </h1>
                {/* Dropzone component for gallery pictures */}
                <Dropzone onDrop={handleGalleryDrop} accept="image/*" multiple={true}>
                    {({ getRootProps, getInputProps }) => (
                        <div className="border-2 border-dashed border-gray-400 rounded-md p-8 text-center" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p className="text-gray-600">
                                Drag 'n' drop up to 5 images here, or click to select.
                            </p>
                            {galleryPictures.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-green-500 font-semibold">
                                        Selected Gallery Pictures:
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                                        {galleryPictures.map((file, index) => (
                                            <img
                                                key={index}
                                                src={URL.createObjectURL(file)}
                                                alt={`Gallery Picture ${index + 1}`}
                                                className="max-w-full h-auto rounded-md"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Dropzone>

                {/* Form with file input */}
                <form onSubmit={handleSubmit} className="mt-8">
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white rounded-full px-6 py-2"
                    >
                        Next
                    </button>
                </form>
            </div>
        </>
    )
}

export default page