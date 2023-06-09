import BaseLayout from "@/components/layouts/BaseLayout";
import { Button } from "@mantine/core";

export default function Login() {
  return (
    <>
      <BaseLayout>
        <main>
          <div className="container mx-auto text-center">
            <h1 className="text-6xl my-3">Snap Sorter</h1>
            <Button type="submit" size="md" className="my-2">
              Login with Google
            </Button>
            <p className="text-xs my-1">Use BITS mail*</p>
          </div>
        </main>
      </BaseLayout>
    </>
  );
}
