# File Uploader

A simple, friendly file uploader built with React. Pick as many files as you like (no size or count limits), drag & drop or click to select, and watch them upload in parallel. You can cancel in progress, retry if something fails, or remove files from the list if you want.

## What it does

- **Drag & drop or click** — Use the drop zone or the file picker; both support multiple files.
- **No file and size limits** — Upload as many files as you want, any size.
- **Per-file progress** — Each file shows its own progress bar and status.
- **Cancel** — Stop an upload before it finishes.
- **Retry** — If an upload fails, hit Retry to try again.
- **Delete** — Remove a file from the list (stops the upload if it’s still running).
- **Toasts** — Success and error messages show up in the corner so you know what happened.

Uploads run in parallel and are simulated in the browser (chunked with a small random failure rate so you can try cancel and retry without a real backend).

## Tech stack

- **React 19** + **Vite** (Rolldown)
- **Tailwind CSS 4** for styling
- **react-toastify** for notifications

## Getting started

npm install
npm run dev
