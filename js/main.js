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
let extLinkArrow = document.querySelector("#ext-link");
let urlElem = document.querySelector("#ext-url");
let title = document.querySelector(".name");
let imagesStapel = [];
let currentProj = projBubbleElements[0];
let currentValue;
let table = document.querySelector(".index");
let infos = document.querySelector("#infos");
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
let infosAktiv = false;
let stapelOffen = false;
let infosblur = 20;
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

infos.style.filter = "blur(" + infosblur + "px)";

// ++++ Durchjumpen ++++++

table.addEventListener("click", (e) => {
    let path = e.composedPath();
    let target = Array.from(path)
        .find((element) => element.classList.contains("index-row"))
        .id.replaceAll("index-", "");

    if (target == "info") {
        projektcounter = projektTitles.length;
        showInfos();
        changetitle("Infos");
    } else {
        for (const i in projektTitles) {
            if (projektTitles[i] == target) {
                projektcounter = i;
            }
        }
        changetitle(projekte[target].title);
    }
    removeIndex();
    updateProjVisibility(projektcounter);
});

// +++++++ Durchscrollen ++++++

// for (i = 0; i < projektTitles.length; i++) {
//   projBubbleElements[i].style.filter = "blur(" + cb + "px)";
// }
let indexcounter = 0;
document.addEventListener("wheel", (e) => {
    if (Date.now() - lastScroll > 40) {
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
            if (projektcounter >= 0 && !isInfos()) {
                projBubbleElements[projektcounter].style.filter =
                    "blur(" + Math.max(0, einzelblur * blurfaktor) + "px)";
            }
        }

        if (!indexAktiv && stapelOffen) {
            stapelSchliessen();
        }

        lastScroll = Date.now();
    }
});

function nextProject() {
    if (scrolldown) {
        if (!isInfos()) projektcounter++;
        einzelblur = -2;
    } else if (!scrolldown) {
        if (projektcounter >= 0) projektcounter--;
        einzelblur = 2;
    }

    if (projektcounter == -1) {
        showIndex();
    } else if (isInfos()) {
        showInfos();
        updateProjVisibility(projektcounter);
    } else {
        removeInfos();
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

title.addEventListener("click", (e) => {
    if (stapelOffen) {
        stapelSchliessen();
    } else if (title.textContent == "Index") {
        showIndex();
    }
});
title.addEventListener("mouseover", (e) => {
    if (!stapelOffen) {
        title.textContent = "Index";
    }
});
title.addEventListener("mouseout", (e) => {
    if (!stapelOffen) {
        title.textContent = "Julika Hother";
    }
});

// ++++++ Helferfunktionen ++++++

function updateProjVisibility(projektcounter) {
    for (let i = 0; i < projBubbleElements.length; i++) {
        const element = projBubbleElements[i];
        i >= projektcounter ?
            element.classList.remove("hide") :
            element.classList.add("hide");
    }
    if (!isInfos()) changetitle(projekte[getCurrentId()].title);
}

function stapelSchliessen() {
    removeBlur();
    pTitle.innerHTML = pTitle.innerHTML.replace(pfeil, "");
    for (i = 0; i < imagesStapel.length; i++) {
        imagesStapel[i].parentNode.removeChild(imagesStapel[i]);
    }
    stapelContainer.style.display = "none";
    title.textContent = "Julika Hother";
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
    title.textContent = "✕";
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

function isInfos() {
    if (projektcounter == projBubbleElements.length) {
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
    extLinkArrow.style.display = "none";

    if (typeof projectValues[projektcounter] != "undefined") {
        if (typeof projectValues[projektcounter].url != "undefined") {
            extLinkArrow.style.display = "inline-block";
            urlElem.href = projectValues[projektcounter].url;
        }
    }
}

function addBlur(callback, x) {
    let addAnimation = setInterval(() => {
        if (blurriness < 20) {
            blurriness += 2;
            for (i = 0; i < projektTitles.length; i++) {
                projBubbleElements[i].style.filter = "blur(" + blurriness + "px)";
            }
        } else {
            clearInterval(addAnimation);
            callback(x);
        }
    }, 10);
}

function removeBlur() {
    let removeAnimation = setInterval(() => {
        if (blurriness > 0) {
            blurriness -= 2;
            for (i = 0; i < projektTitles.length; i++) {
                projBubbleElements[i].style.filter = "blur(" + blurriness + "px)";
            }
        } else {
            clearInterval(removeAnimation);
        }
    }, 10);
}

function showIndex() {
    if (indexAktiv) return;

    addBlur(() => {
        table.style.display = "grid";
    });
    changetitle("Index");
    indexAktiv = !indexAktiv;
    for (let i = 0; i < projBubbleElements.length; i++) {
        const element = projBubbleElements[i];
        element.classList.remove("hide");
    }
    projektcounter = -1;
}

function removeIndex() {
    if (!indexAktiv) return;

    table.style.display = "none";

    removeBlur();
    indexAktiv = !indexAktiv;
}

function getCurrentId() {
    let proj = projBubbleElements[projektcounter];
    if (typeof proj != "undefined") return proj.id;
}

function showInfos() {
    if (infosAktiv) return;
    let removeAnimation = setInterval(() => {
        if (infosblur > 0) {
            infosblur -= 2;
            infos.style.filter = "blur(" + infosblur + "px)";
        } else {
            clearInterval(removeAnimation);
            changetitle("Infos");
        }
    }, 30);
    infosAktiv = !infosAktiv;
}

function removeInfos() {
    if (!infosAktiv) return;
    let removeAnimation = setInterval(() => {
        if (infosblur < 20) {
            infosblur += 2;
            infos.style.filter = "blur(" + infosblur + "px)";
        } else {
            clearInterval(removeAnimation);
        }
    }, 20);
    infosAktiv = !infosAktiv;
}

let mobileelem = document.querySelector("#isMobile")

function isMobile() {
    console.log(mobileelem.style.display == "none");

    return mobileelem.style.display == "none"
}

setInterval(isMobile, 1000)