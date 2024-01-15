"use client"
// Import necessary dependencies and components
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BsArrowLeft, BsTrash } from 'react-icons/bs';
import { useSelector } from 'react-redux';

const ContactUsDetailsPage: React.FC = ({ params }: any) => {
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
    // hooks
    const id = params.id

    // state variables
    const [contactUsRecord, setContactUsRecord] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Fetch contact us record details on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/admin/contact-us/${id}`);
                setContactUsRecord(response.data.contactUsRecord);
            } catch (error) {
                console.error('Error fetching data:', error);

                // Show an error toast
                toast({
                    title: 'Error',
                    description: 'An error occurred while fetching the data.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return (
        <>
            <Sidebar />
            {/* parent div */}
            <div className="mx-32 mb-32">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Contacted Person Details</h1>

                {loading ? (
                    <p className="text-slate-700">Loading...</p>
                ) : contactUsRecord ? (
                    // Render API results
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-md shadow-md space-y-4">
                        <p className="text-2xl font-semibold text-white">Contact Details</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-white">User ID:</div>
                            <div className="text-white font-semibold">{contactUsRecord.id}</div>
                            <div className="text-white">User Name:</div>
                            <div className="text-white font-semibold">{contactUsRecord.user_name}</div>
                            <div className="text-white">Email:</div>
                            <div className="text-white font-semibold">{contactUsRecord.email}</div>
                            <div className="text-white">Phone:</div>
                            <div className="text-white font-semibold">{contactUsRecord.phone}</div>
                            <div className="text-white">Message:</div>
                            {/* message border */}
                            <div className="border p-2">
                                <p className="text-white font-semibold">{contactUsRecord.message}</p>
                            </div>
                            <div className="text-white">Created At:</div>
                            <div className="text-white font-semibold">{contactUsRecord.created_at}</div>
                        </div>
                            {/* buttons */}
                            <div className="flex justify-center mt-8">
                                <div className="text-white">
                                    <button
                                        className="text-slate-900 hover:text-slate-700 px-4 bg-green-300 hover:bg-green-200 focus:outline-none"
                                        onClick={() => router.back()}
                                    >
                                        <BsArrowLeft className="mr-2" />
                                        Go Back
                                    </button>
                                </div>
                                <div className="text-red-500 ml-4">
                                    <button
                                        className="text-red-500 hover:text-red-300 focus:outline-none"
                                        onClick={()=>{console.log("first")}}
                                    >
                                        <BsTrash className="mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                    </div>
                    
                ) : (
                    <p className="text-slate-700">Contact not found</p>
                )}
            </div>
        </>
    );
};

export default ContactUsDetailsPage;
