var userId = "";
var token = "";
var store_phone = "";
var userType = "0";

// 0 身份证 1 驾驶证 2 营业执照
var zj_type = "";
var temp_p1 = "";
var temp_p2 = "";
var temp_p3 = "";
var temp_p4 = "";
var temp_p5 = "";

var temp_userCardCode = "";
var temp_plateColor = "";
var temp_approvedLoad = "";
var temp_vin = "";
var temp_engineNum = "";
var temp_vehicleType = "";
var temp_userName = "";
var temp_appprovedPassengerCapacity = "";
var temp_plateNum = "";
var temp_payType = "";

//银行信息
var temp_cardCode = "";
var temp_cardToken = "";
//全局 验证码
var checkCode = "";

var listArr = [];

$(function() {

	userId = store.get('userId');
	token = store.get("userToken");
	store_phone = store.get("phone");

	initView();

	/**
	 * 车牌颜色 切换
	 */
	$("#plateColor").on('click', function() {
		openColorAs();
	})
	/**
	 * 车牌颜色 切换
	 * 选项 点击操作
	 */
	$("#plateColorSheet .sheet-menu-item").on('click', function() {
		temp_plateColor = $(this).index() * 1 + 1;
		$("#plateColor input").val($(this).text());
		closeColorAs()
	})

	/**
	 * 车辆类型 切换
	 */
	$("#carType").on('click', function() {
		openCarTypeAs();
	})
	/**
	 * 车辆类型 切换
	 * 选项 点击操作
	 */
	$("#carTypeSheet .sheet-menu-item").on('click', function() {
		temp_vehicleType = $(this).text();
		$("#carType input").val($(this).text());
		closeCarTypeAs()
	})

	/**
	 * 银行卡 切换
	 */
	$("#bankNum").on('click', function() {
		openbankCardAs();
	})
	/**
	 * 银行卡 切换
	 * 选项 点击操作
	 */
	$("#bankCardSheet .sheet-menu").on('click', '.sheet-menu-item', function() {
		temp_cardCode = listArr[$(this).index()].cardCode;
		temp_cardToken = listArr[$(this).index()].cardToken;
		$("#bankNum input").val(listArr[$(this).index()].cardCode);
		closebankCardAs()
	})

})

/**
 * 初始化 获取url 参数
 */
function initView() {
	//名称
	if(queryString("userName") != undefined || queryString("userName") != null || queryString("userName") != "" || queryString("userName") != "null") {
		temp_userName = decodeURI(queryString("userName").toString());
		$("#userName input").val(temp_userName);
		$("#userName input").attr("readonly", "readonly")
	} else {
		$("#userName input").removeAttr("readonly")
	}
	//证件号
	if(queryString("userCardCode") != null || queryString("userCardCode") != " ") {
		temp_userCardCode = decodeURI(queryString("userCardCode").toString());
		$("#idCard input").val(temp_userCardCode);
		$("#idCard input").attr("readonly", "readonly")
	} else {
		$("#idCard input").removeAttr("readonly")
	}

	//车牌号
	if(queryString("plateNum") != null || queryString("plateNum") != "") {
		temp_plateNum = decodeURI(queryString("plateNum").toString());
		$("#plateNum input").val(temp_plateNum);
		$("#plateNum input").attr("readonly", "readonly")
	} else {
		$("#plateNum input").removeAttr("readonly")
	}

	//车牌颜色
	if(queryString("plateColor") != null || queryString("plateColor") != "") {
		temp_plateColor = queryString("plateColor").toString();
		$("#plateColor input").val(getPlateColor(queryString("plateColor").toString()));
		$("#plateColor input").attr("readonly", "readonly")
	}

	//车辆类型
	if(queryString("vehicleType") != null || queryString("vehicleType") != "") {
		temp_vehicleType = decodeURI(queryString("vehicleType").toString());
		$("#carType input").val(temp_vehicleType);
		$("#carType input").attr("readonly", "readonly")
	}

	if(queryString("approvedLoad") != null || queryString("approvedLoad") != "") {
		temp_approvedLoad = queryString("approvedLoad").toString();
	}

	if(queryString("vin") != null || queryString("vin") != "") {
		temp_vin = queryString("vin").toString();
	}

	if(queryString("engineNum") != null || queryString("engineNum") != "") {
		temp_engineNum = queryString("engineNum").toString();
	}

	if(queryString("appprovedPassengerCapacity") != null || queryString("appprovedPassengerCapacity") != "") {
		temp_appprovedPassengerCapacity = queryString("appprovedPassengerCapacity").toString();
	}

	if(queryString("p1") != null || queryString("p1") != "") {
		temp_p1 = decodeURI(queryString("p1").toString());
	}

	if(queryString("p2") != null || queryString("p2") != "") {
		temp_p2 = decodeURI(queryString("p2").toString());
	}

	if(queryString("p3") != null || queryString("p3") != "") {
		temp_p3 = decodeURI(queryString("p3").toString());
	}

	if(queryString("p4") != null || queryString("p4") != "") {
		temp_p4 = decodeURI(queryString("p4").toString());
	}

	if(queryString("p5") != null || queryString("p5") != "") {
		temp_p5 = decodeURI(queryString("p5").toString());
	}

	if(queryString("zjtype") != null || queryString("zjtype") != "") {
		zj_type = queryString("zjtype").toString();
	}

};

//获取验证码
function getSmsCode() {
	let count = 60;
	let phoneNum = $("#phoneNum").val();
	let itemCheck = $(".item-check button");
	//向后台请求 验证码
	if(phoneNum == null || phoneNum == "") {
		showToast("手机号码不能为空!", "default")
	} else if(!(/^1[34578]\d{9}$/.test(phoneNum))) {
		showToast("手机号码有误，请重填!", "default")
	} else {
		//开启遮罩 进入60s倒计时
		var si = setInterval(function() {
			if(count > 0) {
				count--;
				itemCheck.addClass('gray');
				itemCheck.text(count + 's');
				itemCheck.attr('disabled', 'disabled')
			} else {
				itemCheck.removeClass('gray');
				itemCheck.text('获取验证码');
				itemCheck.removeAttr('disabled');
				count = 60;
				clearInterval(si);
			}
		}, 1000);

		let posturl = 'http://123.57.215.2:8080/CPSP-SER2/unionindex/sendMessage.json?phone=' + phoneNum + '&type=0';
		$.ajax({
			type: "GET",
			url: posturl,
			data: {},
			dataType: 'json',
			success: function(res) {
				if(res.head.msg == "000") {
					checkCode = res.body.authCode
					console.log("验证码：" + checkCode)
				} else {
					console.log("打印 错误" + res.head.msg)
				}
			}
		})

	}
}

/**
 * 按钮点击事件  进入第三步
 */
function goStepThree() {
	if(checkField()) {
		openZZ();
		let posturl = 'http://123.57.215.2:8080/CPSP-SER2/v1/egsordernew/doPostValidate.json';
		$.ajax({
			type: "GET",
			url: posturl,
			data: {
				token: token,
				userId: userId,
				p1: temp_p1,
				p2: temp_p2,
				p3: temp_p3,
				p4: temp_p4,
				p5: temp_p5,
				type: zj_type,
				userName: $("#userName input").val(),
				userCardCode: $("#idCard input").val(),
				plateNum: $("#plateNum input").val(),
				vehicleType: $("#carType input").val(),
				vin: temp_vin,
				engineNum: temp_engineNum,
				approvedLoad: temp_approvedLoad,
				approvedNum: temp_appprovedPassengerCapacity,
				plateColor: temp_plateColor,
				payType: temp_payType,
				cardCode: temp_cardCode,
				cardToken: temp_cardToken,
			},
			dataType: 'json',
			success: function(res) {
				closeZZ()
				if(res.head.msg == "000") {
					checkCode = res.body.authCode

					window.location.href = "gs_open_apply_step3.html";
				} else {
					console.log("打印 错误" + res.head.msg)
				}
			},
			complete: function(res) {
				console.log(res)
				closeZZ()
			}
		})

	}
}

/**
 * 检查字段
 */
function checkField() {
	if($("#userName input").val() == "" || $("#userName input").val() == null) {
		showToast("请输入姓名!", "warning");
		return false;
	} else if($("#idCard input").val() == "" || $("#idCard input").val() == null) {
		showToast("请输入证件号!", "warning");
		return false;
	} else if($("#plateNum input").val() == "" || $("#plateNum input").val() == null) {
		showToast("请输入车牌号!", "warning");
		return false;
	} else if($("#plateColor input").val() == "" || $("#plateColor input").val() == null) {
		showToast("请选择车牌颜色!", "warning");
		return false;
	} else if($("#carType input").val() == "" || $("#carType input").val() == null) {
		showToast("请选择车辆类型!", "warning");
		return false;
	} else if($("#bankNum input").val() == "" || $("#bankNum input").val() == null) {
		showToast("请选择银行卡!", "warning");
		return false;
	} else if($("#phoneNum input").val() == "" || $("#phoneNum input").val() == null) {
		showToast("请输入银行卡预留手机号!", "warning");
		return false;
	} else if($("#vCode").val() == "" || $("#vCode").val() == null) {
		showToast("请输入短信验证码!", "warning");
		return false;
	} else if($("#vCode").val() != checkCode) {
		showToast("请输入正确的短信验证码!", "warning");
		return false;
	} else {
		return true;
	}

}

/**
 * 根据参数 返回 车牌颜色
 * @param {Object} color
 */
function getPlateColor(color) {
	var carNumColor = "";
	if(color == "1") {
		carNumColor = "蓝色";
	} else if(color == "2") {
		carNumColor = "黄色";
	} else if(color == "3") {
		carNumColor = "白色";
	} else if(color == "4") {
		carNumColor = "黑色";
	} else if(color == "5") {
		carNumColor = "绿色";
	} else if(color == "6") {
		carNumColor = "其他";
	}
	return carNumColor;

}

/**
 * 打开 车牌颜色选择
 */
function openColorAs() {
	$(".as-mask").addClass('on');
	$("#plateColorSheet").addClass("on")
}
/**
 * 关闭 车牌颜色选择
 */
function closeColorAs() {
	$(".as-mask").removeClass('on');
	$("#plateColorSheet").removeClass("on")
}

/**
 * 打开 车辆类型选择
 */
function openCarTypeAs() {
	$(".as-mask").addClass('on');
	$("#carTypeSheet").addClass("on")
}
/**
 * 关闭 车辆类型选择
 */
function closeCarTypeAs() {
	$(".as-mask").removeClass('on');
	$("#carTypeSheet").removeClass("on")
}

/**
 * 打开 选择银行卡
 */
function openbankCardAs() {

	if(listArr.length <= 0) {
		openZZ();
		let posturl = 'http://123.57.215.2:8080/CPSP-SER2/v1/unionpay/getUnionCard.json';
		$.ajax({
			type: "GET",
			//url: posturl,
			url: "json/getBankCard.json",
			data: {
				token: token,
				userId: userId,
				phone: store_phone,
				userType: userType
			},
			dataType: 'json',
			success: function(res) {
				closeZZ()
				if(res.apiTYF.head.msg == "000") {
					var resData = res.apiTYF.body.list;
					if(resData.length > 0) {
						console.log(resData)

						$(".as-mask").addClass('on');
						$("#bankCardSheet").addClass("on");

						listArr = resData;
						$("#bankCardSheet .sheet-menu").empty();

						for(var i = 0; i < resData.length; i++) {
							var innerHtml = '<div class="sheet-menu-item">' + resData[i].cardCode + '</div>';
							$("#bankCardSheet .sheet-menu").append(innerHtml)
						}
					} else {
						showToast2("当前用户尚未绑定银行卡，请前往帮车宝App绑定银行卡", "default")
					}
				} else {
					showToast2("请重试", "default")
					console.log("打印 错误" + res.head.msg)
				}
			},
			error: function(res) {
				closeZZ()
				console.log("打印 错误" + res)
			}
		})
	} else {
		$(".as-mask").addClass('on');
		$("#bankCardSheet").addClass("on");

		$("#bankCardSheet .sheet-menu").empty();
		for(var i = 0; i < listArr.length; i++) {
			var innerHtml2 = '<div class="sheet-menu-item">' + listArr[i].cardCode + '</div>';
			$("#bankCardSheet .sheet-menu").append(innerHtml2)
		}
	}

}
/**
 * 关闭 选择银行卡
 */
function closebankCardAs() {
	$(".as-mask").removeClass('on');
	$("#bankCardSheet").removeClass("on")
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

//toast
function showToast(msg, type) {
	$(".toast-mask").removeClass("hide")
	$.Toast("提示", msg, type, {
		stack: false,
		has_icon: true,
		has_close_btn: false,
		fullscreen: false,
		timeout: 0,
		sticky: false,
		has_progress: false,
		rtl: false,
		has_foot: true,
		foot_type: "1"
	});
}

function showToast2(msg, type) {
	$(".toast-mask").removeClass("hide")
	$.Toast("提示", msg, type, {
		stack: false,
		has_icon: true,
		has_close_btn: false,
		fullscreen: false,
		timeout: 2000,
		sticky: false,
		has_progress: true,
		rtl: false,
		has_foot: true,
		foot_type: "1"
	});
}