$("#pageService").css('height', document.documentElement.clientHeight + 'px')

//一些 全局 参数
var map;
var id = "";
var mark = {};
//创建和初始化地图函数：
function initMap() {
	//创建地图
	createMap();

	if(!queryString("id") == "") {
		id = decodeURI(queryString("id"));
	} else {
		showToast("参数错误!请返回首页重试。", "warning")
	}

	drawMarker();
	
	console.log(mark.id)
	if(!mark.id == ""||mark.id==null){
		resetData()
	}


}

//创建地图
function createMap() {
	map = new AMap.Map('allmap', {
		resizeEnable: true,
		scrollWheel: false,
		zoom: 15,
		center: [127.797402, 46.991946]
	});
}

function drawMarker() {
	let markIcon = new AMap.Icon({
		size: new AMap.Size(44, 65), //图标大小
		image: "images/mark-service.png",
	})

	let marker;

	for(let i = 0; i < sareaArr.length; i++) {
		if(id == sareaArr[i].id) {
			mark = sareaArr[i];
			map.setCenter(sareaArr[i].location);
			marker = new AMap.Marker({
				map: map,
				position: sareaArr[i].location,
				icon: markIcon,
				offset: new AMap.Pixel(-22, -65),
			});
		}
	}

	console.log(mark)
}

function resetData() {
	$(".high-way-num").text(mark.highWayNum);
	$(".high-way-name").text(mark.highWayname);

	$("#name .value").text(mark.name);
	$("#phone .value").text(mark.phone);

	let gasolineHtml = "";
	for(let i = 0; i < mark.gas.gasolineArr.length; i++) {
		gasolineHtml += '<div class="gasolist-type "><span  class="item on">#' + mark.gas.gasolineArr[i] + '</span></div>';
	}
	for(let j = 0; j < mark.gas.gasolineArrNo.length; j++) {
		gasolineHtml += '<div class="gasolist-type "><span  class="item ">#' + mark.gas.gasolineArrNo[j] + '</span></div>';
	}
	$(".gasoline-list").empty();
	$(".gasoline-list").append(gasolineHtml)

	let dieseloilHtml = "";
	for(let i = 0; i < mark.gas.dieseloilArr.length; i++) {
		dieseloilHtml += '<div class="dieseloil-type"><span  class="item on">#' + mark.gas.dieseloilArr[i] + '</span></div>';
	}
	for(let j = 0; j < mark.gas.dieseloilArrNo.length; j++) {
		dieseloilHtml += '<div class="dieseloil-type"><span  class="item ">#' + mark.gas.dieseloilArrNo[j] + '</span></div>';
	}
	$(".dieseloil-list").empty();
	$(".dieseloil-list").append(dieseloilHtml)

	let allServiceItemHtml = "";

	if(mark.service.eat) {
		allServiceItemHtml += '<div class="list-item"><span class="icon-item item-eat"></span><p>餐饮</p></div>';
	}

	if(mark.service.superMarket) {
		allServiceItemHtml += '<div class="list-item"><span class="icon-item item-supermarket"></span><p>超市</p></div>';
	}

	if(mark.service.toilet) {
		allServiceItemHtml += '<div class="list-item"><span class="icon-item item-toilet"></span><p>厕所</p></div>';
	}

	if(mark.service.parking) {
		allServiceItemHtml += '<div class="list-item"><span class="icon-item item-parking"></span><p>停车</p></div>';
	}

	if(mark.service.gasStation) {
		allServiceItemHtml += '<div class="list-item"><span class="icon-item item-gasstation"></span><p>加油</p></div>';
	}

	if(mark.service.hotel) {
		allServiceItemHtml += '<div class="list-item"><span class="icon-item item-hotel"></span><p>住宿</p></div>';
	}

	if(mark.service.hotwater) {
		allServiceItemHtml += '<div class="list-item"><span class="icon-item item-hotwater"></span><p>热水</p></div>';
	}

	if(mark.service.repair) {
		allServiceItemHtml += '<div class="list-item"><span class="icon-item item-repair"></span><p>维修</p></div>';
	}

	if(mark.service.chargingPile) {
		allServiceItemHtml += '<div class="list-item"><span class="icon-item item-chargingpile"></span><p>充电桩</p></div>';
	}

	if(mark.service.fillingStation) {
		allServiceItemHtml += '<div class="list-item"><span class="icon-item item-fillingstation"></span><p>加气站</p></div>';
	}

	$(".all-service .list").empty();

	$(".all-service .list").append(allServiceItemHtml)
}