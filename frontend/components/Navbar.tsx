// Pitfalls:
// Since tailwind preflight is disabled some of these styles overwrite the default styles or make use of the default styles
// For example here 'px-0` is needed to remove the default unordered list padding
import { Button } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
	const { data: session } = useSession();
	const router = useRouter();

	const protectedRoutes = [
		{
			name: "profile",
			path: "/app/profile",
		},
		{
			name: "search",
			path: "/app/search",
		},
	];

	const unprotectedRoutes = [
		{
			name: "announcements",
			path: "/announcements",
		},
	];

	return (
		<nav className="flex items-center justify-between px-10">
			{/* TODO: Add crux logo here for home route */}
			<ul className="flex list-none px-0">
				{router.pathname !== "/login" && session?.user === undefined && (
					<Button component={Link} href={"/"} className="mx-2 capitalize">
						login
					</Button>
				)}
				{unprotectedRoutes.map(
					(route, index) =>
						router.pathname !== route.path && (
							<li key={index} className="mx-2">
								<Button
									component={Link}
									href={route.path}
									className="capitalize">
									{route.name}
								</Button>
							</li>
						)
				)}
				{session?.user && (
					<>
						{protectedRoutes.map(
							(route, index) =>
								router.pathname !== route.path && (
									<li key={index} className="mx-2">
										<Button
											component={Link}
											href={route.path}
											className="capitalize">
											{route.name}
										</Button>
									</li>
								)
						)}
						<li className="mx-2">
							<Button
								onClick={() => signOut({ callbackUrl: "/login" })}
								className="capitalize">
								logout
							</Button>
						</li>
					</>
				)}
			</ul>
		</nav>
	);
}
