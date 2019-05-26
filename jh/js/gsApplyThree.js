var userId = "";
var token = "";

$(function() {

	userId = store.get('userId');
	token = store.get("userToken");

	openZZ();

	let posturl = 'http://123.57.215.2:8080/CPSP-SER2/v1/egsordernew/getEgsUser.json?token=' + token + '&userId=' + userId;
	$.ajax({
		type: "GET",
		//		url: 'json/gsInfo.json',
		url: posturl,
		data: {},
		dataType: 'json',
		success: function(res) {
			closeZZ();
			console.log(res)
			if(res.apiTYF.head.msg == "000") {
				// userName idCard phoneNum plateNum plateColor carType bankNum
				var data = res.apiTYF.body.egsValidate;
				var carNumColor = "";
				$("#userName").text(data.ownerName);
				$("#idCard").text(data.ownerCode);
				$("#phoneNum").text(data.phone);
				$("#plateNum").text(data.plateNum.toUpperCase());

				switch(data.plateColor) {
					case 1:
						carNumColor = "蓝色"
						break;
					case 2:
						carNumColor = "黄色"
						break;
					case 3:
						carNumColor = "白色"
						break;
					case 4:
						carNumColor = "黑色"
						break;
					case 5:
						carNumColor = "绿色"
						break;
					case 6:
						carNumColor = "其他"
						break;
					default:
						carNumColor = "蓝色"
				}

				$("#plateColor").text(carNumColor);
				$("#carType").text(data.vehicleType);
				$("#bankNum").text(data.cardCode);

			} else {
				console.log("打印 错误" + res.head.msg)
			}
		},
		error: function(e) {
			closeZZ();
			console.log("error" + e)
		}
	})
})

function goIndex() {
	window.location.href = "index.html"
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