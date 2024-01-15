// next.tsx
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

// Define interfaces for your data
interface ListItem {
    title: string;
    description: string;
    photos: string[]; // Assuming photos are strings
    videos: string[]; // Assuming videos are strings
}

// Define the props interface for your component
interface NextPageProps {
    params: {
        listId: string;
    };
}

const NextPage: React.FC<NextPageProps> = ({ params }: NextPageProps) => {
    const listId = params.listId;
    const [listItem, setListItem] = useState<ListItem | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/lists/${listId}`);
                setListItem(response.data.listItem);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [listId]);

    // Function to extract YouTube video ID from the URL
    const getYouTubeVideoId = (url: string): string | null => {
        const match = url.match(/[?&]v=([^?&]+)/);
        return match ? match[1] : null;
    };

    return (
        <div className="container mx-auto p-4">
            {listItem && (
                <div className="max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden">
                    <div className="p-4">
                        <h1 className="text-2xl font-bold mb-2">{listItem.title}</h1>
                        <p className="text-gray-600 mb-4">{listItem.description}</p>

                        <div className="mb-4">
                            <h2 className="text-xl font-bold mb-2">Photos:</h2>
                            <div className="flex space-x-2">
                                {listItem.photos.map((photo, index) => (
                                    <img key={index} src={`/${photo}`} alt={`Photo ${index + 1}`} className="w-20 h-20 object-cover rounded-md" />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-2">Videos:</h2>
                            <div className="flex flex-col space-y-2">
                                {listItem.videos.map((video, index) => {
                                    const videoId = getYouTubeVideoId(video);
                                    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

                                    return (
                                        <div key={index} className="mb-4">
                                            <Link
                                                href={video}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img
                                                    src={thumbnailUrl}
                                                    alt={`Video Thumbnail ${index + 1}`}
                                                    className="w-full h-40 object-cover rounded-md"
                                                />
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NextPage;
