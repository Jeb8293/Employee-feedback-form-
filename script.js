/*
 * Front Desk Team Feedback - GitHub Pages-ready survey.
 * Uses FormSubmit's regular HTML POST endpoint, not the AJAX endpoint.
 * The first post requests email activation; complete activation and confirm
 * delivery with a second test before inviting associates to use the form.
 * No associate email address is requested or submitted.
 */

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

function sendFeedback() {
  if (sending || finished) return;

  // At least one response is required; every individual question remains optional.
  const hasContent = ["shiftChallenge", "trainingDetail", "guestDetail", "oneImprovement"]
    .some(id => Boolean(getValue(id))) || getSelected("training").length || getSelected("guestIssue").length;
  if (!hasContent) {
    showError("Please answer at least one question before submitting. You can go back to any question, and the rest may be left blank.");
    return;
  }

  sending = true;
  nextButton.disabled = true;
  backButton.disabled = true;
  nextButtonText.textContent = "Sending...";
  submitSpinner.hidden = false;
  formStatus.textContent = "Sending your feedback through the form service.";
  submitAlert.hidden = true;

  // A normal browser form POST, as documented by FormSubmit, is used here.
  // This allows first-time activation requests to run through its regular flow.
  // The service then redirects to ?feedback=received after a successful post.
  HTMLFormElement.prototype.submit.call(form);
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

// Only show the thank-you screen after FormSubmit redirects back to this URL.
if (new URLSearchParams(window.location.search).get("feedback") === "received") {
  finished = true;
  currentStep = 5;
  showStep(5);
  // Clear the submission marker so refreshing/back navigation doesn't mimic a new submission.
  window.history.replaceState({}, "", window.location.pathname);
} else {
  showStep(0);
}
