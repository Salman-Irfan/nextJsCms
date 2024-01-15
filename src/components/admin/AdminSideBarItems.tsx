import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Icon,
} from "@chakra-ui/react";
import { IoIosSpeedometer, IoIosList, IoIosPerson, IoIosPeople, IoIosLock, IoIosBook, IoMdContact } from "react-icons/io";
import React from "react";
import Link from "next/link";

const AdminSideBarItems = () => {
	return (
		<>
			<Accordion allowToggle>
				{/* dashboard */}
				<AccordionItem
					borderTop="none" // Remove top border
					borderBottom="none" // Remove bottom border
				>
					<h2>
						<AccordionButton
							_expanded={{ bg: "blue.700", color: "white" }}
							borderTop="none" // Remove top border
							borderBottom="none" // Remove bottom border
						>
							<Box as="span" flex="1" textAlign="left">
								{/* add chakra ui icon on the left of Dashboard also */}
								<Icon as={IoIosSpeedometer} mr={2} />
								Dashboard
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
				</AccordionItem>
				{/* listings start*/}
				<AccordionItem
					borderTop="none" // Remove top border
					borderBottom="none" // Remove bottom border
				>
					<h2>
						<AccordionButton
							_expanded={{ bg: "blue.700", color: "white" }}
							borderTop="none" // Remove top border
							borderBottom="none" // Remove bottom border
						>
							<Box as="span" flex="1" textAlign="left">
								<Icon as={IoIosList} mr={2} />
								Listings
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						{/* nested items for listings - starts*/}
						<Accordion allowToggle>
							{/* Create List */}
							<AccordionItem borderTop="none" borderBottom="none">
								<Link href={'/admin/lists/create-listing'} >
									<h2>
										<AccordionButton
											_expanded={{
												bg: "blue.500",
												color: "white",
											}}
											borderTop="none"
											borderBottom="none">
											<Box
												as="span"
												flex="1"
												textAlign="left"
												ml={6}>
												<Icon as={IoIosList} mr={2} />
												Create Listing
											</Box>
											<AccordionIcon />
										</AccordionButton>
									</h2>
								</Link>
							</AccordionItem>

							{/* Lists */}
							<AccordionItem borderTop="none" borderBottom="none">
								<Link href={`/admin/lists`}>
									<h2>
										<AccordionButton
											_expanded={{
												bg: "blue.500",
												color: "white",
											}}
											borderTop="none"
											borderBottom="none">
											<Box
												as="span"
												flex="1"
												textAlign="left"
												ml={6}>
												<Icon as={IoIosPeople} mr={2} />
												Lists
											</Box>
											<AccordionIcon />
										</AccordionButton>
									</h2>
								</Link>
							</AccordionItem>

							{/* Categories */}
							<AccordionItem borderTop="none" borderBottom="none">
								<h2>
									<AccordionButton
										_expanded={{
											bg: "blue.500",
											color: "white",
										}}
										borderTop="none"
										borderBottom="none">
										<Box
											as="span"
											flex="1"
											textAlign="left"
											ml={6}>
											<Icon as={IoIosLock} mr={2} />
											Categories
										</Box>
										<AccordionIcon />
									</AccordionButton>
								</h2>
								<AccordionPanel pb={4}>
									{/* Your content for Categories */}
								</AccordionPanel>
							</AccordionItem>
						</Accordion>
						{/* nested items for listings - ends*/}

					</AccordionPanel>
				</AccordionItem>
				{/* listings ends */}
				{/* users start*/}
				<AccordionItem borderTop="none" borderBottom="none">
					<h2>
						<AccordionButton
							_expanded={{ bg: "blue.700", color: "white" }}
							borderTop="none"
							borderBottom="none">
							<Box
								as="span"
								flex="1"
								textAlign="left"
								display="flex"
								alignItems="center">
								<Icon as={IoIosPerson} mr={2} />
								Users
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						{/* Nested items for Users */}
						<Accordion allowToggle>
							{/* List */}
							<AccordionItem borderTop="none" borderBottom="none">
								<h2>
									<AccordionButton
										_expanded={{
											bg: "blue.500",
											color: "white",
										}}
										borderTop="none"
										borderBottom="none">
										<Box
											as="span"
											flex="1"
											textAlign="left"
											ml={6}>
											<Icon as={IoIosList} mr={2} />
											List
										</Box>
										<AccordionIcon />
									</AccordionButton>
								</h2>
								<AccordionPanel pb={4}>
									{/* Your content for List */}
								</AccordionPanel>
							</AccordionItem>

							{/* Roles */}
							<AccordionItem borderTop="none" borderBottom="none">
								<h2>
									<AccordionButton
										_expanded={{
											bg: "blue.500",
											color: "white",
										}}
										borderTop="none"
										borderBottom="none">
										<Box
											as="span"
											flex="1"
											textAlign="left"
											ml={6}>
											<Icon as={IoIosPeople} mr={2} />
											Roles
										</Box>
										<AccordionIcon />
									</AccordionButton>
								</h2>
								<AccordionPanel pb={4}>
									{/* Your content for Roles */}
								</AccordionPanel>
							</AccordionItem>

							{/* Permissions */}
							<AccordionItem borderTop="none" borderBottom="none">
								<h2>
									<AccordionButton
										_expanded={{
											bg: "blue.500",
											color: "white",
										}}
										borderTop="none"
										borderBottom="none">
										<Box
											as="span"
											flex="1"
											textAlign="left"
											ml={6}>
											<Icon as={IoIosLock} mr={2} />
											Permissions
										</Box>
										<AccordionIcon />
									</AccordionButton>
								</h2>
								<AccordionPanel pb={4}>
									{/* Your content for Permissions */}
								</AccordionPanel>
							</AccordionItem>

							{/* Titles */}
							<AccordionItem borderTop="none" borderBottom="none">
								<h2>
									<AccordionButton
										_expanded={{
											bg: "blue.500",
											color: "white",
										}}
										borderTop="none"
										borderBottom="none">
										<Box
											as="span"
											flex="1"
											textAlign="left"
											ml={6}>
											<Icon as={IoIosBook} mr={2} />
											Titles
										</Box>
										<AccordionIcon />
									</AccordionButton>
								</h2>
								<AccordionPanel pb={4}>
									{/* Your content for Titles */}
								</AccordionPanel>
							</AccordionItem>
						</Accordion>
					</AccordionPanel>
				</AccordionItem>
				{/* users end*/}
				{/* pages start*/}
				<AccordionItem
					borderTop="none" // Remove top border
					borderBottom="none" // Remove bottom border
				>
					<h2>
						<AccordionButton
							_expanded={{ bg: "blue.700", color: "white" }}
							borderTop="none" // Remove top border
							borderBottom="none" // Remove bottom border
						>
							<Box as="span" flex="1" textAlign="left">
								<Icon as={IoIosList} mr={2} />
								Pages
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						{/* nested items for listings - starts*/}
						<Accordion allowToggle>
							{/* Create Page */}
							<AccordionItem borderTop="none" borderBottom="none">
								<Link href={'/admin/pages/create-page'} >
									<h2>
										<AccordionButton
											_expanded={{
												bg: "blue.500",
												color: "white",
											}}
											borderTop="none"
											borderBottom="none">
											<Box
												as="span"
												flex="1"
												textAlign="left"
												ml={6}>
												<Icon as={IoIosList} mr={2} />
												Create Page
											</Box>
											<AccordionIcon />
										</AccordionButton>
									</h2>
								</Link>
								<AccordionPanel pb={4}>
									{/* Your content for Create Listings */}
								</AccordionPanel>
							</AccordionItem>

							{/* Pages */}
							<AccordionItem borderTop="none" borderBottom="none">
								<Link href={'/admin/pages/'}>
									<h2>
										<AccordionButton
											_expanded={{
												bg: "blue.500",
												color: "white",
											}}
											borderTop="none"
											borderBottom="none">
											<Box
												as="span"
												flex="1"
												textAlign="left"
												ml={6}>
												<Icon as={IoIosPeople} mr={2} />
												Pages
											</Box>
											<AccordionIcon />
										</AccordionButton>
									</h2>
								</Link>
								<AccordionPanel pb={4}>
									{/* Your content for Lists */}
								</AccordionPanel>
							</AccordionItem>


						</Accordion>
						{/* nested items for listings - ends*/}

					</AccordionPanel>
				</AccordionItem>
				{/* pages ends */}
				{/* contact us details starts */}
				<AccordionItem
					borderTop="none" // Remove top border
					borderBottom="none" // Remove bottom border
				>
					<h2>
						<AccordionButton
							_expanded={{ bg: "blue.700", color: "white" }}
							borderTop="none" // Remove top border
							borderBottom="none" // Remove bottom border
						>
							<Box as="span" flex="1" textAlign="left">
								<Icon as={IoMdContact} mr={2} />
								<Link href={'/admin/fetch-contact-us'}>
									Contact Us Details
								</Link>
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
				</AccordionItem>
				{/* contact us details ends */}
				{/* join us details starts */}
				<AccordionItem
					borderTop="none" // Remove top border
					borderBottom="none" // Remove bottom border
				>
					<h2>
						<AccordionButton
							_expanded={{ bg: "blue.700", color: "white" }}
							borderTop="none" // Remove top border
							borderBottom="none" // Remove bottom border
						>
							<Box as="span" flex="1" textAlign="left">
								<Icon as={IoMdContact} mr={2} />
								<Link href={'/admin/fetch-join-us'}>
									Join Us Details
								</Link>
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
				</AccordionItem>
				{/* join us details ends */}
			</Accordion>
		</>
	);
};

export default AdminSideBarItems;
