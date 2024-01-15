import HeroSectionForm from "@/sections/web/HeroSectionForm";
import HeroSectionVideo from "@/sections/web/HeroSectionVideo";
import PopularCategoriesDescriptionView from "@/views/web/homePage/popularCategories/PopularCategoriesDescriptionView";
import PopularCategoriesListCarousel from "@/views/web/homePage/popularCategories/PopularCategoriesListCarousel";
import PopularCategoriesView from "@/views/web/homePage/popularCategories/PopularCategoriesView";
import { Box, Center, Flex } from "@chakra-ui/react";

export default function Home() {
	return (
		<>
			{/* hero section starts */}
			<Flex
				direction={{ base: "column", md: "row" }} // stack on mobile, side-by-side on larger screens
			>
				{/* Left side with 75% width */}
				<div className="mx-4 my-4 md:mx-16 md:my-0" style={{ flex: 2 }}>
					{/* Video Hero Section */}
					<HeroSectionVideo />
				</div>

				{/* Right side with 25% width */}
				<div className="mx-4 mt-4 md:mt-16" style={{ flex: 1 }}>
					<HeroSectionForm />
				</div>
			</Flex>
			{/* hero section ends  */}
			{/* category lists start */}
			<Box className="my-4 py-4 bg-gray-200">
				<Flex
					direction={{ base: "column", md: "row" }} // stack on mobile, side-by-side on larger screens
				>
					{/* Popular Categories Component */}
					<div className="mx-4 mt-4 md:mt-16" style={{ flex: 1 }}>
						<PopularCategoriesView />
					</div>
					{/* popular categories description */}
					<div className="mx-4 mt-4 md:mt-16" style={{ flex: 1 }}>
						<PopularCategoriesDescriptionView />
					</div>
				</Flex>
				{/*popular categories carousel */}
				<Center>
					<PopularCategoriesListCarousel />
				</Center>
			</Box>
			{/* category lists end */}
		</>
	);
}
