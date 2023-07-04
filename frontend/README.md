# Snap Sorter

## Status

### Frontend

#### Components

- [ ] Navbar
  - Logo which takes to `search` page when logged in else to `login`
  - [x] Links to each page (profile, search, announcements)
- [ ] Footer
  - Trademark if needed (to be discussed)
  - Links to socials and contact details
- [ ] Common layout with navbar and footer

#### Pages

- [x] Login page
  - [x] Login button which initiates the oauth flow
- [ ] Announcements
  - Get data from announcements endpoint and display sorted by latest
- [ ] Profile
  - Dropzone from mantine to collect images
  - Hover on image to delete the image from the list
  - Reset btn to clear
  - Submit btn to send them to the backend `store images` endpoint
- [ ] Search (the most uncertain part of the code)
  - Input field for UID
  - Filter for year and events
  - Similar to dropzone to show the received images
  - [ ] Modal to change tags
    - Badges to display the received tags
    - Delete or add badges(tags)
    - Save button to send the updated tags back

### Backend

#### Endpoints

- [ ] Announcements
  - Get announcements from DB
- [ ] Store images
  - Take the images and dump them in some folder called `/temp/images` as `studentuid_imagename.extension`
  - After dumping them update the db `Upload Image` with the image and path and uid
- [ ] Search images
  - Frontend will send uid as param along with filters (have defaults for filters too)
  - Return images from the `Unknown schema joined with Dopy Image` table with tags
- [ ] Auth
  - Nextauth will do the needful (more deep dive on what exactly is happening might be needed)
- [ ] Update tags for a given image id
  - Endpoint will be a `PATCH` request which takes image id and the updated tags and updates them in the db.

#### Database

- [ ] Prisma or Drizzle with postgresql
- [ ] Announcement schema - {uuid, title, description, created at time stamp}
- [ ] Upload Image - {uuid,  fk to student uid, image path}
- [ ] Some Unknown schema to store tagged image - {fk to student uid, image id}
- [ ] Dopy Image - {uuid, image path, event name, tags}


### Config & Misc

- [ ] Docker files
  - [ ] Production
  - [ ] Development
- [ ] Config
  - [ ] Prettier
- [ ] Color scheme and UI



<!-- TODO: Update README -->
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
