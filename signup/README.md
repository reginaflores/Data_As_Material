# Reading presentation sign-up

A one-link sign-up page for the reading presentations: https://reginaflores.github.io/Data_As_Material/signup/

Students type their name and email and press **Sign up** on an open spot. The name is written into the Google Sheet and the student gets a confirmation email with their week, date and readings. No login for students.

- `index.html`: the page, hosted on GitHub Pages (course style). Until `API` is set it runs in **preview mode**: sample data, a "nothing is saved yet" banner, no emails.
- `Code.gs`: a Google Apps Script web app the page calls. It reads and writes the sheet and sends the confirmation emails.
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

## Turn on saving (one time, about 5 minutes)
1. Go to https://script.google.com and click **New project**. Name it "Reading sign-up".
2. Delete what's in `Code.gs` and paste this folder's `Code.gs`. Click **Save**.
3. **Deploy → New deployment**. Gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** and authorize with your Google account (access to the sheet and to send email as you). Google warns the app is unverified because you wrote it: **Advanced → Go to Reading sign-up**, then **Allow**.
5. Copy the **Web app URL** (ends in `/exec`).
6. In `index.html`, set `var API='...';` to that URL, then commit and push. The preview banner disappears and sign-ups save.

If you change `Code.gs` later: **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same.
