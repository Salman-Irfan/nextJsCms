"use client";
import {
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import AdminSideBarItems from "./AdminSideBarItems";

const Sidebar = () => {
	const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

	return (
		<>
			{/* hamburger button */}
			<Button colorScheme="gray" onClick={onOpen}>
				☰
			</Button>
			{/* drawer */}
			<Drawer placement="left" onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent bg="gray.800" color="white" boxShadow="md">
					{/* admin header */}
					<DrawerHeader borderBottomWidth="1px">
						<Flex
							justifyContent="space-between"
							alignItems="center">
							<span>Khudi Admin</span>
							<Button colorScheme="red" onClick={onClose}>
								x
							</Button>
						</Flex>
					</DrawerHeader>
					{/* body */}
					<DrawerBody>
						{/* AdminSideBarItems */}
						<AdminSideBarItems />
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default Sidebar;
