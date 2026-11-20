# Front Desk Team Feedback — GitHub Pages (updated FormSubmit delivery)

This is the complete, ready-to-upload website for Hotel Indigo / Holiday Inn Express Austin Downtown. It retains the existing welcome screen, progress indicator, four questions on separate screens, optional individual answers, and original design. The update replaces the asynchronous AJAX submission with a **regular FormSubmit HTML form POST**.

## Upload to your existing GitHub repository

1. Open https://github.com/jeb8293/Employee-feedback-form-/
2. Upload/replace **index.html**, **script.js**, and **styles.css** in the repository root. Keep **favicon.svg** as included. You can upload these individually or drag the extracted files into **Add file → Upload files** and commit the changes.
3. GitHub Pages normally redeploys after the commit. Open https://jeb8293.github.io/Employee-feedback-form-/ and reload the page (use a private/incognito window to bypass cached JavaScript if necessary).
4. Complete at least one question and click **Send feedback**. The browser will now submit the survey directly to FormSubmit. This first attempt may display a confirmation/activation screen rather than the final thank-you message.
5. Search **j.buser3@gmail.com** for the FormSubmit activation email (including Spam and All Mail). Follow the activation link.
6. Return to the published survey, submit a **second** test response, and verify the actual answers arrive in Gmail **before sharing the QR code**. When FormSubmit accepts a normal submission, it redirects to the website's thank-you screen.

**Important:** Updating the code does not automatically activate the receiving email or prove delivery. FormSubmit requires you to confirm the recipient address. If no activation message arrives after the native form submission, check FormSubmit's support or switch to a company-approved survey provider; a static GitHub Pages site cannot send mail by itself.

## What changed

- `index.html`: Added a real `action="https://formsubmit.co/j.buser3@gmail.com" method="POST"` and FormSubmit hidden configuration fields. The `_next` field returns to the survey thank-you screen.
- `script.js`: Kept navigation and optional-answer rules, but the Send button now performs a **standard form POST** instead of a JSON fetch to `/ajax/...`.
- `styles.css`: Added a hidden spam-prevention field style.
- **No employee email field added**: FormSubmit's `<input type="email" name="email">` is an example for contact forms and optional reply-to support. It is not required for survey delivery. Including it here could compromise the survey's privacy objective. All actual survey questions already have `name` attributes.

## Privacy and security

This form does not **ask for** employees' email addresses or names. However, full anonymity should **not be guaranteed**: free-text answers may be identifying and the third-party form provider can process request metadata. Feedback is transmitted to FormSubmit.co and delivered to a personal Gmail account. Verify with your employer that an external form service and personal address are approved for internal staff feedback; do not collect confidential guest, payment-card, or personnel data.

The survey is public on GitHub Pages and cannot verify that respondents work at either hotel. CAPTCHA remains off to preserve the original user experience, and spam protection is limited to a honeypot. If spam becomes a problem, enable FormSubmit's CAPTCHA or use a company-approved service.

## Files

- `index.html` — Full multi-step survey, configuration, and questions.
- `script.js` — Progress bar, back/next navigation, input validation, and native submission.
- `styles.css` — Styling and responsive layout.
- `favicon.svg` — Browser tab icon.

No signup or build step is necessary for GitHub Pages. Test actual email receipt before rolling out.
