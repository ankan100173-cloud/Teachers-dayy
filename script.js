(function () {
  "use strict";

  var audio = document.getElementById("bg-audio");
  var toggleBtn = document.getElementById("music-toggle");
  var openHint = document.getElementById("open-hint");
  var body = document.body;
  var TARGET_VOLUME = 0.25;
  var curtainsOpened = false;
  var musicStarted = false;
  var userMuted = false;

  audio.volume = TARGET_VOLUME;

  function openCurtains() {
    if (curtainsOpened) return;
    curtainsOpened = true;
    body.classList.add("curtains-open");
    setTimeout(function () {
      body.classList.add("content-visible");
    }, 150);
    openHint.disabled = true;
    openHint.setAttribute("aria-hidden", "true");
  }

  function updateButtonState(playing) {
    toggleBtn.classList.toggle("playing", playing);
    toggleBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    toggleBtn.setAttribute("title", playing ? "Mute music" : "Play music");
  }

  function startMusic() {
    if (musicStarted || userMuted) return;
    audio.play().then(function () {
      musicStarted = true;
      updateButtonState(true);
    }).catch(function () {
      // Autoplay blocked; user can still tap the button.
    });
  }

  function onFirstInteraction(e) {
    openCurtains();

    // Skip playing music if the user explicitly clicked the toggle button
    if (!toggleBtn.contains(e.target)) {
      startMusic();
    }

    window.removeEventListener("pointerdown", onFirstInteraction);
    window.removeEventListener("keydown", onFirstInteraction);
    window.removeEventListener("touchstart", onFirstInteraction);
  }

  window.addEventListener("pointerdown", onFirstInteraction, { once: true, passive: true });
  window.addEventListener("keydown", onFirstInteraction, { once: true });
  window.addEventListener("touchstart", onFirstInteraction, { once: true, passive: true });

  toggleBtn.addEventListener("click", function () {
    if (audio.paused) {
      userMuted = false;
      audio.play().then(function () {
        musicStarted = true;
        updateButtonState(true);
      }).catch(function () {});
    } else {
      userMuted = true;
      audio.pause();
      updateButtonState(false);
    }
  });
})();
