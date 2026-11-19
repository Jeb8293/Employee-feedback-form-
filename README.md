# Front Desk Team Feedback | Hotel Indigo & Holiday Inn Express Austin Downtown

A mobile-friendly, four-question employee feedback survey with a welcome screen, one question per page, a progress bar, optional responses, and a thank-you screen. No framework or build tools required. Designed for GitHub Pages.

## Upload to GitHub Pages

1. Create a **new GitHub repository** (for example, `front-desk-feedback`).
2. Upload **all four files** from this package into the **root** of the repository: `index.html`, `styles.css`, `script.js`, and `favicon.svg`. (README is optional but useful.)
3. In the repository, open **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/(root)**, then click **Save**.
5. Wait for GitHub to provide your public Pages URL. Open that URL on your phone to see the survey.

## One-time email activation (IMPORTANT)

The survey is currently set to send responses to **j.buser3@gmail.com** using the free third-party service [FormSubmit.co](https://formsubmit.co/), which supports email forwarding from a GitHub Pages site.

**Before sharing with employees:**

1. Open the **published GitHub Pages URL** (not an HTML file opened from your computer).
2. Complete at least one question and click **Send feedback**. This initializes the FormSubmit destination.
3. Check **j.buser3@gmail.com** (including spam/junk) for a **FormSubmit activation/confirmation email**, then activate the destination using the link provided.
4. Reload the survey and send another **test response**.
5. Verify that the **second test appears in your Gmail inbox**. Only then distribute the link or QR code to staff.

**Important:** Email forwarding is not guaranteed until activation has been completed and tested. The website can be reviewed locally, but end-to-end email delivery requires a live internet connection. If the service changes its policies or endpoints, you may need to adjust `script.js`.

## Privacy and hotel policy considerations

- The form **does not ask** for employee names or email addresses. Employees can skip any individual question, but at least one response is needed to submit.
- Do **not** describe this as perfectly anonymous. Free-text comments could identify someone, and the third-party submission service may process technical information such as IP addresses.
- The form asks employees not to include coworker or guest names. Do not ask for guest payment details, reservation numbers, personnel records, or other confidential information.
- Survey responses are transmitted to **FormSubmit.co**, then forwarded to a **personal Gmail** inbox. Verify that this is consistent with your hotel's employer policies on employee information and external services before distributing it.
- A link to the survey is public; GitHub Pages does not restrict it to hotel employees. Don't include confidential information in the site itself.

## Customization

- **Email destination:** Change `DESTINATION_EMAIL` in `script.js`.
- **Questions / text:** Edit the matching `<section data-step="...">` in `index.html`. The email body labels are in `buildPayload()` inside `script.js`.
- **Colors / appearance:** Edit CSS variables at the top of `styles.css`.
- **Number of questions:** This version is built around four; changing the number requires updating `TOTAL_QUESTIONS`, panels, and button behavior in `script.js`.

## Files

- `index.html`: Survey screens, markup, text, and form controls.
- `styles.css`: Responsive visual design and animations.
- `script.js`: Screen navigation, progress, validation, and sending to email.
- `favicon.svg`: Tab icon.

No paid account, npm, or server is required to host the site on GitHub Pages. Email delivery is provided separately by FormSubmit and requires its one-time verification.
