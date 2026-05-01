(function () {
  let storyData = null;
  let currentSceneId = null;
  let currentStoryFile = null;
  let history = [];
  const debugMode = new URLSearchParams(window.location.search).has("debug");
  const params = new URLSearchParams(window.location.search);

  const cover = document.getElementById("cover");
  const appEl = document.getElementById("app");
  const container = document.getElementById("story-container");
  const sceneText = document.getElementById("scene-text");
  const sceneEmoji = document.getElementById("scene-emoji");
  const choicesContainer = document.getElementById("choices");
  const restartBtn = document.getElementById("restart-btn");
  const postCreditsBtn = document.getElementById("post-credits-btn");
  const backBtn = document.getElementById("back-btn");

  async function loadStory(file) {
    currentStoryFile = file;
    const res = await fetch(file);
    storyData = await res.json();
    document.getElementById("story-title").textContent = storyData.title;
  }

  async function startStory(file) {
    await loadStory(file);
    cover.classList.add("hidden");
    appEl.classList.remove("hidden");
    history = [];
    goToScene("start", false);
  }

  async function init() {
    const storyParam = params.get("story");
    const hashScene = window.location.hash.slice(1);

    // If URL has a hash or story param, skip cover and go directly
    if (hashScene || storyParam) {
      const file = storyParam === "dorito" ? "story_dori.json" : "story.json";
      await loadStory(file);
      cover.classList.add("hidden");
      appEl.classList.remove("hidden");
      if (hashScene && storyData.scenes[hashScene]) {
        goToScene(hashScene, false);
      } else {
        goToScene("start", false);
      }
    } else {
      // Show cover page
      cover.classList.remove("hidden");
      appEl.classList.add("hidden");
    }
  }

  // Cover page buttons
  document.getElementById("cover-main").addEventListener("click", () => startStory("story.json"));
  document.getElementById("cover-dorito").addEventListener("click", () => {
    // Set URL param so hash routing knows which file
    const url = new URL(window.location);
    url.searchParams.set("story", "dorito");
    window.history.replaceState({}, "", url);
    startStory("story_dori.json");
  });
  function goToScene(sceneId, addToHistory = true) {
    const scene = storyData.scenes[sceneId];
    if (!scene) return;

    if (addToHistory && currentSceneId) {
      history.push(currentSceneId);
    }
    currentSceneId = sceneId;

    // Update URL hash
    window.location.hash = sceneId;

    // Switch music track if needed
    switchTrack(sceneId);

    // Show/hide back button
    backBtn.classList.toggle("hidden", history.length === 0);

    // Fade out
    if (!debugMode) container.classList.remove("visible");

    setTimeout(() => {
      // Update background color
      document.body.style.backgroundColor = scene.bg || "#fdf6f0";

      // Light text for dark backgrounds
      const isDark = scene.bg && scene.bg.match(/^#[0-3]/);
      sceneText.style.color = isDark ? "#e8e0f0" : "#3d2e22";

      // Update emoji
      sceneEmoji.textContent = scene.emoji || "";

      // Clear previous text and choices
      sceneText.textContent = "";
      choicesContainer.innerHTML = "";
      restartBtn.classList.add("hidden");
      postCreditsBtn.classList.add("hidden");

      // Typewriter effect
      typeWriter(scene.text, sceneText, () => {
        // Show choices after text finishes
        if (scene.finale) {
          showFinale();
        } else {
          showChoices(scene.choices);
        }
      });

      // Fade in
      container.classList.add("visible");
    }, debugMode ? 0 : 400);
  }

  function typeWriter(text, element, callback) {
    if (debugMode) {
      element.innerHTML = text.replace(/\n/g, "<br>");
      if (callback) callback();
      return;
    }
    let i = 0;
    element.textContent = "";
    const speed = 30; // ms per character

    function type() {
      if (i < text.length) {
        // Handle newlines
        if (text.charAt(i) === "\n") {
          element.innerHTML += "<br>";
        } else {
          element.innerHTML += text.charAt(i);
        }
        i++;
        setTimeout(type, speed);
      } else {
        if (callback) callback();
      }
    }
    type();
  }

  function showChoices(choices) {
    choicesContainer.innerHTML = "";
    choices.forEach((choice, idx) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.label;
      btn.style.animationDelay = idx * 0.15 + "s";
      btn.addEventListener("click", () => goToScene(choice.next));
      choicesContainer.appendChild(btn);
    });
  }

  function showFinale() {
    restartBtn.classList.remove("hidden");
    // Show post-credits button only on main finale scene
    if (currentSceneId === "finale" && currentStoryFile === "story.json") {
      postCreditsBtn.classList.remove("hidden");
    } else {
      postCreditsBtn.classList.add("hidden");
    }
    launchCelebration();
  }

  function launchCelebration() {
    // Floating hearts
    for (let i = 0; i < 30; i++) {
      setTimeout(() => createHeart(), i * 100);
    }
    // Confetti burst
    for (let i = 0; i < 60; i++) {
      setTimeout(() => createConfetti(), i * 50);
    }
  }

  function createHeart() {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = ["❤️", "💕", "💗", "💖", "✨", "🎉"][Math.floor(Math.random() * 6)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = 3 + Math.random() * 3 + "s";
    heart.style.fontSize = 16 + Math.random() * 20 + "px";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }

  function createConfetti() {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd"][Math.floor(Math.random() * 6)];
    confetti.style.animationDuration = 2 + Math.random() * 2 + "s";
    confetti.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }

  restartBtn.addEventListener("click", () => {
    history = [];
    // Reset music
    arabMusic.pause();
    arabMusic.currentTime = 0;
    currentTrack = "default";
    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      musicToggle.textContent = "🔇";
    }
    // Reset URL
    const url = new URL(window.location);
    url.searchParams.delete("story");
    url.hash = "";
    window.history.replaceState({}, "", url.pathname);
    // Show cover
    appEl.classList.add("hidden");
    cover.classList.remove("hidden");
    container.classList.remove("visible");
    postCreditsBtn.classList.add("hidden");
  });

  postCreditsBtn.addEventListener("click", () => {
    postCreditsBtn.classList.add("hidden");
    goToScene("post_credits");
  });

  backBtn.addEventListener("click", () => {
    if (history.length > 0) {
      const prev = history.pop();
      goToScene(prev, false);
    }
  });

  // Handle browser back/forward
  window.addEventListener("hashchange", () => {
    const hashScene = window.location.hash.slice(1);
    if (hashScene && storyData && storyData.scenes[hashScene] && hashScene !== currentSceneId) {
      goToScene(hashScene, false);
    }
  });

  // Music toggle
  const musicToggle = document.getElementById("music-toggle");
  const bgMusic = document.getElementById("bg-music");
  const arabMusic = document.getElementById("arab-music");
  let musicPlaying = false;
  let currentTrack = "default"; // "default" or "arab"

  const arabScenes = ["arab_guy", "arab_guy_2nd_wife", "arab_guy_cats", "arab_guy_habibi", "arab_guy_dream"];

  function isArabScene(sceneId) {
    return arabScenes.includes(sceneId);
  }

  function switchTrack(sceneId) {
    const wantArab = isArabScene(sceneId);
    if (wantArab && currentTrack !== "arab") {
      bgMusic.pause();
      currentTrack = "arab";
      if (musicPlaying) {
        arabMusic.play();
      }
    } else if (!wantArab && currentTrack === "arab") {
      arabMusic.pause();
      currentTrack = "default";
      if (musicPlaying) {
        bgMusic.play();
      }
    }
  }

  function getCurrentAudio() {
    return currentTrack === "arab" ? arabMusic : bgMusic;
  }

  musicToggle.addEventListener("click", () => {
    if (musicPlaying) {
      getCurrentAudio().pause();
      musicToggle.textContent = "🔇";
    } else {
      getCurrentAudio().play();
      musicToggle.textContent = "🎵";
    }
    musicPlaying = !musicPlaying;
  });

  // Start
  init();
})();
