import Footer from "@/components/Footer";
import { Flex } from "@mantine/core";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Flex justify="center" align="center" direction="column" mih="90vh">
        {children}
        <Footer />
      </Flex>
    </>
  );
}
