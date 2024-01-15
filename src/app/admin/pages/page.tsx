"use client"
import Sidebar from '@/components/admin/Sidebar'
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { BsEye, BsEyeSlash, BsTrash } from 'react-icons/bs';
import { useSelector } from 'react-redux';

const page = () => {
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
    // state variables
    const [pages, setPages] = useState([]);
    // Create a state variable to trigger a refetch
    const [shouldRefetch, setShouldRefetch] = useState(false);
    // Create a map to store the visibility state for each page
    const [pageVisibilityMap, setPageVisibilityMap] = useState({});
    // api calling
    const fetchPages = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/admin/pages/fetch-all-pages', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.data.success) {
                setPages(response.data.allPagesRecords);
            } else {
                // Handle error if needed
                console.error('Failed to fetch pages');
            }
        } catch (error) {
            // Handle error if needed
            console.error('Failed to fetch pages', error);
        }
    };

    // useEffect to fetch pages on component mount
    // now i want that if user clicks on toggle the page status button, this use efect hook called again
    useEffect(() => {
        fetchPages();
        // Reset shouldRefetch to false after the fetch
        setShouldRefetch(false);
    }, [authToken, setShouldRefetch]);
    // handle delete
    const handleDelete = async (pageId: number) => {

        try {
            const response = await axios.delete(`http://localhost:3000/api/v1/admin/pages/delete/${pageId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.data.success) {
                // Cannot find name 'fetchPages'.
                fetchPages();
                toast({
                    title: 'Page deleted successfully',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                // Handle deletion failure
                toast({
                    title: 'Failed to delete page',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error deleting page:', error);
            // Handle deletion failure
            toast({
                title: 'An Error Occurred while deleting the page',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    

    const handleToggleVisibility = async (pageId, pageStatus) => {
        // Log the "show" or "hide" value of {page.status}
        console.log(`${pageStatus === 'show' ? 'hide' : 'show'} clicked for Page ID ${pageId}`);

        // now if pageStatus value is show, update this value to hide, and vice versa
        setPageVisibilityMap((prevMap) => ({
            ...prevMap,
            [pageId]: !prevMap[pageId],
        }));

        // Make an axios.put request to update the status on the server
        try {
            const response = await axios.patch(`http://localhost:3000/api/v1/admin/pages/status/${pageId}`, {
                status: pageStatus === 'show' ? 'hide' : 'show',
            });

            if (response.data.success) {
                console.log(response.data.message);
                // Set shouldRefetch to true to trigger a refetch after the status update
                setShouldRefetch(true);
                // Update the UI based on the response
                const updatedPages = pages.map((pageItem) => {
                    if (pageItem.id === pageId) {
                        return {
                            ...pageItem,
                            status: pageStatus === 'show' ? 'hide' : 'show',
                            // also update the eye / eye slash button states
                        };
                    }
                    return pageItem;
                });

                setPages(updatedPages);
            } else {
                console.error('Failed to update page status:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating page status:', error);
        }
    };

    return (
        <>
            <Sidebar />
            {/* parent div */}
            <div className="mx-32 mb-32">
                <h1 className="text-2xl font-bold mb-4 text-slate-900 text-center">All Pages</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-slate-700 text-white border border-black-700">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Page Name</th>
                                <th className="px-4 py-2">Page Title</th>
                                <th className="px-4 py-2">Show on Nav Bar</th>
                                <th className="px-4 py-2">Created At</th>
                                <th className="px-4 py-2">Updated At</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map((page) => (
                                <tr key={page.id}>
                                    <td className="border px-4 py-2">{page.id}</td>
                                    <td className="border px-4 py-2">{page.page_name}</td>
                                    <td className="border px-4 py-2">{page.page_title}</td>
                                    <td className="border px-4 py-2 relative">
                                        <div style={{ position: 'relative' }}>
                                            {page.status}{' '}
                                            <button
                                                onClick={() => handleToggleVisibility(page.id, page.status)}
                                                className="text-blue-500 hover:underline focus:outline-none"
                                            >
                                                {(page.status==='show') ? <BsEye /> : <BsEyeSlash />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="border px-4 py-2">{new Date(page.created_at).toLocaleString()}</td>
                                    <td className="border px-4 py-2">{new Date(page.updated_at).toLocaleString()}</td>
                                    {/* Add Action buttons */}
                                    <td className="border px-4 py-2">
                                        <Link href={`/admin/pages/id/${page.id}`}>
                                            <button
                                                className="text-blue-500 hover:underline focus:outline-none"
                                            >
                                                <BsEye />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(page.id)}
                                            className="text-red-500 hover:underline focus:outline-none ml-2"
                                        >
                                            <BsTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default page