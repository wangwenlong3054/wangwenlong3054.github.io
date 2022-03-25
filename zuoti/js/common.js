//url 
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

//url 参数 中文
function queryString(str) {
	var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(String(window.document.location.href)),
		tmp;
	if(tmp = rs) return tmp[2];
	return "";
}

/*
 * wwl 
 * 2021年12月24日08:21:54
 * CPSP-SER2
 * 101.201.100.73:8090
 * 122.112.138.176:8090
 */
var devApi = "http://122.112.138.176:8090/CPSP-SER2/";

var dbApi = "http://122.112.247.27:8099/"

Array.prototype.indexOf = function(val) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] == val) return i;
	}
	return -1;
};

Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if(index > -1) {
		this.splice(index, 1);
	}
};

/*
 * webview 调用方法
 * 参数 lng
 * 参数 lat
 */
function getWebViewLocation(_lng, _lat) {
	lkAddPushGps(_lng, _lat)
	//	if(_fromPage == "lkLocation") {
	//		lkAddPushGps(_fromPage, _lng, _lat)
	//	} else if(_fromPage == "cyLocation") {
	//		cyAddPushGps(_fromPage, _lng, _lat)
	//	}
}

/*
 * 验证是 pc 还是 mobile
 */
function isMobile() {
	let isMobileBlean = false;
	if(window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPad|iPod|ios|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
		//mobile
		isMobileBlean = true;
	} else {
		//pc
		isMobileBlean = false;
	}
	return isMobileBlean
}

/*
 * 验证 android
 */
function isAndroid() {
	let ua = navigator.userAgent.toLowerCase();
	return ua.indexOf('android') > -1 || ua.indexOf('linux') > -1;
}

/*
 * 验证ios
 */
function isIos() {
	let ua = navigator.userAgent.toLowerCase();
	return !!ua.match(/(iphone|ipod|ios|ipad)/ig)
}

function tellClosePage() {
	if(isAndroid()) {
		window.androidWebViewClose.webViewClose("pageClose")
	} else if(isIos()) {
		window.webkit.messageHandlers.iosWebViewClose.postMessage("pageClose")
	}
}

// check null
function checkNullOrEmpty(data) {
	let returnData = "";
	if(data == 0 || data == "0") {
		returnData = data;
	} else if(data == null || data == "" || data == "null" || data == undefined || data == "undefined") {
		returnData = "";
	} else {
		returnData = data;
	}
	return returnData;
}

//获取七牛token
function getQiniuToken() {
	let qiniuUrl = devApi + '/generatesignature/getSignature.json';
	$.ajax({
		type: "GET",
		url: qiniuUrl,
		data: {},
		dataType: 'json',
		success: function(res) {
			if(res.apiTYF.head.msg == "000") {
				console.log(res.apiTYF.body.upToken)
				store.set("qiniuToken", res.apiTYF.body.upToken)
			} else {
				console.log("打印 错误" + res.head.msg);
			}
		},
		error: function(e) {
			console.log("获取七牛上传签名失败，请重试加载页面")
		}
	});
}

/*
 * 创造随机字符串
 */
function randomString(len) {
	len = len || 2;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = $chars.length;
	var pwd = '';
	for(i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

//日期格式转换
function dateToStr() {
	var year = datetime.getFullYear()
	var month = datetime.getMonth()
	var month1 = datetime.getMonth() + 1 //js从0开始取
	var date = datetime.getDate()

	if(month < 10) {
		month = "0" + month
	}
	if(month1 < 10) {
		month1 = "0" + month1
	}
	if(date < 10) {
		date = "0" + date
	}
	return year + '/' + month1 + '/' + date
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
	return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
}

function getRealTime1(data) {
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
	return y + "/" + m + "/" + d + " " + hh + ":" + mm + ":" + ss;
}

// 计算 返回 格式 时间
function getRealTime2(data) {
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
	return y + "-" + m + "-" + d;
}

// 计算 返回 格式 时间
function getRealTime3(data) {
	let nowDate = new Date().getTime();
	let date3 = nowDate - data * 1;
	var days = Math.floor(date3 / (24 * 3600 * 1000));
	var leave1 = date3 % (24 * 3600 * 1000);
	var hours = Math.floor(leave1 / (3600 * 1000));
	var leave2 = leave1 % (3600 * 1000);
	var minutes = Math.floor(leave2 / (60 * 1000));
	var leave3 = leave2 % (60 * 1000);
	var seconds = Math.round(leave3 / 1000);
	return days + "天" + hours + "小时  " + minutes + "分钟 " + seconds + "秒 "
}

//计算 返回 格式 时间
function getRealTime4(data) {
	let nowDate = new Date().getTime();
	let date3 = nowDate - data * 1;
	var days = Math.floor(date3 / (24 * 3600 * 1000));
	var leave1 = date3 % (24 * 3600 * 1000);
	var hours = Math.floor(leave1 / (3600 * 1000));
	var leave2 = leave1 % (3600 * 1000);
	var minutes = Math.floor(leave2 / (60 * 1000));
	var leave3 = leave2 % (60 * 1000);
	var seconds = Math.round(leave3 / 1000);
	return days;
}

function baseCode64(input) {
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var output = "";
	var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	var i = 0;
	input = this._utf8_encode(input);
	while(i < input.length) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if(isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if(isNaN(chr3)) {
			enc4 = 64;
		}
		output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
	}
	return output;
}

function _utf8_encode(string) {
	string = string.replace(/\r\n/g, "\n");
	var utftext = "";
	for(var n = 0; n < string.length; n++) {
		var c = string.charCodeAt(n);
		if(c < 128) {
			utftext += String.fromCharCode(c);
		} else if((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		} else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}
	}
	return utftext;
}