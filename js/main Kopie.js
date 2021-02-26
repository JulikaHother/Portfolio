projektTitles = Object.keys(projekte);
projectValues = Object.values(projekte);
let randomPosX;
let randomPosY;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let projBubbleElements = [];
let stapelContainer = document.querySelector("#stapelcontainer");
let container = document.querySelector(".fixed-container");
let headlineBG = document.querySelector(".headline");
let closeButton = document.querySelector("#closeButton");
let title = document.querySelector(".name");
let imagesStapel = [];
let n = 0;
let current;
let stapelText;
let scrollN = 0;
let scrollFaktor = 500;
let scrollCounter = 0;

let scrolldown;
let pTitle = document.querySelector(".p-title");
let startscreen = true;
let headBalken = document.getElementById("head-balken");
let aboutPage = document.getElementById("about");
let infoText;
let pfeil = "↓ &nbsp;&nbsp;&nbsp;";

// ++++++ Elemente generieren +++++++++

for (i = 0; i < projektTitles.length; i++) {
  projBubbleElements[i] = createNeuesElement(
    "img",
    projektTitles[i],
    "projektbubble"
  );
  container.appendChild(projBubbleElements[i]);

  r = Math.floor(Math.random() * Math.floor(projektTitles.length));

  projBubbleElements[i].src =
    "assets/images/hintergrund/" + projectValues[i].background;
  projBubbleElements[i].style.zIndex = r;

  projBubbleElements[i].innerHTML = projektTitles[i];
  for (let i = 0; i < projBubbleElements.length; i++) {
    const element = projBubbleElements[i];
    if (i < projBubbleElements.length - 5) {
      element.style.display = "none";
    } else {
      element.style.display = "block";
    }
  }
}

// ++++++++ Durchwechseln bei Scrollen +++++++
document.addEventListener("wheel", (e) => {
  if (
    document.getElementById("stapelcontainer").style.display != "block" &&
    aboutPage.style.display != "block" &&
    scrollCounter % 2 == 0
  ) {
    durchrotieren(projBubbleElements);
    if (e.deltaY < 0) {
      scrolldown = true;
    } else {
      scrolldown = false;
    }
    let curr = projBubbleElements[projBubbleElements.length - 1].id;

    pTitle.textContent = projekte[curr].title;
    // stapelContainer.style.backgroundColor = "black";

    for (let i = 0; i < projBubbleElements.length; i++) {
      projBubbleElements[i].style.zIndex = i;
      //  projBubbleElements[i].style.mixBlendMode = "difference";
      // projBubbleElements[projBubbleElements.length - 1].style.mixBlendMode =
      // "normal";
    }
    startscreen = false;
  }
  scrollCounter++;
  console.log(e);

  for (let i = 0; i < projBubbleElements.length; i++) {
    const element = projBubbleElements[i];
    if (i < projBubbleElements.length - 4) {
      element.style.display = "none";
    } else {
      element.style.display = "block";
    }
  }
});

// ++++++++ Stapel öffnen ++++++++

container.addEventListener("click", (e) => {
  current = projBubbleElements[projBubbleElements.length - 1].id;

  if (n == 0 && !startscreen && projekte[current].images[0]) {
    pTitle.innerHTML = pfeil + pTitle.textContent;
    nextImage(e);

    stapelContainer.style.display = "block";
  }
});

stapelContainer.addEventListener("click", (e) => {
  if (n < projekte[current].images.length) {
    nextImage(e);
  }
});

function nextImage(e) {
  imagesStapel[n] = createNeuesElement("img", current + n, "stapelBild");

  imagesStapel[n].src =
    "assets/images/" + current + "/" + projekte[current].images[n];
  imagesStapel[n].style.transform =
    "rotate(" + getRandomWinkel() + ") translateY(-50%) translateX(-50%)";
  if (e.x < 250) {
    imagesStapel[n].style.left = 280;
  } else if (e.x > windowWidth - 250) {
    imagesStapel[n].style.left = windowWidth - 280;
  } else {
    imagesStapel[n].style.left = e.x;
  }
  if (e.y < 300) {
    imagesStapel[n].style.top = 330;
  } else if (e.y > windowHeight - 250) {
    imagesStapel[n].style.top = windowHeight - 280;
  } else {
    imagesStapel[n].style.top = e.y;
  }

  stapelContainer.appendChild(imagesStapel[n]);

  n++;
}

// ++++++++ Stapel schließen ++++++++

// stapelContainer.addEventListener("click", (e) => {
//   if (e.target == stapelContainer) {
//     pTitle.innerHTML = pTitle.innerHTML.replace(pfeil, "");
//     for (i = 0; i < imagesStapel.length; i++) {
//       imagesStapel[i].parentNode.removeChild(imagesStapel[i]);
//     }
//     stapelContainer.style.display = "none";
//     imagesStapel = [];
//     n = 0;
//   }
// });

closeButton.addEventListener("click", (e) => {
  pTitle.innerHTML = pTitle.innerHTML.replace(pfeil, "");
  for (i = 0; i < imagesStapel.length; i++) {
    imagesStapel[i].parentNode.removeChild(imagesStapel[i]);
  }
  stapelContainer.style.display = "none";
  imagesStapel = [];
  n = 0;
});

// ++++ About Seite und Header +++++++
let tempCurr;

title.addEventListener("mouseenter", (e) => {
  if (stapelContainer.style.display != "block") {
    tempCurr = pTitle.textContent;

    pTitle.textContent = "Infos";
  } else if (typeof infoText == "undefined") {
    infoText = createNeuesElement("div", "pInfo", "pInfo");
    stapelContainer.appendChild(infoText);
    infoText.textContent = projekte[current].description;
  }
});
title.addEventListener("mouseleave", (e) => {
  if (stapelContainer.style.display != "block") {
    pTitle.textContent = tempCurr;
  } else if (typeof infoText != "undefined") {
    infoText.parentNode.removeChild(infoText);
    infoText = undefined;
  }
});

title.addEventListener("click", (e) => {
  if (stapelContainer.style.display != "block") {
    tempCurr = pTitle.textContent;
    aboutPage.style.display = "block";
    pTitle.textContent = "Infos";
    headBalken.style.pointerEvents = "none";
  }
});

aboutPage.addEventListener("click", (e) => {
  if (stapelContainer.style.display != "block") {
    aboutPage.style.display = "none";
    pTitle.textContent = tempCurr;
    headBalken.style.pointerEvents = "inherit";
  }
});

// ++++++ Helferfunktionen ++++++

function getRandomWinkel() {
  let maxWinkel = 10;
  let rWinkel = Math.floor(
    Math.random() * Math.floor(maxWinkel * 2) - maxWinkel
  );
  return rWinkel + "deg";
}

function createNeuesElement(type, id, klasse) {
  let elem = document.createElement(type);
  elem.setAttribute("id", id);
  elem.setAttribute("class", klasse);
  return elem;
}

function checkScrollDirectionIsUp(event) {
  if (event.wheelDelta) {
    return event.wheelDelta > 0;
  }
  return event.deltaY < 0;
}

function durchrotieren(arr) {
  if (scrolldown) {
    arr.unshift(arr[arr.length - 1]);
    arr.pop();
  } else {
    arr.push(arr[0]);
    arr.shift();
  }
}
