import { Anchor, Button } from "@mantine/core";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10">
      {/* TODO: Add crux logo here for home route */}
      <Anchor component={Link} href={"/"}>
        Logo
      </Anchor>
      <ul className="list-none flex">
        <li>
          <Button
            component={Link}
            href={"/announcements"}
            className="mx-1 capitalize"
          >
            announcements
          </Button>
          <Button
            component={Link}
            href={"/app/profile"}
            className="mx-1 capitalize"
          >
            profile
          </Button>
          <Button
            component={Link}
            href={"/app/search"}
            className="mx-1 capitalize"
          >
            search
          </Button>
        </li>
      </ul>
    </nav>
  );
}
