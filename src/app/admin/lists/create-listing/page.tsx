"use client"
import Sidebar from '@/components/admin/Sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select'; // Import react-select
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; // Import the styles
import postFormService from '@/services/apiServices/postFormService/postFormService';
import endPoints from '@/constants/client/endPoints/endPoints';
import CustomFields from '@/views/admin/listings/CustomFields';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Dropzone from 'react-dropzone';
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
    // State variables
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    // State variables for sub-categories
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    // State variable to track whether a parent category is selected
    const [isParentCategorySelected, setIsParentCategorySelected] = useState(false);
    // State variable to track selected categories for breadcrumb
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    // State variable to store custom fields
    const [customFields, setCustomFields] = useState([]);
    // State variables for handling file upload
    const [mainPicture, setMainPicture] = useState<File | null>(null);

    // Function to fetch sub-categories based on the selected parent category
    const fetchSubCategories = async (parentId: any) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/admin/categories/fetch-sub-category-from-parent-id/${parentId}`);
            const { data } = response;
            if (data.success) {
                setSubCategories(data.categories.map((subCategory: any) => ({
                    sub_category_id: subCategory.id,
                    label: subCategory.name,
                })));
            }
        } catch (error) {
            console.error('Error fetching sub-categories:', error);
        }
    };
    // Function to flatten the nested category structure for Select options
    const flattenCategories = (categories: any) => {
        let flattenedOptions = [];
        categories.forEach((category) => {
            // Add parent category
            flattenedOptions.push({
                category_id: category.id,
                label: category.name,
                isParent: true,
            });

            // Add sub-categories as nested options
            if (category.subCategories && category.subCategories.length > 0) {
                category.subCategories.forEach((subCategory) => {
                    flattenedOptions.push({
                        category_id: subCategory.id,
                        label: subCategory.name,
                        parentId: category.id,
                    });
                });
            }
        });
        return flattenedOptions;
    };
    // Update this function to handle parent category selection
    const handleParentCategoryChange = (value: any) => {
        setSelectedCategory(value);
        setSelectedSubCategory(null); // Reset sub-category when parent category changes
        setIsParentCategorySelected(!!value); // Set isParentCategorySelected based on whether a parent category is selected
        // Update the selected categories for breadcrumb
        setSelectedCategories([value]);

        // Fetch sub-categories based on the selected parent category
        if (value && value.parent_category_id) {
            const parentId = value.parent_category_id;
            fetchSubCategories(parentId);
        }
    };
    // Function to define styles based on the presence of parent_category_id
    const getOptionStyles = (option: any) => {
        const isParentCategory = option.parent_category_id === null;

        return {
            backgroundColor: isParentCategory ? '#b3d4fc' : '#e2f0cb', // Change background color based on the presence of parent_category_id
            color: isParentCategory ? 'black' : 'blue', // Change text color based on the presence of parent_category_id
            fontWeight: isParentCategory ? 'normal' : 'bold', // Change font weight based on the presence of parent_category_id
            cursor: isParentCategory ? 'not-allowed' : 'pointer', // Change cursor based on whether it is a parent category
            marginLeft: isParentCategory ? 0 : '20px', // Adjust the left margin for subcategories
            transition: 'background-color 0.3s ease', // Add transition for smoother hover effect
            '&:hover': {
                backgroundColor: isParentCategory ? '#9fc4f2' : '#c5e6b4', // Change background color on hover
            },
        };
    };
    // Update this function to handle sub-category selection
    const handleSubCategoryChange = (value: any) => {
        setSelectedSubCategory(value);
        // Update the selected categories for breadcrumb
        setSelectedCategories([selectedCategory, value]);
    };

    // Handle file drop or selection
    const handleDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            // Only consider the first file in case of multiple uploads
            setMainPicture(acceptedFiles[0]);
        }
    };

    const [formData, setFormData] = useState({
        category_id: null,
        title: '',
        description: '',
        shortDescription: '',
        address: '',
        tags: '',
        is_featured: false, // Default value is "No"
        city_id: null,
        map_url: "",
        twitter: "",
        linkedin: "",
        youtube: "",
        instagram: "",
        facebook: "",
        site_url: "",
        user_name: "",
        email: "",
        phone: "",
    });
    const handleEditorChange = (event: any, editor: any) => {
        const data = editor.getData();
        // console.log('Editor data:', data);
        setFormData({
            ...formData,
            description: data,
        });
    };
    const handlePhoneChange = (value: any, formattedValue: any) => {
        setFormData({
            ...formData,
            phone: formattedValue,
        });
    };

    // function to handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const organizeCategories = (categories: any) => {
        const organizedCategories: any = [];

        categories.forEach((category: any) => {
            if (!category.parent_category_id) {
                // If it's a parent category, add it directly to the organizedCategories
                organizedCategories.push({
                    ...category,
                    subcategories: [],
                });
            } else {
                // If it's a subcategory, find its parent category and add it to the subcategories array
                const parentCategory = organizedCategories.find(
                    (parent: any) => parent.id === category.parent_category_id
                );
                if (parentCategory) {
                    parentCategory.subcategories.push(category);
                }
            }
        });

        return organizedCategories;
    };

    // Fetch categories from API on component mount
    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/api/v1/admin/categories/fetch-all-categories'
                );
                if (response.data.success) {
                    setCategories(response.data.categories);
                } else {
                    // Handle error if needed
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                // Handle error if needed
                console.error('Failed to fetch categories', error);
            }
        };

        fetchParentCategories();
    }, []); // Empty dependency array ensures this runs only once on component mount
    // fetch sub categories from parent category id start
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                if (selectedCategory) {
                    const response = await axios.get(
                        `http://localhost:3000/api/v1/admin/categories/fetch-sub-category-from-parent-id/${selectedCategory.category_id}`
                    );
                    if (response.data.success) {
                        setSubCategories(response.data.categories);
                    } else {
                        // Handle error if needed
                        console.error('Failed to fetch sub-categories');
                    }
                }
            } catch (error) {
                // Handle error if needed
                console.error('Failed to fetch sub-categories', error);
            }
        };

        fetchSubCategories();
    }, [selectedCategory]);
    // fetch sub categories from parent category id end
    // Fetch cities from API on component mount
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/api/v1/admin/cities/fetch-all-cities'
                );
                if (response.data.success) {
                    setCities(response.data.cities);
                } else {
                    // Handle error if needed
                    console.error('Failed to fetch cities');
                }
            } catch (error) {
                // Handle error if needed
                console.error('Failed to fetch categories', error);
            }
        };

        fetchCities();
    }, []); // Empty dependency array ensures this runs only once on component mount
    // Fetch custom fields from API based on selected sub-category
    useEffect(() => {
        const fetchCustomFields = async () => {
            try {
                if (selectedSubCategory) {
                    const response = await axios.get(
                        `http://localhost:3000/api/v1/admin/custom-fields/fetch-custom-fields-from-category-id/${selectedSubCategory.sub_category_id}`
                    );
                    if (response.data.success) {
                        setCustomFields(response.data.customFieldResult);
                    } else {
                        console.error('Failed to fetch custom fields');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch custom fields', error);
            }
        };

        fetchCustomFields();
    }, [selectedSubCategory]);

    // Function to handle custom field input change
    const handleCustomFieldChange = (fieldId: any, value: any) => {
        setFormDataWithCustomFields((prevData) => ({
            ...prevData,
            customFields: {
                ...prevData.customFields,
                [fieldId]: value,
            },
        }));
    };

    // Handle form submission
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     const category_id = selectedSubCategory?.sub_category_id?.toString() || ''
    //     const city_id = selectedCity?.city_id?.toString() || ''
    //     // on form submission, console the category_id, title, description, city_id
    //     // Logging values
    //     formData.category_id = category_id
    //     formData.city_id = city_id
    //     console.log('Form data:', formData);
    //     // Log the main_picture file
    //     console.log('Main Picture:', mainPicture); // also send this file with formData to the api server
    //     // calling api
    //     try {
    //         // Make an Axios POST request
    //         // const response = await axios.post( 'http://localhost:3000/api/v1/admin/lists/add-list',formData);

    //         const response = await postFormService(endPoints.ADD_LIST, formData)
    //         // Check if the request was successful
    //         if (response.data.success) {
    //             const insertId = response.data.insertId
    //             // Show success toast notification
    //             toast({
    //                 title: 'List item created successfully',
    //                 status: 'success',
    //                 duration: 5000,
    //                 isClosable: true,
    //             });

    //             // redirect to upoading main picture
    //             router.push(`/admin/lists/create-listing/upload-main-picture/${insertId}`);

    //         } else {
    //             // Show error toast notification
    //             toast({
    //                 title: 'Failed to create list item',
    //                 description: response.data.message,
    //                 status: 'error',
    //                 duration: 5000,
    //                 isClosable: true,
    //             });
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         toast({
    //             title: 'Error',
    //             description: 'An error occurred while creating the list item.',
    //             status: 'error',
    //             duration: 5000,
    //             isClosable: true,
    //         });
    //     }
    // };

    // handle form submission with main picture
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const category_id = selectedCategory?.category_id?.toString() || '';
        const city_id = selectedCity?.city_id?.toString() || '';

        // Set category_id and city_id in formData
        formData.category_id = category_id;
        formData.city_id = city_id;

        // Create FormData object to send both data and file
        const formDataToSend = new FormData();
        formDataToSend.append('category_id', category_id);
        formDataToSend.append('city_id', city_id);

        // Append other form data fields
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        // Append the mainPicture file
        if (mainPicture) {
            formDataToSend.append('mainPicture', mainPicture);
        }

        console.log('Form data:', formDataToSend);

        try {
            const response = await postFormService(endPoints.ADD_LIST, formDataToSend);

            if (response.data.success) {
                const insertId = response.data.insertId;

                toast({
                    title: 'List item created successfully',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });

                router.push(`/admin/lists/create-listing/upload-gallery-pictures/${insertId}`);
            } else {
                toast({
                    title: 'Failed to create list item',
                    description: response.data.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                description: 'An error occurred while creating the list item.',
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
            <div className="mx-32 mb-32">
                {/* bread crumb start */}
                <Breadcrumb
                    spacing="8px"
                    separator={<ChevronRightIcon color="gray.500" />}
                    textAlign="center"
                    bg="gray.100"
                    p="4"
                    borderRadius="md"
                    fontWeight="semibold"
                    fontSize="lg"
                >
                    {/* listing start */}
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink
                            href="/admin/lists/create-listing"
                            color="blue.500"
                            _hover={{ color: 'blue.600' }}
                        >
                            Listing Details
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {/* listing end */}

                    {/* main photo start */}
                    {/* <BreadcrumbItem>
                        <BreadcrumbLink color="yellow.500" _hover={{ color: 'yellow.600' }}>
                            Main Photo
                        </BreadcrumbLink>
                    </BreadcrumbItem> */}
                    {/* main photo end*/}

                    {/* Photos Gallery start */}
                    <BreadcrumbItem>
                        <BreadcrumbLink color="yellow.500" _hover={{ color: 'yellow.600' }}>
                            Photos
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {/* Photos Gallery end */}

                    {/* Video Urls start */}
                    <BreadcrumbItem>
                        <BreadcrumbLink color="yellow.500" _hover={{ color: 'yellow.600' }}>
                            Videos
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {/* Video Urls end */}
                </Breadcrumb>
                {/* bread crumb end */}
                <h1 className="text-2xl font-bold mb-4 text-slate-900 text-center">Create Listing</h1>
                {/* Responsive form with react-select */}
                <form onSubmit={handleSubmit} className="max-w-full mx-auto w-full">
                    {/* parent category start */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 py-2">Select a Category</label>
                        {/* drop down menu for category api */}
                        <Select
                            options={categories.map((category) => ({
                                category_id: category.id,
                                label: category.name,
                                parent_category_id: category.parent_category_id,
                            }))}
                            value={selectedCategory}
                            onChange={(value) => handleParentCategoryChange(value)}
                            placeholder="Select a category"
                            styles={{ option: (styles, { data }) => getOptionStyles(data) }}
                        />
                    </div>
                    {/* parent category end */}

                    {/* sub-category start */}

                    {/* {isParentCategorySelected && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 py-2">Select a Sub-Category</label>

                            <Select
                                options={subCategories.map((subCategory) => ({
                                    sub_category_id: subCategory.id,
                                    label: subCategory.name,
                                }))}
                                value={selectedSubCategory}
                                onChange={(value) => handleSubCategoryChange(value)}
                                placeholder="Select a sub-category"
                            />
                        </div>
                    )} */}

                    {/* sub-category end */}
                    {/* Breadcrumb display start */}
                    {/* <div className="mb-4">
                        <div className="flex">
                            {selectedCategories.map((category, index) => (
                                <div key={category.category_id} className="mr-2">
                                    {index > 0 && <span className="text-gray-500"> / </span>}
                                    <span className={`text-blue-600 font-semibold ${index === selectedCategories.length - 1 ? 'underline' : ''}`}>
                                        {category.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div> */}
                    {/* Breadcrumb display end */}

                    {/* title start */}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Page Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* title end */}
                    {/* Description start */}
                    <div className="mb-4 ">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        {/* CKEditor */}
                        <div className="mb-4 border border-black min-h-96">
                            <CKEditor
                                editor={ClassicEditor}
                                data={formData.description}
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
                    {/* short description start */}
                    <div className="mb-4">
                        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                            Short Description
                        </label>
                        <textarea
                            id="shortDescription"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            placeholder='Enter short description'
                            required
                        />
                    </div>
                    {/* short description end */}
                    {/* tags start */}
                    <div className="mb-4">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                            Tags
                        </label>
                        <textarea
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            placeholder='Enter Comma Separated Values ","'
                            required
                        />
                    </div>
                    {/* tags end */}
                    {/* is featured start */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 py-2">Is Featured?</label>
                        <div className="flex items-center">
                            <label htmlFor="isFeaturedYes" className="mr-2">
                                <input
                                    type="radio"
                                    id="isFeaturedYes"
                                    name="is_featured"
                                    value="true"
                                    checked={formData.is_featured === "true"}
                                    onChange={handleInputChange}
                                />
                                Yes
                            </label>
                            <label htmlFor="isFeaturedNo">
                                <input
                                    type="radio"
                                    id="isFeaturedNo"
                                    name="is_featured"
                                    value="false"
                                    checked={formData.is_featured === "false"}
                                    onChange={handleInputChange}
                                />
                                No
                            </label>
                        </div>
                    </div>
                    {/* is featured end */}


                    {/* location info start */}
                    <h2 className='prose prose-xl font-extrabold'>Location Information</h2>

                    {/* city start */}
                    <label className="block text-sm font-medium text-gray-700">Select a City</label>
                    {/* drop down menu for city api */}
                    <Select
                        options={cities.map((city) => ({
                            city_id: city.id,
                            label: city.name,
                        }))}
                        value={selectedCity}
                        onChange={(value) => setSelectedCity(value)}
                        placeholder="Select a city"
                    />
                    {/* city end */}
                    {/* 
                        display custom fields here,
                    */}
                    {/* Render the CustomFields component here */}
                    <CustomFields customFields={customFields} />
                    {/* address start */}
                    <div className="mb-4 flex items-center justify-end">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                            Address:
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="mt-1 ml-4 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* address end */}
                    {/* map url start */}
                    <div className="mb-4 flex items-center justify-end">
                        <label htmlFor="map_url" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                            Map Url:
                        </label>
                        <input
                            type="text"
                            id="map_url"
                            name="map_url"
                            value={formData.map_url}
                            onChange={handleInputChange}
                            className="mt-1 ml-4 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* map url end */}
                    {/* location info end */}

                    {/* social media links start */}
                    <h2 className='prose prose-xl font-extrabold'>Social Media Links</h2>
                    {/* twitter start */}
                    <div className="mb-4 flex items-center justify-end">
                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                            Twitter:
                        </label>
                        <input
                            type="text"
                            id="twitter"
                            name="twitter"
                            value={formData.twitter}
                            onChange={handleInputChange}
                            className="mt-1 ml-4 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* twitter end */}

                    {/* linkedin start */}
                    <div className="mb-4 flex items-center justify-end">
                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                            Linkedin:
                        </label>
                        <input
                            type="text"
                            id="linkedin"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            className="mt-1 ml-4 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* linkedin end */}

                    {/* youtube start */}
                    <div className="mb-4 flex items-center justify-end">
                        <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                            Youtube:
                        </label>
                        <input
                            type="text"
                            id="youtube"
                            name="youtube"
                            value={formData.youtube}
                            onChange={handleInputChange}
                            className="mt-1 ml-4 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* youtube end */}

                    {/* instagram start */}
                    <div className="mb-4 flex items-center justify-end">
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                            Instagram:
                        </label>
                        <input
                            type="text"
                            id="instagram"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleInputChange}
                            className="mt-1 ml-4 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* instagram end */}

                    {/* facebook start */}
                    <div className="mb-4 flex items-center justify-end">
                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                            Facebook:
                        </label>
                        <input
                            type="text"
                            id="facebook"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleInputChange}
                            className="mt-1 ml-4 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* facebook end */}

                    {/* site_url start */}
                    <div className="mb-4 flex items-center justify-end">
                        <label htmlFor="site_url" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                            Site URL:
                        </label>
                        <input
                            type="text"
                            id="site_url"
                            name="site_url"
                            value={formData.site_url}
                            onChange={handleInputChange}
                            className="mt-1 ml-4 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* site_url end */}

                    {/* user information start */}
                    <h2 className='prose prose-xl font-extrabold'>User's Information</h2>
                    {/* user_name start */}
                    <div className="mb-4 flex items-center justify-end">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                            User Name:
                        </label>
                        <input
                            type="text"
                            id="user_name"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleInputChange}
                            className="mt-1 ml-4 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* user_name end */}
                    {/* email start */}
                    <div className="mb-4 flex items-center justify-end">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 ml-4 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* email end */}
                    {/* phone start */}
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone:
                        </label>
                        <PhoneInput
                            country={'pk'} // Set the default country (you can change it based on your needs)
                            value={formData.phone}
                            onChange={(value, country, e, formattedValue) => handlePhoneChange(value, formattedValue)}
                            inputProps={{
                                name: 'phone',
                                required: true,
                                autoFocus: false,
                                className: 'mt-1 pl-16 py-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300',
                            }}
                        />
                    </div>
                    {/* phone end */}
                    {/* user information end */}
                    {/* logo start */}
                    <h4 className="mt-6 font-bold text-slate-900">Upload Logo: </h4>
                    {/* Dropzone component */}
                    <Dropzone onDrop={handleDrop} accept="image/*" multiple={false}>
                        {({ getRootProps, getInputProps }) => (
                            <div className="border-2 border-dashed border-gray-400 rounded-md p-8 text-center" {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p className="text-gray-600">Drag 'n' drop an image here, or click to select one</p>
                                {mainPicture && (
                                    <div className="mt-4">
                                        <p className="text-green-500 font-semibold">Selected Image:</p>
                                        <img src={URL.createObjectURL(mainPicture)} alt="Main Picture" className="mt-2 max-w-xs h-auto" />
                                    </div>
                                )}
                            </div>
                        )}
                    </Dropzone>
                    {/* Form with file input */}
                    {/* log0 end */}
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white rounded-full px-6 py-2"
                    >
                        Next
                    </button>
                </form>
            </div>
        </>
    )
}

export default page