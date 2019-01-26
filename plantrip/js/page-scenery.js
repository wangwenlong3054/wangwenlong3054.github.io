$("#pageScenery").css('min-height', document.documentElement.clientHeight + 'px');

//一些 全局 参数
var id = "1";
var scenery = {};

function init() {

	if(!queryString("id") == "") {
		id = decodeURI(queryString("id"));
	} else {
		showToast("参数错误!请返回首页重试。", "warning")
	}

	for(let i = 0; i < sceneryArr.length; i++) {
		if(id == sceneryArr[i].id) {
			scenery = sceneryArr[i];
		}
	}

	console.log(scenery.id)
	if(!scenery.id == "" || scenery.id == null) {
		resetData()
	}

}

function resetData() {
	$(".header-title").text(scenery.name);
	
	
	
	if(scenery.banner.length > 0){
		let bannerImg = '<img src=' + scenery.banner + '>';
		$(".banner").append(bannerImg);
	}
	

	if(scenery.des.length > 0) {
		$(".des").text(scenery.des);
	} else {
		$(".des").text("暂无城市简介");
	}

	let imgListHtml = ''
	

	if(scenery.images.length == 0) {
		imgListHtml += '<div class="no-data "><img src="images/no_data.png"></div>'
	} else {
		for(let i = 0; i < scenery.images.length; i++) {
			imgListHtml += '<div class="item"><img src="'+scenery.images[i]+'"></div>';
		}
	}

	$(".img-list").empty();
	$(".img-list").append(imgListHtml);

	

}

function goToIndex() {
	let href = "index.html";
	window.location.href = href;
}