projektTitles = Object.keys(projekte);
projectValues = Object.values(projekte);
let randomPosX;
let randomPosY;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let projBubbleElements = [];
let indexrows = [];
let stapelContainer = document.querySelector("#stapelcontainer");
let container = document.querySelector(".fixed-container");
let headlineBG = document.querySelector(".headline");
let closeButton = document.querySelector("#closeButton");
let title = document.querySelector(".name");
let imagesStapel = [];
let currentProj = projBubbleElements[0];
let currentValue;
let table = document.querySelector(".index");
let blurriness = 0;

let n = 0;
let stapelText;
let scrollN = 0;
let scrollFaktor = 500;
let scrollCounter = 0;

let scrolldown;
let pTitle = document.querySelector(".p-title");
let headBalken = document.getElementById("head-balken");
let aboutPage = document.getElementById("about");
let infoText;
let pfeil = "↓ &nbsp;&nbsp;&nbsp;";

let projektcounter = 0;
let counter = 0;
let indexAktiv = false;
let stapelOffen = false;
let cb = 20;
let einzelblur = 0;
let blurfaktor = 10;
var lastScroll = 0;

// ++++++ Elemente generieren +++++++++

for (i = 0; i < projektTitles.length; i++) {
  projBubbleElements[i] = createNeuesElement(
    "img",
    projektTitles[i],
    "projektbubble"
  );
  container.appendChild(projBubbleElements[i]);

  projBubbleElements[i].src =
    "assets/images/hintergrund/" + projectValues[i].background;
  projBubbleElements[i].style.zIndex = projektTitles.length - i;

  projBubbleElements[i].innerHTML = projektTitles[i];

  indexrows[i] = createNeuesElement(
    "li",
    "index-" + projektTitles[i],
    "index-row"
  );
  table.appendChild(indexrows[i]);

  let tempTitle = createNeuesElement(
    "span",
    "title-" + projektTitles[i],
    "li-title"
  );
  indexrows[i].appendChild(tempTitle);

  tempTitle.innerHTML = projectValues[i].title;

  let tempCat = createNeuesElement(
    "span",
    "category-" + projektTitles[i],
    "li-category"
  );
  indexrows[i].appendChild(tempCat);

  tempCat.innerHTML = projectValues[i].category;

  let tempYear = createNeuesElement(
    "span",
    "year-" + projektTitles[i],
    "li-year"
  );
  indexrows[i].appendChild(tempYear);

  tempYear.innerHTML = projectValues[i].year;

  let r = Math.floor(Math.random() * 100);
  indexrows[i].querySelector(".li-category").style.paddingLeft = r + "vw";
}

let tempStr = table.innerHTML;
tempStr =
  tempStr +
  '<li id="index-info" class="index-row"><span id="title-phd" class="li-title">Info</span><span id="year-phd" class="li-year">mail@julikahother.de</span></li>';
table.innerHTML = tempStr;

// ++++ Durchjumpen ++++++

table.addEventListener("click", (e) => {
  let target = Array.from(e.path)
    .find((element) => element.classList.contains("index-row"))
    .id.replaceAll("index-", "");

  for (const i in projektTitles) {
    if (projektTitles[i] == target) {
      projektcounter = i;
      changetitle(projekte[target].title);
      updateProjVisibility(projektcounter);
      removeIndex();
    }
  }
});

// +++++++ Durchscrollen ++++++

// for (i = 0; i < projektTitles.length; i++) {
//   projBubbleElements[i].style.filter = "blur(" + cb + "px)";
// }
let indexcounter = 0;
document.addEventListener("wheel", (e) => {
  if (Date.now() - lastScroll > 40) {
    console.log(indexAktiv);
    if (e.deltaY > 0) {
      scrolldown = true;
      counter++;
    } else {
      scrolldown = false;
      counter--;
    }

    //++++++++  POJIS  +++++++++

    if (!stapelOffen) {
      if (counter % 4 == 0) {
        nextProject();
      }
      if (scrolldown) {
        einzelblur++;
      } else {
        einzelblur--;
      }
      if (projektcounter >= 0) {
        projBubbleElements[projektcounter].style.filter =
          "blur(" + Math.max(0, einzelblur * blurfaktor) + "px)";
      }
    }

    if (!indexAktiv && stapelOffen) {
      removeBlur();
      stapelSchliessen();
    }

    //++++++++  INDEX  +++++++++

    // if (counter < 0 && !indexAktiv && !scrolldown) {
    //   showIndex();
    // } else if (counter < 0 && indexAktiv && scrolldown) {
    //   removeIndex();
    // }
    lastScroll = Date.now();
  }
});

function nextProject() {
  if (scrolldown) {
    if (!isLastProj()) projektcounter++;
    einzelblur = -2;
  } else if (!scrolldown) {
    if (projektcounter >= 0) projektcounter--;
    einzelblur = 2;
  }

  if (projektcounter == -1) {
    showIndex();
  } else {
    removeIndex();
    updateProjVisibility(projektcounter);
  }
}

// ++++++++ Stapel öffnen ++++++++

container.addEventListener("click", (e) => {
  stapeloeffnen(e);
});

// +++ weitere Bilder anzeigen ++++++
let zi = 10;

stapelContainer.addEventListener("click", (e) => {
  if (n < projekte[getCurrentId()].images.length) {
    nextImage(e);
  } else if (e.target.classList.contains("stapelBild")) {
    zi++;
    e.target.style.zIndex = zi;
  }
});

closeButton.addEventListener("click", (e) => {
  stapelSchliessen();
});

// ++++++ Helferfunktionen ++++++

function updateProjVisibility(projektcounter) {
  for (let i = 0; i < projBubbleElements.length; i++) {
    const element = projBubbleElements[i];
    i >= projektcounter
      ? element.classList.remove("hide")
      : element.classList.add("hide");
  }
  changetitle(projekte[getCurrentId()].title);
}

function stapelSchliessen() {
  pTitle.innerHTML = pTitle.innerHTML.replace(pfeil, "");
  for (i = 0; i < imagesStapel.length; i++) {
    imagesStapel[i].parentNode.removeChild(imagesStapel[i]);
  }
  stapelContainer.style.display = "none";
  imagesStapel = [];
  n = 0;
  stapelOffen = false;
}

function stapeloeffnen(e) {
  if (n == 0 && projekte[getCurrentId()].images[0]) {
    // pTitle.innerHTML = pfeil + pTitle.textContent;
    addBlur(nextImage, e);

    stapelContainer.style.display = "block";
  }
  stapelOffen = true;
}

function nextImage(e) {
  imagesStapel[n] = createNeuesElement("img", getCurrentId() + n, "stapelBild");

  imagesStapel[n].src =
    "assets/images/" +
    getCurrentId() +
    "/" +
    projekte[getCurrentId()].images[n];
  imagesStapel[n].style.transform =
    "rotate(" + getRandomWinkel() + ") translateY(-50%) translateX(-50%)";

  let padding = 80;
  let breite = windowWidth / 4 + padding;
  let hoehe = windowHeight / 4 + padding;

  if (e.x < breite) {
    imagesStapel[n].style.left = breite;
  } else if (e.x > windowWidth - breite) {
    imagesStapel[n].style.left = windowWidth - breite;
  } else {
    imagesStapel[n].style.left = e.x;
  }
  if (e.y < hoehe + 50) {
    imagesStapel[n].style.top = hoehe + 50;
  } else if (e.y > windowHeight - hoehe) {
    imagesStapel[n].style.top = windowHeight - hoehe;
  } else {
    imagesStapel[n].style.top = e.y;
  }

  stapelContainer.appendChild(imagesStapel[n]);

  n++;
}

function isLastProj() {
  if (projektcounter == projBubbleElements.length - 1) {
    return true;
  } else {
    return false;
  }
}
function isFirstProj() {
  if (projektcounter == 0) {
    return true;
  } else {
    return false;
  }
}

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

function changetitle(input) {
  pTitle.textContent = input;
}

function addBlur(callback, x) {
  let addAnimation = setInterval(() => {
    if (blurriness < 20) {
      blurriness += 4;
      for (i = 0; i < projektTitles.length; i++) {
        projBubbleElements[i].style.filter = "blur(" + blurriness + "px)";
      }
    } else {
      clearInterval(addAnimation);
      callback(x);
    }
  }, 20);
}

function removeBlur() {
  let removeAnimation = setInterval(() => {
    if (blurriness > 0) {
      blurriness -= 4;
      for (i = 0; i < projektTitles.length; i++) {
        projBubbleElements[i].style.filter = "blur(" + blurriness + "px)";
      }
    } else {
      clearInterval(removeAnimation);
    }
  }, 20);
}

function showIndex() {
  if (indexAktiv) return;
  addBlur(() => {
    table.style.display = "grid";
  });
  indexAktiv = !indexAktiv;
}
function removeIndex() {
  if (!indexAktiv) return;

  table.style.display = "none";

  removeBlur();
  indexAktiv = !indexAktiv;
}

function getCurrentId() {
  return projBubbleElements[projektcounter].id;
}
