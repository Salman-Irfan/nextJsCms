"use client"
import Sidebar from '@/components/admin/Sidebar'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BsArrowLeft, BsPencil, BsTrash } from 'react-icons/bs'
import { useSelector } from 'react-redux'

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
    const pageId = params.id
    // state variables
    const [pageRecord, setPageRecord] = useState<any | null>(null);
    // api calling
    useEffect(() => {
        const fetchPageDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/admin/pages/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (response.data.success) {
                    setPageRecord(response.data.pageRecord);
                } else {
                    // Handle error if needed
                    console.error('Failed to fetch page details');
                }
            } catch (error) {
                console.log('Failed to fetch page details', error);
            }

        }
        fetchPageDetails();

    }, [pageId, authToken])

    return (
        <>
            <Sidebar />
            {/* parent div */}
            <div className="mx-32 mb-32">
                <h1 className="text-2xl font-bold mb-4 text-slate-900 text-center">Page Details</h1>
                {/* using tailwind css responsive classes */}
                {/* integrate api content here */}
                {pageRecord ? (
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-xl font-semibold mb-2">{pageRecord.page_name}</h2>
                        <p className="text-gray-700 mb-2">{pageRecord.page_title}</p>
                        {/* Render HTML content using dangerouslySetInnerHTML */}
                        <div dangerouslySetInnerHTML={{ __html: pageRecord.page_content }} />
                        <p className="text-sm text-gray-500 mt-4">
                            Created At: {new Date(pageRecord.created_at).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Updated At: {new Date(pageRecord.updated_at).toLocaleString()}</p>
                        {/* seo tags start */}
                        <div className="mb-4">
                            <h2 className='prose prose-xl font-extrabold'>SEO Related Information</h2>
                            <div>
                                {/* Seo Title */}
                                <div className="flex items-center mb-4">
                                    <h3 className='prose prose-xl font-bold mr-2'>Seo Title:</h3>
                                    <p className="text-gray-700">{pageRecord.seo_title}</p>
                                </div>

                                {/* Seo Description */}
                                <div className="flex items-center mb-4">
                                    <h3 className='prose prose-xl font-bold mr-2'>Seo Description:</h3>
                                    <p className="text-gray-700">{pageRecord.seo_description}</p>
                                </div>

                                {/* Seo Keywords */}
                                <div className="flex items-center">
                                    <h3 className='prose prose-xl font-bold mr-2'>Seo Keywords:</h3>
                                    <p className="text-gray-700">{pageRecord.seo_keywords}</p>
                                </div>
                            </div>

                        </div>
                        {/* seo tags end */}
                        {/* buttons */}
                        <div className="flex justify-center mt-8">
                            <div className="text-white">
                                <button
                                    className="text-slate-700 hover:text-gray-900 focus:outline-none"
                                    onClick={() => router.back()}
                                >
                                    <BsArrowLeft className="mr-2" />
                                    Go Back
                                </button>
                            </div>
                            <div className="text-red-500 ml-4">
                                <Link href={`/admin/pages/update/${pageId}`}>
                                    <button
                                        className="text-green-500 hover:text-green-900 focus:outline-none"
                                    >
                                        <BsPencil className="mr-2" />
                                        Update
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    )
}

export default page