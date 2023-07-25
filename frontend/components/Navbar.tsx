// Pitfalls:
// Since tailwind preflight is disabled some of these styles overwrite the default styles or make use of the default styles
// For example here 'px-0` is needed to remove the default unordered list padding
import { Anchor, Button } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="flex items-center justify-between px-10">
      {/* TODO: Add crux logo here for home route */}
      <Anchor component={Link} href={"/"}>
        Logo
      </Anchor>
      {session?.user && (
        <ul className="list-none flex px-0">
          <li className="mx-2">
            <Button
              component={Link}
              href={"/announcements"}
              className="capitalize"
            >
              announcements
            </Button>
          </li>
          <li className="mx-2">
            <Button
              component={Link}
              href={"/app/profile"}
              className=" capitalize"
            >
              profile
            </Button>
          </li>
          <li className="mx-2">
            <Button component={Link} href={"/app/search"} className=" capitalize">
              search
            </Button>
          </li>
          <li className="mx-2">
            <Button onClick={() => signOut({ callbackUrl: "/login" })} className=" capitalize">
              logout
            </Button>
          </li>
        </ul>
      )}
    </nav>
  );
}
