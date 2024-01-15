"use client"
// Import necessary dependencies
import Sidebar from '@/components/admin/Sidebar';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import axios from 'axios';
import Dropzone, { useDropzone } from 'react-dropzone';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; // Import the styles

const UpdateListingPage = ({ params }: any) => {
    // Redux
    const authToken = useSelector((state: any) => state.authToken.token);
    // Hooks
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
    const listingId = params.id
    // State variables
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState({});
    // State variables for handling file upload
    const [mainPicture, setMainPicture] = useState<File | null>(null);
    const [mainPictureUrl, setMainPictureUrl] = useState<string | null>(null);
    // State variables for handling gallery images
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>([]);

    // from create listings
    // State variables for sub-categories
    // State variable to track the loading state
    const [isLoading, setIsLoading] = useState(true);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    // State variable to track whether a parent category is selected
    const [isParentCategorySelected, setIsParentCategorySelected] = useState(false);
    // State variable to track selected categories for breadcrumb
    const [selectedCategories, setSelectedCategories] = useState([]);
    // State variable for form data
    const [formData, setFormData] = useState({
        category_id: null,
        title: '',
        description: '',
        shortDescription: '',
        tags: '',
        is_featured: '',
        city_id: null,
        address: '',
        map_url: '',
        twitter: '',
        linkedin: '',
        youtube: '',
        instagram: '',
        facebook: '',
        site_url: '',
        user_name: '',
        email: '',
        phone: '',
        videoUrls: [],
    });
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
    // Fetch categories from API on component mount
    const fetchCategories = async () => {
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
    useEffect(() => {
        fetchCategories();
    }, []);
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
    }, [selectedCity]); // Empty dependency array ensures this runs only once on component mount

    // Fetch existing listing details on component mount
    const fetchListingDetails = async () => {
        try {
            // Set loading state to true
            setIsLoading(true);
            const response = await axios.get(`http://localhost:3000/api/v1/admin/lists/fetch-list-by-id/${listingId}`);
            const { data } = response;
            if (data.success && data.results.length > 0) {
                const listingDetails = data.results[0];

                // Set selected category based on the response
                const selectedCategory = {
                    category_id: listingDetails.category_id,
                    label: listingDetails.category_name,
                    parent_category_id: null, // Assuming there is no parent category in the API response
                };
                setSelectedCategory(selectedCategory);

                // Set selected city based on the response
                const selectedCity = {
                    city_id: listingDetails.city_id,
                    label: listingDetails.city_name,
                };
                setSelectedCity(selectedCity);
                // Set main picture URL based on the response
                if (listingDetails.main_picture) {
                    setMainPictureUrl(`${listingDetails.main_picture}`);
                }
                // Set gallery images based on the response
                if (listingDetails.photoUrls) {
                    setGalleryImageUrls(listingDetails.photoUrls);
                }
                // set form data
                setFormData({
                    category_id: selectedCategory.category_id,
                    title: listingDetails.title,
                    description: listingDetails.description,
                    shortDescription: listingDetails.short_description,
                    tags: listingDetails.tags,
                    is_featured: listingDetails.is_featured === 0 ? "false" : "true",
                    city_id: listingDetails.city_id,
                    address: listingDetails.address,
                    map_url: listingDetails.map_url,
                    twitter: listingDetails.twitter,
                    linkedin: listingDetails.linkedin,
                    youtube: listingDetails.youtube,
                    instagram: listingDetails.instagram,
                    facebook: listingDetails.facebook,
                    site_url: listingDetails.site_url,
                    user_name: listingDetails.user_name,
                    email: listingDetails.email,
                    phone: listingDetails.phone,
                    videoUrls: listingDetails.videoUrls || [],
                });
            } else {
                // Handle error if needed
                console.error('Failed to fetch listing details');
            }
        } catch (error) {
            // Handle error if needed
            console.error('Failed to fetch listing details', error);
        } finally {
            // Set loading state to false after fetching data
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchListingDetails();
    }, [params.id]);
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
    // Handle file drop or selection for gallery images
    const handleGalleryDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setGalleryImages(acceptedFiles);
        }
    };
    // Remove selected gallery image by index
    const removeGalleryImage = (index: any) => {
        const updatedGalleryImages = [...galleryImages];
        updatedGalleryImages.splice(index, 1);
        setGalleryImages(updatedGalleryImages);
    };

    // Remove existing gallery image URL by index
    const removeGalleryImageUrl = (index: any) => {
        const updatedGalleryImageUrls = [...galleryImageUrls];
        updatedGalleryImageUrls.splice(index, 1);
        setGalleryImageUrls(updatedGalleryImageUrls);
    };
    // Handle input change for video URLs
    const handleVideoUrlChange = (index:any, value:any) => {
        setFormData((prevData:any) => ({
            ...prevData,
            videoUrls: prevData.videoUrls.map((url:any, i:any) => (i === index ? value : url)),
        }));
    };
    // Handle input change for form fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    // Handle update form submission
    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Include the selected file in formData
        const updatedFormData = {
            ...formData,
            mainPicture: mainPicture, // Add the selected file to formData
            galleryImages: galleryImages,
            galleryImageUrls: galleryImageUrls
        };

        // Log the updated formData
        // console.log(updatedFormData);

        // Create FormData object to send both data and file
        const formDataToSend = new FormData();
        // Append other form data fields
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });
        // Append the mainPicture file
        if (mainPicture) {
            formDataToSend.append('mainPicture', mainPicture);
        }
        if(galleryImages){
            // Append galleryImages array
            galleryImages.forEach((galleryImage, index) => {
                formDataToSend.append(`galleryImages[${index}]`, galleryImage);
            });
        }
        console.log('Form data:', formDataToSend);
        try {
            // Make Axios PUT request to update the list item
            const response = await axios.put(
                `http://localhost:3000/api/v1/admin/lists/update-list/${listingId}`,
                formDataToSend
            );
            // Check if the request was successful
            if (response.data.success) {
                // Log success message
                console.log(response.data.message);
                toast({
                    title: 'List item updated successfully',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });

                router.push(`/admin/lists`);
                // You can perform additional actions here if needed
            } else {
                // Log an error message if the request was not successful
                console.error('Failed to update list item:', response.data.message);
                toast({
                    title: 'Failed to Update listing',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            // Handle any errors that occurred during the request
            console.error('Error updating list item:', error);
            toast({
                title: 'Unable to update listing',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };


    return (
        <>
            <Sidebar />
            <div className="mx-32 mb-32">
                <h1 className="text-2xl font-bold mb-4 text-slate-900 text-center">
                    Update Listing
                </h1>
                {/* Display loader while fetching data */}
                {isLoading && <div className="text-center">Loading...</div>}
                {/* Responsive form with react-select */}
                {!isLoading && (
                    <form
                        onSubmit={handleUpdateSubmit}
                        className="max-w-full mx-auto w-full mt-8"
                    >
                        {/* Category dropdown start */}
                        <label className="block text-sm font-medium text-gray-700">
                            Select a Category
                        </label>
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
                        {/* category dropdown end */}
                        {/* title start */}
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Listing Title
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
                            onChange={(value) => {
                                setSelectedCity(value);
                            }}
                            placeholder="Select a city"
                        />

                        {/* city end */}


                        {/* custom fields -- todo */}

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
                        {/* social media links end */}

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
                        {/* preview main picture here using dropzone */}
                        <div className="mt-8">
                            {/* Dropzone component */}
                            <Dropzone
                                onDrop={(acceptedFiles) => {
                                    if (acceptedFiles && acceptedFiles.length > 0) {
                                        // Only consider the first file in case of multiple uploads
                                        setMainPicture(acceptedFiles[0]);
                                    }
                                }}
                                accept="image/*"
                                multiple={false}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <div className="border-2 border-dashed border-gray-400 rounded-md p-8 text-center" {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p className="text-gray-600">Drag 'n' drop an image here, or click to
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                                                Update
                                            </button>
                                        </p>
                                        {mainPicture || mainPictureUrl ? (
                                            <div className="mt-4">
                                                <p className="text-green-500 font-semibold">Selected Image:</p>
                                                <img
                                                    src={mainPicture ? URL.createObjectURL(mainPicture) : mainPictureUrl}
                                                    alt="Main Picture"
                                                    className="mt-2 max-w-xs h-auto"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </Dropzone>
                        </div>
                        {/* logo end */}
                        {/* Dropzone for updating gallery images */}
                        <h4 className="mt-6 font-bold text-slate-900">Gallery Pictures: </h4>
                        <Dropzone
                            onDrop={handleGalleryDrop}
                            accept="image/*"
                            multiple
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div className="border-2 border-dashed border-gray-400 rounded-md p-8 text-center" {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p className="text-gray-600">Drag 'n' drop images here, or click to
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                                            Update Gallery Pictures
                                        </button>
                                    </p>
                                    {galleryImages.length > 0 || galleryImageUrls.length > 0 ? (
                                        <div className="mt-4">
                                            <p className="text-green-500 font-semibold">Selected Gallery Images:</p>
                                            {galleryImages.map((image, index) => (
                                                <div key={index} className="flex items-center mb-2">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Gallery Image ${index + 1}`}
                                                        className="max-w-xs h-auto mr-2"
                                                    />
                                                    <button
                                                        onClick={() => removeGalleryImage(index)}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}

                                            {galleryImageUrls.map((imageUrl, index) => (
                                                <div key={index} className="flex items-center mb-2">
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Gallery Image ${index + 1}`}
                                                        className="max-w-xs h-auto mr-2"
                                                    />
                                                    <button
                                                        onClick={() => removeGalleryImageUrl(index)}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </Dropzone>

                        {formData.videoUrls.map((url, index) => (
                            <div key={index} className="mb-4">
                                <label htmlFor={`videoUrl${index}`} className="block text-sm font-medium text-gray-700">
                                    Video URL {index + 1}
                                </label>
                                <input
                                    type="text"
                                    id={`videoUrl${index}`}
                                    name={`videoUrl${index}`}
                                    value={url}
                                    onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                />
                            </div>
                        ))}

                        {/* Update button */}
                        <button
                            type="submit"
                            className="mt-4 bg-blue-500 text-white rounded-full px-6 py-2"
                        >
                            Update
                        </button>
                    </form>
                )}
            </div>
        </>
    );
};

export default UpdateListingPage;
