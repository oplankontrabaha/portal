# OKB Portal

One app for every Oplan Kontra Baha report. Regional Offices and District Engineering Offices sign in with **their own official DPWH e-mail** and can:

- **Output & Sketch**: report the volume dredged and paint the cleaned stretches on the map.
- **Photo Desk**: upload field photos. The date and location come from the camera, or the office enters the date and pins the spot.
- **Register Waterway**: trace a new waterway or an extension. It goes to an administrator for approval.
- Open the **24/7 Flood Report**, which is linked for now and not yet merged into the app.

**Administrators** (the OKB Secretariat, the **OKB Task Force** and the **Bureau of Equipment**) see every region and can enter targets, correct or delete entries, see the photos uploaded each day, and approve registrations.

The app uses **the same data** as your current tools: the OKB SSOT, the OKB Photo Uploading List and the Philippine Geographic Database.

---

## What is new in version 1.1

| New | What it does |
|---|---|
| **Simple view** | A plain grey screen with tables and small buttons, like a desktop program. Anyone can switch it on with the **Simple view** button (top bar, sign-in page, Account, or More on a phone). The device remembers the choice. Nothing else changes. |
| **Administrator offices** | **Bureau of Equipment** and **OKB Task Force** are now offices in the sign-in list. Their accounts are administrators. |
| **Nationwide accomplishments** | Administrators get a table of every region: target, accomplished, share of target, average progress, completed, photos. Click a region to open it. |
| **Targets** | A page to type the target volume of each waterway. It writes to `planned_volume_office` on the plan tab. |
| **Corrections and deletes** | On a waterway page, an administrator can correct or delete a wrong volume entry, and delete a wrong photo. A reason is required and a copy of what was deleted is kept. |
| **Daily photos** | Every photo uploaded on a chosen day, for all regions or one region. |
| **Works with weak signal** | A submission is saved on the device first and sent by itself. If the signal drops it waits and tries again. A report or photo sent twice is saved once. |
| **Plan tab check** | The Targets page lists plan-tab rows whose name matches no waterway, and names listed twice. |

---

## The files (all flat, no folders)

| File | What it is |
|---|---|
| `Config.gs` | Settings. **The only file you normally edit.** |
| `Code.gs` | The doors in and out (page, API, `setup()`) and shared helpers |
| `Auth.gs` | Office accounts, e-mailed sign-in codes, registration with memorandum |
| `Data.gs` | Reads offices and places (PGD), waterways, volumes and photos (SSOT) |
| `Submit.gs` | Output & Sketch, photos, waterway requests |
| `Admin.gs` | Approvals, and copying approved waterways into the SSOT |
| `Manage.gs` | **New.** Targets, corrections and deletes, daily photos |
| `index.html` | The whole app page. It works on Apps Script and on GitHub Pages |
| `appsscript.json` | Project settings: Manila time, web app access |
| `sw.js` | **New, optional, GitHub Pages only.** Lets the page open with no signal. Not used inside Apps Script |
| `START-HERE.html` | **In the setup kit.** The setup steps with a Copy button for each file. A helper only: it is not pasted into Apps Script and not uploaded to GitHub |

---

## Set it up in a blank Apps Script project

The same steps are in **`START-HERE.html`**, with a Copy button for each file and a small form that writes your details into `Config.gs`. Open it in a browser and follow it, or use the list below.

1. Go to **script.google.com**, choose **New project**, and name it **OKB Portal**.
2. Replace the content of the default `Code.gs` with this `Code.gs`.
3. Click **＋ ▸ Script** six times. Name the new files `Config`, `Auth`, `Data`, `Submit`, `Admin` and `Manage`, then paste each file's content.
4. Click **＋ ▸ HTML**, name it **`index`**, and paste `index.html`.
5. Go to **Project Settings ⚙** and set the time zone to **(GMT+08:00) Manila**. You can also tick **Show "appsscript.json"** and paste the file.
6. In **`Config.gs`**:
   - Add your own official e-mail to `ADMIN_EMAILS` and `NOTIFY_EMAILS`.
   - Paste your Photo Desk's Drive folder ID into `PHOTO_FOLDER_ID`. You'll find it in the Photo Desk's Code.gs. If you leave it blank, a new "OKB Portal — Photos" folder is made.
   - Check `MEMO_ADDRESSEE` and `MEMO_ADDRESSEE_TITLE`.
   - Optional: in `CENTRAL_OFFICES`, put e-mails inside `emails: []` for people who should sign in as administrators right away (see below).
7. Choose **`setup`** in the function list, click **Run**, and allow the permissions. Then open **Execution log**. It creates:
   - the **"OKB Portal — Accounts & Requests"** sheet, with the tabs Accounts, Waterway Requests, Request Coordinates, Activity and Deleted Items
   - the private **"OKB Portal — Memoranda"** folder

   It also checks that the SSOT, the photo list and the PGD can be opened, and counts the offices in the PGD.
8. Go to **Deploy ▸ New deployment ▸ Web app**, set **Execute as: Me** and **Who has access: Anyone**, and click **Deploy**. Copy the `/exec` link.
9. Open the link, choose **Secretariat · sign in by e-mail**, and enter your admin e-mail. The 6-digit code arrives by e-mail.

### Already pasted version 1.0?

1. Replace the content of `Code`, `Auth`, `Data`, `Submit`, `Admin` and `index` with the new files.
2. Add one new script file named **`Manage`** and paste `Manage.gs`.
3. `Config.gs`: either paste the new file and redo your own edits, or keep yours and add the `CENTRAL_OFFICES` block from the new file. Without that block, Bureau of Equipment and OKB Task Force do not appear.
4. **Deploy ▸ Manage deployments ▸ ✏️ Edit ▸ Version: New version ▸ Deploy.**

You do not need to run `setup` again. The new "Deleted Items" tab is made the first time something is deleted.

### Which Google account should run it
- It needs to **edit** the OKB SSOT, the Photo Uploading List and the photo folder, and to **view** the Philippine Geographic Database.
- **E-mail limit:** every sign-in code and receipt is one e-mail. A Gmail account can send about **100 a day**; a Google Workspace account about **1,500**. With many offices, deploy from a Workspace account, or set `EMAIL_RECEIPTS: false` so only sign-in codes are sent. Receipts stop when 20 e-mails are left for the day (`MAIL_RESERVE_FOR_CODES`), so sign-in codes can still go out.

### After changing any file
**Deploy ▸ Manage deployments ▸ ✏️ Edit ▸ Version: New version ▸ Deploy.** This keeps the same `/exec` link. Saving alone does not update the live app.

---

## Who can do what

| | RO / DEO | Administrator |
|---|---|---|
| See waterways | Its own region | Every region, plus the table by region |
| Output & Sketch, Photo Desk, Register Waterway | Yes | Yes |
| Enter or change targets | No | Yes |
| Correct or delete a volume entry | No | Yes, with a reason |
| Delete a photo | No | Yes, with a reason |
| Daily photos | No | Yes |
| Approve offices and waterway requests | No | Yes |

Administrators are: e-mails in `ADMIN_EMAILS` (the Secretariat), and accounts of the offices in `CENTRAL_OFFICES`.

---

## How offices get in

1. **Register office**: choose the region and then the Regional Office or DEO, from the PGD's "DPWH DEOs" tab.
2. Confirm the **official @dpwh.gov.ph e-mail** with a 6-digit code.
3. Enter the focal person, designation and mobile number.
4. Attach the **scanned memorandum** to the Task Force Commander that names that e-mail (PDF, JPG or PNG, up to 10 MB). A sample text is in the app.
5. An administrator opens the memo in **Admin console ▸ Registrations** and approves or rejects it. The office gets an e-mail either way.
6. **Sign in**: choose the office. The code goes to its approved e-mail, and the device stays signed in for 7 days.

- One approved e-mail per RO or DEO. A newer approved memorandum replaces the older account.
- Regional Offices and DEOs see **every waterway of their region**. Each submission is saved under the office that sent it.

### Bureau of Equipment and OKB Task Force

- On the sign-in page, choose **Central offices (administrators)** in the region list.
- They register the same way: official e-mail, then the scanned memorandum. An administrator approves them.
- **Several people** can each have their own account in the same central office.
- To let someone in without registering, put the e-mail in `Config.gs`:

  ```js
  { id: 'CO-BUREAU-OF-EQUIPMENT', name: 'Bureau of Equipment', short: 'Bureau of Equipment', emails: ['name@dpwh.gov.ph'] }
  ```

  Remove the e-mail and deploy a new version to end that access.
- Keep each `id` as it is once people have registered. Their accounts are filed under it.

---

## Administrator pages

### Targets
- Type a number, or a sum like `68700+70095`. A sum is kept in the sheet as a formula, the way the plan tab already does it.
- Leave the box blank to remove a target.
- A comma goes only between thousands (`68,700`). `191,56` is refused, so it cannot be read as 19,156.
- Nothing changes in the SSOT until you press **Review and save**. You see the old and the new value first.
- A waterway that is not on the plan tab yet is added below the last row, with the formulas of the rows above it.
- **The plan tab decides the target of a waterway it lists.** For a waterway the plan tab does not list, the target written beside its last log entry is used.

### Plan tab check
On the Targets page for **All regions**, a yellow note appears when:
- a row of the plan tab matches no waterway in `SitevsWaterway`. Its figures are not in the portal's totals. Usually the name is spelled differently on the two tabs. Make the two names the same and the row joins its waterway.
- a name is listed twice on the plan tab. The first row is used.

A plan-tab name that is the waterway's name followed by its site, like `RIZAL CREEK, ILOILO CITY` for `RIZAL CREEK` in ILOILO CITY, is matched by itself.

### Corrections and deletes
- Open a waterway. Each volume entry has **Correct** and **Delete**.
- A reason is required. The totals of the later entries and `accomplished_volume` on the plan tab are worked out again.
- The office that sent the entry gets an e-mail.
- A deleted entry or photo is copied to the **Deleted Items** tab of the "OKB Portal — Accounts & Requests" sheet first. A deleted photo's file goes to the Drive trash, where it stays for 30 days.

### Daily photos
- Photos are grouped by the day they were **uploaded** (Manila time).
- The strip shows the last 14 days and how many photos each day has.
- Open a photo to see its details or delete it.

---

## Weak or no signal

- When an office presses Submit, the work is **saved on the device first**. The window says **"Saved on this device"** and shows a turning circle.
- The page sends it to the SSOT by itself. When the SSOT has it, the window changes to **"Saved in the SSOT"** with a green tick.
- With no signal, it waits in the **Outbox** (Account page, or the chip in the top bar) and is sent when the signal is back. If the page was closed, it is sent the next time the portal is opened on that device.
- Every report and every photo carries its own ID, so one that is sent twice is saved **once**, even when the second try comes the next day.
- The dashboard, waterway list and map open from the copy kept on the device, then update when new figures arrive.
- **Limits:** unsent work lives in that browser on that device. Clearing the browser's data, or using a private window, loses it. Sending continues only while the portal is open.

---

## What it writes (same format as your current tools)

| Action | Where |
|---|---|
| Cleaned stretches | SSOT `WaterwayVsCoordinates` (Cleaned YES/NO and Date Cleaned) and one row per changed point in `CleanedChangeLog` |
| Volume | SSOT `Accomplishment Log` ("UPDATE TO" / "UPDATE BY"), plus `accomplished_volume` on `WaterwayVsAccomplishment` when the waterway is listed there. A new **`submitted_by_office`** column is added at the end of the log; it can be turned off with `ADD_OFFICE_COLUMN` |
| Photos | Your photo folder (shared by link, as before) and the **Photo Uploading List**, using the same columns and 5-digit Submission IDs |
| Target | `planned_volume_office` on `WaterwayVsAccomplishment` |
| Corrected or deleted entry | The row in `Accomplishment Log`, the totals of the later rows, and `accomplished_volume` on the plan tab |
| Deleted photo | Its row in the Photo Uploading List is removed and the file goes to the Drive trash |
| Approved new waterway | SSOT `SitevsWaterway`, `SiteVsRegion` (new site), `WaterwayVsCoordinates` (every 20 m, Cleaned = NO) and `WaterwayVsCity` |
| Approved extension | New segment numbers in `WaterwayVsCoordinates`, a `WaterwayExtensions` row, and Extensions / Last Extended on `SitevsWaterway` |

After each of these, `DATA_VERSION` goes up so your other OKB tools reload. Every administrator action is written to the **Activity** tab.

---

## Moving the page to GitHub Pages later

1. In `index.html`, set `API_URL: ''` (near the top of the script) to your `/exec` link.
2. Upload `index.html`, `sw.js` and this `README.md` to the repository's main folder, without any `.gs` files. Then set **Settings ▸ Pages ▸ main / (root)**.
3. In `Config.gs`, set `APP_URL` to the GitHub Pages link so e-mails point there. Then deploy a new version.

`sw.js` works only on GitHub Pages. With it, the page itself can open with no signal. Inside Apps Script the page still needs a signal to open, but an open page keeps working and sends later.

---

## Good to know

- After editing the SSOT or PGD by hand, run **`clearCaches`** once so the app reloads them right away.
- An office's ID comes from its name in the PGD "DPWH DEOs" tab. If you rename an office there, update its **Office ID** in the Accounts tab too.
- The 24/7 Flood Report is a link (`LINKS.floodReport`) until it is merged into the app.
- A sketch keeps "cleaned" per point, like the Sketcher. One stretch left unmarked between two cleaned stretches cannot be kept, so the page draws it dashed and says so before you submit.
- A number typed with a comma for the decimal point in a sheet, like `191,56`, is read as 191.56.
- Average progress counts a waterway that is past its target as 100%.
