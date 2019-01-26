$("#planTripSearch").css('min-height', document.documentElement.clientHeight + 'px')

//关键字
var key = "";
//地图对象
var map;
//起点 lng 和 lat 坐标
var startLng = "";
var startLat = "";
var endLng = "";
var endLat = "";
var tempLng = "";
var tempLat = "";
var tempInputVal = ""

//创建和初始化地图函数：
function initMap() {
	//创建地图
	createMap();

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

//获取搜索信息
function searchAmap(keytype, keywords) {
	let eleTarget = "result-list-start";
	let elePagination = "pagination-start";
	if(keytype == "1") {
		eleTarget = "result-list-end";
		elePagination = "pagination-end";
	}
	AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'],
		function(MarkerList, SimpleMarker, SimpleInfoWindow) {
			//即jQuery/Zepto
			var $ = MarkerList.utils.$;
			var markerList = new MarkerList({
				map: map,
				//ListElement对应的父节点或者ID
				listContainer: eleTarget, //document.getElementById("myList"),
				//选中后显示
				//从数据中读取位置, 返回lngLat
				getPosition: function(item) {
					return item.location;
				},
				//数据ID，如果不提供，默认使用数组索引，即index
				getDataId: function(item, index) {
					return item.id;
				},
				getInfoWindow: function(data, context, recycledInfoWindow) {
					if(recycledInfoWindow) {
						recycledInfoWindow.setInfoTitle(data.name);
						recycledInfoWindow.setInfoBody(data.address);
						return recycledInfoWindow;
					}
					return new SimpleInfoWindow({
						infoTitle: data.name,
						infoBody: data.address,
						offset: new AMap.Pixel(0, -32)
					});
				},

				//构造列表元素，与getMarker类似，可以是函数，返回一个dom元素，或者模板 html string
				getListElement: function(data, context, recycledListElement) {
					//使用模板创建
					var innerHTML = MarkerList.utils.template(
						'<div class="item-content">' +
						'<div class="item-icon"><span class="item-icon-position"></span></div>' +
						'<div class="item-body">' +
						'<p class="key-value"><%- data.name %></p>' +
						'<p class="key-address"><%- data.address %></p>' +
						'</div>' +
						'<div class="item-mark"><span class="item-icon-mark"></span></div>' +
						'</div>' +
						'<div class="clear"></div>', {
							data: data
						});

					if(recycledListElement) {
						recycledListElement.innerHTML = innerHTML;
						return recycledListElement;
					}

					$("#" + eleTarget).empty()

					return '<li class="list-item">' +
						innerHTML +
						'</li>';
				},
				//列表节点上监听的事件
				listElementEvents: ['click', 'mouseenter', 'mouseleave'],

			});

			window.markerList = markerList;

			AMap.plugin(["AMap.PlaceSearch"], function() {
				var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
					pageSize: 10,
					pageIndex: 1,
					city: '全国',
				});

				var $pagination = $('#' + elePagination);

				function initPagination(page, totalPages) {
					//初始化分页器
					$pagination.twbsPagination({
						totalPages: totalPages,
						startPage: page,
						prev: null,
						first: '首页',
						next: '下一页',
						last: null,
						initiateStartPageClick: false,
						onPageClick: function(event, page) {
							goPage(page);
						}
					});
				}

				var inited = false;

				function goPage(page) {
					//设置当前页
					placeSearch.setPageIndex(page);
					//关键字查询
					placeSearch.search(keywords, function(status, result) {
						console.log("关键字查询结果数据")
						console.log(result.poiList)
						if(status == 'error' || status == 'no_data') {
							showToast("没有查询到数据，请重新输入！", "warning")
							$("#result-list-box").addClass('hide');
							$(".no-data").removeClass('hide');
						} else {

							//render当前页的数据
							markerList.render(result.poiList.pois);

						}
						console.log(status)
						if(status = 'complete' && result.poiList.count > 0) {
							if(!inited) {
								inited = true;
								//首次初始化
								initPagination(page, Math.ceil(result.poiList.count / result.poiList.pageSize));
							}
						}

					});
				}

				goPage(1);

			});

			markerList.on('selectedChanged', function(event, info) {
				console.log(info.selected.data)
				console.log(info.selected.data.location.lng)
				console.log(info.selected.data.location.lat)

				if(keytype == "0") {
					$("#start").val(info.selected.data.name);
					startLng = info.selected.data.location.lng;
					startLat = info.selected.data.location.lat;

				} else if(keytype == "1") {

					$("#end").val(info.selected.data.name);
					endLng = info.selected.data.location.lng;
					endLat = info.selected.data.location.lat;

					// 点击 终点 跳转 页面 给改点位置 参数	
					if(startLng != "" && startLat != "") {
						goTripPlan();
					} else {
						showToast("请输入起点！", "warning")
					}

				}
			});
		});
}

//监听 input
$("#start").on('touchstart', function(e) {
	$("#startResult").removeClass('hide');
	$("#endResult").addClass('hide');
})

$("#end").on('touchstart', function(e) {
	$("#endResult").removeClass('hide');
	$("#startResult").addClass('hide');
})


$("#start").on('keypress', function(e) {
	let keycode = e.keyCode;
	//获取搜索框的值
	let startValue = $(this).val();
	if(keycode == '13') {
		e.preventDefault();
		//请求搜索接口
		if(startValue == '') {
			showToast("请输入地点", "warning");
			//alert('请输入检索内容！');
		} else {
			searchAmap('0', startValue);
			//alert(startValue);
		}
	}
});

$("#end").on('keypress', function(e) {
	let keycode = e.keyCode;
	//获取搜索框的值
	let endValue = $(this).val();
	if(keycode == '13') {
		e.preventDefault();
		//请求搜索接口
		if(endValue == '') {
			showToast("请输入地点", "warning");
			//alert('请输入检索内容！');
		} else {
			searchAmap('1', endValue);
			//alert(endValue);
		}
	}
});


//$("#formStart").on('submit', function(e) {
//	console.log("formStart");
//	let startValue = $("#start").val()
//	if(!startValue == "" || startValue == null) {
//		searchAmap('0', startValue);
//	} else {
//		showToast("请输入地点", "warning");
//	}
//})

//$("#formEnd").on('submit', function(e) {
//	console.log("formEnd");
//	let endValue = $("#end").val()
//	if(!endValue == "" || endValue == null) {
//		searchAmap('1', endValue);
//	} else {
//		showToast("请输入地点", "warning")
//	}
//})

//值 互换
function valueChange() {
	tempLng = startLng;
	tempLat = startLat;

	startLng = endLng;
	startLat = endLat;

	endLng = tempLng;
	endLat = tempLat;

	let startVal = $("#start").val();
	let endVal = $("#end").val();
	tempInputVal = startVal;
	$("#start").val(endVal);
	$("#end").val(tempInputVal);

}

//获取我的位置 
function getMyPosition(key) {
	if(key == "start") {
		getStartPosition(key)
	} else if(key == "end") {
		getStartPosition(key)
	} else {
		showToast("发生未知错误!请重试。", "warning")
	}
}

//获取浏览器定位
function getStartPosition(key) {
	openZZ();
	var options = {
		'enableHighAccuracy': true, //是否使用高精度定位，默认:true
		'timeout': 4000,
		'showButton': false, //是否显示定位按钮
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
				console.log("浏览器定位数据")
				console.log(result)

				if(key == "start") {
					$("#start").val(result.formattedAddress);
					startLng = result.position.lng;
					startLat = result.position.lat;

				} else if(key == "end") {
					$("#end").val(result.formattedAddress);
					endLng = result.position.lng;
					endLat = result.position.lat;
				}

				closeZZ();

			} else {
				showToast("无法获取您的当前位置!", "warning")
			}
		});
	});

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

//跳转 进入 查询路线页面
function goTripPlan() {
	let startName = $("#start").val();
	let endName = $("#end").val();
	let href = encodeURI("trip.html?startLng=" + startLng + "&startLat=" + startLat + "&endLng=" + endLng + "&endLat=" + endLat + "&startName=" + startName + "&endName=" + endName);
	window.location.href = href;
}