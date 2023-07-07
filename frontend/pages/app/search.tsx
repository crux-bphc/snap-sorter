// Pitfalls:
// Relying on <Group> from mantine does not seem like a good idea. Try replacing them with normal html elements and style with tailwind
import BaseLayout from "@/components/layouts/BaseLayout";
import { Button, Group, MultiSelect, TextInput } from "@mantine/core";
import { useState } from "react";
import { YearPickerInput } from "@mantine/dates";
import ImageWithModal from "@/components/ImageWithModal";

// TODO: Make the UI better for larger screens
export default function Search() {
  const [uid, setUid] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [eventYear, setEventYear] = useState<Date | null>(new Date());
  const [images, setImages] = useState<{ imageUrl: string; tags: string[] }[]>(
    []
  );

  const eventsFromDatabase = [
    { value: "1", label: "Atmos" },
    { value: "2", label: "Pearl" },
  ];

  // TODO: Finish handleSearch
  async function handleSearch() {
    console.log(uid);
    console.log(events);
    // TODO: Handle events being empty
    console.log(eventYear);

    setImages([
      {
        imageUrl:
          "https://images.unsplash.com/photo-1538991383142-36c4edeaffde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
        tags: ["CSA", "A7"],
      },
    ]);
  }

  const previews = images.map(({ imageUrl, tags }, index) => {
    return (
      <ImageWithModal key={index} imageUrl={imageUrl} tagsFromDatabase={tags} />
    );
  });

  return (
    <BaseLayout>
      <main>
        <section className="px-10 py-4 max-w-md mx-auto">
          <form onSubmit={(event) => event.preventDefault()}>
            <article>
              {/* TODO: Regex validation for BITS UIDs */}
              <TextInput
                value={uid}
                label="UID"
                placeholder="fxxxxxxxx"
                onChange={(event) => setUid(event.currentTarget.value)}
                required
                withAsterisk
              />
              <MultiSelect
                data={eventsFromDatabase}
                placeholder="Pick events"
                label="Events"
                onChange={setEvents}
                value={events}
                clearButtonProps={{ "aria-label": "Clear selection" }}
                searchable
                clearable
                required
                withAsterisk
              />
            </article>
            <article>
              <Group position="center" className="m-2">
                <YearPickerInput
                  label="Event year"
                  value={eventYear}
                  onChange={setEventYear}
                  withAsterisk
                  maxDate={new Date()}
                />
              </Group>
              <Group position="center">
                <Button type="submit" color="green" onClick={handleSearch}>
                  Search
                </Button>
              </Group>
            </article>
          </form>
        </section>

        <section className="px-10">
          <div
            className={`grid grid-cols-1 py-4 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 lg:grid-cols-4 xl:grid-cols-5`}
          >
            {previews}
          </div>
        </section>
      </main>
    </BaseLayout>
  );
}
