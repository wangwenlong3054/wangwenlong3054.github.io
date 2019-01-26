$("#pageCity").css('min-height', document.documentElement.clientHeight + 'px');

//一些 全局 参数
var id = "2";
var city = {};

function init() {

	if(!queryString("id") == "") {
		id = decodeURI(queryString("id"));
	} else {
		showToast("参数错误!请返回首页重试。", "warning")
	}

	for(let i = 0; i < cityArr.length; i++) {
		if(id == cityArr[i].id) {
			city = cityArr[i];
		}
	}

	console.log(city.id)
	if(!city.id == "" || city.id == null) {
		resetData()
	}

}

function resetData() {
	$(".header-title").text(city.cityName);
	
	
	
	if(city.cityBanner.length > 0){
		let bannerImg = '<img src=' + city.cityBanner + '>';
		$(".banner").append(bannerImg);
	}
	

	if(city.des.length > 0) {
		$(".des").text(city.des);
	} else {
		$(".des").text("暂无城市简介");
	}

	let localColorItem = "";
	if(city.localColor.length == 0) {
		localColorItem += '<div class="no-data "><img src="images/no_data.png"></div>'
	} else {
		for(let i = 0; i < city.localColor.length; i++) {
			localColorItem += '<div class="item"><img src="' + city.localColor[i].img + '"><p>' + city.localColor[i].title + '</p></div>';
		}
	}

	$(".local-color .list").empty();
	$(".local-color .list").append(localColorItem);

	let culturalTourismItem = "";
	if(city.culturalTourism.length == 0) {
		culturalTourismItem += '<div class="no-data "><img src="images/no_data.png"></div>'
	} else {
		for(let i = 0; i < city.culturalTourism.length; i++) {
			culturalTourismItem += '<div class="item"><img src="' + city.culturalTourism[i].img + '"><p>' + city.culturalTourism[i].title + '</p></div>';
		}
	}

	$(".cultural-tourism .list").empty();
	$(".cultural-tourism .list").append(culturalTourismItem);

}

function goToIndex() {
	let href = "index.html";
	window.location.href = href;
}