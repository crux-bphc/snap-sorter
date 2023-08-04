import BaseLayout from "@/components/layouts/BaseLayout";
import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";

export default function Login() {
	return (
		<>
			<BaseLayout>
				<main>
					<div className="container mx-auto text-center">
						<h1 className="my-3 text-6xl">Snap Sorter</h1>
						<Button
							type="submit"
							size="md"
							className="my-2"
							onClick={() =>
								signIn(
									"google",
									{ callbackUrl: "/app/profile" },
									{ hd: "hyderabad.bits-pilani.ac.in" }
								)
							}>
							Login with Google
						</Button>
						<p className="my-1 text-xs">Use BITS mail*</p>
					</div>
				</main>
			</BaseLayout>
		</>
	);
}
