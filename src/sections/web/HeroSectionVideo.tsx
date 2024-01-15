import React from "react";

const HeroSectionVideo = () => {
	const heroSectionVideo = "/videos/khudii-clip.mp4";

	return (
		<div className="relative">
			{/* Video as a background */}
			<video
				autoPlay
				loop
				muted
				playsInline
				className="w-full h-auto object-cover relative">
				<source src={heroSectionVideo} type="video/mp4" />
				<div className="absolute inset-0 bg-blue-500 opacity-50"></div>
			</video>

			{/* Content on top of the video */}
            
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
				{/* Your content goes here */}
				<h1 className="text-4xl font-bold text-white">
					<span className="underline text-red-500">
						An insight to the outside
					</span>
				</h1>
			</div>
		</div>
	);
};

export default HeroSectionVideo;
