# record-keeper

A small browser-based tool for capturing expense receipts: upload a photo, enter date, vendor, amount, car, and customer, and keep everything **only in this browser** (no server).

## What it does

- **Receipt image** — Drag-and-drop or browse; supports common image types (PNG, JPEG, WebP, HEIC where the browser allows).
- **Expense fields** — Date, vendor, amount (USD), car or fleet ID, and customer or account name.
- **Local storage** — On submit, entries are saved to `localStorage` under the key `record-keeper-receipts`. The image is stored as a data URL inside each entry.
- **Recent list** — Shows the last few saved receipts for this browser session’s data.

Nothing is uploaded to a remote service; clearing site data or using another browser/device will not show the same receipts.

## Run it

This is static HTML, CSS, and JavaScript. You can:

1. **Open the file** — Double-click `index.html`, or open it from your editor’s “Open in browser” action. Some browsers restrict `file://` for certain features; if anything misbehaves, use a local server.
2. **Serve the folder** — From the project directory, for example:

   ```bash
   npx --yes serve .
   ```

   Then open the URL shown in the terminal (often `http://localhost:3000`).

## Files

| File        | Role                                      |
| ----------- | ----------------------------------------- |
| `index.html`| Page structure and form                   |
| `styles.css`| Layout and styling                        |
| `app.js`    | Validation, preview, storage, recent list |

## Requirements

A modern browser with `localStorage`, `FileReader`, and `crypto.randomUUID` (or the app falls back to a timestamp ID).
