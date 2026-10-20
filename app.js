"use strict";

// The three stations are the whole story. Broad signal areas make discovery
// possible; the clear area must be reached before a broadcast can be logged.
const stations = [
  {
    frequency: 912,
    name: "The empty platform",
    transcript: "“If you hear this after midnight, do not wait where the trains arrive. That platform has been empty for years.”",
  },
  {
    frequency: 976,
    name: "The rooftop decoy",
    transcript: "“The light on the roof is a decoy. I left it there so they would search above us.”",
  },
  {
    frequency: 1044,
    name: "The red door",
    transcript: "“Follow the sound beneath the clock. Our old recordings are kept behind the red door.”",
  },
];

const dial = document.querySelector("#frequency-dial");
const frequencyValue = document.querySelector("#frequency-value");
const signalLabel = document.querySelector("#signal-label");
const signalBars = document.querySelector(".signal-bars");
const feedbackText = document.querySelector("#feedback-text");
const listenButton = document.querySelector("#listen-button");
const clueList = document.querySelector("#clue-list");
const progressCount = document.querySelector("#progress-count");
const puzzle = document.querySelector("#puzzle");
const answerFeedback = document.querySelector("#answer-feedback");
const ending = document.querySelector("#ending");

const found = new Set();
let solved = false;

function nearestStation(value) {
  return stations.reduce((nearest, station) =>
    Math.abs(station.frequency - value) < Math.abs(nearest.frequency - value) ? station : nearest
  );
}

function signalAt(value) {
  const station = nearestStation(value);
  const distance = Math.abs(station.frequency - value);
  if (distance <= 2) return { strength: 5, station };
  if (distance <= 5) return { strength: 3, station: null };
  if (distance <= 12) return { strength: 1, station: null };
  return { strength: 0, station: null };
}

function setFeedback(message) {
  feedbackText.textContent = message;
}

function updateDial() {
  const value = Number(dial.value);
  const { strength, station } = signalAt(value);
  frequencyValue.textContent = (value / 10).toFixed(1);
  signalBars.dataset.strength = String(strength);
  dial.style.setProperty("--dial-progress", `${((value - 880) / 200) * 100}%`);

  if (station) {
    signalLabel.textContent = found.has(station.frequency) ? "STATION LOGGED" : "CLEAR SIGNAL";
    setFeedback(found.has(station.frequency)
      ? "You have this broadcast already. Keep tuning to find another."
      : "A voice is coming through. Press “Listen to frequency” to record it.");
  } else if (strength > 0) {
    signalLabel.textContent = strength === 3 ? "SIGNAL GROWING" : "FAINT SIGNAL";
    setFeedback("The static is thinning. Move the dial a little further.");
  } else {
    signalLabel.textContent = "NO SIGNAL";
    setFeedback("Only static here. Keep moving the dial to find a station.");
  }
}

function renderLog() {
  progressCount.textContent = `${found.size} / ${stations.length}`;
  clueList.innerHTML = "";

  stations.forEach((station, index) => {
    const item = document.createElement("li");
    item.className = `clue ${found.has(station.frequency) ? "found" : "empty"}`;

    const number = document.createElement("span");
    number.className = "clue-index";
    number.textContent = String(index + 1).padStart(2, "0");
    item.append(number);

    const content = document.createElement("div");
    if (found.has(station.frequency)) {
      const title = document.createElement("strong");
      title.textContent = `${(station.frequency / 10).toFixed(1)} MHz · ${station.name}`;
      const transcript = document.createElement("p");
      transcript.textContent = station.transcript;
      content.append(title, transcript);
    } else {
      content.className = "clue-placeholder";
      content.textContent = "Frequency unknown. Keep tuning.";
    }
    item.append(content);
    clueList.append(item);
  });

  puzzle.hidden = found.size !== stations.length;
}

function listen() {
  const { station } = signalAt(Number(dial.value));
  if (!station) {
    setFeedback("No clear station at this frequency. Move the dial until the signal meter fills, then listen again.");
    return;
  }
  if (found.has(station.frequency)) {
    setFeedback("This broadcast is already in your signal log. Tune to a different station to continue.");
    return;
  }

  found.add(station.frequency);
  renderLog();
  signalLabel.textContent = "STATION LOGGED";
  setFeedback(`Recorded ${station.name}. You have ${found.size} of ${stations.length} broadcasts.`);
  if (found.size === stations.length) {
    setFeedback("All three broadcasts are recorded. Read the clues, then answer the question below.");
    puzzle.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function answer(choice) {
  if (solved) return;
  if (choice === "archive") {
    solved = true;
    answerFeedback.textContent = "Correct. The platform is empty, the roof is a decoy, and the red door leads to the archive room.";
    answerFeedback.dataset.result = "correct";
    ending.hidden = false;
    document.querySelectorAll(".choice").forEach(button => {
      button.disabled = true;
      if (button.dataset.answer === choice) button.classList.add("selected");
    });
  } else {
    answerFeedback.textContent = choice === "platform"
      ? "The first broadcast says the platform has been empty for years. Try another place."
      : "The second broadcast calls the rooftop light a decoy. Try another place.";
    answerFeedback.dataset.result = "try-again";
  }
}

function reset() {
  found.clear();
  solved = false;
  dial.value = "880";
  ending.hidden = true;
  answerFeedback.textContent = "";
  delete answerFeedback.dataset.result;
  document.querySelectorAll(".choice").forEach(button => {
    button.disabled = false;
    button.classList.remove("selected");
  });
  renderLog();
  updateDial();
  setFeedback("A fresh start. Move the dial to find the first hidden station.");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

dial.addEventListener("input", updateDial);
listenButton.addEventListener("click", listen);
document.querySelector("#reset-button").addEventListener("click", reset);
document.querySelector("#ending-reset").addEventListener("click", reset);
document.querySelectorAll(".choice").forEach(button =>
  button.addEventListener("click", () => answer(button.dataset.answer))
);

renderLog();
updateDial();
