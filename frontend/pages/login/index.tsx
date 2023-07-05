import BaseLayout from "@/components/layouts/BaseLayout";
import { Text, Title, Button } from "@mantine/core";

export default function Login() {
  return (
    <>
      <BaseLayout>
        <main>
          <div className="container mx-auto text-center">
            <Title order={1} className="text-6xl p-4">
              Snap Sorter
            </Title>
            <Button type="submit" size="lg" className="my-2">
              Login with Google
            </Button>
            <Text fz="xs">Use BITS mail*</Text>
          </div>
        </main>
      </BaseLayout>
    </>
  );
}
