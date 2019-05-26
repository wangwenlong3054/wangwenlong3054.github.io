var userId = "";
var token = "";

// 0 身份证 1 驾驶证 2 营业执照
var zj_type = "0";
var p1 = "";
var p2 = "";
var p3 = "";
var p4 = "";
var p5 = "";

var isPc;

var qiniuToken = "";

//// 长按
//var touchY = 0;
//var longClick = 0;
// 控制 点击
//var onclickPicOne = "0";
//var onclickPicTwo = "0";
//var onclickPicThree = "0";
//var onclickPicFour = '0';

var uploaderOne = null;
var uploaderTwo = null;
var uploaderThree1 = null;
var uploaderThree2 = null;
var uploaderThree3 = null;
var uploaderFour = null;

$(function() {

	userId = store.get('userId');
	token = store.get("userToken");

	getQiniuToken();

	//车主证件 3选1
	$(".choose-one ul li").on('click', function() {
		$(this).addClass('active').siblings().removeClass('active');
		if($(this).index() == 0) {
			$("#picThree").removeClass('hide');
			$("#picFour").addClass('hide');
			$("#picFive").addClass('hide');
			zj_type = "0";
		} else if($(this).index() == 1) {
			$("#picThree").addClass('hide');
			$("#picFour").removeClass('hide');
			$("#picFive").addClass('hide');
			zj_type = "1"
		} else if($(this).index() == 2) {
			$("#picThree").addClass('hide');
			$("#picFour").addClass('hide');
			$("#picFive").removeClass('hide');
			zj_type = "2"
		}
	})

	/**
	 * 第一张图片
	 */

	uploaderOne = Qiniu.uploader({
		disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
		runtimes: 'html5,flash,html4', // 上传模式，依次退化
		browse_button: 'picOne', // 上传选择的点选按钮，必需
		container: 'uploadGroupOne', // 上传区域DOM ID，默认是browser_button的父元素
		max_file_size: '100mb', // 最大文件体积限制
		flash_swf_url: 'js/qiniu/Moxie.swf', // 引入flash，相对路径
		dragdrop: false, // 关闭可拖曳上传
		chunk_size: '4mb', // 分块上传时，每块的体积
		multi_selection: !(moxie.core.utils.Env.OS.toLowerCase() === "ios"),
		uptoken: qiniuToken,
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
				// 文件添加进队列后，处理相关的事情
				plupload.each(files, function(file) {
					console.log(file)
				});
			},
			'BeforeUpload': function(up, file) { // 每个文件上传前，处理相关的事情
				console.log("开始上传之前");
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

				//赋值
				p1 = "http://cdn.tyfbox.com/" + res.key;

				//操作dom
				$("#picOne").addClass('on');
				$("#picOneDelete").removeClass('hide');
				$("#picOneMask").removeClass('hide').append(img);

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
	 * 图片1 删除
	 */
	$("#picOneDelete").on('click', function(e) {
		e.preventDefault();
		console.log("图片1 删除");

		p1 = "";

		$("#picOne").removeClass('on');
		$("#picOneDelete").addClass('hide');
		$("#picOneMask").empty().addClass('hide');

	});

	/**
	 * 第2张图片
	 */

	uploaderTwo = Qiniu.uploader({
		disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
		runtimes: 'html5,flash,html4', // 上传模式，依次退化
		browse_button: 'picTwo', // 上传选择的点选按钮，必需
		container: 'uploadGroupOne', // 上传区域DOM ID，默认是browser_button的父元素
		max_file_size: '100mb', // 最大文件体积限制
		flash_swf_url: 'js/qiniu/Moxie.swf', // 引入flash，相对路径
		dragdrop: false, // 关闭可拖曳上传
		chunk_size: '4mb', // 分块上传时，每块的体积
		multi_selection: !(moxie.core.utils.Env.OS.toLowerCase() === "ios"),
		uptoken: qiniuToken,
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
				// 文件添加进队列后，处理相关的事情
				plupload.each(files, function(file) {
					console.log(file)
				});
			},
			'BeforeUpload': function(up, file) { // 每个文件上传前，处理相关的事情
				console.log("开始上传之前");
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

				//赋值
				p2 = "http://cdn.tyfbox.com/" + res.key;

				//操作dom
				$("#picTwo").addClass('on');
				$("#picTwoDelete").removeClass('hide');
				$("#picTwoMask").removeClass('hide').append(img);

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
	 * 图片2 删除
	 */
	$("#picTwoDelete").on('click', function(e) {
		e.preventDefault();

		p2 = "";
		$("#picTwo").removeClass('on');
		$("#picTwoDelete").addClass('hide');
		$("#picTwoMask").empty().addClass('hide');

	});

	/**
	 * 第3张图片
	 */
	uploaderThree1 = Qiniu.uploader({
		disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
		runtimes: 'html5,flash,html4', // 上传模式，依次退化
		browse_button: 'picThree', // 上传选择的点选按钮，必需
		container: 'uploadGroupTwo', // 上传区域DOM ID，默认是browser_button的父元素
		max_file_size: '100mb', // 最大文件体积限制
		flash_swf_url: 'js/qiniu/Moxie.swf', // 引入flash，相对路径
		dragdrop: false, // 关闭可拖曳上传
		chunk_size: '4mb', // 分块上传时，每块的体积
		multi_selection: !(moxie.core.utils.Env.OS.toLowerCase() === "ios"),
		uptoken: qiniuToken,
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
				// 文件添加进队列后，处理相关的事情
				plupload.each(files, function(file) {
					console.log(file)
				});
			},
			'BeforeUpload': function(up, file) { // 每个文件上传前，处理相关的事情
				console.log("开始上传之前");
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

				//赋值
				p3 = "http://cdn.tyfbox.com/" + res.key;

				//操作dom
				$("#picThree").addClass('on');
				$("#picThreeMask").removeClass('hide').append(img);
				$("#picThreeDelete").removeClass('hide');

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
	 * 图片3 删除
	 */
	$("#picThreeDelete").on('click', function(e) {
		e.preventDefault();

		p3 = "";
		$("#picThree").removeClass('on');
		$("#picThreeMask").empty().addClass('hide');
		$("#picThreeDelete").addClass('hide');
	});

	/**
	 * 第4张图片
	 */
	uploaderThree2 = Qiniu.uploader({
		disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
		runtimes: 'html5,flash,html4', // 上传模式，依次退化
		browse_button: 'picFour', // 上传选择的点选按钮，必需
		container: 'uploadGroupTwo', // 上传区域DOM ID，默认是browser_button的父元素
		max_file_size: '100mb', // 最大文件体积限制
		flash_swf_url: 'js/qiniu/Moxie.swf', // 引入flash，相对路径
		dragdrop: false, // 关闭可拖曳上传
		chunk_size: '4mb', // 分块上传时，每块的体积
		multi_selection: !(moxie.core.utils.Env.OS.toLowerCase() === "ios"),
		uptoken: qiniuToken,
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
				// 文件添加进队列后，处理相关的事情
				plupload.each(files, function(file) {
					console.log(file)
				});
			},
			'BeforeUpload': function(up, file) { // 每个文件上传前，处理相关的事情
				console.log("开始上传之前");
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

				//赋值
				p3 = "http://cdn.tyfbox.com/" + res.key;

				//操作dom
				$("#picFour").addClass('on');
				$("#picFourMask").removeClass('hide').append(img);
				$("#picFourDelete").removeClass('hide');

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
	 * 图片4 删除
	 */
	$("#picFourDelete").on('click', function(e) {
		e.preventDefault();

		p3 = "";
		$("#picFour").removeClass('on');
		$("#picFourMask").empty().addClass('hide');
		$("#picFourDelete").addClass('hide');
	});

	/**
	 * 第5张图片
	 */
	uploaderThree3 = Qiniu.uploader({
		disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
		runtimes: 'html5,flash,html4', // 上传模式，依次退化
		browse_button: 'picFive', // 上传选择的点选按钮，必需
		container: 'uploadGroupTwo', // 上传区域DOM ID，默认是browser_button的父元素
		max_file_size: '100mb', // 最大文件体积限制
		flash_swf_url: 'js/qiniu/Moxie.swf', // 引入flash，相对路径
		dragdrop: false, // 关闭可拖曳上传
		chunk_size: '4mb', // 分块上传时，每块的体积
		multi_selection: !(moxie.core.utils.Env.OS.toLowerCase() === "ios"),
		uptoken: qiniuToken,
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
				// 文件添加进队列后，处理相关的事情
				plupload.each(files, function(file) {
					console.log(file)
				});
			},
			'BeforeUpload': function(up, file) { // 每个文件上传前，处理相关的事情
				console.log("开始上传之前");
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

				//赋值
				p3 = "http://cdn.tyfbox.com/" + res.key;

				//操作dom
				$("#picFive").addClass('on');
				$("#picFiveMask").removeClass('hide').append(img);
				$("#picFiveDelete").removeClass('hide');

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
	 * 图片5 删除
	 */
	$("#picFiveDelete").on('click', function(e) {
		e.preventDefault();

		p3 = "";
		$("#picFive").removeClass('on');
		$("#picFiveMask").empty().addClass('hide');
		$("#picFiveDelete").addClass('hide');
	});

	/**
	 * 第6张图片
	 */
	uploaderFour = Qiniu.uploader({
		disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
		runtimes: 'html5,flash,html4', // 上传模式，依次退化
		browse_button: 'picSix', // 上传选择的点选按钮，必需
		container: 'uploadGroupThree', // 上传区域DOM ID，默认是browser_button的父元素
		max_file_size: '100mb', // 最大文件体积限制
		flash_swf_url: 'js/qiniu/Moxie.swf', // 引入flash，相对路径
		dragdrop: false, // 关闭可拖曳上传
		chunk_size: '4mb', // 分块上传时，每块的体积
		multi_selection: !(moxie.core.utils.Env.OS.toLowerCase() === "ios"),
		uptoken: qiniuToken,
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
				// 文件添加进队列后，处理相关的事情
				plupload.each(files, function(file) {
					console.log(file)
				});
			},
			'BeforeUpload': function(up, file) { // 每个文件上传前，处理相关的事情
				console.log("开始上传之前");
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

				//赋值
				p4 = "http://cdn.tyfbox.com/" + res.key;

				//操作dom
				$("#picSix").addClass('on');
				$("#picSixMask").removeClass('hide').append(img);
				$("#picSixDelete").removeClass('hide');

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
	 * 图片6 删除
	 */
	$("#picSixDelete").on('click', function(e) {
		e.preventDefault();

		p4 = "";
		$("#picSix").removeClass('on');
		$("#picSixMask").empty().addClass('hide');
		$("#picSixDelete").addClass('hide');
	});

})

function getQiniuToken() {
	openZZ()
	let posturl = 'http://101.201.143.219:8090/CPSP-SER2/generatesignature/getSignature.json';
	$.ajax({
		type: "GET",
		url: posturl,
		data: {},
		dataType: 'json',
		success: function(res) {
			closeZZ();
			console.log(res)
			var indexData = res.apiTYF.body;
			if(res.apiTYF.head.msg == "000") {
				qiniuToken = res.apiTYF.body.upToken;

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
 * 点击 下一步
 */
function goNext() {
	UpPicResultCarInfo();
}

/**
 * 提交图片 接口
 */
function UpPicResultCarInfo() {
	if(p1 == "") {
		console.log("请上传行驶证正本")
		showToast("请上传行驶证正本!", "warning")
	} else if(p2 == "") {
		console.log("请上传行驶证副本")
		showToast("请上传行驶证副本!", "warning")
	} else if(p3 == "") {
		if(zj_type == "0") {
			console.log("请上传身份证正面")
			showToast("请上传身份证正面!", "warning")
		} else if(zj_type == "1") {
			console.log("请上传驾驶证正面")
			showToast("请上传驾驶证正面!", "warning")
		} else if(zj_type == "2") {
			console.log("请上传营业执照正面")
			showToast("请上传营业执照正面!", "warning")
		}
	} else if(p3 == "") {
		console.log("请上传车辆正面照片")
		showToast("请上传车辆正面照片!", "warning")
	} else {
		openZZ();
		//http://123.57.215.2:8080/CPSP-SER2/v1/egsordernew/getCheckPic.json?p1=http://cdn.tyfbox.com/BCB1558590410320_7657_2eb865ac7112ad98.jpg&p2=http://cdn.tyfbox.com/BCB1558590418702_7657_-41babce5b29a7136.jpg&p3=http://cdn.tyfbox.com/BCB1558590425618_7657_42f551f215d5efe1.jpg&p4=http://cdn.tyfbox.com/BCB1558590435649_7657_-758a0c75590a863.jpg&token=cd2417bfc793019f1f334d3ea62a87363a17353b9646980d420cc3982d327a30&type=0&
		p1 = "http://cdn.tyfbox.com/BCB1558590410320_7657_2eb865ac7112ad98.jpg";
		p2 = "http://cdn.tyfbox.com/BCB1558590418702_7657_-41babce5b29a7136.jpg";
		p3 = "http://cdn.tyfbox.com/BCB1558590425618_7657_42f551f215d5efe1.jpg";
		p4 = "http://cdn.tyfbox.com/BCB1558590435649_7657_-758a0c75590a863.jpg";
		p5 = "";
		let posturl = 'http://123.57.215.2:8080/CPSP-SER2/v1/egsordernew/getCheckPic.json?token=' + token + '&p1=' + p1 + '&p2=' + p2 + '&p3=' + p3 + '&p4=' + p4 + '&type=' + zj_type;
		$.ajax({
			type: "GET",
			//			url: 'json/getCheckPic.json',
			url: posturl,
			data: {},
			dataType: 'json',
			success: function(res) {
				closeZZ();
				console.log(res)
				var indexData = res.apiTYF.body;
				if(res.apiTYF.head.msg == "000") {

					var gohref = "gs_open_apply_step2.html?";
					window.location.href = gohref + 'userCardCode=' + indexData.map.userCardCode +
						'&plateColor=' + indexData.map.plateColor +
						'&approvedLoad=' + indexData.map.approvedLoad +
						'&vin=' + indexData.map.vin +
						'&engineNum=' + indexData.map.engineNum +
						'&vehicleType=' + indexData.map.vehicleType +
						'&userName=' + indexData.map.userName +
						'&appprovedPassengerCapacity=' + indexData.map.appprovedPassengerCapacity +
						'&plateNum=' + indexData.map.plateNum +
						'&p1=' + p1 +
						'&p2=' + p2 +
						'&p3=' + p3 +
						'&p4=' + p4 +
						'&p5=' + p5 +
						'&zjtype=' + zj_type

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

/**
 * is pc
 */
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