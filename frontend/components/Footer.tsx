// Here the padding y on footer is responsible for the spacing
import { Anchor } from "@mantine/core";
import { Icon } from "@iconify/react";

// TODO: Add urls for socials
export default function Footer() {
	return (
		<footer className="flex items-center justify-between px-10 py-3 text-4xl">
			<p className="my-0 py-0 text-3xl">cruX</p>
			<ul className="my-0 flex list-none items-center justify-evenly gap-x-2 py-0">
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
