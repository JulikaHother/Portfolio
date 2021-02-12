projektKeys = Object.keys(projekte);
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
let table = document.querySelector(".index")
let blurriness = 0


let n = 0;
let current;
let stapelText;
let scrollN = 0;
let scrollFaktor = 500;
let scrollCounter = 0;

let scrolldown;
let pTitle = document.querySelector(".p-title");
let projekteAktv = true;
let headBalken = document.getElementById("head-balken");
let aboutPage = document.getElementById("about");
let infoText;
let pfeil = "↓ &nbsp;&nbsp;&nbsp;";

// ++++++ Elemente generieren +++++++++

for (i = 0; i < projektKeys.length; i++) {
    projBubbleElements[i] = createNeuesElement(
        "img",
        projektKeys[i],
        "projektbubble"
    );
    container.appendChild(projBubbleElements[i]);

    projBubbleElements[i].src =
        "assets/images/hintergrund/" + projectValues[i].background;
    projBubbleElements[i].style.zIndex = projektKeys.length - i;

    projBubbleElements[i].innerHTML = projektKeys[i];

    indexrows[i] = createNeuesElement(
        "li",
        "index-" + projektKeys[i],
        "index-row"
    );
    table.appendChild(indexrows[i]);

    let tempTitle = createNeuesElement(
        "span",
        "title-" + projektKeys[i],
        "li-title"
    );
    indexrows[i].appendChild(tempTitle);

    tempTitle.innerHTML = projectValues[i].title;

    let tempCat = createNeuesElement(
        "span",
        "category-" + projektKeys[i],
        "li-category"
    );
    indexrows[i].appendChild(tempCat);

    tempCat.innerHTML = projectValues[i].category;

    let tempYear = createNeuesElement(
        "span",
        "year-" + projektKeys[i],
        "li-year"
    );
    indexrows[i].appendChild(tempYear);

    tempYear.innerHTML = projectValues[i].year;

    let r = Math.floor(Math.random() * 100)
    indexrows[i].querySelector(".li-category").style.paddingLeft = r + "vw";

}

// +++++++ Durchscrollen ++++++
let counter = 0;
let indexAktiv = false;
let cb = 20
for (i = 0; i < projektKeys.length; i++) {
    projBubbleElements[i].style.filter = "blur(" + cb + "px)";
}
let projektcounter = 0;
let einzelblur = 0;

document.addEventListener("wheel", (e) => {

    if (e.deltaY > 0) {
        scrolldown = true;
        counter++;

    } else {
        scrolldown = false;
        counter--;
    }


    //++++++++  INDEX  +++++++++
    if (scrolldown && cb >= -30 && projektcounter == 0) {
        cb = cb - 5;
    } else if (!scrolldown && cb <= 30 && projektcounter == 0) {
        cb = cb + 5;
    }

    if (cb > -30) {
        indexAktiv = true;
        projekteAktiv = false;
        if (cb > 0) {
            changetitle("Index")
        }
        if (cb < 0 && projekte[current]) {
            changetitle(projekte[current].title)
        }
    } else {
        indexAktiv = false;
        projekteAktv = true

    }
    if (cb <= 30) {
        table.style.display = "none";
    } else if (cb >= 30) {
        table.style.display = "grid";
    }
    for (i = 0; i < projektKeys.length; i++) {
        projBubbleElements[i].style.filter = "blur(" + (cb - 5) + "px)";
    }

    //++++++++  POJIS  +++++++++
    removeBlur()
    stapelSchliessen()


    if (counter % 6 == 0) {
        if (!indexAktiv) {
            nextProject()

        }
    } else {
        if (scrolldown) {
            einzelblur++
        } else {
            einzelblur--
        }

        projBubbleElements[projektcounter].style.filter = "blur(" + (einzelblur * 2 - 4) + "px)";

    }

})




function nextProject() {
    if (scrolldown) {
        oberstesEntfernen()
        if (projektcounter != projBubbleElements.lenth - 1 && projektcounter < projBubbleElements.length) {
            projektcounter++
        }
        einzelblur = 0;

    } else if (!scrolldown) {
        if (projektcounter != 0 && projektcounter <= projBubbleElements.length) {
            projektcounter--
        }
        neuesAnzeigen()
        einzelblur = 6;

    }
    current = projBubbleElements[projektcounter].id;

    changetitle(projekte[current].title)
}

function oberstesEntfernen() {
    for (let i = 0; i < projBubbleElements.length; i++) {
        const element = projBubbleElements[i];

        if (projektcounter == i) {
            element.classList.add("hide")
        }
    }
}

function neuesAnzeigen() {
    for (let i = 0; i < projBubbleElements.length; i++) {
        const element = projBubbleElements[i];

        if (projektcounter == i) {
            element.classList.remove("hide")
        }
    }
}



// ++++++++ Stapel öffnen ++++++++

container.addEventListener("click", (e) => {

    addBlur();

    if (n == 0 && projekteAktv && projekte[current].images[0]) {
        pTitle.innerHTML = pfeil + pTitle.textContent;
        nextImage(e);

        stapelContainer.style.display = "block";
    }
});

// +++ weitere Bilder anzeigen ++++++

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



closeButton.addEventListener("click", (e) => {
    stapelSchliessen()

});

// ++++ About Seite und Header +++++++
// let tempCurr;

// title.addEventListener("mouseenter", (e) => {
//     if (stapelContainer.style.display != "block") {
//         tempCurr = pTitle.textContent;

//         pTitle.textContent = "Infos";
//     } else if (typeof infoText == "undefined") {
//         infoText = createNeuesElement("div", "pInfo", "pInfo");
//         stapelContainer.appendChild(infoText);
//         infoText.textContent = projekte[current].description;
//     }
// });
// title.addEventListener("mouseleave", (e) => {
//     if (stapelContainer.style.display != "block") {
//         pTitle.textContent = tempCurr;
//     } else if (typeof infoText != "undefined") {
//         infoText.parentNode.removeChild(infoText);
//         infoText = undefined;
//     }
// });

// title.addEventListener("click", (e) => {
//     if (stapelContainer.style.display != "block") {
//         tempCurr = pTitle.textContent;
//         aboutPage.style.display = "block";
//         pTitle.textContent = "Infos";
//         headBalken.style.pointerEvents = "none";
//     }
// });

// aboutPage.addEventListener("click", (e) => {
//     if (stapelContainer.style.display != "block") {
//         aboutPage.style.display = "none";
//         pTitle.textContent = tempCurr;
//         headBalken.style.pointerEvents = "inherit";
//     }
// });

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

function stapelSchliessen() {

    pTitle.innerHTML = pTitle.innerHTML.replace(pfeil, "");
    for (i = 0; i < imagesStapel.length; i++) {
        imagesStapel[i].parentNode.removeChild(imagesStapel[i]);
    }
    stapelContainer.style.display = "none";
    imagesStapel = [];
    n = 0;


}

function changetitle(input) {
    pTitle.textContent = input
}




function addBlur() {

    let addAnimation = setInterval(() => {
        console.log(blurriness);

        if (blurriness < 20) {
            blurriness += 4
            for (i = 0; i < projektKeys.length; i++) {
                projBubbleElements[i].style.filter = "blur(" + blurriness + "px)";
            }
        } else {
            clearInterval(addAnimation)
        }
    }, 20)
}

function removeBlur() {
    let removeAnimation = setInterval(() => {
        if (blurriness > 0) {
            blurriness -= 4
            for (i = 0; i < projektKeys.length; i++) {
                projBubbleElements[i].style.filter = "blur(" + blurriness + "px)";
            }
        } else {
            clearInterval(removeAnimation)

        }
    }, 20)
}