import { Anchor } from "@mantine/core";
import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-10 text-4xl">
      <p className="text-3xl">cruX</p>
      <ul className="list-none flex items-center pt-2">
        <li>
          <Anchor target="_blank" href="">
            <Icon icon="mdi:github" />
          </Anchor>
        </li>
        <li>
          <Anchor target="_blank" href="">
            <Icon icon="mdi:instagram" />
          </Anchor>
        </li>
        <li>
          <Anchor target="_blank" href="">
            <Icon icon="mdi:facebook" />
          </Anchor>
        </li>
        <li>
          <Anchor target="_blank" href="">
            <Icon icon="mdi:gmail" />
          </Anchor>
        </li>
      </ul>
    </footer>
  );
}
