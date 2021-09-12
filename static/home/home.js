document.onreadystatechange = function() { 
    if (document.readyState !== "complete") { 
        document.body.style.visibility = "hidden";
        document.body.style.overflowY = "hidden"; 
        document.querySelector("#loader").style.visibility = "visible";
       } else { 
        document.querySelector("#loader").style.display = "none"; 
        document.body.style.visibility = "visible"; 
        document.body.style.overflowY = "scroll";
        contentCount = 0;
		loadContent();
    } 
};
window.onscroll = function() {
	scrollFunction();
	checkScroll();
};

// $(document).ready(function() {
// 	contentCount = 0;
// 	loadContent();
// });
function loadContent(){
	$("#lastP").hide();
	search = $("#search_bar").val().toLowerCase();
	if (search.length == 0) {
		search = " ";
	}
	document.getElementById("content_loader").style.display = "block";
	console.log(search);
	$.getJSON("search/"+search+"/"+contentCount, function(data){
		console.log(data.media);
		for (var i = 0; i < data.media.length; i++) {
			$("#content div:nth-child(2)").append("<img loading=\"lazy\" src=\"/images/"+data.media[i]+"\"></img>");
		}
		contentCount += data.media.length + 1;
		document.getElementById("content_loader").style.display = "none";
		if (data.media.length < 15) {
			let bHeight = document.body.offsetHeight;
			$("#lastP").show();
			// document.getElementById("lastP").style.top = bHeight + "px";
		}
		
	}).fail(function(){
		document.getElementById("content_loader").style.display = "none";
		$("#content > div > p").text("Something went wrong");
	});
}
let isTop = true;
function scrollFunction() {
	var navh = document.getElementsByTagName('nav')[0].offsetHeight;
  	if (document.body.scrollTop > Number(navh)+10 || document.documentElement.scrollTop > Number(navh)+10) {
  		if (isTop == true) {
	 		var ssb = document.getElementById('search_bar');
	 		var ssb_div = document.getElementById('search_div');
	 		var ssb_img = document.getElementById('search_img');
	 		document.getElementsByTagName('header')[0].style.height = (navh+52).toString()+"px";
	 		ssb.style.width = "80%";
	 		ssb_div.style.position = "fixed";
	 		ssb_div.style.backgroundColor = "white";
	 		ssb_div.style.top = "0px";   
	 		ssb_div.style.left = "0px";
	 		ssb_div.style.right = "0px";
	 		ssb_div.style.borderRadius = "0px";
	 		ssb_div.style.margin = "auto";	
	 		ssb_img.style.opacity = "1";
	 		ssb_img.style.transition = "transform 0.5s";
	 		ssb_img.style.transform = "translateY(0%)";
	 		isTop = false;
	 	}
 		// console.log("hey");
  	} else {
  		if (isTop==false) {
			document.getElementsByTagName('header')[0].style.height = "auto";
	  		var ssb = document.getElementById('search_bar');
	  		var ssb_div = document.getElementById('search_div');
	  		var ssb_img = document.getElementById('search_img');
	  		ssb.style.width = "100%";
	 		ssb_div.style.position = "relative";
	 		ssb_div.style.borderRadius = "30px";
	 		ssb_div.style.backgroundColor = "transparent";
	 		ssb_img.style.opacity = "0";
	 		ssb_img.style.transition = "transform 0s 0.2s, opacity 0.2s";
	 		ssb_img.style.transform = "translateY(-200%)";
	 		isTop = true;
	 		// ssb.style.top = "initial";
	 		// ssb.style.left = "initial";
	 		// ssb.style.right = "initial";
	 	}
  	}
}
isBottom = false;
function checkScroll(){
	bodyHeight = document.body.offsetHeight;
  	if (window.scrollY + window.innerHeight >= bodyHeight - 100 && contentCount > 0){
  		if (isBottom == false){
  			isBottom = true;
  			console.log("wow");
  			loadContent();
  		}
  		
  	}
  	else{
  		if (isBottom==true) {
  			isBottom = false;
  		}
  	}

}

function menu(el){
	if (el.className=="close") {
		// el.style.bottom = "30%";
		// el.style.transform = "rotate(180deg)";
		var up = document.getElementById('up');
		up.style.transform = "rotateZ(45deg)";
		up.style.marginTop = "36%";
		var mid = document.getElementById('mid');
		mid.style.opacity = "0";
		var down = document.getElementById('down');
		down.style.transform = "rotateZ(-45deg)";
		down.style.marginTop = "-36%";
		document.getElementById("expage_back").style.transition = "opacity 0.2s";
		document.getElementById('expage_back').style.opacity = "1";
		document.getElementById('expage_back').style.zIndex = "9";
		// document.body.style.overflow = "hidden";
		document.getElementById('expage_back').addEventListener("click", function(){
			if (el.className=="open") {
				menu(document.getElementById('explore'));
			}
		})
		el.className = "open";
		el.style.zIndex = 10;
		document.getElementById('expage').style.transition = "opacity 0.2s";
		document.getElementById('expage').style.opacity = "1";
		document.getElementById('expage').style.zIndex = "10";
	}
	else{
		// el.style.bottom = "16%";
		// el.style.transform = "rotate(0deg)";
		var up = document.getElementById('up');
		up.style.transform = "rotateZ(0deg)";
		up.style.marginTop = "12%";
		var mid = document.getElementById('mid');
		mid.style.opacity = "1";
		var down = document.getElementById('down');
		down.style.transform = "rotateZ(0deg)";
		down.style.marginTop = "12%";
		el.className = "close";	
		// document.body.style.overflow = "auto";
		document.getElementById('expage_back').style.transition = "opacity 0.2s, z-index 0s 0.2s";
		document.getElementById('expage_back').style.opacity = "0";	
		document.getElementById('expage_back').style.zIndex = "-9";
		document.getElementById('expage').style.transition = "opacity 0.2s, z-index 0s 0.2s";
		document.getElementById('expage').style.opacity = "0";	
		document.getElementById('expage').style.zIndex = "-10";
	}

}
function srch(el) {
	var cat = el.innerHTML.toLowerCase();
	document.querySelector('#content div:first-child').style.display = "inline-block";
	document.querySelector("#content div:first-child p").innerHTML = cat[0].toUpperCase() + cat.slice(1) + " Gifs";
	document.getElementById("search_bar").value = cat;
	document.querySelector("#content div:nth-child(2)").innerHTML = "";
	contentCount = 0;
	loadContent();
}
function check(e, el) {
	// body...
	var key = e.keyCode ? e.keyCode : e.which;
	if (key==13) {
		var inp = document.getElementById('search_bar');
		var cat = inp.value.toLowerCase();
		cat = cat.trim();
		if (cat.length>0) {
			document.querySelector('#content div:first-child').style.display = "inline-block";
			document.querySelector("#content div:first-child p").innerHTML = cat[0].toUpperCase() + cat.slice(1) + " Gifs";
			contentCount = 0;
			document.querySelector("#content div:nth-child(2)").innerHTML = "";
			loadContent();
		}
	}

}