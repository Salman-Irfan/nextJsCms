"use client";
import React from "react";
import {
	Flex,
	Text,
	Button,
	IconButton,
	useDisclosure,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
} from "@chakra-ui/react";
import {
	HamburgerIcon,
	PhoneIcon,
	ChatIcon,
	SettingsIcon,
} from "@chakra-ui/icons";
import Link from "next/link";
import PageNames from "@/components/web/pageNames/PageNames";

const Navbar = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			{/* Desktop Navbar */}
			<Flex
				as="nav"
				align="center"
				justify="space-between"
				wrap="wrap"
				padding={6}
				bg="teal.500"
				color="white">
				{/* Left Side - Khudi*/}
				<Flex align="center">
					<IconButton
						icon={<HamburgerIcon />}
						display={{ base: "inherit", md: "none" }}
						onClick={onOpen}
						variant="unstyled"
						aria-label="Open Menu" // Add this line
						mr={2}
					/>
					<Text fontSize="lg" fontWeight="bold">
						KHUDI
					</Text>
				</Flex>
				{/* Center */}
				<Flex
					align="center"
					justify="center"
					flexGrow={1}
					display={{ base: "none", md: "flex" }}>
					{/* home */}
					<Text mx={4}>
						{" "}
						<Link href={"/"}> Home </Link>{" "}
					</Text>

					{/* dynamic page names */}
					<PageNames />
					{/* dynamic page names - ends */}
				</Flex>

				{/* Right Side */}
				<Flex align="center">
					{/* contact us */}
					<Link href={"/contact"}>
						<Button
							leftIcon={<PhoneIcon />}
							colorScheme="whiteAlpha"
							variant="link"
							mr={4}>
							Contact Us
						</Button>
					</Link>
					{/* Join Us */}
					<Link href={"/join"}>
						<Button
							leftIcon={<ChatIcon />}
							colorScheme="whiteAlpha"
							variant="link"
							mr={4}>
							Join Us
						</Button>
					</Link>

					{/* admin */}
					<Link href={"/admin"}>
						<Button
							leftIcon={<SettingsIcon />}
							colorScheme="whiteAlpha"
							variant="link">
							Admin
						</Button>
					</Link>
				</Flex>
			</Flex>

			{/* Mobile Drawer */}
			<Drawer
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				size="xs">
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader bg="teal.500" color="white">
						Khudi
					</DrawerHeader>
					<DrawerBody>
						<Text my={2}>Home</Text>
						<PageNames />
						{/* contact us */}
						<Link href={"/contact"}>
							<Button
								leftIcon={<PhoneIcon />}
								colorScheme="blackAlpha"
								variant="link"
								mr={4}>
								Contact Us
							</Button>
						</Link>
						{/* Join Us */}
						<Link href={"/join"}>
							<Button
								leftIcon={<ChatIcon />}
								colorScheme="blackAlpha"
								variant="link"
								mr={4}>
								Join Us
							</Button>
						</Link>

						{/* admin */}
						<Link href={"/admin"}>
							<Button
								leftIcon={<SettingsIcon />}
								colorScheme="blackAlpha"
								variant="link">
								Admin
							</Button>
						</Link>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default Navbar;
