# AirFloor n8n automations

Two importable workflows for the n8n instance at n8n.yash.cx. Both are also served from the live site, so they can be imported by URL.

## 1. Content refresh (LLM, monthly)

File: `airfloor-content-refresh.json`
Import URL: `https://airfloor.netlify.app/n8n/airfloor-content-refresh.json`

Runs at 06:00 on the 1st of every month. Fetches the live `cityprofiles.json`, asks an LLM to lightly refresh only the "general" and the current season's texts in all three languages, then hard-validates the result before anything ships: same 50 city ids, coordinates and names byte-identical, every field non-empty, no banned characters. If validation fails, nothing happens.

**It starts in DRY RUN.** In dry-run mode it only emails a review summary. To let it publish, open the Config node and set `DRY_RUN` to `false`. When live, it commits the new file to GitHub and does an incremental Netlify deploy (only `cityprofiles.json` changes; every other file keeps its existing hash).

Credentials to attach after import:
- **LLM refresh** node: the existing OpenAI credential (`openAiApi`).
- **GitHub commit** node: a GitHub credential with a fine-grained token, Contents read/write on `yashkotha/airfloor` only.
- **Netlify file digest / Create deploy / Upload changed file** nodes: a Netlify credential (`netlifyApi`) with a personal access token from app.netlify.com/user/applications.
- **Email review / Email published** nodes: an SMTP credential (smtp.office365.com, port 587, STARTTLS works with the existing mailbox).

## 2. Trackers (health + OSS plan)

File: `airfloor-trackers.json`
Import URL: `https://airfloor.netlify.app/n8n/airfloor-trackers.json`

Runs every 6 hours and checks: the site responds and looks like AirFloor, `cityprofiles.json` parses and has its cities, the Open-Meteo air-quality API answers for a sample Indian coordinate, and the Netlify account plan. Failures produce one alert email. If the Netlify plan ever changes away from "Personal" (the Open Source plan landing), it emails a reminder to cancel the paid subscription.

Credentials to attach after import: the same **Netlify** and **SMTP** credentials as above. The three public HTTP checks need none.

## Import steps

1. n8n, Workflows, Create Workflow, then the three-dot menu, "Import from URL", paste the import URL.
2. Open each node named in the credentials list and select the credential.
3. Run once manually to confirm, then toggle Active.
