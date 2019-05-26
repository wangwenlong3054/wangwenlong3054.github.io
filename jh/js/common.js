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

var isLogin = "";

if(store.get('isLogin') == undefined || store.get('isLogin') == "" || store.get('isLogin') == null || store.get('isLogin') == "null"){
	window.location.href = "login.html";
}
