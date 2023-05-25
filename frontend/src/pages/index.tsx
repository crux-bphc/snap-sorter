import Layout from "@/components/Layout";
import authOptions from "@/pages/api/auth/[...nextauth]";
import { Button, Stack, Text, Title } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getProviders, signIn, useSession } from "next-auth/react";
import Head from "next/head";

export default function SignIn() {
  const { status } = useSession();

  return (
    <>
      <Head>
        <title>cruX batchsnaps sorter | Login page</title>
        <meta
          name="description"
          content="Our machine learning model analyzes your photo's facial features and finds your images from the hundreds of images taken by DoPY."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <main>
          <Stack align="center">
            <Title order={1} size="40" align="center">
              <span
                style={{
                  color: "#164a9e",
                }}>
                cruX
              </span>
              {" Batchsnaps Sorter"}
            </Title>
            <Button mt="md" onClick={() => signIn("google", { callbackUrl: "/app" })} loading={status === "loading"}>
              Sign in with Google
            </Button>
            <Text fz="sm" fw="bold">
              Use your BITS email
            </Text>
          </Stack>
        </main>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/app" } };
  }

  const providers = await getProviders();
  return {
    props: { providers: providers ?? [] },
  };
}
