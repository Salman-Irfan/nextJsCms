"use client"
// Import necessary dependencies
import Sidebar from '@/components/admin/Sidebar';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditPage = ({ params }: any) => {
    // redux
    const authToken = useSelector((state: any) => state.authToken.token);
    // hooks
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(true);

    // State for CKEditor content
    const [editorContent, setEditorContent] = useState('');

    // Check if authToken is null and redirect to /auth/admin/login
    if (!authToken) {
        // show alert toast notification from chakra ui
        toast({
            title: 'Unauthorized Access',
            description: 'You need to log in to access this page.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
        });
        router.push('/auth/admin/login');
        return null; // You may also render a loading state or something else here
    }

    const [pageData, setPageData] = useState({
        page_name: '',
        page_title: '',
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
    });

    // Fetch page data by ID
    useEffect(() => {
        const fetchPageById = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/v1/admin/pages/${params.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                if (response.data.success) {
                    const { pageRecord } = response.data;
                    setPageData({
                        page_name: pageRecord.page_name,
                        page_title: pageRecord.page_title,
                        seo_title: pageRecord.seo_title,
                        seo_description: pageRecord.seo_description,
                        seo_keywords: pageRecord.seo_keywords,
                    });
                    setEditorContent(pageRecord.page_content);
                } else {
                    // Handle error if needed
                    console.error('Failed to fetch page data');
                }
            } catch (error) {
                // Handle error if needed
                console.error('Failed to fetch page data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPageById();
    }, [authToken, params.id]);

    const handleUpdate = async () => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/v1/admin/pages/update/${params.id}`,
                { ...pageData, page_content: editorContent },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (response.data.success) {
                toast({
                    title: 'Page data updated successfully',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                router.push('/admin/pages');
            } else {
                // Handle update failure
                toast({
                    title: 'Failed to update page data',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error updating page data:', error);
        }
    };

    if (loading) {
        // You can replace this with your loading spinner component or logic
        return <div className="mx-64 mb-32">Loading...</div>;
    }

    return (
        <>
            <Sidebar />
            <div className="mx-32 mb-32">
                <h1 className="text-2xl font-bold mb-4 text-slate-900 text-center">
                    Edit Page
                </h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate();
                    }}
                >
                    {/* Other inputs */}
                    <label className="block mt-4 text-sm font-medium text-gray-700">
                        Page Name
                    </label>
                    <input
                        type="text"
                        name="page_name"
                        value={pageData.page_name}
                        onChange={(e) => setPageData({ ...pageData, page_name: e.target.value })}
                        className="w-full px-4 py-2 mt-1 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
                    />

                    <label className="block mt-4 text-sm font-medium text-gray-700">
                        Page Title
                    </label>
                    <input
                        type="text"
                        name="page_title"
                        value={pageData.page_title}
                        onChange={(e) => setPageData({ ...pageData, page_title: e.target.value })}
                        className="w-full px-4 py-2 mt-1 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
                    />

                    {/* CKEditor */}
                    <label className="block mt-4 text-sm font-medium text-gray-700">
                        Page Content
                    </label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={editorContent}
                        onChange={(event, editor) => setEditorContent(editor.getData())}
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
                    {/* seo tags start */}
                    {/* seo title start*/}
                    <label className="block mt-4 text-sm font-medium text-gray-700">
                        SEO Title
                    </label>
                    <input
                        type="text"
                        name="seo_title"
                        value={pageData.seo_title}
                        onChange={(e) => setPageData({ ...pageData, seo_title: e.target.value })}
                        className="w-full px-4 py-2 mt-1 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
                    />
                    {/* seo title end*/}
                    {/* seo description start */}
                    <label className="block mt-4 text-sm font-medium text-gray-700">
                        SEO Description
                    </label>
                    <textarea
                        name="seo_description"
                        value={pageData.seo_description}
                        onChange={(e) => setPageData({ ...pageData, seo_description: e.target.value })}
                        className="w-full px-4 py-2 mt-1 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
                    />
                    {/* seo description end */}
                    {/* seo keywords start */}
                    <label className="block mt-4 text-sm font-medium text-gray-700">
                        SEO Keywords
                    </label>
                    <textarea
                        name="seo_keywords"
                        value={pageData.seo_keywords}
                        onChange={(e) => setPageData({ ...pageData, seo_keywords: e.target.value })}
                        className="w-full px-4 py-2 mt-1 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
                    />
                    {/* seo keywords end */}
                    {/* seo tags end */}
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white rounded-full px-6 py-2"
                    >
                        Update
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditPage;
