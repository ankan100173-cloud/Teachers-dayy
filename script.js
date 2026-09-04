(function () {
  "use strict";

  var audio = document.getElementById("bg-audio");
  var toggleBtn = document.getElementById("music-toggle");
  var openHint = document.getElementById("open-hint");
  var body = document.body;
  var TARGET_VOLUME = 0.25;

  var curtainsOpened = false;
  var musicStarted = false;
  var musicStarting = false;
  var userMuted = false;

  // Prime audio volume safely (some mobile browsers throw on programmatic volume)
  try {
    audio.volume = TARGET_VOLUME;
  } catch (e) {}

  // Preload audio metadata early so media pipeline is ready when tapped
  try {
    audio.load();
  } catch (e) {}

  function openCurtains() {
    if (curtainsOpened) return;
    curtainsOpened = true;
    body.classList.add("curtains-open");
    setTimeout(function () {
      body.classList.add("content-visible");
    }, 150);

    if (openHint) {
      openHint.setAttribute("aria-hidden", "true");
      openHint.tabIndex = -1;
      // Delay disabling the button so that in-flight touch and click gestures
      // are not aborted by the browser mid-interaction
      setTimeout(function () {
        openHint.disabled = true;
      }, 600);
    }
  }

  function updateButtonState(playing) {
    if (!toggleBtn) return;
    toggleBtn.classList.toggle("playing", playing);
    toggleBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    toggleBtn.setAttribute("title", playing ? "Mute music" : "Play music");
  }

  function startMusic() {
    if (musicStarted || musicStarting || userMuted) return;

    try {
      audio.volume = TARGET_VOLUME;
    } catch (e) {}

    musicStarting = true;
    var playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          musicStarted = true;
          musicStarting = false;
          updateButtonState(true);
          cleanupInteractionListeners();
        })
        .catch(function (err) {
          musicStarting = false;
          updateButtonState(false);
          // If playback was blocked (e.g. strict policy), fallback listeners remain
          // attached so that the next tap on the screen will start playback.
        });
    } else {
      musicStarted = !audio.paused;
      musicStarting = false;
      updateButtonState(musicStarted);
      if (musicStarted) {
        cleanupInteractionListeners();
      }
    }
  }

  function handleOpenAndPlay(e) {
    if (toggleBtn && e && toggleBtn.contains(e.target)) {
      return;
    }

    openCurtains();
    startMusic();
  }

  function handleOpenHintTouchEnd(e) {
    handleOpenAndPlay(e);
  }

  function handleOpenHintClick(e) {
    handleOpenAndPlay(e);
  }

  // Bind directly to the "Tap to Open Invitation" button for immediate user activation
  if (openHint) {
    openHint.addEventListener("click", handleOpenHintClick);
    openHint.addEventListener("touchend", handleOpenHintTouchEnd, { passive: true });
  }

  // Fallback interaction listeners across window so tapping anywhere on the screen also works
  function onFallbackInteraction(e) {
    handleOpenAndPlay(e);
  }

  function attachFallbackListeners() {
    window.addEventListener("click", onFallbackInteraction);
    window.addEventListener("touchend", onFallbackInteraction, { passive: true });
    window.addEventListener("keydown", onFallbackInteraction);
  }

  function cleanupInteractionListeners() {
    if (openHint) {
      openHint.removeEventListener("click", handleOpenHintClick);
      openHint.removeEventListener("touchend", handleOpenHintTouchEnd);
    }
    window.removeEventListener("click", onFallbackInteraction);
    window.removeEventListener("touchend", onFallbackInteraction);
    window.removeEventListener("keydown", onFallbackInteraction);
  }

  attachFallbackListeners();

  // Sync toggle button with real audio element play/pause events
  audio.addEventListener("play", function () {
    musicStarted = true;
    updateButtonState(true);
  });

  audio.addEventListener("pause", function () {
    updateButtonState(false);
  });

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      if (audio.paused) {
        userMuted = false;
        try {
          audio.volume = TARGET_VOLUME;
        } catch (err) {}
        audio.play().then(function () {
          musicStarted = true;
          updateButtonState(true);
          cleanupInteractionListeners();
        }).catch(function () {});
      } else {
        userMuted = true;
        audio.pause();
        updateButtonState(false);
      }
    });
  }
})();
