# Snap Sorter

## Status

### Frontend

#### Components

- [ ] Navbar
  - [ ] Logo which takes to `search` page when logged in else to `login`
  - [x] Links to each page (profile, search, announcements)
  - [x] Make it dynamic when showing the pages i.e., do not display announcements route when on announcements page, show other routes only when logged in.
- [ ] Footer
  - Trademark if needed (to be discussed)
  - Links to socials and contact details
- [x] Common layout with navbar and footer

#### Pages

- [x] Login page
  - [x] Login button which initiates the oauth flow
- [x] Announcements
  - [ ] Integrate with backend
  - [x] Get data from announcements endpoint and display sorted by latest
- [x] Profile
  - [x] Dropzone from mantine to collect images
  - [x] Hover on image to delete the image from the list
  - [x] Reset btn to clear
  - [x] Submit btn to send them to the backend `store images` endpoint
- [ ] Search page
  - [ ] Integrate with backend(might need to change the props etc.,)
  - [x] Input field for UID
  - [x] Filter for year and events
  - [x] Similar to dropzone to show the received images
  - [x] Get images with the uid and display them
  - [x] Modal to change tags
    - [x] Badges to display the received tags
    - [x] Delete or add badges(tags)
    - [x] Save button to send the updated tags back

### Backend

#### Endpoints

- [ ] Announcements
  - Get announcements from DB
- [x] Store images
  - Take the images and dump them in some folder called `/temp/images` as `studentuid_imagename.extension`
  - After dumping them update the db `Upload Image` with the image and path and uid
- [ ] Search images
  - Frontend will send uid as param along with filters (have defaults for filters too)
  - Return images from the `Unknown schema joined with Dopy Image` table with tags
- [x] Auth
  - Nextauth will do the needful (more deep dive on what exactly is happening might be needed)
- [ ] Update tags for a given image id
  - Endpoint will be a `PATCH` request which takes image id and the updated tags and updates them in the db.

#### Database

- [x] Prisma or Drizzle with postgresql
- [ ] Announcement schema - {uuid, title, description, created at time stamp}
- [x] Upload Image - {uuid, fk to student uid, image path}
- [ ] Some Unknown schema to store tagged image - {fk to student uid, image id}
- [ ] Dopy Image - {uuid, image path, event name, tags}

### Config & Misc

- [ ] Docker files
  - [ ] Production
  - [x] Development
- [x] Config
  - [x] Prettier
- [ ] Color scheme and UI

<!-- TODO: Update README -->

## Getting Started

### Development

1. Rename `.env.example` as `.env` or `.env.development` and add your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from google cloud console.
2. Run the following command and visit http://localhost:3000
   ```bash
   docker compose -f docker-compose.dev.yml up
   ```
3. Locally for the editor you also have to install the dependencies and also generate prisma types. Run the following commands to do that.
   ```bash
   pnpm install
   pnpm prisma generate
   ```
