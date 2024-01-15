"use client"
// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { useToast, Select } from '@chakra-ui/react';
import axios from 'axios';
import { BsEye, BsTrash } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import getApiService from '@/services/apiServices/getApiService/getApiService';
import endPoints from '@/constants/client/endPoints/endPoints';
import Link from 'next/link';

// Define the interface for a single joinUsRecord
interface JoinUsRecord {
    id: number;
    user_name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const JoinUsPage: React.FC = () => {
    // redux
    const authToken = useSelector((state: any) => state.authToken.token);
    // hooks
    const router = useRouter();
    const toast = useToast();
    // state variables
    const [joinUsRecords, setJoinUsRecords] = useState<JoinUsRecord[]>([]);
    const [loading, setLoading] = useState(true);

    // API call to fetch join us records
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await axios.get('http://localhost:3000/api/v1/admin/join-us/fetch-all-join-us');
                const response = await getApiService(endPoints.FETCH_ALL_JOIN_US_BY_ADMIN)
                setJoinUsRecords(response.data.joinUsRecords);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    // Function to handle status change
    const handleStatusChange = async (index: number, newStatus: string) => {
        try {
            console.log("button clicked");
        } catch (error) {
            console.error('Error updating status:', error);

            // Show an error toast
            toast({
                title: 'Error',
                description: 'An error occurred while updating the status.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Render the component
    return (
        <>
            <Sidebar />
            <div className="mx-32 mb-32">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 text-center">Join Us Details</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-slate-700 text-white border border-black-700">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">User Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Phone</th>
                                <th className="py-2 px-4 border-b">Message</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-4 px-4 border-b">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                joinUsRecords && joinUsRecords.length > 0 ? (
                                    joinUsRecords.map((record) => (
                                        <tr key={record.id} className="hover:bg-slate-800">
                                            <td className="py-2 px-4 border-b">{record.user_name}</td>
                                            <td className="py-2 px-4 border-b">{record.email}</td>
                                            <td className="py-2 px-4 border-b">{record.phone}</td>
                                            <td className="py-2 px-4 border-b">{`${record.message.substring(0, 15)}${record.message.length > 15 ? '...' : ''
                                                }`}</td>
                                            <td className="py-2 px-4 border-b">
                                                {/* Add a dropdown menu for status */}
                                                <Select
                                                    value={record.status}
                                                    onChange={(e) => handleStatusChange(record.id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="rejected">Rejected</option>
                                                    <option value="approved">Approved</option>
                                                </Select>
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                <Link href={`/admin/fetch-join-us/id/${record.id}`}>
                                                    <button className="mr-2 text-blue-500 hover:text-blue-300 focus:outline-none">
                                                        <BsEye />
                                                    </button>
                                                </Link>
                                                <button className="text-red-500 hover:text-red-300 focus:outline-none">
                                                    <BsTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-4 px-4 border-b">
                                            No records found.
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default JoinUsPage;
