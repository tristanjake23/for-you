# For You

A small React, TypeScript, Vite, and Motion site. Edit the Home greeting and letter in `src/Home.tsx`. The current letter is sample copy.

## Add your images

- **Scrapbook photos:** Upload JPG, JPEG, PNG, or WebP files to `src/assets/photos/`. Use lowercase extensions and numbered filenames such as `01.jpg` and `02.png` to set the order. The **Our photos** notebook has four pages with five slots each. The first 20 files are shown in filename order. Edit `src/photo-captions.json` to add a caption keyed by its full filename, such as `"01.jpg": "Our favorite afternoon"`. The first photo also appears in the kitten hunt reward.
- **Dog cutouts:** Replace `src/assets/black-dog.webp` and `src/assets/white-dog.webp`. Use the same filenames and transparent WebP files to preserve the cutout look.

## Run locally

```bash
npm ci
npm run dev
```

Run `npm run build` for a type check and production build. Vercel can import this repository with the Vite preset and use `dist` as the output directory.
