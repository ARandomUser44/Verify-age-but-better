const steps = [
  "Verifying system identity",
  "Checking device integrity",
  "Scanning security protocols",
  "Captcha verification",
  "Finalizing request"
];

let step = 0;
let progress = 0;
let retry = 0;
const maxRetries = 2;
let firstRetry = true;

/* ELEMENTS */
const main = document.getElementById("main");
const stage = document.getElementById("stage");
const fill = document.getElementById("fill");
const percent = document.getElementById("percent");
const stepInfo = document.getElementById("stepInfo");
const troll = document.getElementById("troll");

const captcha = document.getElementById("captcha");
const captchaStep1 = document.getElementById("captchaStep1");
const captchaStep2 = document.getElementById("captchaStep2");
const checkBox = document.getElementById("checkBox");
const tiles = document.querySelectorAll(".tile");
const verifyBtn = document.getElementById("verifyBtn");

/* INIT */
main.classList.add("show");
stage.textContent = steps[0];
updateStepUI();
runStep();

/* STEP UI */
function updateStepUI() {
  stepInfo.textContent = `Step ${step + 1}/${steps.length}: ${steps[step]}`;
}

/* PROGRESS */
function setProgress(p) {
  progress = p;
  fill.style.width = p + "%";
  percent.textContent = Math.floor(p) + "%";
}

/* STEPS */
function runStep() {
  if (step === steps.length - 1) return runFinal();

  updateStepUI();
  stage.textContent = steps[step];

  let p = 0;

  const tick = setInterval(() => {
    p += Math.random() * 2;
    setProgress(p);

    if (p >= 100) {
      clearInterval(tick);
      step++;

      if (steps[step] === "Captcha verification") {
        showCaptcha();
        return;
      }

      setTimeout(runStep, 250);
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
    step++;
    runStep();
  } else {
    alert("Try again");
  }
});

/* FINAL */
function runFinal() {
  updateStepUI();
  stage.textContent = "Completing age verification";

  let p = 0;

  const rise = setInterval(() => {
    p += Math.random() * 1.3;
    setProgress(p);

    if (p >= 99) {
      clearInterval(rise);
      setTimeout(retryLoop, 1200);
    }
  }, 30);
}

/* RETRY */
function retryLoop() {
  if (retry >= maxRetries) return fail();

  retry++;

  stage.textContent = "Error retrying";

  if (firstRetry) {
    firstRetry = false;
    setProgress(0);
    setTimeout(retryLoop, 700);
    return;
  }

  let p = progress;

  const drop = setInterval(() => {
    p -= 2;
    setProgress(p);

    if (p <= 70) {
      clearInterval(drop);

      const rise = setInterval(() => {
        p += 2;
        setProgress(p);

        if (p >= 99) {
          clearInterval(rise);
          setTimeout(retryLoop, 800);
        }
      }, 30);
    }
  }, 30);
}

/* FAIL */
function fail() {
  let p = progress;

  const drop = setInterval(() => {
    p -= 1;
    setProgress(p);

    if (p <= 30) {
      clearInterval(drop);

      stage.style.display = "none";
      document.querySelector(".bar").style.display = "none";
      percent.style.display = "none";
      stepInfo.style.display = "none";
      troll.style.display = "block";
    }
  }, 60);
}
