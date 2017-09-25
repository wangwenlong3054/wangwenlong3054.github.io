(function($) {
	$.fn.extend({
		//移动端-重力感应
		Grav: function(options) {
			var config = {
				ShakeRate: 200,
				//重力灵敏度
				power: 200,
				//甩动力度
				ShakeTotal: 3,
				//甩动次数
				Shaking: function() {},
				//甩动中
				callback: function() {}
				//甩动后
			};
			var grav = $.extend(config, options);
			var ShakeNum = 0;
			var x, y, z, lastX, lastY, lastZ, lastTime = 0;

			if(window.DeviceMotionEvent) {
				window.addEventListener("devicemotion", Handler, true);
			} else {
				alert("然而你的设备并不支持重力感应。");
			};

			function Handler(eventDate) {
				var acceler = eventDate.accelerationIncludingGravity,
					curTime = new Date().getTime(),
					eventTime = curTime - lastTime;
				if(eventTime > 100) {
					lastTime = curTime;
					x = acceler.x;
					y = acceler.y;
					z = acceler.z;
					var ShakeSpeed = Math.abs(x + y + z - lastX - lastY - lastZ) / eventTime * grav.power;

					if(ShakeSpeed > grav.ShakeRate) {
						ShakeNum++;
						grav.Shaking();

						if(ShakeNum == grav.ShakeTotal) {
							window.removeEventListener("devicemotion", Handler, true);
							grav.callback();
							ShakeNum = 0;
							return false;
						};

					};
					lastX = x;
					lastY = y;
					lastZ = z;
				};
			};
		}
	});
})(jQuery);