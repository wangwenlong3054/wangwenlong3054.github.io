$("#pageAlong").css('min-height', document.documentElement.clientHeight + 'px');

//一些 全局 参数
var id = "2";
var city = {};

function goScenery(id) {
	href = encodeURI("scenery.html?id=" + id);
	window.location.href = href;
}

function goService(id) {
	href = encodeURI("service.html?id=" + id);
	window.location.href = href;
}

function goToIndex() {
	let href = "index.html";
	window.location.href = href;
}