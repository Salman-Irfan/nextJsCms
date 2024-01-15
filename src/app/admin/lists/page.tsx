"use client"
import Sidebar from '@/components/admin/Sidebar';
import ListingsTableView from '@/views/admin/listings/ListingsTableView';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
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
    useEffect(() => {
    }, [authToken]);

    return (
        <>
            <Sidebar />
            {/* Listings Table Component */}
            <ListingsTableView />
            {/* ListingsTableView' cannot be used as a JSX component.
  Its type '() => void' is not a valid JSX element type.
    Type '() => void' is not assignable to type '(props: any, deprecatedLegacyContext?: any) => ReactNode'.
      Type 'void' is not assignable to type 'ReactNode'.ts(2786) */}
        </>
    )
}

export default page