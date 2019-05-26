// 0 身份证 1 驾驶证 2 营业执照
var zj_type = 0;
var p1 = "";
var p2 = "";
var p3 = "";
var p4 = "";

var isPc;

// 长按
var touchY = 0;
var longClick = 0;
// 控制 点击
var onclickPicOne = 0;
var onclickPicTwo = 0;
var onclickPicThree = 0;
var onclickPicFour = 0;

$(function() {

	browserRedirect();

	//车主证件 3选1
	$(".choose-one ul li").on('click', function() {
		$(this).addClass('active').siblings().removeClass('active');
		if($(this).index() == 0) {
			$("#picThree").removeClass('hide');
			$("#picFour").addClass('hide');
			$("#picFive").addClass('hide');
			zj_type = 0;
		} else if($(this).index() == 1) {
			$("#picThree").addClass('hide');
			$("#picFour").removeClass('hide');
			$("#picFive").addClass('hide');
			zj_type = 1
		} else if($(this).index() == 2) {
			$("#picThree").addClass('hide');
			$("#picFour").addClass('hide');
			$("#picFive").removeClass('hide');
			zj_type = 2
		}

	})

	/**
	 * 第一张图片
	 */

	var uploader = Qiniu.uploader({
		disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
		runtimes: 'html5,flash,html4', // 上传模式，依次退化
		browse_button: 'picOne', // 上传选择的点选按钮，必需
		container: 'uploadGroupOne', // 上传区域DOM ID，默认是browser_button的父元素
		max_file_size: '100mb', // 最大文件体积限制
		flash_swf_url: 'js/qiniu/Moxie.swf', // 引入flash，相对路径
		dragdrop: false, // 关闭可拖曳上传
		chunk_size: '4mb', // 分块上传时，每块的体积
		multi_selection: !(moxie.core.utils.Env.OS.toLowerCase() === "ios"),
		uptoken: 'LD5uBW1UGlUUk5fyYgv0v7aDcNswYZHGc3LWYcsJ:8hQRzjC-mYE3_NKycEUUVSX-uSE=:eyJzY29wZSI6ImRmZmRzZGYiLCJkZWFkbGluZSI6MTU1ODUxMzQ4M30=',
		//uptoken_url: 'XXX', // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置,uptoken是上传凭证，由其他程序生成;uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func;其优先级为uptoken > uptoken_url > uptoken_func
		domain: 'http://cdn.tyfbox.com/', // bucket域名，下载资源时用到，必需
		get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的uptoken
		auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
		max_retries: 1, // 上传失败最大重试次数
		unique_names: false,
		save_key: false,
		resize: {
			// 想限制上传图片尺寸，直接用resize这个属性
			//width: 300,
			//height: 300
		},
		filters: {
			mime_types: [
				//只允许上传图片
				{
					title: "Image files",
					extensions: "jpg,jpeg,gif,png"
				},
			],
			prevent_duplicates: false //不允许选取重复文件
		},

		init: {
			'FilesAdded': function(up, files) {
				if(onclickPicOne == 0) {
					// 文件添加进队列后，处理相关的事情
					plupload.each(files, function(file) {
						console.log(file)
					});
				}
			},
			'BeforeUpload': function(up, file) { // 每个文件上传前，处理相关的事情
				console.log("开始上传之前");
				//$("#picOne").empty()
				openZZ();
			},
			'UploadProgress': function(up, file) { // 每个文件上传时，处理相关的事情
				console.log("上传中");
				//$(".upload-progress").html("上传进度:" + file.percent + "%");
			},
			'FileUploaded': function(up, file, info) {
				// 每个文件上传成功后，处理相关的事情
				console.log("上传成功");
				var res = $.parseJSON(info.response)
				//var res = JSON.parse(eval(info))
				console.log("http://cdn.tyfbox.com/" + res.key)
				//创建一个Image对象，实现图片的预下载
				var img = new Image();
				img.src = "http://cdn.tyfbox.com/" + res.key;
				$("#picOne .inner-img").append(img);
				p1 = "http://cdn.tyfbox.com/" + res.key;
				onclickPicOne = 1;
				$("#picOne").addClass('on');

			},
			'Error': function(up, err, errTip) {
				console.log("上传出错");
				closeZZ();
			},
			'UploadComplete': function() {
				closeZZ();
			},
			'Key': function(up, file) {
				var extarr = file['name'].split('.');
				if(extarr.length === 1) {
					var arr = file['type'].split('/');
					var prename = extarr[0];
					var ext = (arr[arr.length - 1] == 'undefined') ? '' : arr[arr.length - 1];
				} else {
					var ext = '.' + extarr[extarr.length - 1]; //得到后缀
					var index = file['name'].lastIndexOf('.'); //得到最后一个点的坐标
					var prename = file['name'].substring(0, index); //得到最后一个点之前的字符串
				}
				var time = Date.parse(new Date()) / 1000;
				$("input[name='ftype']").val(prename);
				var key = 'jh/BCB' + time + prename + ext;
				return key;
			}
		}
	});

	

	/**
	 * 图片1 长按
	 */
	$("#picOne .delete").on('click',functon(){
		
	});

})

/**
 * 点击 下一步
 */
function goNext() {
	//	if(){
	//		
	//	}
}

/**
 * 提交图片 接口
 */
function UpPicResultCarInfo() {

}



function openZZ() {
	$(".z-mask").removeClass('hide');
	$(".z-mask").removeClass('hide');
}

function closeZZ() {
	$(".z-mask").addClass('hide');
	$(".z-mask").addClass('hide');

}

function browserRedirect() {
	var sUserAgent = navigator.userAgent.toLowerCase();
	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid = sUserAgent.match(/android/i) == "android";
	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

	if(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
		return isPc = true
	} else {
		return isPc = false
	}
}