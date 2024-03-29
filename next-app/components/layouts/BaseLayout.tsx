// Pitfalls:
// Opposed to creating a type and using getLayout specified in the Next.js docs here ReactNode type is used to get around that
// Entire layout is positioned using flex box
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthLayout from "./AuthLayout";

type Props = {
	children?: ReactNode;
};

export default function BaseLayout({ children }: Props) {
	return (
		<AuthLayout>
			<div className="flex min-h-screen flex-col justify-between">
				<Navbar />
				{children}
				<Footer />
			</div>
		</AuthLayout>
	);
}
