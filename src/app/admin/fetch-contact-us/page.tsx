"use client"
import Sidebar from '@/components/admin/Sidebar';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BsEye, BsTrash } from 'react-icons/bs';
import getApiService from '@/services/apiServices/getApiService/getApiService';
import endPoints from '@/constants/client/endPoints/endPoints';
import Link from 'next/link';

// Define the interface for a single contactUsRecord
interface ContactUsRecord {
    id: number; // Add this line to include the id property
    user_name: string;
    email: string;
    phone: string;
    message: string;
    created_at: string;
    updated_at: string;
}

const Page = () => {
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
    const [contactUsRecords, setContactUsRecords] = useState<ContactUsRecord[]>([]);
    const [loading, setLoading] = useState(true);
    // api call
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await axios.get('http://localhost:3000/api/v1/admin/contact-us/fetch-all-contact-us');
                const response = await getApiService(endPoints.FETCH_ALL_CONTACT_US_BY_ADMIN);
                setContactUsRecords(response.data.contactUsRecords);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            <Sidebar />
            {/* parent div */}
            <div className="mx-32 mb-32">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 text-center">Contact Us Details</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-slate-700 text-white border border-black-700">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">User Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Phone</th>
                                <th className="py-2 px-4 border-b">Message</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-4 px-4 border-b">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                contactUsRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-800">
                                        <td className="py-2 px-4 border-b">{record.user_name}</td>
                                        <td className="py-2 px-4 border-b">{record.email}</td>
                                        <td className="py-2 px-4 border-b">{record.phone}</td>
                                        <td className="py-2 px-4 border-b">{`${record.message.substring(0, 15)}${record.message.length > 15 ? '...' : ''
                                            }`}</td>
                                        <td className="py-2 px-4 border-b">
                                            {/* view button */}
                                            <Link href={`/admin/fetch-contact-us/id/${record.id}`}>
                                                <button className="mr-2 text-blue-500 hover:text-blue-300 focus:outline-none">
                                                    <BsEye />
                                                </button>
                                            </Link>
                                            {/* delete button */}
                                            <button className="text-red-500 hover:text-red-300 focus:outline-none">
                                                <BsTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Page;
