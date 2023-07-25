// Image component which opens a modal when clicked
// This became a separate component to avoid the complex state management to share the image data with modal
// Pitfalls:
// Tags state from server might not be the same with the client state
// Some of the components like the right section of badge are not separated to avoid complex state management
// The tags removal from array currently relies on array indices
import { Icon } from "@iconify/react";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Image,
  Modal,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

type Props = {
  imageUrl: string;
  tagsFromDatabase: string[];
};

export default function ImagePreviewModal({
  imageUrl,
  tagsFromDatabase,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [tags, setTags] = useState(tagsFromDatabase);
  const [newTag, setNewTag] = useState("");

  async function handleUpdateTags() {
    console.log(tags);
  }

  return (
    <>
      <Image
        alt={imageUrl}
        src={imageUrl}
        onClick={open}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        className="cursor-pointer"
      />

      <Modal centered opened={opened} onClose={close} size={"auto"}>
        <section className="sm:flex sm:gap-x-2 px-2 py-4">
          <Image
            alt={imageUrl}
            src={imageUrl}
            onClick={open}
            imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
          />
          <div>
            <Group position="center" className="mt-2">
              {tags.map((tag, badgeIndex) => (
                <Badge
                  className="m-1 capitalize"
                  key={badgeIndex}
                  rightSection={
                    <ActionIcon
                      variant="transparent"
                      color="red"
                      onClick={() =>
                        setTags((tags) =>
                          tags.filter((_, index) => index !== badgeIndex)
                        )
                      }
                    >
                      <Icon icon={"mdi:close"}></Icon>
                    </ActionIcon>
                  }
                >
                  {tag}
                </Badge>
              ))}
            </Group>

            <Group position="center" className="py-2">
              <TextInput
                value={newTag}
                placeholder="New tag"
                onChange={(event) => setNewTag(event.currentTarget.value)}
              />
              <Button
                type="button"
                disabled={newTag.length === 0}
                onClick={() => setTags([...tags, newTag])}
              >
                Create tag
              </Button>
              <Button type="button" onClick={handleUpdateTags}>
                Update tags
              </Button>
            </Group>
          </div>
        </section>
      </Modal>
    </>
  );
}
