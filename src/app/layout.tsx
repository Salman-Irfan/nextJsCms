import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "@/layouts/web/Navbar";
import StoreProvider from "@/lib/redux/providers";
// import { Providers } from "@/lib/redux/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "KHUDI",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				{/* <Providers> */}
				<StoreProvider>
					<ChakraProvider>
						<Navbar />
						{children}
					</ChakraProvider>
				</StoreProvider>
				{/* </Providers> */}
			</body>
		</html>
	);
}
