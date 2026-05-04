const steps = [
  "Verifying system identity",
  "Checking device integrity",
  "Scanning security protocols",
  "Finalizing request"
];

let step = 0;
let progress = 0;

/* ELEMENTS */
let main, stage, fill, percent, stepInfo;
let captcha, captchaStep1, captchaStep2, checkBox, tiles, verifyBtn;

/* INIT (IMPORTANT: prevents broken load) */
window.addEventListener("DOMContentLoaded", () => {

  main = document.getElementById("main");
  stage = document.getElementById("stage");
  fill = document.getElementById("fill");
  percent = document.getElementById("percent");
  stepInfo = document.getElementById("stepInfo");

  captcha = document.getElementById("captcha");
  captchaStep1 = document.getElementById("captchaStep1");
  captchaStep2 = document.getElementById("captchaStep2");
  checkBox = document.getElementById("checkBox");
  tiles = document.querySelectorAll(".tile");
  verifyBtn = document.getElementById("verifyBtn");

  reset();
  runStep();
});

/* RESET */
function reset() {
  step = 0;
  progress = 0;
  setProgress(0);
}

/* STEP UI */
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
  if (step >= steps.length) return;

  updateStepUI();
  stage.textContent = steps[step];

  let p = 0;

  const tick = setInterval(() => {
    p += Math.random() * 2;
    setProgress(p);

    if (p >= 100) {
      clearInterval(tick);

      // CAPTCHA ONLY at step 3
      if (step === 2) {
        showCaptcha();
        return;
      }

      step++;
      setTimeout(runStep, 200);
    }
  }, 30);
}

/* CAPTCHA */
function showCaptcha() {
  captcha.style.display = "flex";
}

/* STEP 1 */
checkBox.addEventListener("click", () => {
  checkBox.classList.add("checked");

  setTimeout(() => {
    captchaStep1.style.display = "none";
    captchaStep2.style.display = "block";
  }, 400);
});

/* STEP 2 */
tiles.forEach(tile => {
  tile.addEventListener("click", () => {
    tile.classList.toggle("selected");
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

    step++;          // continue after CAPTCHA
    runStep();
  } else {
    alert("Try again");
  }
});
