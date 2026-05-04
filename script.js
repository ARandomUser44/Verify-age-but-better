const steps = [
  "Verifying system identity",
  "Checking device integrity",
  "Scanning security protocols",
  "Completing age check"
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
  if (step >= steps.length) return;

  updateStepUI();
  stage.classList.remove("error");
  stage.textContent = steps[step];

  let p = 0;

  const tick = setInterval(() => {
    p += Math.random() * 2.2;
    setProgress(p);

    if (p >= 100) {
      clearInterval(tick);

      /* CAPTCHA STEP */
      if (step === 2) {
        showCaptcha();
        return;
      }

      /* FINAL STEP SPECIAL LOGIC */
      if (step === steps.length - 1) {

        setProgress(99);

        setTimeout(() => {
          stage.classList.add("error");
          stage.textContent = "Error retrying...";

          let fake = 99;

          const retry = setInterval(() => {
            fake -= 2;
            setProgress(fake);

            if (fake <= 85) {
              clearInterval(retry);

              setTimeout(() => {
                step++; // finish
                runStep();
              }, 800);
            }
          }, 30);

        }, 700);

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

/* CAPTCHA SETUP */
function setupCaptcha() {

  if (!checkBox || !verifyBtn) return;

  /* STEP 1 */
  checkBox.onclick = () => {
    checkBox.classList.add("checked");

    setTimeout(() => {
      captchaStep1.style.display = "none";
      captchaStep2.style.display = "block";
    }, 400);
  };

  /* STEP 2 */
  tiles.forEach(tile => {
    tile.onclick = () => {
      tile.classList.toggle("selected");
    };
  });

  /* VERIFY */
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
