import { Button, Skeleton, useToast } from '@chakra-ui/react';
import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import deleteApiService from '@/services/apiServices/deleteApiService/deleteApiService';
import endPoints from '@/constants/client/endPoints/endPoints';
import Link from 'next/link';

const ListingsTableView = () => {
    // hooks
    const toast = useToast();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from the API
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/admin/lists/fetch-all-lists');
            if (response.data.success) {
                setListings(response.data.listings);
            } else {
                console.error('Error fetching listings:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            // Set loading to false once data is fetched
            setLoading(false);
        }
    };

    useEffect(() => {
        // Call the fetchData function
        fetchData();
    }, []); // Empty dependency array means this effect will run once after the first render

    // function to delete listing
    const handleDelete = async (listingId: any) => {
        try {
            // const response = await axios.delete(`http://localhost:3000/api/v1/admin/lists/delete/${listingId}`)
            const response = await deleteApiService(`${endPoints.ADMIN_DELETE_LISTING}/${listingId}`)
            if (response.data.success) {
                // Cannot find name 'fetchPages'.
                fetchData();
                toast({
                    title: 'Listing deleted successfully',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                // Handle deletion failure
                toast({
                    title: 'Failed to delete listing',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error deleting listing:', error);
            // Handle deletion failure
            toast({
                title: 'An Error Occurred while deleting the listing',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }
    // styles
    const headerCellStyle = "px-4 py-2 text-lg font-bold bg-slate-800 text-white";
    const dataCellStyle = "text-center py-2";
    return (
        <div className="mx-32 mb-32">
            <h1 className="text-2xl font-bold mb-4 text-slate-900 text-center">All Listings</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-slate-700 text-white border border-black-700">
                    {/* design the table more prominent than its data rows */}
                    <thead>
                        <tr>
                            <th className={headerCellStyle}>Listing ID</th>
                            <th className={headerCellStyle}>Title</th>
                            <th className={headerCellStyle}>User Name</th>
                            <th className={headerCellStyle}>City</th>
                            <th className={headerCellStyle}>Main Photo</th>
                            <th className={headerCellStyle}>Created At</th>
                            <th className={headerCellStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            // Display Skeleton while loading
                            <tr>
                                <td colSpan="7">
                                    <Skeleton height="20px" />
                                </td>
                                <td colSpan="7">
                                    <Skeleton height="20px" />
                                </td>
                                <td colSpan="7">
                                    <Skeleton height="20px" />
                                </td>
                            </tr>
                        ) : (
                            // Display data when available
                            Array.isArray(listings) && listings.length > 0 ?
                                (
                                    listings.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-slate-600 hover:text-gray-200 transition border-b-2 border-slate-800 py-2">
                                            <td className={dataCellStyle}>{listing.id}</td>
                                            <td className={dataCellStyle}>{listing.title}</td>
                                            <td className={dataCellStyle}>{listing.user_name}</td>
                                            <td className={dataCellStyle}>{listing.city_name}, {listing.country}</td>
                                            <td className={dataCellStyle}>
                                                <img
                                                    src={`${listing.main_picture}`}
                                                    alt={listing.title}
                                                    className="w-32 h-16 object-cover rounded"
                                                />
                                            </td>
                                            <td className={dataCellStyle}>{listing.created_at}</td>
                                            <td>
                                                {/* view */}
                                                <Link href={`/admin/lists/id/${listing.id}`} >
                                                    <Button className='mx-2' colorScheme='teal' variant='solid'>
                                                        <ViewIcon />
                                                    </Button>
                                                </Link>
                                                {/* edit */}
                                                <Link href={`/admin/lists/update/${listing.id}`} >
                                                    <Button className='mx-2' colorScheme='yellow' variant='solid'>
                                                        <EditIcon />
                                                    </Button>
                                                </Link>
                                                {/* delete */}
                                                <Button
                                                    className='mx-2'
                                                    colorScheme='red'
                                                    onClick={() => handleDelete(listing.id)}
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))

                                ) : (
                                    // Handle case where listings is empty or not an array
                                    <tr>
                                        <td colSpan="7">No data available</td>
                                    </tr>
                                )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListingsTableView;
