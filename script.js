const steps = [
  "Verifying system identity",
  "Checking your browser history",
  "Installing malware totally not fake",
  "Completing age verification"
];

let step = 0;
let progress = 0;

/* ELEMENTS */
let main, stage, fill, percent, stepInfo;
let captcha, captchaStep1, captchaStep2, checkBox, tiles, verifyBtn;

/* INIT */
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
  setupCaptcha();
});

/* RESET */
function reset() {
  step = 0;
  progress = 0;
  setProgress(0);
}

/* PROGRESS */
function setProgress(p) {
  progress = p;
  fill.style.width = p + "%";
  percent.textContent = Math.floor(p) + "%";
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

/* MAIN FLOW */
function runStep() {
  if (step >= steps.length - 1) {
    runFinalLockedStep();
    return;
  }

  updateStepUI();
  stage.classList.remove("error");
  stage.textContent = steps[step];

  let p = 0;

  const tick = setInterval(() => {
    p += Math.random() * 2.2;
    setProgress(p);

    if (p >= 100) {
      clearInterval(tick);

      if (step === 2) {
        showCaptcha();
        return;
      }

      step++;
      setTimeout(runStep, 200);
    }
  }, 30);
}

/* FINAL STEP (LOCKED AT 99%) */
function runFinalLockedStep() {

  updateStepUI();
  stage.classList.remove("error");
  stage.textContent = "Completing age verification";

  // HARD LOCK
  setProgress(99);

  setTimeout(() => {
    finalSequence();
  }, 1500);
}

/* FINAL FAILURE SEQUENCE */
function finalSequence() {

  stage.classList.add("error");
  stage.textContent = "Error retrying...";

  let fake = 0;
  setProgress(fake);

  const rise = setInterval(() => {
    fake += 2;
    setProgress(fake);

    if (fake >= 60) {
      clearInterval(rise);

      setTimeout(() => {

        let drop = 60;

        const fall = setInterval(() => {
          drop -= 3;
          setProgress(drop);

          if (drop <= 30) {
            clearInterval(fall);

            document.getElementById("main").innerHTML =
              `<div class="troll"> You've been trolled lol</div>`;
          }

        }, 40);

      }, 2000);

    }

  }, 30);
}

/* CAPTCHA */
function showCaptcha() {
  captcha.style.display = "flex";
}

/* CAPTCHA SETUP */
function setupCaptcha() {

  checkBox.onclick = () => {
    checkBox.classList.add("checked");

    setTimeout(() => {
      captchaStep1.style.display = "none";
      captchaStep2.style.display = "block";
    }, 400);
  };

  tiles.forEach(tile => {
    tile.onclick = () => {
      tile.classList.toggle("selected");
    };
  });

  verifyBtn.onclick = () => {
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
  };
}
