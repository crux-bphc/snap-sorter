import BaseLayout from "@/components/layouts/BaseLayout";

// TODO: Get announcements from db
let announcements = [
  {
    id: 1,
    title: "Important announcement",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam elementum vehicula enim. Sed rhoncus, odio quis pulvinar orn.",
    date: new Date(),
  },
  {
    id: 2,
    title: "Not Important announcement",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: new Date(),
  },
  {
    id: 3,
    title: "Not Important announcement",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: new Date(),
  },
  {
    id: 4,
    title: "Not Important announcement",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: new Date(),
  },
];

export default function Announcements() {
  if (announcements.length == 0) {
    return (
      <BaseLayout>
        <h2 className="text-center">No announcements to show</h2>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <section className="grid grid-cols-1 p-5 gap-y-4 mx-auto">
        {announcements.map(({ id, title, description, date }) => (
          <article
            key={id}
            className="border border-solid border-gray-300/75 rounded-md p-4 bg-gray-100 shadow-md"
          >
            <div>
              <h3>{title}</h3>
              <p>{date.toDateString()}</p>
            </div>
            <p>{description}</p>
          </article>
        ))}
      </section>
    </BaseLayout>
  );
}
