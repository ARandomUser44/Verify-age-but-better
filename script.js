const steps = [
  "Verifying system identity",
  "Checking device integrity",
  "Scanning security protocols",
  "Finalizing request"
];

let step = 0;
let progress = 0;

/* ELEMENTS */
const main = document.getElementById("main");
const stage = document.getElementById("stage");
const fill = document.getElementById("fill");
const percent = document.getElementById("percent");
const stepInfo = document.getElementById("stepInfo");
const captcha = document.getElementById("captcha");

const captchaStep1 = document.getElementById("captchaStep1");
const captchaStep2 = document.getElementById("captchaStep2");
const checkBox = document.getElementById("checkBox");
const tiles = document.querySelectorAll(".tile");
const verifyBtn = document.getElementById("verifyBtn");

/* INIT */
main.classList.add("show");
runStep();

/* STEP UI (o--o system) */
function updateStepUI() {
  let out = "";

  for (let i = 0; i < steps.length; i++) {
    out += (i < step) ? "•" : "o";
    if (i < steps.length - 1) out += "--";
  }

  stepInfo.textContent = out;
}

/* PROGRESS */
function setProgress(p) {
  progress = p;
  fill.style.width = p + "%";
  percent.textContent = Math.floor(p) + "%";
}

/* MAIN FLOW */
function runStep() {
  updateStepUI();
  stage.textContent = steps[step];

  let p = 0;

  const tick = setInterval(() => {
    p += Math.random() * 2;
    setProgress(p);

    if (p >= 100) {
      clearInterval(tick);

      // CAPTCHA is PART of step 3
      if (step === 2) {
        showCaptcha();
        return;
      }

      step++;
      setTimeout(runStep, 250);
    }
  }, 30);
}

/* CAPTCHA */
function showCaptcha() {
  captcha.style.display = "flex";
}

/* STEP 1 CAPTCHA */
checkBox.addEventListener("click", () => {
  checkBox.classList.add("checked");

  setTimeout(() => {
    captchaStep1.style.display = "none";
    captchaStep2.style.display = "block";
  }, 400);
});

/* STEP 2 CAPTCHA */
tiles.forEach(t => {
  t.addEventListener("click", () => {
    t.classList.toggle("selected");
  });
});

verifyBtn.addEventListener("click", () => {
  const selected = document.querySelectorAll(".tile.selected");

  let valid = true;

  selected.forEach(t => {
    if (t.dataset.type !== "car") valid = false;
  });

  if (selected.length === 0) valid = false;

  if (valid) {
    captcha.style.display = "none";
    step++; // continue AFTER CAPTCHA completes step 3
    runStep();
  } else {
    alert("Try again");
  }
});
