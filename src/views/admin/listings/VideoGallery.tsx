import Link from 'next/link';
import React from 'react';
import { BsFileEarmarkPlay } from 'react-icons/bs';

const VideoGallery = ({ listingDetails }:any) => {
    const getYoutubeVideoId = (url:any) => {
        // Extract the YouTube video ID from the URL
        const match = url.match(/[?&]v=([^&]+)/);
        return match ? match[1] : null;
    };

    return (
        <div className="container">
            <h1 className="text-2xl ml-8 font-bold text-blue-800 my-8">Videos</h1>
            <hr className="ml-8" />
            <div className="flex flex-wrap ml-16">
                {listingDetails.videoUrls.map((videoUrl:any, index:any) => {
                    const videoId = getYoutubeVideoId(videoUrl);
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

                    return (
                        <Link
                            key={index}
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="my-4 mx-4 relative"
                        >
                            <img
                                src={thumbnailUrl}
                                alt={`Video ${listingDetails.title}`}
                                className="h-48 w-full object-cover rounded-lg transition-transform transform hover:scale-105 cursor-pointer"
                            />
                            <div className="absolute bottom-2 right-2"> 
                                <BsFileEarmarkPlay size={48} color="red" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default VideoGallery;
