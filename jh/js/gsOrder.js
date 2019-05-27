var userId = "";
var token = "";
var obdId = "";

var orderList = new Array();
var innerHtml = '';

$(function() {

	userId = store.get('userId');
	token = store.get("userToken");
	obdId = store.get("obdId");

	openZZ();

	let posturl2 = 'http://123.57.215.2:8080/CPSP-SER2/v1/egsordernew/getEgsOrderList.json?obdId=' + obdId + '&token=' + token + '&userId=' + userId;
	$.ajax({
		type: "GET",
		//		url: 'json/gsOrder.json',
		url: posturl2,
		data: {},
		dataType: 'json',
		success: function(res) {
			console.log(res)
			closeZZ();
			if(res.apiTYF.head.msg == "000") {
				orderList = getOrderList(res.apiTYF.body.egsOrderList)
				$(".gsorder-list").empty();
				for(var i = 0; i < orderList.length; i++) {
					let innerHtml = '<div class="order-item">' +
						'<div class="order-item-body">' +
						'<div class="order-title">' +
						'行程编号：<span class="item-ordernum">' + orderList[i].order_num + '</span>' +
						'</div>' +
						'<div class="order-p">' +
						'<div class="p-key">金额</div>' +
						'<div class="p-value"><span class="money">' + orderList[i].price + '</span>元</div>' +
						'</div>' +
						'<div class="order-p">' +
						'<div class="p-key">行驶轨迹</div>' +
						'<div class="p-value"><span class="inzhan">' + orderList[i].beginZhan + '</span>--<span class="outzhan">' + orderList[i].endZhan + '</span></div>' +
						'</div>' +
						'<div class="order-p">' +
						'<div class="p-key">时间</div>' +
						'<div class="p-value"><span class="intime">' + orderList[i].beginTime + '</span>--<span class="outtime">' + orderList[i].endTime + '</span></div>' +
						'</div>' +
						'</div>' +
						'<div class="order-item-foot" onclick="checkFp(\'' + orderList[i].order_num + '\' )">查看发票信息</div>' +
						'</div>'
					$(".gsorder-list").append(innerHtml);
				}
			} else {

				let nodata = '<div class="no-data"><img src="images/icon_nodata.png"><p>暂无数据</p></div>'
				$(".gsorder-list").append(nodata);
				console.log("打印 错误" + res.head.msg)
			}
		},
		error: function(e) {
			closeZZ();
			let nodata = '<div class="no-data"><img src="images/icon_nodata.png"><p>暂无数据</p></div>'
			$(".gsorder-list").append(nodata);
			console.log("error" + e)
		}
	})
})

function checkFp(id) {
	console.log(scientificNotationToString(id))
}

//屏蔽科学计数法
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

//重构 orderList数组
function getOrderList(data) {
	let order_list = [];
	for(let item of data) {
		if(item.ORDER_NUM != null && item.MILEAGE != null && item.IN_NAME != null && item.OUT_NAME != null && item.IN_TIME != null && item.OUT_TIME != null && item.ORDER_TIME != null) {
			let order = creatOrderList(item);
			order_list.push(order)
		}
	}
	console.log(order_list)
	return order_list;
}

function creatOrderList(item) {
	let order_num = item.ORDER_NUM;
	let mileage = (item.MILEAGE * 1).toFixed(2);
	let beginZhan = item.IN_NAME;
	let endZhan = item.OUT_NAME;
	let zhannum = item.DETAIL_COUNT;
	let price = item.PRICE;
	let beginTime = getRealTime(item.IN_TIME + '000');
	let endTime = getRealTime(item.OUT_TIME + '000');
	let runtime = calOneRunTime(item.ORDER_TIME);
	let order = {
		order_num: order_num,
		mileage: mileage,
		beginZhan: beginZhan,
		endZhan: endZhan,
		zhannum: zhannum,
		price: price,
		beginTime: beginTime,
		endTime: endTime,
		runtime: runtime
	};
	return order;
}

// 计算并返回 单条时长
function calOneRunTime(data) {
	let runtime_h = 0;
	let runtime_m = 0;
	let runtime_s = 0;
	let t = data.toString().split(":");
	runtime_h = t[0] * 1;
	runtime_m = t[1] * 1;
	runtime_s = t[2] * 1;
	if(runtime_h > 0) {
		runtime_m = runtime_m + runtime_h * 60
	}
	return runtime_m;
}
// 计算 返回 格式 时间
function getRealTime(data) {
	let temp = new Date(data * 1);
	let y = temp.getFullYear();
	let m = (temp.getMonth() + 1) + "";
	m = m.length > 1 ? m : "0" + m;
	let d = temp.getDate() + "";
	d = d.length > 1 ? d : "0" + d;
	let hh = temp.getHours() + "";
	hh = hh.length > 1 ? hh : "0" + hh;
	let mm = temp.getMinutes() + "";
	mm = mm.length > 1 ? mm : "0" + mm;
	let ss = temp.getSeconds() + "";
	ss = ss.length > 1 ? ss : "0" + ss;
	return y + "-" + m + "-" + d + " " + hh + ":" + mm;
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