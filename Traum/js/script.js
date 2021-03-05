jQuery.noConflict();

jQuery(document).ready(function() {

    jQuery('#box-or').on("mouseenter", function(){
      jQuery('#img3').css({'z-index': 20})
      jQuery('#img2').css({ 'transform': 'scale(1.5)'})
    })
    jQuery('#box-or').on("mouseleave", function(){
      jQuery('#img3').css({'z-index': 10})
      jQuery('#img2').css({ 'transform': 'scale(1)'})
    })


    jQuery('#box-ol').on("mouseenter", function(){
      jQuery('#img2').css({'z-index': 11})
      jQuery('#img1').css({'background-color': 'yellow', 'opacity':'0.2'})
    })
    jQuery('#box-ol').on("mouseleave", function(){
      jQuery('#img2').css({'z-index': 5})
      jQuery('#img1').css({'background-color': 'transparent'})
    })


    jQuery('#box-ul').on("mouseenter", function(){
      jQuery('#img4').css({'z-index': 11, 'transform': 'scale(1.5)'})
    })
    jQuery('#box-ul').on("mouseleave", function(){
      jQuery('#img4').css({'z-index': 15, 'transform': 'scale(1)'})
    })

    jQuery('#box-ur').on("mouseenter", function(){
      jQuery('#img1').css({'background-color': 'purple', 'opacity':'0.8'})
    })
    jQuery('#box-ur').on("mouseleave", function(){
      jQuery('#img1').css({'background-color': 'transparent'})
    })

    var text     = "WILD WILD WEB – A VIRTUAL EXHIBITION SPACE – 20.12.2018/7PM – HOWWW.DE/WWW";

    var follow   = [];
    var timeDiff = 200;
    var mousePos = {x: 0, y: 0};


    // Konstruktor-Funktion für einen Verfolger
    function Item(element, left, top, width, height) {
        this.el     = element;
        this.left   = left;
        this.top    = top;
        this.width  = width;
        this.height = height;
    }// Item


    function setPos(item, left, top) {
        item.left = left;
        item.top  = top;


        // Breite und Höhe des Scrollbereichs
        var docWidth  = jQuery(document).width();
        var docHeight = jQuery(document).height();


        var curWidth  = item.width;
        var curHeight = item.height;


        // Über Rand -> Breite/Höhe verkleinern
        if(item.left + item.width > docWidth) {
            curWidth = item.width - ((item.left + item.width) - docWidth);
        }

        if(item.top + item.height > docHeight) {
            curHeight = item.height - ((item.top + item.height) - docHeight);
        }


        // Position setzen
        item.el.style.left = item.left + "px";
        item.el.style.top  = item.top  + "px";


        // Breite/Höhe setzen
        if(curWidth > 0 && curHeight > 0 ) {
            item.el.style.width   = curWidth  + "px";
            item.el.style.height  = curHeight + "px";
            item.el.style.display = "block";
        } else {
            item.el.style.display = "none";
        }
    }// setPos


    function move() {
        // follow[5].pos = follow[4].pos;
        // follow[4].pos = follow[3].pos;
        // ...
        // follow[1].pos = follow[0].pos;
        for(var i = follow.length - 1; i > 0; i--) {
            setPos(follow[i], follow[i - 1].left,
                              follow[i - 1].top);
        }

        // follow[0].pos = Aktuelle Position des Mauszeigers im Dokument
        setPos(follow[0], mousePos.x + 10, mousePos.y + 10);
    }// move


    // Divs mit Buchstaben erzeugen
    var body = document.getElementsByTagName("body")[0];

    for(var i = 0; i < text.length; i++) {
        var el = document.createElement("div");

        el.className             = "testi";
        el.style.position        = "absolute";
        el.style.display         = "block";
        el.style.overflow        = "hidden";
        el.style.backgroundColor = "transparent";

        el.style.color           = "yellow";
        el.style.fontSize        = "40px";

        el.style.left            = mousePos.x + "px";
        el.style.top             = mousePos.y + "px";
        el.style.zIndex          = 12;

        el.style.margin          = 0;
        el.style.padding         = 0;
        el.style.borderWidth     = 0;

        // Textnode in Div legen
        var textNode = document.createTextNode(text.charAt(i));
        el.appendChild(textNode);


        body.appendChild(el);

        var item = new Item(el, mousePos.x, mousePos.y,
                                jQuery(el).width(), jQuery(el).height());
        follow.push(item);
    }// for(var i = 0; i < text.length; i++) {


    // Mousemove-Handler
    jQuery(document).mousemove(function(e) {
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
    });// mousemove


    // Zeitgeber starten
    setInterval(move, timeDiff);
});// jQuery(document).ready(function() {
