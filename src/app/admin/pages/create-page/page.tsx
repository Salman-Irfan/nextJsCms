"use client"
import Sidebar from '@/components/admin/Sidebar'
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
    const [formData, setFormData] = useState({
        page_name: '',
        page_title: '',
        page_content: '',
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
    });




    const handleEditorChange = (event: any, editor: any) => {
        const data = editor.getData();
        console.log('Editor data:', data);
        setFormData({
            ...formData,
            page_content: data,
        });
    };
    // function to handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    // function to handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);
        // Add your logic for submitting the form data to the backend
        try {
            // Send form data to the backend
            const response = await axios.post('http://localhost:3000/api/v1/admin/pages/add', formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.data.success) {
                // Handle success, for example, show a success toast
                toast({
                    title: 'Form Submission Successful',
                    description: 'Page added successfully!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            }
            // Optionally, you can redirect the user to another page after successful submission
            router.push('/admin/pages');
        } catch (error) {
            // Handle any unexpected errors
            console.log('Error submitting form:', error);
            // Handle success, for example, show a success toast
            toast({
                title: 'Error in Form Submission Successful',
                description: 'Error in form submission',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    return (
        <>
            <Sidebar />
            {/* parent div */}
            <div className="mx-32 mb-32 ">
                <h1 className="text-2xl font-bold mb-4 text-slate-900 text-center">Create Page</h1>
                
                <form onSubmit={handleSubmit} className="max-w-full mx-auto w-full ">
                    {/* Page Name */}
                    <div className="mb-4">
                        <label htmlFor="page_name" className="block text-sm font-medium text-gray-700">
                            Page Name
                        </label>
                        <input
                            type="text"
                            id="page_name"
                            name="page_name"
                            value={formData.page_name}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    {/* Page Title */}
                    <div className="mb-4">
                        <label htmlFor="page_title" className="block text-sm font-medium text-gray-700">
                            Page Title
                        </label>
                        <input
                            type="text"
                            id="page_title"
                            name="page_title"
                            value={formData.page_title}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    {/* Page Content */}
                    <div className="mb-4 ">
                        <label htmlFor="page_content" className="block text-sm font-medium text-gray-700">
                            Page Content
                        </label>
                        {/* CKEditor */}
                        <div className="mb-4 border border-black min-h-96">
                            <CKEditor
                                editor={ClassicEditor}
                                data={formData.page_content}
                                onChange={handleEditorChange}
                                config={{
                                    ckfinder: {
                                        uploadUrl: '/api/v1/admin/pages/uploads'
                                    },
                                    toolbar: [
                                        'heading',
                                        '|',
                                        'bold',
                                        'italic',
                                        'underline',
                                        'Strike Through',
                                        '|',
                                        'link',
                                        'imageUpload',
                                        'mediaEmbed',
                                        '|',
                                        'bulletedList',
                                        'numberedList',
                                        '|',
                                        'indent',
                                        'outdent',
                                        '|',
                                        'blockQuote',
                                        'insertTable',
                                        '|',
                                        'undo',
                                        'redo',
                                    ],
                                }}
                            />
                        </div>
                    </div>

                    {/* seo starts */}
                    <h2 className='prose prose-xl font-extrabold'>SEO Tags</h2>
                    {/* seo title starts */}
                    <div className="mb-4">
                        <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700">
                            SEO Title
                        </label>
                        <input
                            type="text"
                            id="seo_title"
                            name="seo_title"
                            value={formData.seo_title}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* seo title ends */}
                    {/* SEO Description starts */}
                    <div className="mb-4">
                        <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700">
                            SEO Description
                        </label>
                        <textarea
                            id="seo_description"
                            name="seo_description"
                            value={formData.seo_description}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* SEO Description ends */}
                    {/* seo keywords starts */}
                    <div className="mb-4">
                        <label htmlFor="seo_keywords" className="block text-sm font-medium text-gray-700">
                            SEO keywords
                        </label>
                        <textarea
                            id="seo_keywords"
                            name="seo_keywords"
                            value={formData.seo_keywords}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            placeholder='Enter values separated by Commas "," '
                            required
                        />
                    </div>
                    {/* seo keywords ends */}
                    {/* seo ends */}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    )
}

export default page