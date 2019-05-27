var userId = "";
var token = "";

var egsVadType = '1';

//egsVadType = 4
var messageId = "";
var message = "";
var examine = "";
var searchId = "";
var messageName = "";

//egsVadType = 5
var order_zhanin = "";
var order_zhanout = "";
var order_money = "";
var order_timein = "";
var order_timeout = "";
var order_no = "";
$(function() {

	userId = store.get('userId');
	token = store.get("userToken");

	//用户信息
	$(".bar-user").on('click', function() {
		if(egsVadType != '0'||egsVadType != '1'||egsVadType != '2') {
			window.location.href = "gs_car_info.html";
		}
	});

	//订单信息
	$(".bar-order").on('click', function() {
		window.location.href = "gs_order_list.html";
	});

	//状态图片 点击
	$("#gsState").on('click', function() {
		if(egsVadType == '1') {
			window.location.href = "gs_open_apply.html";
		}
		if(egsVadType == '2') {
			window.location.href = "gs_open_apply_step3.html";
		}
	});

	/**
	 * 高速 通知进行  点击事件
	 */

	$(".jx-btn").on('click', function() {
		alert("点击处理")
	})

	/**
	 * 高速 通知 订单  点击事件
	 */
	$(".order-btn").on('click', function() {
		alert("查看电子发票");
		console.log(scientificNotationToString(order_no))
	})

	//请求数据
	initData();

})

/**
 * 获取 高速 状态等 高速信息
 */
function initData() {
	openZZ();
	let posturl = 'http://123.57.215.2:8080/CPSP-SER2/v1/egsordernew/getEgsIndex.json?token=' + token + '&userId=' + userId;
	$.ajax({
		type: "GET",
		//		url: 'json/getHighWayState.json',
		url: posturl,
		data: {},
		dataType: 'json',
		success: function(res) {
			closeZZ();
			console.log(res)
			var indexData = res.apiTYF.body;
			if(res.apiTYF.head.msg == "000") {

				//高速服务总里程
				$("#allMileage").text(indexData.miles.toString());
				//高速服务总时长
				$("#allH").text(getHourByData(indexData.times))
				$("#allM").text(getMinuteByData(indexData.times))
				//高速服务总金额
				$("#allMoney").text(getPriceFixed2ByData(indexData.prices))

				//判断状态
				egsVadType = indexData.egsVadType.toString();

				if(egsVadType == "1") {
					$("#gsState").removeClass();
					$("#gsState").addClass('gs-state bg-1');

					$("#gsJx").addClass('hide')
					$("#gsOrder").addClass('hide')
				} else if(egsVadType == "2") {
					$("#gsState").removeClass();
					$("#gsState").addClass('gs-state bg-2');
					$("#gsJx").addClass('hide')
					$("#gsOrder").addClass('hide')
				} else if(egsVadType == "3") {
					$("#gsState").removeClass();
					$("#gsState").addClass('gs-state bg-3');
					$("#gsJx").addClass('hide')
					$("#gsOrder").addClass('hide')
				} else if(egsVadType == "4") {
					$("#gsJx").removeClass('hide')

					$("#gsState").addClass('hide');
					$("#gsOrder").addClass('hide');

					//赋值

					$("#gsJx .info").html("您的车辆于<span class='blue'>" + indexData.egsSearchCar.rodTime.toString().replace('.0', '') + "</span>从<span class='blue'>" + indexData.egsSearchCar.tollboothName + "</span>进入高速")
					messageId = indexData.accidentMessage.messageId;
					message = indexData.accidentMessage.message;
					examine = indexData.accidentMessage.examine;
					searchId = indexData.accidentMessage.searchId;
					messageName = indexData.accidentMessage.messageName;

					if(examine == "0") {
						$(".jx-btn").text("点击处理")
					} else if(examine == "1") {
						$(".jx-btn").text("已处理")
					}

				} else if(egsVadType == "5") {
					$("#gsOrder").removeClass('hide')

					$("#gsState").addClass('hide');
					$("#gsJx").addClass('hide');

					//赋值
					order_zhanin = indexData.egsUnionPay.inName;
					order_zhanout = indexData.egsUnionPay.outName;
					order_money = indexData.egsUnionPay.payFee;
					order_timein = indexData.egsUnionPay.inTime.toString().replace('.0', '');
					order_timeout = indexData.egsUnionPay.outTime.toString().replace('.0', '');
					order_no = indexData.egsUnionPay.orderno;

					$("#zhanIn").text(order_zhanin)
					$("#zhanOut").text(order_zhanout)
					$("#orderMoney").text(order_money)
					$("#timeIn").text(order_timein)
					$("#timeOut").text(order_timeout)

				}

			} else {
				console.log("打印 错误" + res.head.msg)
			}
		},
		error: function(e) {
			closeZZ();
			console.log("error" + e)
		}
	});
}

/**
 * 高速服务总时长 
 * 小时
 */
function getHourByData(data) {
	return Math.floor(data / 3600)
}
/**
 * 高速服务总时长 
 * 分钟
 */
function getMinuteByData(data) {
	return Math.floor(data / 60 % 60)
}

/**
 * 高速服务总金额  
 * 返回小数点 2位
 */
function getPriceFixed2ByData(data) {
	var temp_price = data / 100;
	return temp_price.toFixed(2)
}

function scientificNotationToString(param) {
	let strParam = String(param)
	let flag = /e/.test(strParam)
	if(!flag) return param

	// 指数符号 true: 正，false: 负
	let sysbol = true
	if(/e-/.test(strParam)) {
		sysbol = false
	}
	// 指数
	let index = Number(strParam.match(/\d+$/)[0])
	// 基数
	let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')

	if(sysbol) {
		return basis.padEnd(index + 1, 0)
	} else {
		return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
	}
}

/**
 * open loading zzz
 */
function openZZ() {
	$(".z-mask").removeClass('hide');
	$(".z-loading").removeClass('hide');
}
/**
 * close loading zzz
 */
function closeZZ() {
	$(".z-mask").addClass('hide');
	$(".z-loading").addClass('hide');
}