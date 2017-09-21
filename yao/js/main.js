var h = document.documentElement.clientHeight;
var w = document.documentElement.clientWidth;

$(".red_bg").css("height", h + "px");

var SHAKE_THRESHOLD = 3000;
var last_update = 0;
var x = y = z = last_x = last_y = last_z = 0;
var shaketype = true;

function init() {
	if(window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', deviceMotionHandler, false);
	} else {
		alert('not support mobile event');
	}
}

//手机摇动 函数
function deviceMotionHandler(eventData) {
	var acceleration = eventData.accelerationIncludingGravity;
	var curTime = new Date().getTime();
	if((curTime - last_update) > 60) {
		var diffTime = curTime - last_update;
		last_update = curTime;
		x = acceleration.x;
		y = acceleration.y;
		z = acceleration.z;
		var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

		if(speed > SHAKE_THRESHOLD) {
			//alert("摇动了")
			if(shaketype) {
				//骰子蛊 状态变为 摇动
				shaketype = false;
				$('#coverbox').removeClass('coverbox').addClass('shake');
				setTimeout(function() {
					//骰子蛊 状态变为 移开
					$('#coverbox').removeClass('shake').addClass('moveout');
					// 显示骰子
					$('.sz').removeClass('hidden')
					var p1 = rsz();
					var p2 = rsz();
					var p3 = rsz();
					console.log(p1 + '-----' + p2 + '-----' + p3)
					//骰子 确定点数
					$('.sz-left').addClass('sz-' + p1)
					$('.sz-center').addClass('sz-' + p2)
					$('.sz-right').addClass('sz-' + p3)
					//显示遮罩 和 再来一次 窗口
					$('.model-bg').removeClass('hidden')
					$('.play-again').removeClass('hidden')
					//计算 得分点数
					$('.play-again .num span').text(p1 * 1 + p2 * 1 + p3 * 1)

				}, 2000);

			}

		}
		last_x = x;
		last_y = y;
		last_z = z;
	}
}

//随机点数
function rsz() {
	return Math.floor(Math.random() * 6 + 1)
}

//重置 页面设置
$('.reset').on('click', function() {
	$('#coverbox').removeAttr('class').attr('class', 'coverbox')
	//$('.sz').addClass('hidden')
	$('.model-bg').addClass('hidden')
	$('.play-again').addClass('hidden')
	$('.sz').eq(0).removeAttr('class').attr('class', 'sz sz-left  hidden')
	$('.sz').eq(1).removeAttr('class').attr('class', 'sz sz-center  hidden')
	$('.sz').eq(2).removeAttr('class').attr('class', 'sz sz-right  hidden')

	shaketype = true;
})