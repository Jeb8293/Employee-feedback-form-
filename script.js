/*
 * Front Desk Team Feedback - GitHub Pages-ready survey.
 * FormSubmit emails the responses to the address configured below.
 * IMPORTANT: Send a test submission and activate your FormSubmit destination
 * through the email FormSubmit sends before inviting employees to use the form.
 */

const DESTINATION_EMAIL = "j.buser3@gmail.com";
const ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(DESTINATION_EMAIL)}`;
const TOTAL_QUESTIONS = 4;

const form = document.getElementById("feedbackForm");
const steps = [...document.querySelectorAll(".step")];
const stepLabel = document.getElementById("stepLabel");
const stepCount = document.getElementById("stepCount");
const progressTrack = document.getElementById("progressTrack");
const progressFill = document.getElementById("progressFill");
const backButton = document.getElementById("backButton");
const skipButton = document.getElementById("skipButton");
const nextButton = document.getElementById("nextButton");
const nextButtonText = document.getElementById("nextButtonText");
const nextArrow = document.getElementById("nextArrow");
const submitSpinner = document.getElementById("submitSpinner");
const actionBar = document.getElementById("actionBar");
const submitAlert = document.getElementById("submitAlert");
const formStatus = document.getElementById("formStatus");

let currentStep = 0;
let sending = false;
let finished = false;

function setStep(step) {
  if (sending || finished) return;
  currentStep = Math.max(0, Math.min(TOTAL_QUESTIONS, step));
  showStep(currentStep);
}

function showStep(step) {
  for (const section of steps) {
    section.hidden = Number(section.dataset.step) !== step;
  }

  const complete = step === 5;
  const percent = complete ? 100 : (step / TOTAL_QUESTIONS) * 100;
  progressFill.style.width = `${percent}%`;
  progressTrack.setAttribute("aria-valuenow", String(complete ? TOTAL_QUESTIONS : step));
  progressTrack.setAttribute("aria-valuetext", complete ? "Survey complete" : (step === 0 ? "Welcome screen" : `Question ${step} of ${TOTAL_QUESTIONS}`));
  stepLabel.textContent = complete ? "THANKS FOR SHARING" : step === 0 ? "LET'S MAKE WORK BETTER" : "YOUR VOICE, OUR NEXT STEPS";
  stepCount.textContent = complete ? "COMPLETE" : step === 0 ? "WELCOME" : `${String(step).padStart(2, "0")} / 04`;
  actionBar.hidden = complete;
  backButton.hidden = step === 0 || complete;
  skipButton.hidden = step === 0 || step === TOTAL_QUESTIONS || complete;
  nextButtonText.textContent = step === 0 ? "Get started" : step === TOTAL_QUESTIONS ? "Send feedback" : "Continue";
  nextArrow.hidden = step === TOTAL_QUESTIONS;
  submitAlert.hidden = true;
  submitAlert.textContent = "";
  formStatus.textContent = complete ? "Your feedback was submitted." : (step ? `Question ${step} of 4` : "Welcome to the survey");

  if (step !== 0) {
    window.scrollTo({ top: 0, behavior: "auto" });
    const heading = steps.find(el => Number(el.dataset.step) === step)?.querySelector("h2");
    if (heading) heading.focus({ preventScroll: true });
  }
}

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function getSelected(name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);
}

function buildPayload() {
  const training = getSelected("training");
  const guestIssue = getSelected("guestIssue");
  return {
    _subject: "Front Desk Team Feedback | Austin Downtown",
    _template: "table",
    _captcha: "false",
    _honey: getValue("companyWebsite"),
    "1. Biggest shift challenge": getValue("shiftChallenge") || "No response",
    "2. Training or guidance needed": training.length ? training.join("; ") : "No selection",
    "2a. Training details": getValue("trainingDetail") || "No response",
    "3. Biggest guest experience issue": guestIssue[0] || "No selection",
    "3a. Guest experience details": getValue("guestDetail") || "No response",
    "4. One improvement for the next 30 days": getValue("oneImprovement") || "No response"
  };
}

async function sendFeedback() {
  if (sending || finished) return;
  // Prevent empty submissions while keeping individual questions optional.
  const hasContent = ["shiftChallenge", "trainingDetail", "guestDetail", "oneImprovement"].some(id => Boolean(getValue(id))) || getSelected("training").length || getSelected("guestIssue").length;
  if (!hasContent) {
    showError("Please answer at least one question before submitting. You can go back to any question, and the rest may be left blank.");
    return;
  }

  sending = true;
  nextButton.disabled = true;
  backButton.disabled = true;
  nextButtonText.textContent = "Sending...";
  submitSpinner.hidden = false;
  formStatus.textContent = "Sending your feedback. Please wait.";
  submitAlert.hidden = true;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(buildPayload())
    });
    let data;
    try { data = await response.json(); } catch (_) { data = null; }
    const succeeded = response.ok && (data?.success === true || data?.success === "true");
    if (!succeeded) {
      const serviceMessage = typeof data?.message === "string" ? data.message : "";
      if (/activat|confirm|verif/i.test(serviceMessage)) {
        throw new Error("This form still needs email activation. Please let management know so they can activate it before collecting feedback.");
      }
      throw new Error("We couldn't confirm your response was sent. Please try again in a moment.");
    }
    finished = true;
    currentStep = 5;
    showStep(5);
  } catch (error) {
    showError(error instanceof Error ? error.message : "We couldn't send your feedback. Please try again.");
  } finally {
    sending = false;
    nextButton.disabled = false;
    backButton.disabled = false;
    submitSpinner.hidden = true;
    if (!finished) nextButtonText.textContent = "Send feedback";
  }
}

function showError(message) {
  submitAlert.textContent = message;
  submitAlert.hidden = false;
  formStatus.textContent = message;
  submitAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

backButton.addEventListener("click", () => setStep(currentStep - 1));
skipButton.addEventListener("click", () => setStep(currentStep + 1));
nextButton.addEventListener("click", () => {
  if (currentStep === TOTAL_QUESTIONS) sendFeedback();
  else setStep(currentStep + 1);
});
form.addEventListener("submit", event => { event.preventDefault(); if (currentStep === TOTAL_QUESTIONS) sendFeedback(); });

// Make the "I'm comfortable with my current training" response exclusive.
const trainingCheckboxes = [...form.querySelectorAll('input[name="training"]')];
for (const checkbox of trainingCheckboxes) {
  checkbox.addEventListener("change", () => {
    if (!checkbox.checked) return;
    if (checkbox.dataset.exclusive === "true") {
      for (const other of trainingCheckboxes) if (other !== checkbox) other.checked = false;
    } else {
      const exclusive = trainingCheckboxes.find(el => el.dataset.exclusive === "true");
      if (exclusive) exclusive.checked = false;
    }
  });
}

for (const [textareaId, counterId] of [["shiftChallenge", "challengeCount"], ["oneImprovement", "improvementCount"]]) {
  const textarea = document.getElementById(textareaId);
  const counter = document.getElementById(counterId);
  textarea.addEventListener("input", () => { counter.textContent = `${textarea.value.length} / 1600`; });
}

// Honeypot field created as a non-interactive hidden field.
const honeypot = document.createElement("input");
honeypot.type = "text";
honeypot.id = "companyWebsite";
honeypot.name = "companyWebsite";
honeypot.tabIndex = -1;
honeypot.autocomplete = "off";
honeypot.setAttribute("aria-hidden", "true");
honeypot.style.cssText = "position:absolute!important;left:-99999px!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important";
form.appendChild(honeypot);

showStep(0);
