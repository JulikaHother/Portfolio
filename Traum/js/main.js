let curtain = document.querySelector("#curtain");
let starttypo = document.querySelector("#curtain span");
let loading = document.querySelector("#loading");
let eingefaded = false;
let imgs = ["aufwachen.gif", "einschlafen0.png", "einschlafen4.gif", "leichtschlaf.gif", "leichtschlaf.png", "tiefschlaf0.png", "tiefschlaf02.gif", "traum1.png", "traumphase0.png", "traum1.gif"]

let preloads = []
for (let i = 0; i < imgs.length; i++) {
    const url = imgs[i];
    preloads[i] = new Image();
    preloads.src = url;
}

window.onload = function () {
    einfaden(starttypo);
};

curtain.addEventListener("click", (e) => {
    if (eingefaded) {
        ausfaden(starttypo);
        setTimeout(() => {
            ausfaden(curtain)
        }, 1300);
    }
});

function ausfaden(elem) {
    let opacity = 1;
    let removeAnimation = setInterval(() => {
        if (opacity > 0) {
            opacity -= 0.01;
            elem.style.opacity = opacity;
        } else {
            clearInterval(removeAnimation);
            elem.style.display = "none";
        }
    }, 20);
}

function einfaden(elem) {
    let opacity = 0;
    elem.style.display = "block";
    let removeAnimation = setInterval(() => {
        if (opacity < 1) {
            opacity += 0.01;
            elem.style.opacity = opacity;
        } else {
            clearInterval(removeAnimation);
            eingefaded = true;
        }
    }, 20);
}

$("#box1").hover(
    function () {
        $("#hintergrund").css("background-image", "url(img/einschlafen0.png)");
        $("#phase1").css("display", "block");
        $("#phase0").css("display", "none");
    },
    function () {
        $("#hintergrund").css("background-image", "none");
        $("#phase1").css("display", "none");
        $("#phase0").css("display", "block");
    }
);

$("#pfeil1").hover(
    function () {
        $("#traum").css("background-image", "url(img/einschlafen4.gif)");
    },
    function () {
        $("#traum").css("background-image", "none");
    }
);

$("#pfeil2").hover(
    function () {
        $("#traum").css("background-image", "url(img/leichtschlaf.gif)");
    },
    function () {
        $("#traum").css("background-image", "none");
    }
);

$("#pfeil3").hover(
    function () {
        $("#traum").css("background-image", "url(img/tiefschlaf02.gif)");
    },
    function () {
        $("#traum").css("background-image", "none");
    }
);

$("#pfeil4").hover(
    function () {
        $("#traum").css("background-image", "url(img/traum1.gif)");
    },
    function () {
        $("#traum").css("background-image", "none");
    }
);

$("#pfeil5").hover(
    function () {
        $("#traum").css("background-image", "url(img/traum1.gif)");
    },
    function () {
        $("#traum").css("background-image", "none");
    }
);

$("#pfeil6").hover(
    function () {
        $("#traum").css("background-image", "url(img/traum1.gif)");
    },
    function () {
        $("#traum").css("background-image", "none");
    }
);

$("#pfeil7").hover(
    function () {
        $("#traum").css("background-image", "url(img/aufwachen.gif)");
    },
    function () {
        $("#traum").css("background-image", "none");
    }
);

$("#box2").hover(
    function () {
        $("#hintergrund").css("background-image", "url(img/leichtschlaf.png)");
        $("#phase2").css("display", "block");
        $("#phase0").css("display", "none");
    },
    function () {
        $("#hintergrund").css("background-image", "none");
        $("#phase2").css("display", "none");
        $("#phase0").css("display", "block");
    }
);

$("#box3").hover(
    function () {
        $("#hintergrund").css("background-image", "url(img/tiefschlaf0.png)");
        $("#phase3").css("display", "block");
        $("#phase0").css("display", "none");
    },
    function () {
        $("#hintergrund").css("background-image", "none");
        $("#phase3").css("display", "none");
        $("#phase0").css("display", "block");
    }
);

$("#box4").hover(
    function () {
        $("#hintergrund").css("background-image", "url(img/traumphase0.png)");
        $("#phase4").css("display", "block");
        $("#phase0").css("display", "none");
    },
    function () {
        $("#hintergrund").css("background-image", "none");
        $("#phase4").css("display", "none");
        $("#phase0").css("display", "block");
    }
);

$("#box5").hover(
    function () {
        $("#hintergrund").css("background-image", "url(img/traum1.png)");
        $("#phase5").css("display", "block");
        $("#phase0").css("display", "none");
    },
    function () {
        $("#hintergrund").css("background-image", "none");
        $("#phase5").css("display", "none");
        $("#phase0").css("display", "block");
    }
);

var bg = document.getElementById("bg");
bg.loop = true;

$("body").click(function () {
    playBackground();
});

function playBackground() {
    bg.play();
}
/*function pauseBackground(){
    bg.pause(); 
}
*/

function playAudio(audioid) {
    var x = document.getElementById(audioid);
    x.loop = true;
    x.play();
    //   pauseBackground()
}

function pauseAudio(audioid) {
    var x = document.getElementById(audioid);
    x.pause();
    playBackground();
}

$(
    "#pfeil1",
    "#pfeil2",
    "#pfeil3",
    "#pfeil4",
    "#pfeil5",
    "#pfeil1",
    "#pfeil1"
).hover(
    function () {
        $("#hintergrund").css("background-image", "url(img/einschlafen0.png)");
    },
    function () {
        $("#hintergrund").css("background-image", "none");
    }
);