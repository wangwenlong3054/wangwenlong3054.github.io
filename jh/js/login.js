$(function() {
	
	$('#loginTab a').click(function(e) {
		e.preventDefault()
		$(this).tab('show')
	})
	
	
})

//全局
var checkCode = "";

//获取验证码
function getSmsCode() {
	let count = 60;
	let phoneNum = $("#phoneNum_q").val();
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
				itemCheck.removeAttr('disabled')
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

function validateDefault() {
	let phoneNum = $("#phoneNum_d").val();
	let pwdNum = $("#pwd_d").val();

	if(phoneNum == null || phoneNum == "") {
		showToast("手机号码不能为空!", "default")
		return false;
	} else if(!(/^1[34578]\d{9}$/.test(phoneNum))) {
		showToast("手机号码有误，请重填!", "default")
		return false;
	} else if(pwdNum == "" || pwdNum == null) {
		showToast("密码不能为空!", "default")
		return false;
	} else if(pwdNum.length < 6 || pwdNum.length > 12) {
		showToast("请输入6-12位的密码!", "default")
		return false;
	} else {
		return true
	}
}

//帐号密码登录
function loginByDefault() {
	let phoneNum = $("#phoneNum_d").val();
	let pwdNum = $("#pwd_d").val();

	if(validateDefault()) {
		let posturl = 'http://123.57.215.2:8080/CPSP-SER2/unionindex/login.json?phone=' + phoneNum + '&password=' + pwdNum + '&type=0';
		$.ajax({
			type: "GET",
			url: posturl,
			data: {},
			dataType: 'json',
			success: function(res) {
				console.log(res)
				if(res.head.msg == "000") {
					//缓存obdId
					if(res.body.car.plateNum != null && res.body.car.plateNum != "") {
						store.set('userId', res.body.flag.userId);
						store.set('userToken', res.body.session[0].token);
						store.set('obdId', res.body.user.obdId);
						store.set('phone', res.body.user.phone);
						store.set('isLogin', "isLogin");
						
						window.location.href = "index.html"
					} else {
						showToast("用户未绑定车辆或车牌号为空!", "default")
					}
				} else {
					console.log("打印 错误" + res.head.msg)
				}
			}
		})

	} else {
		console.log("false")
	}

}

function validateQuick() {
	let phoneNum = $("#phoneNum_q").val();
	let checkNum = $("#checkCode_q").val();

	if(phoneNum == null || phoneNum == "") {
		showToast("手机号码不能为空!", "default")
		return false;
	} else if(!(/^1[34578]\d{9}$/.test(phoneNum))) {
		showToast("手机号码有误，请重填!", "default")
		return false;
	} else if(checkNum == '' || checkNum == null) {
		showToast("请输入短信验证码!", "default")
		return false;
	} else if(checkNum != checkCode) {
		showToast("请输入正确的短信验证码!", "default")
		return false;
	} else {
		return true
	}
}

//快速登录
function loginByQuick() {
	let phoneNum = $("#phoneNum_q").val();
	let checkNum = $("#checkCode_q").val();
	if(validateQuick()) {
		openZZ();
		let posturl = 'http://123.57.215.2:8080/CPSP-SER2/unionindex/login.json?phone=' + phoneNum + '&password=&type=3';
		$.ajax({
			type: "GET",
			url: posturl,
			data: {},
			dataType: 'json',
			success: function(res) {
				closeZZ();
				if(res.head.msg == "000") {
					if(res.body.car.plateNum != null && res.body.car.plateNum != "") {
						store.set('userId', res.body.flag.userId);
						store.set('userToken', res.body.session[0].token);
						store.set('obdId', res.body.user.obdId);
						store.set('phone', res.body.user.phone);
						store.set('isLogin', "isLogin");
						
						window.location.href = "index.html"
					} else {
						showToast("用户未绑定车辆或车牌号为空!", "default")
					}

				} else {
					console.log("打印 错误" + res.head.msg)
				}
			},
			error:function(res){
				closeZZ();
			}
		})

	} else {
		console.log("false")
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

//toast
function showToast(msg, type) {
	$(".toast-mask").removeClass("hide")
	$.Toast("提示", msg, type, {
		stack: true,
		has_icon: true,
		has_close_btn: true,
		fullscreen: false,
		timeout: 2000,
		sticky: false,
		has_progress: true,
		rtl: false,
	});
}