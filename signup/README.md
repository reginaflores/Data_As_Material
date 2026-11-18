# Reading presentation sign-up

A one-link sign-up page for the reading presentations. Students open the link, type their name and email, and press **Sign up**. The name is written into the Google Sheet and the student gets a confirmation email with their week, date and readings. No login for students.

- `Index.html`: the page (course style). Opened on its own it shows sample data and saves nothing.
- `Code.gs`: the Google Apps Script that serves the page and reads/writes the sheet.
- Sheet: "Data as Material · Reading presentation sign-up (Spring 2027)" in Drive folder Data_As_Material_2026 (ID in `Code.gs`).

## Confirmation email
- Sent from your Google account (the script runs as you), with the sender name "Data as Material". Replies go to regina.flores@newschool.edu.
- Subject: "Reading presentation: Week 02, Monday, February 1, 2027". Body: the week, date and 4:00 p.m. start, the readings as a list, a reminder to present all of them, the syllabus link, and "reply to switch weeks." Edit the text in `sendConfirmation_` in `Code.gs`.
- Emails are not saved in the sheet. If an email fails to send, the spot still counts and the page says so.
- A Gmail account can send about 100 of these a day, far more than 11.

## Rules the script enforces
- One name per spot; a filled spot can't be overwritten.
- Each name only once (everyone presents once).
- Spots marked `(one presenter)` in the sheet are closed.
- To move or remove someone, edit the sheet directly.

## Publish it (one time, about 5 minutes)
1. Open the sheet in Google Sheets. Menu: **Extensions → Apps Script**.
2. In `Code.gs`, delete what's there and paste this folder's `Code.gs`.
3. Click **+** next to Files → **HTML**, name it `Index` (no extension), and paste this folder's `Index.html`.
4. Click **Save**, then **Deploy → New deployment**. Gear icon → **Web app**.
   - Description: Reading sign-up
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and authorize with your Google account. It asks for access to the sheet and to send email as you. Google warns the app is unverified because you wrote it: **Advanced → Go to (project name)**, then **Allow**.
6. Copy the **Web app URL** (ends in `/exec`). That's the link for students.

If you change the code later: **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same.
