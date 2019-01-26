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

//toast
function showToast(msg, type) {
	$(".toastmask").removeClass("hide")
	$.Toast("提示：", msg, type, {
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