import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";

// TODO: Meta tags description, title, favicon
// TODO: Dark mode
// TODO: Prettier config
export default function App({ 
  Component, 
  pageProps: { session, ...pageProps}
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
}
