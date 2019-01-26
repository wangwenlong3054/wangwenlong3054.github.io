$("#tripLine").css('height', document.documentElement.clientHeight + 'px')

var map;
var district = null;
var startLng = "126.535319"; 
var startLat = "45.803131";

var endLng = "129.618602";
var endLat = "44.582962";
var startName = "";
var endName = "";
var swiper;

	//	startLng = '126.535319';
	//	startLat = '45.803131';
	//	endLng = '130.277487';
	//	endLat = '47.332085';


//创建和初始化地图函数：
function initMap() {
	
	//创建地图
	createMap();

	//初始化 swiper
	swiper = new Swiper('.swiper-container', {
		mode: 'horizontal',
		initialSlide: 0,
		pagination: '.banner-pagination',
		loop: false,
		autoplay: 0,
		observer: true, //修改swiper自己或子元素时，自动初始化swiper
		observeParents: true, //修改swiper的父元素时，自动初始化swiper
		paginationClickable: true,
		onSlideChangeEnd: function(swiper) {
			console.log(swiper.activeIndex);

			//重绘 线
			reDrawPolyline(swiper.activeIndex);

		}
	});
	
	let isok = true;
	
	if(!queryString("startLng") == ""){
		startLng = queryString("startLng");
	}else{
		isok = false;
	}
	
	if(!queryString("startLat") == ""){
		startLat = queryString("startLat");
	}else{
		isok = false;
	}
	
	if(!queryString("endLng") == ""){
		endLng = queryString("endLng");
	}else{
		isok = false;
	}
	
	if(!queryString("endLat") == ""){
		endLat = queryString("endLat");
	}else{
		isok = false;
	}
	
	if(!queryString("startName") ==""){
		startName = decodeURI(queryString("startName")) ;
		$("#start").val(startName);
	}else{
		isok = false;
	}
	
	if(!queryString("endName") ==""){
		endName = decodeURI(queryString("endName")) ;
		$("#end").val(endName);
	}else{
		isok = false;
	}
	
	if(isok){
		//根据 lng lat 画出路线
		getPointAndLine();
	}else{
		showToast("缺少参数!", "error");
	}
	
//	getPointAndLine();
	
//	if(!queryString("startLng") == "" || queryString("startLat") == "" || queryString("endLng") == "" || queryString("endLat") == "") {
//		startLng = queryString("startLng");
//		startLat = queryString("startLat");
//		endLng = queryString("endLng");
//		endLat = queryString("endLat");
//		startName = decodeURI(queryString("startName")) ;
//		endName = decodeURI(queryString("endName")) ;
//		$("#start").val(startName);
//		$("#end").val(endName);
//		
//	}else{
//		showToast("系统错误!", "error");
//	}

}
//创建地图
function createMap() {
	map = new AMap.Map('allmap', {
		resizeEnable: true,
		scrollWheel: false,
		zoom: 7,
		center: [126.669503, 45.747708]
	});
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

//全局 重定义数组 下标
var hlj_GD = ['G1京哈高速', 'G10绥满高速', 'G11鹤大高速', 'G1001哈尔滨绕城高速', 'G1011哈同高速', 'G1111鹤哈高速', 'G1012建黑高速', 'G1211吉黑高速', 'G45大广高速', 'G102京哈线', 'G201', 'G203', 'G221', 'G222', 'G111', 'G301'];

var objArr = {};
var objArrIndex = 0;
var objRoadStr = {};
//个方案 总里程 数组
var objAllMail = [];
//个方案 总时间 数组
var objAllTime = [];

//请求 路线数据 
function getPointAndLine() {
	//重置 参数
	//clear()

	//	startLng = '126.535319';
	//	startLat = '45.803131';
	//	endLng = '130.277487';
	//	endLat = '47.332085';

	if(startLng== "" || startLat== "" || endLng== "" || endLat== "") {
		showToast("缺少参数!请重试", "warning")
	} else {
		//var origin = startLng + ',' + startLat; //126.535319,45.803131
		//var destination = endLng + ',' + endLat; //130.277487,47.332085

		addMarker('s', "", startLng, startLat);
		addMarker('e', "", endLng, endLat);
	}

	let urlStr = 'https://restapi.amap.com/v3/direction/driving?key=405ed507df4a92d0b2b6fa95410897b7&origin=' + startLng + ',' + startLat + '&destination=' + endLng + ',' + endLat + '&output=json&strategy=19'
	console.log(urlStr)
	$.ajax({
		type: "GET",
		url: urlStr,
		async: false,
		dataType: "json",
		success: function(data) {
			console.log("请求得到原始数据")
			console.log(data);
			console.log("--------分割---------")
			console.log("路线数" + data.count)

			if(data.route.paths.length > 0) {
				//给下标赋值
				objArrIndex = data.route.paths.length;
				for(let i = 0; i < data.route.paths.length; i++) {
					objArr['arr' + i] = [];
					objRoadStr[i] = "";

					//个方案 总里程 数组
					objAllMail[i] = data.route.paths[i].distance;
					//个方案 总时间 数组
					objAllTime[i] = data.route.paths[i].duration;

					//console.log("进入第二层循环")
					for(let j = 0; j < data.route.paths[i].steps.length; j++) {
						//console.log("总数"+data.route.paths[i].steps.length)
						//拆分 得到 点集合
						split1('arr' + i, data.route.paths[i].steps[j].polyline)
						if(data.route.paths[i].steps[j].road) {
							//得到 road字符串
							getRoadStr(i, data.route.paths[i].steps[j].road)
							//getRoadStr(i, data.route.paths[i].steps[j].toll_road)
						}
					}
				}
				//画线
				doDrawPolyline()
				//获得字符串
				strMatch();
				//添加 面板 方案
				addPanelPlan();

			} else {
				alert("没有获得可用方案")
			}

		},
		error: function(e) {
			console.log(e);
		}
	});

}

//画线
var drawPolyline;

function doDrawPolyline() {
	console.log("draw-------------")
	let strokeColor = '#9ac79d';
	for(let l = objArrIndex-1; l >=0; l--) {
		if(l == 0) {
			strokeColor = '#459c50'
		} else {
			strokeColor = '#9ac79d'
		}
		drawPolyline = new AMap.Polyline({
			map: map,
			path: objArr['arr' + l],
			strokeColor: strokeColor, //线颜色 、、9ac79d
			strokeOpacity: 1, //线透明度
			strokeWeight: 5, //线宽
			strokeStyle: "solid", //线样式
			lineJoin: 'round',
			strokeDasharray: [10, 5], //补充线样式
			extData: l
		});

		map.setFitView(drawPolyline)
	}
}
var redrawPolyline;
function reDrawPolyline(index) {
	//let strokeColor = '#9ac79d';
	
	for(let l = objArrIndex-1; l >=0; l--) {
		
		redrawPolyline = new AMap.Polyline({
			map: map,
			path: objArr['arr' + l],
			strokeColor: index==l?'#459c50':'#9ac79d', //线颜色 、、9ac79d
			strokeOpacity: 1, //线透明度
			strokeWeight: 5, //线宽
			strokeStyle: "solid", //线样式
			lineJoin: 'round',
			strokeDasharray: [10, 5], //补充线样式
			extData: l
		});
		
	}
	
	redrawPolyline = new AMap.Polyline({
			map: map,
			path: objArr['arr' + index],
			strokeColor: '#459c50', //线颜色 、、9ac79d
			strokeOpacity: 1, //线透明度
			strokeWeight: 5, //线宽
			strokeStyle: "solid", //线样式
			lineJoin: 'round',
			strokeDasharray: [10, 5], //补充线样式
			extData: index
		});
	
	
	map.setFitView(redrawPolyline)


}

//添加 面板 方案
function addPanelPlan() {
	let panelItemStr = "";
	let panelTitle = ['方案一', '方案二', '方案三', '方案四', '方案五', '方案六'];
	let alongHtml = ""
	
	console.log(objArrIndex)
	for(var b = 0; b < objArrIndex; b++) {
		
		if(objRoadStr[b]==="G10绥满高速"){
			alongHtml = '<div class="along" onclick="goPageAlong()">线路沿线服务</div>';
		}
		
		panelItemStr = '<div class="swiper-slide"><div class="panel-item">' +
			'<h4 class="panel-title"><span class="title-mark">' + panelTitle[b] + '</span></h4>' +
			'<div class="panel-body">' +
			'<p>约<span class="panel-time">' + getAlltimes(objAllTime[b]) + '</span> | 约<span class="panel-mail">' + getAllMails(objAllMail[b]) + '</span>公里</p>' +
			'<p class="panel-pass">途经：<span class="panel-names">' + objRoadStr[b] + '</span></p>' +
			'</div></div>'+alongHtml+'</div>'

		//$(".swiper-list").append(panelItemStr)
		swiper.appendSlide(panelItemStr);
	}
	swiper.activeIndex = 0;
}

//根据参数 得到 总里程
function getAllMails(data) {
	console.log(data)
	let theMails = Math.floor(data * 1 / 1000).toFixed(2);

	return theMails
}

//根据参数 得到 时间
function getAlltimes(data) {

	let minute = 0,
		hour = 0,
		day = 0;

	minute = parseInt(data / 60); //算出一共有多少分钟

	if(minute > 60) { //如果分钟大于60，计算出小时和分钟
		hour = parseInt(minute / 60);
		minute %= 60; //算出有多分钟
	}
	if(hour > 24) { //如果小时大于24，计算出天和小时
		day = parseInt(hour / 24);
		hour %= 24; //算出有多分钟
	}
	return hour + "小时" + minute + "分钟"
}

//获得字符串
function strMatch() {
	for(let r = 0; r < objArrIndex; r++) {
		objRoadStr[r] = strUnique(objRoadStr[r].match(/(G(.*?)高速)/gi) + ",")
	}

	console.log(objRoadStr);
	
}

//拆分 ;
function split1(index, data) {
	let arrSplit1 = data.split(";")
	//console.log(arrSplit1)
	let appSplit2 = []
	//console.log('进入循环')
	for(let s = 0; s < arrSplit1.length - 1; s++) {
		appSplit2 = arrSplit1[s].split(",")
		//console.log(appSplit2)
		objArr[index].push(appSplit2)
	}
}

//拆分
function getRoadStr(name, data) {
	objRoadStr[name] = objRoadStr[name] + data + ','
	console.log(objRoadStr[name])
}

//去重复
function strUnique(str) {
	let ret = [];
	str.replace(/[^,]+/g, function($1, $2) {
		(str.indexOf($1) == $2) && ret.push($1);
	});
	return ret.join("-");
}

//创建 mark 点
function addMarker(type, address, lng, lat) {

	var markerIcon
	if(type == 's') {
		markerIcon = new AMap.Icon({
			size: new AMap.Size(25, 34), //图标大小
			image: "images/start.png",
		})
	} else if(type == 'e') {
		markerIcon = new AMap.Icon({
			size: new AMap.Size(25, 34), //图标大小
			image: "images/end.png",
		})
	} else {
		markerIcon = null
	}

	var marker = new AMap.Marker({
		map: map,
		position: [lng, lat],
		icon: markerIcon
	});

}


function goPageAlong(){
	let href = encodeURI("along.html");
	window.location.href = href;
}











