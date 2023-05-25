import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <MantineProvider
        withGlobalStyles
        theme={{
          colorScheme: "light",
        }}>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
}
