

var body = document.querySelector("body");
body.style.height = window.innerHeight + "px";

var Element = {
	wrap:document.querySelector("#wrap"),
	dateWrap:document.querySelector("#date"),
	dateOut:document.querySelector("#dateOut"),
	time:document.querySelector("#time"),
	bg:document.querySelector("#bg"),
	imgWrap:document.querySelector("#imgWrap"),
	nameSame:document.querySelector("#nameSame"),
	kong:document.querySelector(".kong")
}

var Element1 = {
	wrapP:Element.wrap.getElementsByTagName("p"),
	wrapTxt:Element.wrap.getElementsByTagName("input"),
	pointer:Element.time.getElementsByTagName("p"),
	p2:imgWrap.querySelector(".forImgIn"),
	p1:imgWrap.querySelector(".spanDel"),
	hint:Element.nameSame.querySelector("strong"),
	close:Element.nameSame.querySelector("span")
	
}

var Element2 = {
	span:Element1.p1.querySelector("span")
}

var _IP = 0;
var Selected = [];

document.addEventListener("contextmenu",function(e) {
	if(e.target.tagName.toUpperCase() == "LI"
	||e.target.tagName.toUpperCase() == "IMG"
	||e.target.tagName.toUpperCase() == "P"
	||e.target.tagName.toUpperCase() == "INPUT") {
		showContextMenu(e,data.menu.file);
	} else {
		showContextMenu(e,data.menu.main);
	}
});

view(0);



document.addEventListener("click",function() {
	hideMenu();
	if(isMove) {
		return
	}
	
	removeActive();
	startMove({
		el:Element.dateWrap,
		target:{
			top:-800
		},
		type:"linear",
		time:500
	})
})

//框选
document.addEventListener("mousedown",region);

Element.dateWrap.addEventListener("click",function(e) {
	e.stopPropagation();
})
