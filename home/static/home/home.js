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
		console.log(data);
		for (var i = 0; i < data.length; i++) {
			$("#content > div:nth-child(2)").append(`<span data-id="${data[i].id}" loading="lazy" style="background-image:url('/images/${data[i].media}')"></span>`);
			// let img = $("#content div:nth-child(2) span:last-child");
			// img.height(img.width());
		}
		contentCount += data.length;
		document.getElementById("content_loader").style.display = "none";
		if (data.length < 15) {
			let bHeight = document.body.offsetHeight;
			$("#lastP").show();
			// document.getElementById("lastP").style.top = bHeight + "px";
		}
		
	}).fail(function(){
		document.getElementById("content_loader").style.display = "none";
		$("#content > div > p").text("Something went wrong");
	});
}

async function loadGif(e){
	const gif = e.target;
	const id = gif.dataset.id
	const media = gif.style.backgroundImage.slice(5,-2);
	const loader = document.getElementById("content_loader")
	console.log(media);
	if(id){
		const gifContainer = document.getElementById("gif_view");
		const gifContent = document.getElementById("gif_content");
		gifContent.innerHTML = "";
		const relatedGifContent = document.getElementById("gif_related");
		relatedGifContent.innerHTML = "<h3>Related GIFs</h3>"
		document.body.style.overflow = "hidden";
		gifContainer.classList.remove("gif_view--hidden");
		loader.style.display = "block";
		const gifResponse = await fetch(`/view/${id}`);
		const data = await gifResponse.json();
		console.log(data);
		gifContent.innerHTML = `<h1>${ data.tags.slice(0,2).join(" ")} GIF</h1>
		<span>
		<img data-id=${data.id} loading="lazy" src="${media}"></img>
		</span>
		<div id="gif_content_actions">
			<h2>${data.owner}</h2>
			<div id="gif_content_buttons">
				<button>Close</button>
				<a href=${media} download><button>Download</button></a>
			</div>
		</div>
		<div id="gif_tags">
		${data.tags.map((value)=>{
			return `<span data-tag=${value}>${value}</span>`
		}).join("\n")}
		</div>
		<div id="gif_share">
			<h2>Share URL</h2>
			<p>${window.location.href+media.slice(1)}</p>
		</div>
		<div id="gif_details">
			<h2>Created</h2>
			<p>${new Date(data.date).toLocaleString()}</p>
		</div>`
		const gifImg = document.querySelector("#gif_content > span > img");
		if(gifImg.offsetWidth > gifImg.offsetHeight * 1.5){
			gifImg.style.width = "100%";
			gifImg.style.height = "auto";
		} else{
			gifImg.style.width = "auto";
			gifImg.style.height = "60vh";
		}

		document.querySelector("#gif_content_buttons > button").addEventListener("click",function(){
			document.body.style.overflow = "auto";
			document.getElementById("gif_view").classList.add("gif_view--hidden");
		})
		
		document.getElementById("gif_tags").addEventListener("click",function(e){
			const tagEl = e.target;
			const tag = tagEl.dataset.tag;
			if(tag){
				document.getElementById("search_bar").value = tag;
				document.body.style.overflow = "auto";
				gifContainer.classList.add("gif_view--hidden");
				document.querySelector('#content div:first-child').style.display = "inline-block";
				document.querySelector("#content div:first-child p").innerHTML = tag + " Gifs";
				document.querySelector("#content div:nth-child(2)").innerHTML = "";
				contentCount = 0;
				loadContent();
			}
		})

		const relatedGifResponse = await fetch(`search/${data.tags.join(" ")}/0`);
		const relatedGifs = await relatedGifResponse.json();
		loader.style.display = "none";
		console.log(relatedGifs);
		relatedGifs.slice(0,8).forEach(rGif=>{
			if(data.id !== rGif.id){
			relatedGifContent.insertAdjacentHTML('beforeend',`<span data-id="${rGif.id}" loading="lazy" style="background-image:url('/images/${rGif.media}')"></span>`)
	}})
	}
}

let isTop = true;
function scrollFunction() {
	var navh = document.getElementsByTagName('nav')[0].offsetHeight;
	var header = document.getElementsByTagName('header')[0];
	var headerh = header.offsetHeight;
  	if (document.body.scrollTop > Number(navh)+10 || document.documentElement.scrollTop > Number(navh)+10) {
  		if (isTop == true) {
  			var ss = document.getElementById('search');
	 		var ssb = document.getElementById('search_bar');
	 		var ssb_div = document.getElementById('search_div');
	 		var ssb_img = document.getElementById('search_img');
	 		header.style.height = (headerh).toString()+"px";
	 		ssb.style.width = "80%";
	 		ssb_div.style.position = "fixed";
	 		ssb_div.style.backgroundColor = "white";
	 		ssb_div.style.top = "0px";   
	 		ssb_div.style.left = "0px";
	 		ssb_div.style.right = "0px";
	 		ssb_div.style.borderRadius = "0px";
	 		ssb_div.style.margin = "auto";	
	 		ssb_img.style.opacity = "1";
	 		// ssb_img.style.width = "20%";
	 		ssb_img.style.transition = "transform 0.5s";
	 		ssb_img.style.transform = "translateY(0%)";
	 		isTop = false;
	 	}
 		// console.log("hey");
  	} else {
  		if (isTop==false) {
			document.getElementsByTagName('header')[0].style.height = "auto";
			var ss = document.getElementById('search');
	  		var ssb = document.getElementById('search_bar');
	  		var ssb_div = document.getElementById('search_div');
	  		var ssb_img = document.getElementById('search_img');
	  		ssb.style.width = "100%";
	 		ssb_div.style.position = "relative";
	 		ssb_div.style.borderRadius = "30px";
	 		ssb_div.style.backgroundColor = "transparent";
	 		ssb_img.style.opacity = "0";
	 		// ssb_img.style.width = "0%";
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

document.querySelector("#content div:nth-child(2)").addEventListener("click",loadGif);
document.getElementById("gif_related").addEventListener("click",loadGif);
document.getElementById("close_gif_view").addEventListener("click",function(){
	document.body.style.overflow = "auto";
	document.getElementById("gif_view").classList.add("gif_view--hidden");
})