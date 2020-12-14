// cache dom elements
const mapContainer = document.querySelector("#map");
const backBtn = mapContainer.querySelector("#back_btn");
const map = mapContainer.querySelector("#us_map");
const originalViewBox = [0, 0, 650, 400]; // viewBox of initial map SVG
map.setAttribute("height", getComputedStyle(mapContainer, null).height); // so zoom works properly

// manage focus when zoomed-in
const allPins = Array.from(mapContainer.querySelectorAll(".pin_link"));
let lastActiveElem; // save last active element for focus
let zoomedIn = false; // helps managing keyboard focus
let interactiveElems = null; // array of elems
let currentFocusedElemIndex = null; // integer

// vars for zoom in/out animation
const totalAmountOfFrames = 16;
let requestID = null;
let currentFrameIndex = 0;
let targetViewBox;

/**
 * Animation function that gradually changes 4 nums of viewBox to get it closer to targetViewBox, creating nice zoom in/out animation
 * uses recursion and requestAnimationFrame
 * idea is borrowed in part from here: https://codepen.io/thebabydino/pen/brywXv/?editors=1010
 */
function updateViewBox() {
  let progress = ++currentFrameIndex / totalAmountOfFrames;
  let j = 1 - progress;
  let currentViewBox = originalViewBox.slice(); // make a copy of current viewBox array

  // this is where magic of animation happens: loop thru all 4 array items and gradually get them closer to targetViewBox numbers
  for (let i = 0; i < 4; i++) {
    currentViewBox[i] = j * originalViewBox[i] + progress * targetViewBox[i];
  }

  map.setAttribute("viewBox", currentViewBox.join(" ")); // update viewBox in DOM

  // stops recursion
  if (!(currentFrameIndex % totalAmountOfFrames)) {
    currentFrameIndex = 0;
    originalViewBox.splice(0, 4, ...currentViewBox);
    stopAni();
    return;
  }

  requestID = requestAnimationFrame(updateViewBox); // recursion
}

// helper for updateViewBox()
function stopAni() {
  cancelAnimationFrame(requestID);
  requestID = null;
}

// EVEN LISTENERS
// Click event listeners
mapContainer.addEventListener("click", function (e) {
  // when state is clicked
  if (e.target.closest(".state_link")) {
    console.warn(e.target);
    console.warn(e.target.closest(".state_link"));

    const smViewBox = e.target.getBBox(); // --> object of viewBox data for that state
    targetViewBox = [smViewBox.x, smViewBox.y, smViewBox.width, smViewBox.height]; // our new viewBox target
    updateViewBox();

    backBtn.classList.remove("d-none");

    // to show related pins
    let state;
    // we need this b/c e.target is different if you click or use Enter key
    if (e.target.matches(".state_link")) {
      state = e.target.querySelector(".active_state").getAttribute("data-state"); // e.g. "CA"
    } else {
      state = e.target.getAttribute("data-state"); // e.g. "CA"
    }
    // find all pins with data-state attribute matching value
    const pins = Array.from(document.querySelectorAll(`a[data-state="${state}"`));
    pins.forEach(function (item, i) {
      item.classList.remove("d-none"); // show them all
    });

    // to manage focus
    backBtn.focus();
    lastActiveElem = e.target.closest(".state_link"); // save to return focus to it on zoomed-out
    zoomedIn = true;
    if (pins.length < 1) return; // if no pins, no need to manage focus

    // create array of interactive elems and trap focus in there
    interactiveElems = [backBtn, ...pins];
    currentFocusedElemIndex = 0;
  }

  // when Back btn is clicked
  if (e.target.id === "back_btn") {
    // we then set the new viewBox stsring as the vewBox attribute on the SVG
    targetViewBox = [0, 0, 650, 400];
    updateViewBox();

    e.target.classList.add("d-none");
    lastActiveElem.focus();
    zoomedIn = false;
    interactiveElems = null;
    currentFocusedElemIndex = null;
    allPins.forEach(function (item, i) {
      item.classList.add("d-none");
    });
  }
});

// All keyboard listeners
document.addEventListener("keyup", function (e) {
  // when zoomed-in, Esc key will zoom out
  if (zoomedIn && e.key === "Escape") {
    backBtn.click();
    return;
  }

  // listen for Shift+Tab keypress
  else if (zoomedIn && e.shiftKey && e.key === "Tab") {
    // if keypress happens on last elem, then focus the 1st one
    if (currentFocusedElemIndex === 0) {
      currentFocusedElemIndex = interactiveElems.length - 1;
    } else {
      currentFocusedElemIndex--;
    }

    interactiveElems[currentFocusedElemIndex].focus(); // manually focus next elem
  }

  // listen for Tab keypress
  else if (zoomedIn && e.key === "Tab") {
    // if keypress happens on last elem, then focus the 1st one
    if (currentFocusedElemIndex === interactiveElems.length - 1) {
      currentFocusedElemIndex = 0;
    } else {
      currentFocusedElemIndex++;
    }

    interactiveElems[currentFocusedElemIndex].focus(); // manually focus next elem
  }
});

// Creates event listeners for every tooltip trigger so that tooltips show/hide on tabbing through the map
var pins = Array.from(document.querySelectorAll("[data-toggle]"));
var tooltips = [];
pins.forEach(function (item) {
  tooltips.push(new Tooltip(item, {}));
});

for (let i = 0; i < pins.length; i++) {
  pins[i].addEventListener("focus", function () {
    tooltips[i].show();
  });

  pins[i].addEventListener("blur", function () {
    tooltips[i].hide();
  });
}
