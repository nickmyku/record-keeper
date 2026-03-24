# record-keeper

A small browser-based app for capturing expense receipts: upload a photo, enter date, vendor, amount, vehicle, and customer, then save everything **only in your browser**—no server or account required.

## What it does

- **Receipt photo** — Drag-and-drop or browse; supports common image types (PNG, JPEG, WebP; HEIC accepted in the file picker where the browser supports it).
- **Expense fields** — Date, vendor, amount (USD), car / fleet ID, and customer / account name, with client-side validation.
- **Local storage** — Submitted receipts are stored in `localStorage` under the key `record-keeper-receipts`. Each entry includes the image as a data URL plus metadata and a save timestamp.
- **Recent list** — After you save, the app shows up to eight of the most recently saved receipts (summary only in the list).

Nothing is uploaded to a remote service; clearing site data or using another browser/device will not show the same saved receipts.

## How to run

This is a static site: `index.html`, `styles.css`, and `app.js`. No build step or package manager.

1. **Simplest** — Open `index.html` in your browser (double-click or “Open with…”).

2. **Recommended for development** — Serve the folder with any static HTTP server so behavior matches typical deployment, for example:

   ```bash
   npx --yes serve .
   ```

   Then open the URL shown in the terminal (often `http://localhost:3000`).

Other options work the same way: Python’s `python -m http.server`, VS Code “Live Server”, etc.

## Project layout

| File        | Role                                      |
| ----------- | ----------------------------------------- |
| `index.html` | Markup for the receipt form and layout   |
| `styles.css` | App styling                               |
| `app.js`     | Validation, preview, `localStorage` I/O   |

## Browser support

Uses modern APIs (`localStorage`, `FileReader`, `crypto.randomUUID` when available). Use a current evergreen browser for the best experience.
