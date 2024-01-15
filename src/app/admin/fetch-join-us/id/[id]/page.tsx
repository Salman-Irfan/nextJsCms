"use client"
// Import necessary dependencies and components
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BsArrowLeft, BsTrash } from 'react-icons/bs';

const JoinUsDetailsPage: React.FC = ({ params }: any) => {
    // hooks
    const id = params.id;
    const router = useRouter();
    const toast = useToast();

    // state variables
    const [joinUsRecord, setJoinUsRecord] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Fetch join us record details on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/admin/join-us/${id}`);
                setJoinUsRecord(response.data.joinUsRecord);
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

    // Function to handle delete action
    const handleDelete = async () => {
        try {
            // Perform the delete action, for example:
            // await axios.delete(`http://localhost:3000/api/v1/admin/join-us/delete/${id}`);

            // Show a success toast
            toast({
                title: 'Success',
                description: 'Join us record has been deleted successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Redirect to the join us list page
            router.push('/admin/join-us-list');
        } catch (error) {
            console.error('Error deleting join us record:', error);

            // Show an error toast
            toast({
                title: 'Error',
                description: 'An error occurred while deleting the join us record.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Sidebar />
            {/* parent div */}
            <div className="mx-32 mb-32">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Join Us Details</h1>

                {loading ? (
                    <p className="text-slate-700">Loading...</p>
                ) : joinUsRecord ? (
                    // Render API results
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-md shadow-md space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-white">User ID:</div>
                            <div className="text-white font-semibold">{joinUsRecord.id}</div>
                            <div className="text-white">User Name:</div>
                            <div className="text-white font-semibold">{joinUsRecord.user_name}</div>
                            <div className="text-white">Email:</div>
                            <div className="text-white font-semibold">{joinUsRecord.email}</div>
                            <div className="text-white">Phone:</div>
                            <div className="text-white font-semibold">{joinUsRecord.phone}</div>
                            <div className="text-white">Message:</div>
                            {/* message border */}
                            <div className="border p-2">
                                <p className="text-white font-semibold">{joinUsRecord.message}</p>
                            </div>
                            <div className="text-white">Status:</div>
                            <div className="text-white font-semibold">{joinUsRecord.status}</div>
                            <div className="text-white">Created At:</div>
                            <div className="text-white font-semibold">{joinUsRecord.created_at}</div>
                        </div>

                        {/* buttons */}
                        <div className="flex justify-center mt-8">
                            <div className="text-white">
                                <button
                                    className="text-white hover:text-gray-300 focus:outline-none"
                                    onClick={() => router.back()}
                                >
                                    <BsArrowLeft className="mr-2" />
                                    Go Back
                                </button>
                            </div>
                            <div className="text-red-500 ml-4">
                                <button
                                    className="text-red-500 hover:text-red-300 focus:outline-none"
                                    onClick={handleDelete}
                                >
                                    <BsTrash className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-700">Join us record not found</p>
                )}
            </div>
        </>
    );
};

export default JoinUsDetailsPage;
