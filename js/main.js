projektTitles = Object.keys(projekte);
projectValues = Object.values(projekte);

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let projBubbleElements = [];
let indexrows = [];
let body = document.querySelector("body");
let stapelContainer = document.querySelector("#stapelcontainer");
let container = document.querySelector(".fixed-container");
let extLinkArrow = document.querySelector("#ext-link");
let urlElem = document.querySelector("#ext-url");
let title = document.querySelector(".name");
let imagesStapel = [];
let table = document.querySelector(".index");
let infos = document.querySelector("#infos");
let pTitle = document.querySelector(".p-title");
let headBalken = document.getElementById("head-balken");
let aboutPage = document.getElementById("about");
let scrollPfeil = document.querySelector("#scrollPfeil")

let n = 0;
let counter = 0;
let projektcounter = 0;
let scrolldown;
var lastScroll = 0;
let indexAktiv = false;
let infosAktiv = false;
let stapelOffen = false;
let ready = false;

let blurriness = 20;
let infosMaxblur = 13;
let infosblur = infosMaxblur;
let einzelblur = 0;
let blurfaktor = 10;

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
    '<li id="index-info" class="index-row"><span id="title-phd" class="li-title">Info</span><span id="year-phd" class="li-year">julika.hother@gmx.de</span></li>';
table.innerHTML = tempStr;

infos.style.filter = "blur(" + infosblur + "px)";
for (i = 0; i < projektTitles.length; i++) {
    projBubbleElements[i].style.filter = "blur(" + blurriness + "px)";
}

window.onload = function() {
    removeBlur(0.3, () => {
        ready = true;
    });
    scrollPfeil.classList.add("movedown")
};

// +*++++ NUR DESKTOPP +++++
if (!isMobile()) {
    // ++++ Durchjumpen ++++++

    table.addEventListener("click", (e) => {
        let path = e.composedPath();
        let target = Array.from(path)
            .find((element) => element.classList.contains("index-row"))
            .id.replace("index-", "");

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
            removeInfos();
        }
        removeIndex();
        updateProjVisibility(projektcounter);
    });

    // +++++++ Durchscrollen ++++++

    document.addEventListener("wheel", (e) => {
        if (Date.now() - lastScroll > 40) {
            if (e.deltaY > 0) {
                scrolldown = true;
                counter++;
            } else {
                scrolldown = false;
                counter--;
            }

            //++++++++  PROJIS  +++++++++

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

            // if (!indexAktiv && stapelOffen) {
            //   stapelSchliessen();
            // }

            lastScroll = Date.now();
        }
    });

    // ++++++++ Stapel öffnen ++++++++

    container.addEventListener("click", (e) => {
        if (pTitle.textContent == "") {
            showIndex();
        } else {
            stapeloeffnen(e);
        }
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
            title.textContent = "Index";

        } else if (indexAktiv) {

            location.reload();

        } else if (title.textContent == "Index" && ready) {
            removeInfos();
            showIndex();
        }

    });
    title.addEventListener("mouseover", (e) => {
        if (!stapelOffen && !indexAktiv) {
            title.textContent = "Index";
        }
    });
    title.addEventListener("mouseout", (e) => {
        if (!stapelOffen) {
            title.textContent = "Julika Hother";
        }
    });
} else {
    // ++++++ NUR MOBIL +++++++

    headBalken.style.zIndex = 10;
    let desktEmpf = document.querySelector("#desktopEmpfehlung");

    container.style.display = "none";
    showInfos();
    let touchstartpos = {
        x: 0,
        y: 0
    };
    document.addEventListener("touchstart", (e) => {
        touchstartpos = Math.floor(e.touches[0].clientX);
    });
    document.addEventListener("touchend", (e) => {
        let isTap = Math.floor(e.changedTouches[0].clientX) == touchstartpos;
        let isContactme =
            e.target == document.querySelector(".contactme") ||
            e.target == document.querySelector(".contactme a");
        if (isTap && !isContactme) {
            if (infosAktiv) {
                removeInfos();
                desktEmpf.style.display = "block";
                body.style.overflow = "hidden";
                headBalken.style.backgroundColor = "rgba(180, 192, 231,0)";
            } else {
                showInfos();
                desktEmpf.style.display = "none";
                body.style.overflow = "visible";
                headBalken.style.backgroundColor = "rgb(180, 192, 231)";
            }
        }
    });
}

// ++++++ Helferfunktionen ++++++

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

function updateProjVisibility(projektcounter) {
    for (let i = 0; i < projBubbleElements.length; i++) {
        const element = projBubbleElements[i];
        i >= projektcounter ?
            element.classList.remove("hide") :
            element.classList.add("hide");
    }
    if (!isInfos()) changetitle(projekte[getCurrentId()].title);
}

function stapeloeffnen(e) {
    if (n == 0 && projekte[getCurrentId()].images[0]) {
        addBlur(nextImage, e);
        stapelContainer.style.display = "block";
    }
    title.textContent = "✕";
    stapelOffen = true;
}

function stapelSchliessen() {
    removeBlur();
    for (i = 0; i < imagesStapel.length; i++) {
        imagesStapel[i].parentNode.removeChild(imagesStapel[i]);
    }
    stapelContainer.style.display = "none";
    title.textContent = "Julika Hother";
    imagesStapel = [];
    n = 0;
    stapelOffen = false;
}

function nextImage(e) {
    imagesStapel[n] = createNeuesElement("img", getCurrentId() + n, "stapelBild");
    let imgelem = imagesStapel[n];
    imgelem.src =
        "assets/images/" +
        getCurrentId() +
        "/" +
        projekte[getCurrentId()].images[n];

    // ++++ drehen ++++

    imgelem.style.transform =
        "rotate(" +
        getRandomWinkel() +
        ") translateY(-50%) translateX(-50%)";

    let padding = 80;
    let breite;
    let hoehe;

    imgelem.onload = function() {
        breite = this.width / 2 + padding;
        hoehe = this.height / 2 + padding;

        if (e.x < breite) {
            imgelem.style.left = breite;
        } else if (e.x > windowWidth - breite) {
            imgelem.style.left = windowWidth - breite;
        } else {
            imgelem.style.left = e.x;
        }
        if (e.y < hoehe + 50) {
            imgelem.style.top = hoehe + 50;
        } else if (e.y > windowHeight - hoehe) {
            imgelem.style.top = windowHeight - hoehe;
        } else {
            imgelem.style.top = e.y;
        }
    };
    stapelContainer.appendChild(imgelem);

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
    if (type == "img") {
        let elem = new Image();
        elem.setAttribute("id", id);
        elem.setAttribute("class", klasse);
        return elem;
    }
    let elem = document.createElement(type);
    elem.setAttribute("id", id);
    elem.setAttribute("class", klasse);
    return elem;
}

function changetitle(input) {
    scrollPfeil.style.display = "none";
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

function removeBlur(step = 2, callback) {
    let removeAnimation = setInterval(() => {
        if (blurriness > 0) {
            blurriness -= step;
            for (i = 0; i < projektTitles.length; i++) {
                projBubbleElements[i].style.filter = "blur(" + blurriness + "px)";
            }
        } else {
            clearInterval(removeAnimation);
            blurriness = 0;
            if (callback) {
                callback();
            }
        }
    }, 10);


}

function showIndex() {
    if (indexAktiv) return;

    projektcounter = -1;
    addBlur(() => {
        table.style.display = "grid";
    });
    changetitle("Index");
    indexAktiv = !indexAktiv;
    for (let i = 0; i < projBubbleElements.length; i++) {
        const element = projBubbleElements[i];
        element.classList.remove("hide");
    }
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
            infos.style.filter = "blur(0px)";

            clearInterval(removeAnimation);
            changetitle("Infos");
        }
    }, 30);
    infosAktiv = !infosAktiv;
}

function removeInfos() {
    if (!infosAktiv) return;
    let removeAnimation = setInterval(() => {
        if (infosblur < infosMaxblur) {
            infosblur += 2;
            infos.style.filter = "blur(" + infosblur + "px)";
        } else {
            clearInterval(removeAnimation);
        }
    }, 20);
    infosAktiv = !infosAktiv;
}

function isMobile() {
    var x = window.matchMedia("(max-width: 678px)");
    return x.matches;
}