$("#planTripIndex").css('height', document.documentElement.clientHeight + 'px')

//一些 全局 参数
var map;
var district = null;

//创建和初始化地图函数：
function initMap() {
	//创建地图
	createMap();
	//搜索
	//poiStartSearch()
	//poiEndSearch()

}

//创建地图
function createMap() {
	map = new AMap.Map('allmap', {
		resizeEnable: true,
		scrollWheel: false,
		zoom: 6,
		center: [127.797402, 46.991946]
	});
}

//定位 我的位置
function myMapPosition() {
	$("#myPosition").addClass('active').siblings().removeClass('active');
	openZZ();

	var options = {
		'showButton': true, //是否显示定位按钮
		'buttonPosition': 'LB', //定位按钮的位置
		/* LT LB RT RB */
		'buttonOffset': new AMap.Pixel(10, 20), //定位按钮距离对应角落的距离
		'showMarker': true, //是否显示定位点
		'markerOptions': { //自定义定位点样式，同Marker的Options
			'offset': new AMap.Pixel(-18, -36),
			'content': '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
		},
		'showCircle': true, //是否显示定位精度圈
		'circleOptions': { //定位精度圈的样式
			'strokeColor': '#0093FF',
			'noSelect': true,
			'strokeOpacity': 0.5,
			'strokeWeight': 1,
			'fillColor': '#02B0FF',
			'fillOpacity': 0.25
		}
	}
	AMap.plugin(["AMap.Geolocation"], function() {
		var geolocation = new AMap.Geolocation(options);
		map.addControl(geolocation);
		geolocation.getCurrentPosition(function(status, result) {
			if(status == 'complete') {
				onComplete(result)
			} else {
				onError(result)
			}
		});
	});
}

//解析定位结果
function onComplete(data) {
	map.setZoom(11);
	closeZZ();
	console.log("定位结果" + data.position)

}
//解析定位错误信息
function onError(data) {
	console.log("失败原因" + data.message);
}

//查看全省 并标注一些点
function allMapProvince() {
	$("#allProvince").addClass('active').siblings().removeClass('active');
	openZZ();

	let polygons = [];
	//加载行政区划插件
	if(!district) {
		//实例化DistrictSearch
		let opts = {
			subdistrict: 0, //获取边界不需要返回下级行政区
			extensions: 'all', //返回行政区边界坐标组等具体信息
			level: 'district' //查询行政级别为 市
		};
		district = new AMap.DistrictSearch(opts);
	}
	//行政区查询
	district.setLevel('city')
	district.search('230000', function(status, result) {
		map.remove(polygons) //清除上次结果
		polygons = [];
		var bounds = result.districtList[0].boundaries;
		if(bounds) {
			for(var i = 0, l = bounds.length; i < l; i++) {
				//生成行政区划polygon
				var polygon = new AMap.Polygon({
					strokeWeight: 4,
					path: bounds[i],
					fillOpacity: 0.4,
					//					fillColor: '#80d8ff',
					fillColor: '',
					strokeColor: '#2487ff'
				});
				polygons.push(polygon);
			}
		}
		map.add(polygons)
		map.setZoom(6);
		map.setCenter([127.797402, 46.991946]);
		//map.setFitView(polygons); //视口自适应
		closeZZ();

	});

	console.log("展示黑龙江省大地图，和一些标注点")
}

//打开遮罩
function openZZ() {
	$(".toastmask").removeClass("hide");
	$(".loading").removeClass("hide");
}

//关闭遮罩
function closeZZ() {
	$(".toastmask").addClass("hide");
	$(".loading").addClass("hide");
}

//地图 放大 
function zoomMapPlus() {
	if(map.getZoom() * 1 >= 18) {
		alert("这个比例可以了，不要再放大了")
	} else {
		map.setZoom(map.getZoom() + 1);
	}
}
//地图 缩小
function zoomMapMinus() {
	if(map.getZoom() * 1 < 5) {
		alert("这个比例可以了，不要再缩小了")
	} else {
		map.setZoom(map.getZoom() - 1);
	}

}

//清空 输入框
function goClear() {
	$("#searchName").val("");
}

//点击 搜索
function goSearch() {
	let inputValue = $("#searchName").val().trim();
	//let inputValue = $("#searchName").val().trim();
	if(inputValue == "" || inputValue == null) {
		showToast("请输入关键字!", "warning")
	} else {
		let href = encodeURI("search.html?key=" + inputValue);
		window.location.href = href;
	}
}

//点击别的区域 关闭信息窗体
$(".toastmask").click(function() {
	$(".toastmask").addClass('hide')
	$("#infoBox").addClass("slideOutDown");
	$("#infoBox").addClass("hide");
})

//打开窗体
function openInfo() {
	console.log('openInfoBox');
	$(".toastmask").removeClass("hide");
	$("#infoBox").removeClass("hide");
	$("#infoBox").addClass("slideInUp");

}

/*
 * 自定义一些数据
 */
//
//var trafficArr = [{
//		id: 1,
//		highWayNum: "G10",
//		highWayname: "绥满高速",
//		highWaySection: "尚志周边路段",
//		reason: "大雪封路",
//		duration: "2019年1月24日 至 2019年1月26日",
//		location: [127.943319, 45.193886]
//	},
//	{
//		id: 2,
//		highWayNum: "G10",
//		highWayname: "绥满高速",
//		highWaySection: "长平村路段",
//		reason: "道路养护施工",
//		duration: "2019年1月12日 至 2019年1月25日",
//		location: [128.715938, 44.917014]
//	},
//	{
//		id: 3,
//		highWayNum: "G10",
//		highWayname: "绥满高速",
//		highWaySection: "三道沟路段",
//		reason: "道路养护施工",
//		duration: "2019年1月18日 至 2019年1月25日",
//		location: [129.04158, 44.832225]
//	},
//	{
//		id: 4,
//		highWayNum: "G10",
//		highWayname: "绥满高速",
//		highWaySection: "海林市路段",
//		reason: "大雪封路",
//		duration: "2019年1月24日 至 2019年1月25日",
//		location: [129.413398, 44.606081]
//	},
//	{
//		id: 5,
//		highWayNum: "G1",
//		highWayname: "京哈高速",
//		highWaySection: "拉林河收费站",
//		reason: "因吉林省京哈高速长春站至拉林河站改扩建工程，拉林河站至长春站封闭。",
//		duration: "2018年4月20日 至 2019年7月30日",
//		location: [126.144676, 45.166582]
//	},
//	{
//		id: 6,
//		highWayNum: "G1",
//		highWayname: "京哈高速",
//		highWaySection: "石家收费站路段",
//		reason: "京哈高速石家站入口车道封闭，全部改为出口车道。",
//		duration: "2018年4月20日 至 2019年7月30日。",
//		location: [126.181175, 45.179896]
//	},
//	{
//		id: 7,
//		highWayNum: "G1011",
//		highWayname: "哈同高速",
//		highWaySection: "双鸭山收费站路段",
//		reason: "哈同高速双鸭山收费站改扩建施工，双向封闭，请绕行集贤收费站。",
//		duration: "2018年8月23日 至 2019年6月15日",
//		location: [131.1556, 46.756118]
//	},
//	{
//		id: 8,
//		highWayNum: "G1012",
//		highWayname: "建黑高速",
//		highWaySection: "黑瞎子岛站路段",
//		reason: "建黑高速黑瞎子岛站，禁止七座以上客车及危化品车辆通行。",
//		duration: "至 2019年1月2日  08:00",
//		location: [134.659912, 48.255889]
//	},
//	{
//		id: 9,
//		highWayNum: "G1012",
//		highWayname: "建黑高速",
//		highWaySection: "浓桥站路段",
//		reason: "建黑高速浓桥站，禁止七座以上客车及危化品车辆通行。",
//		duration: "至 2019年1月2日  08:00",
//		location: [134.327842, 48.137232]
//	}
//
//];

//点击 路况 按钮
var isTrafficOn = false;
var trafficMarkers = [];
var trafficMarker;

function trafficMarks() {
	if(isTrafficOn) {
		isTrafficOn = false;
		$(".icon-traffic").removeClass('active');
		map.remove(trafficMarkers);
	} else {
		isTrafficOn = true;
		$(".icon-traffic").addClass('active');

		let trafficMarkerIcon = new AMap.Icon({
			size: new AMap.Size(34, 50), //图标大小
			image: "images/mark-traffic.png",
		})

		for(let i = 0; i < trafficArr.length; i++) {
			trafficMarker = new AMap.Marker({
				map: map,
				position: trafficArr[i].location,
				icon: trafficMarkerIcon,
				offset: new AMap.Pixel(-17, -50),
			});
			trafficMarker.extData = trafficArr[i].id;
			//监听事件
			AMap.event.addListener(trafficMarker, 'click', trafficMarkerClick);

			trafficMarkers.push(trafficMarker);
		}

	}
}

//路况 mark 点击事件 执行
function trafficMarkerClick(e) {
	let index = e.target.extData - 1;
	let trafficHtml = '';
	console.log(index);

	$("#infoBox").empty();
	for(var i = 0; i < trafficArr.length; i++) {
		if(i == index) {
			trafficHtml = '<div class="traffic-box"><div class="traffic-body"><div class="high-way-mark"><div class="high-way-title">国家高速</div>' +
				'<div class="high-way-body">' +
				'<p class="high-way-num">' + trafficArr[i].highWayNum + '</p>' +
				'<p class="high-way-name">' + trafficArr[i].highWayname + '</p>' +
				'</div></div><div class="high-way-info">' +
				'<p class="highWaySection">' + trafficArr[i].highWaySection + '</p>' +
				'<p class="reason">' + trafficArr[i].reason + '</p>' +
				'<p class="duration">封闭时间：' + trafficArr[i].duration + '</p>' +
				'</div></div><div class="traffic-bottom">' +
				'<div class="link-more" id=' + e.target.extData + '>查看更多路况信息</div>' +
				'</div></div>';
		}
	}
	$("#infoBox").append(trafficHtml);
	openInfo();

}

//点击 服务区 按钮
var isSareaOn = false;
var sareaMarkers = [];
var sareaMarker;

function serviceAreaMarks() {
	if(isSareaOn) {
		isSareaOn = false;
		$(".icon-p").removeClass('active');
		map.remove(sareaMarkers);
	} else {
		isSareaOn = true;
		$(".icon-p").addClass('active');

		let sareaMarkerIcon = new AMap.Icon({
			size: new AMap.Size(34, 50), //图标大小
			image: "images/mark-service.png",
		})

		for(let i = 0; i < sareaArr.length; i++) {
			sareaMarker = new AMap.Marker({
				map: map,
				position: sareaArr[i].location,
				icon: sareaMarkerIcon,
				offset: new AMap.Pixel(-17, -50),
			});
			sareaMarker.extData = sareaArr[i].id;
			//监听事件
			AMap.event.addListener(sareaMarker, 'click', sareaMarkerClick);

			sareaMarkers.push(sareaMarker);
		}
	}
}

//服务区 mark 点击事件 执行
function sareaMarkerClick(e) {
	let index = e.target.extData - 1;
	let sareaHtml = '';
	let sareaItemHtml = "";
	let type = "service";
	let serviceId = e.target.extData;
	console.log(index);

	$("#infoBox").empty();
	for(var i = 0; i < sareaArr.length; i++) {
		if(i == index) {

			if(sareaArr[i].service.eat) {
				sareaItemHtml += '<span class="item-badge">餐饮</span>'
			}
			if(sareaArr[i].service.superMarket) {
				sareaItemHtml += '<span class="item-badge">超市</span>'
			}
			if(sareaArr[i].service.toilet) {
				sareaItemHtml += '<span class="item-badge">厕所</span>'
			}
			if(sareaArr[i].service.parking) {
				sareaItemHtml += '<span class="item-badge">停车</span>'
			}
			if(sareaArr[i].service.gasStation) {
				sareaItemHtml += '<span class="item-badge">加油站</span>'
			}
			if(sareaArr[i].service.hotel) {
				sareaItemHtml += '<span class="item-badge">住宿</span>'
			}
			if(sareaArr[i].service.hotwater) {
				sareaItemHtml += '<span class="item-badge">热水</span>'
			}
			if(sareaArr[i].service.repair) {
				sareaItemHtml += '<span class="item-badge">汽车维修</span>'
			}
			if(sareaArr[i].service.chargingPile) {
				sareaItemHtml += '<span class="item-badge">充电桩</span>'
			}
			if(sareaArr[i].service.fillingStation) {
				sareaItemHtml += '<span class="item-badge">加气站</span>'
			}
			
			
			
			sareaHtml = '<div class="service-box"><div class="service-body"><div class="high-way-mark"><div class="high-way-title">国家高速</div>' +
				'<div class="high-way-body">' +
				'<p class="high-way-num">' + sareaArr[i].highWayNum + '</p>' +
				'<p class="high-way-name">' + sareaArr[i].highWayname + '</p>' +
				'</div></div><div class="service-info">' +
				'<p class="service-name">' + sareaArr[i].name + '</p>' +
				'<div class="service-item"><label>提供服务：</label>' + sareaItemHtml + '</div></div></div>' +
				'<div class="service-bottom">' +
				'<div class="link-more" id=' + e.target.extData + '  onclick=goHref("'+type+'",'+serviceId+')>查看详情</div>' +
				'</div></div>';
		}
	}

	$("#infoBox").append(sareaHtml);
	openInfo();

}

//点击 收费站 按钮
var isZhanOn = false;
var zhanMarkers = [];
var zhanMarker;

function zhanMarks() {
	if(isZhanOn) {
		isZhanOn = false;
		$(".icon-zhan").removeClass('active');
		map.remove(zhanMarkers);
	} else {
		isZhanOn = true;
		$(".icon-zhan").addClass('active');

		let zhanMarkerIcon = new AMap.Icon({
			size: new AMap.Size(30, 44.3), //图标大小
			image: "images/mark-zhan.png",
		})

		for(let i = 0; i < zhanArr.length; i++) {
			zhanMarker = new AMap.Marker({
				map: map,
				position: zhanArr[i].location,
				icon: zhanMarkerIcon,
				offset: new AMap.Pixel(-15, -44.3),
			});
			zhanMarker.extData = zhanArr[i].id;
			//监听事件
			AMap.event.addListener(zhanMarker, 'click', zhanMarkerClick);

			zhanMarkers.push(zhanMarker);
		}
	}
}

//收费站mark 点击事件 执行
function zhanMarkerClick(e) {
	let index = e.target.extData - 1;
	let zhanHtml = '';
	console.log(index);

	$("#infoBox").empty();
	for(var i = 0; i < zhanArr.length; i++) {
		if(i == index) {

			zhanHtml = '<div class="zhan-box"><div class="zhan-body"><div class="high-way-mark"><div class="high-way-title">国家高速</div>' +
				'<div class="high-way-body">' +
				'<p class="high-way-num">' + zhanArr[i].highWayNum + '</p>' +
				'<p class="high-way-name">' + zhanArr[i].highWayname + '</p>' +
				'</div></div><div class="zhan-info">' +
				'<p class="zhan-name">' + zhanArr[i].zhanName + '</p>' +
				'<div class="zhan-support"><label>本站支持：</label><div><span class="item-badge">现金支付</span><span class="item-badge">ETC支付</span><span class="item-badge">无感支付</span><span class="item-badge">扫码支付</span></div></div></div></div>' +
				'<div class="city-bottom"><div class="link-more" id=' + e.target.extData + '>查看详情</div></div>'
		}
	}
	$("#infoBox").append(zhanHtml);
	openInfo();

}

//点击 城市 按钮
var isCityOn = false;
var cityMarkers = [];
var cityMarker;

function cityMarks() {
	if(isCityOn) {
		isCityOn = false;
		$(".icon-city").removeClass('active');
		map.remove(cityMarkers);
	} else {
		isCityOn = true;
		$(".icon-city").addClass('active');

		let cityMarkerIcon = new AMap.Icon({
			size: new AMap.Size(30, 44.3), //图标大小
			image: "images/mark-city.png",
		})

		for(let i = 0; i < cityArr.length; i++) {
			cityMarker = new AMap.Marker({
				map: map,
				position: cityArr[i].cityLocation,
				icon: cityMarkerIcon,
				offset: new AMap.Pixel(-15, -44.3),
			});
			cityMarker.extData = cityArr[i].id;
			//监听事件
			AMap.event.addListener(cityMarker, 'click', cityMarkerClick);

			cityMarkers.push(cityMarker);
		}

	}
}

//城市 mark 点击事件 执行
function cityMarkerClick(e) {
	let index = e.target.extData - 1;
	let cityHtml = '';
	let type = "city";
	console.log(index);

	$("#infoBox").empty();
	for(var i = 0; i < cityArr.length; i++) {
		if(i == index) {
			cityHtml = '<div class="city-box"><div class="city-body">' +
				'<div class="city-title">' + cityArr[i].cityName + '</div>' +
				'<div class="city-des">' + cityArr[i].des + '</div></div>' +
				'<div class="city-bottom"><div class="link-more" id=' + e.target.extData + ' onclick=goHref("'+type+'",'+e.target.extData+')>查看详情</div></div>'
		}
	}
	$("#infoBox").append(cityHtml);
	openInfo();

}

//点击 景区 按钮

var isSceneryOn = false;
var sceneryMarkers = [];
var sceneryMarker;

function sceneryMarks() {
	if(isSceneryOn) {
		isSceneryOn = false;
		$(".icon-scenery").removeClass('active');
		map.remove(sceneryMarkers);
	} else {
		isSceneryOn = true;
		$(".icon-scenery").addClass('active');

		let sceneryMarkerIcon = new AMap.Icon({
			size: new AMap.Size(30, 44.3), //图标大小
			image: "images/mark-scenery.png",
		})

		for(let i = 0; i < sceneryArr.length; i++) {
			sceneryMarker = new AMap.Marker({
				map: map,
				position: sceneryArr[i].location,
				icon: sceneryMarkerIcon,
				offset: new AMap.Pixel(-15, -44.3),
			});
			sceneryMarker.extData = sceneryArr[i].id;
			//监听事件
			AMap.event.addListener(sceneryMarker, 'click', sceneryMarkerClick);

			sceneryMarkers.push(sceneryMarker);
		}
	}
}

//景区 mark 点击事件 执行
function sceneryMarkerClick(e) {
	let index = e.target.extData - 1;
	let sceneryHtml = '';
	let type = "scenery";
	console.log(index);

	$("#infoBox").empty();
	for(var i = 0; i < sceneryArr.length; i++) {
		if(i == index) {
			sceneryHtml = '<div class="city-box"><div class="city-body">' +
				'<div class="city-title">' + sceneryArr[i].name + '</div>' +
				'<div class="city-des">' + sceneryArr[i].des + '</div></div>' +
				'<div class="city-bottom"><div class="link-more" id=' + e.target.extData + ' onclick=goHref("'+type+'",'+e.target.extData+')>查看详情</div></div>'
		}
	}
	$("#infoBox").append(sceneryHtml);
	openInfo();

}



function goHref(type,id){
	let href = ""
	if(type == "service"){
		href = encodeURI("service.html?id=" + id);
		window.location.href = href;
	}
	
	if(type == "city"){
		href = encodeURI("city.html?id=" + id);
		window.location.href = href;
	}
	
	if(type == "scenery"){
		href = encodeURI("scenery.html?id=" + id);
		window.location.href = href;
	}
	
	
}

















