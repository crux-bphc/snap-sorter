// Here the padding y on footer is responsible for the spacing
import { Anchor } from "@mantine/core";
import { Icon } from "@iconify/react";

// TODO: Add urls for socials
export default function Footer() {
	return (
		<footer className="flex items-center justify-between px-10 text-4xl py-3">
			<p className="text-3xl py-0 my-0">cruX</p>
			<ul className="list-none flex items-center py-0 my-0 justify-evenly gap-x-2">
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
