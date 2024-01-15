"use client"
import Sidebar from '@/components/admin/Sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';
import Dropzone from 'react-dropzone';
import { useState } from 'react';
import axios from 'axios';
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
    const [mainPicture, setMainPicture] = useState<File | null>(null);
    // Handle file drop or selection
    const handleDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            // Only consider the first file in case of multiple uploads
            setMainPicture(acceptedFiles[0]);
        }
    };
    // Handle file selection for manual input
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files && e.target.files[0];
        setMainPicture(selectedFile);
    };
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Log the main_picture file
        console.log('Main Picture:', mainPicture);

        // You can perform further actions, such as uploading the file to a server
        // ...
        // Create a FormData object
        const formData = new FormData();

        // Append the mainPicture to the FormData
        if (mainPicture) {
            formData.append('mainPicture', mainPicture);
        }
        console.log(formData)
        try {
            // Make the PUT request using Axios
            const response = await axios.put(`http://localhost:3000/api/v1/admin/lists/add-list/main-picture/${insertId}`, formData);
            console.log(response)
            // Show success toast notification
            toast({
                title: 'List item created successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            // redirect to upoading main picture
            router.push(`/admin/lists/create-listing/upload-gallery-pictures/${insertId}`);
        } catch (error) {
            console.log(error)
        }
        // Clear the file input after submission if needed
        // setMainPicture(null);
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
                    <BreadcrumbItem>
                        <BreadcrumbLink isCurrentPage color="blue.500" _hover={{ color: 'blue.600' }}>
                            Main Photo
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {/* main photo end*/}

                    {/* Photos Gallery start */}
                    <BreadcrumbItem>
                        <BreadcrumbLink color="yellow.500" _hover={{ color: 'yellow.600' }}>
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
                <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-900 text-center">Upload Main Picture</h1>
                {/* Dropzone component */}
                <Dropzone onDrop={handleDrop} accept="image/*" multiple={false}>
                    {({ getRootProps, getInputProps }) => (
                        <div className="border-2 border-dashed border-gray-400 rounded-md p-8 text-center" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p className="text-gray-600">Drag 'n' drop an image here, or click to select one</p>
                            {mainPicture && (
                                <div className="mt-4">
                                    <p className="text-green-500 font-semibold">Selected Image:</p>
                                    <img src={URL.createObjectURL(mainPicture)} alt="Main Picture" className="mt-2 max-w-full h-auto" />
                                </div>
                            )}
                        </div>
                    )}
                </Dropzone>
                {/* Form with file input */}
                <form onSubmit={handleSubmit} className="mt-8">
                    {/* <label htmlFor="mainPicture" className="block text-sm font-medium text-gray-700">Main Picture:</label> */}
                    {/* <input
                        type="file"
                        id="mainPicture"
                        name="mainPicture"
                        accept="image/*"
                        className="mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        onChange={handleFileInputChange}
                    /> */}
                    <button type="submit" className="mt-4 bg-blue-500 text-white rounded-full px-6 py-2">Next</button>
                </form>
            </div>
        </>
    )
}

export default page