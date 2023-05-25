import { ActionIcon, Flex, Group } from "@mantine/core";
import { IconBrandFacebook, IconBrandGithub, IconMail } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: "0",
        width: "80%",
        zIndex: -1,
        padding: "0.5em 1.5em",
      }}>
      <Flex justify="space-evenly">
        <p>
          Powered by <span style={{ color: "#164a9e", fontWeight: "bold" }}>cruX</span>
        </p>
        <Group>
          <ActionIcon component="a" variant="subtle" href="https://github.com/crux-bphc" aria-label="github">
            <IconBrandGithub color="#164a9e" />
          </ActionIcon>
          <ActionIcon component="a" variant="subtle" href="https://www.facebook.com/cruxbphc/" aria-label="facebook">
            <IconBrandFacebook color="#164a9e" />
          </ActionIcon>
          <ActionIcon component="a" variant="subtle" href="mailto:crux@hyderabad.bits-pilani.ac.in" aria-label="gmail">
            <IconMail color="#164a9e" />
          </ActionIcon>
        </Group>
      </Flex>
    </footer>
  );
}
