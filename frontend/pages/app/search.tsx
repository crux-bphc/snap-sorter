// Pitfalls:
// Relying on <Group> from mantine does not seem like a good idea. Try replacing them with normal html elements and style with tailwind
import BaseLayout from "@/components/layouts/BaseLayout";
import { Button, Group, MultiSelect, TextInput } from "@mantine/core";
import { useState } from "react";
import { YearPickerInput } from "@mantine/dates";

// TODO: Make the UI better for larger screens
export default function Search() {
  const [uid, setUid] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [eventYear, setEventYear] = useState<Date | null>(new Date());
  const [images, setImages] = useState([]);

  const eventsFromDatabase = [
    { value: "1", label: "Atmos" },
    { value: "2", label: "Pearl" },
  ];

  // TODO: Finish handleSearch
  async function handleSearch() {
    console.log(uid);
    console.log(events);
    console.log(eventYear);
  }

  return (
    <BaseLayout>
      <main>
        <section className="px-10 py-4 grid-cols-1 md:grid-cols-2 grid gap-x-4">
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
                maxDate={new Date()}
              />
            </Group>
            <Group position="center">
              <Button type="submit" color="green" onClick={handleSearch}>
                Search
              </Button>
            </Group>
          </article>
        </section>
      </main>
    </BaseLayout>
  );
}
