// File which handles the user profile
// Pitfalls:
// <p> tags margin reset
// Possibly remove <Group> and <Image> from mantine and use regular html tags
// !There's no max file size limit or max number of files limit
import BaseLayout from "@/components/layouts/BaseLayout";
import { useState } from "react";
import { Image, Text, Group, Button, ActionIcon } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";

export default function Profile() {
  const [images, setImages] = useState<FileWithPath[]>([]);
  const {data: session} = useSession();

  const userData = {
    email: session?.user?.email,
    name: session?.user?.name
  };

  const handleImageUpload = async function () {
    // TODO: Finish image upload request
    console.log(images);
  };

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);

    return (
      <div key={index} className="relative group">
        <Image
          alt={imageUrl}
          src={imageUrl}
          imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        />
        <ActionIcon
          className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
          color="red"
          variant="filled"
          onClick={() => {
            setImages((images) => images.filter((_, key) => key !== index));
          }}
        >
          <Icon icon="mdi:delete" className="text-3xl" />
        </ActionIcon>
      </div>
    );
  });

  return (
    <BaseLayout>
      <main className="py-7 px-10">
        <div className="flex flex-col container mx-auto text-center">
          <section>
            <h1 className="text-3xl my-2">Profile</h1>
            <p className="m-1">
              <b>Name:</b> {userData.name}
            </p>
            <p className="m-1">
              <b>Email:</b> {userData.email}
            </p>
          </section>

          <section>
            <Group position="center" className="py-5">
              <Button
                type="submit"
                color="green"
                onClick={handleImageUpload}
                disabled={images.length === 0}
              >
                Upload
              </Button>
              <Button
                type="button"
                color="red"
                onClick={() => setImages([])}
                disabled={images.length === 0}
              >
                Reset
              </Button>
            </Group>
            <Dropzone accept={["image/jpeg", "image/png"]} onDrop={setImages}>
              <Text align="center">Drop images here</Text>
            </Dropzone>
          </section>

          <section>
            {previews.length > 0 && (
              <div
                className={`grid grid-cols-1 py-4 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 lg:grid-cols-4 xl:grid-cols-5`}
              >
                {previews}
              </div>
            )}
          </section>
        </div>
      </main>
    </BaseLayout>
  );
}
