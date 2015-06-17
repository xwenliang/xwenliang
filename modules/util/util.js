//工具库

var $ = require('jquery');

module.exports = {
	/* dialog对话框
	 * @param html(string)				窗体内容
	 * @param title(string)				窗体标题
	 * @param contentClass(string)		窗体class
	 * @param width(num)				窗体宽
	 * @param time(num)					窗体自动关闭时间
	 * @param closeCallback(fn)			窗体关闭后的回调
	 */
	dialog: function(cfg){
		function Dialog(cfg){
			var _default = {
				html: '谁还没有个默认值呀~',
				title: '提示',
				contentClass: '',
				width: 400,
				time: null,
				closeCallback: null,
				auto: null
			};
			this.opt = $.extend({}, _default, cfg);
			this.size = {
				x: $(document).width(),
				y: Math.max($(document).height(), $(window).height()),
				scrollTop: $(document).scrollTop()
			};
			this.open();
		};

		Dialog.prototype.open = function(){
			var self = this,
			opt = this.opt,
			size = this.size,
			mask = $('<div></div>'),
			content = $('<div class='+opt.contentClass+'>\
							<div class="dialog-title">'+opt.title+'<button class="dialog-close">×</button></div>\
							<div class="dialog-content">'+opt.html+'</div>\
						</div>');
			this.mask = mask;
			this.content = content;
			mask.css({
				'width': '100%',
				'height': size.y + 'px',
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'z-index': 1000,
				'background': 'rgba(0, 0, 0, 0.2)'
			});
			content.css({
				'position': 'relative',
				'width': opt.width + 'px',
				'margin': '0 auto',
				'top': ($(window).height() - content.height())/2 - 100 + size.scrollTop,
				'background': '#fefefe',
				'border-radius': '4px',
				'box-shadow': '0 0 10px #555',
				'text-align': 'center',
				'display': 'none',
				'z-index': 1001
			});
			content.find('.dialog-title').css({
				'background': '#f1f1f1',
				'border-radius': '4px 4px 0 0',
				'border-bottom': '1px solid #fff',
				'height': '32px',
				'line-height': '32px',
				'font-weight': 'bold',
				'text-align': 'left',
				'padding-left': '15px'
			});
			content.find('.dialog-close').css({
				'position': 'absolute',
				'top': '1px',
				'right': '15px',
				'font-size': '18px'
			}).click(function(){
				self.close();
				opt.closeCallback && opt.closeCallback();
			});
			content.find('.dialog-content').css({
				'padding': '10px 0'
			});
			content.appendTo(mask);
			mask.appendTo($('body'));
			content.show(300);
			//自动关闭
			if(opt.time){
				opt.auto = setTimeout(function(){
					self.close();
					opt.closeCallback && opt.closeCallback();
				}, opt.time);
			}
		};

		Dialog.prototype.close = function(){
			var mask = this.mask,
			opt = this.opt;
			mask.fadeOut(100, function(){
				mask.remove();
				opt.closeCallback && opt.closeCallback();
			});
		};

		return new Dialog(cfg);
	},
	/* tips类似于Gmail的小提示
	 * @param html(string)				窗体内容
	 * @param tipsClass(string)			窗体class
	 * @param time(num)					窗体自动关闭时间
	 * @param closeCallback(fn)			窗体关闭后的回调
	 */
	tips: function(cfg){
		function Tips(cfg){
			var _default = {
				html: '参数错误~~',
				tipsClass: '',
				time: 2000,
				closeCallback: null,
				auto: null
			};
			//支持仅传入一个字符串
			cfg = typeof cfg === 'string' ? {html: cfg} : cfg;
			this.opt = $.extend({}, _default, cfg);
			this.size = {
				x: $(document).width(),
				y: Math.max($(document).height(), $(window).height()),
				scrollTop: $(document).scrollTop()
			};
			this.open();
		};

		Tips.prototype.open = function(){
			var self = this,
			opt = this.opt,
			size = this.size,
			tips = $('<div class="'+opt.tipsClass+'">'+opt.html+'</div>');
			this.tips = tips;
			tips.css({
				'position': 'absolute',
				'top': 200 + size.scrollTop + 'px',
				'padding': '5px 15px',
				'border': '1px solid #def3d6',
				'background': '#beefab',
				'color': '#387c1e',
				'box-shadow': '0 0 6px #999',
				'opacity': 0
			});
			tips.appendTo($('body'));
			tips.css('left', ($(window).width() - tips.outerWidth(true))/2 + 'px');
			tips.animate({'opacity': 1, 'top': 100 + size.scrollTop + 'px'}, 300);
			//自动关闭
			if(opt.time){
				opt.auto = setTimeout(function(){
					self.close();
					opt.closeCallback && opt.closeCallback();
				}, opt.time);
			}
		};

		Tips.prototype.close = function(){
			var tips = this.tips,
			opt = this.opt;
			tips.fadeOut(200, function(){
				tips.remove();
				opt.closeCallback && opt.closeCallback();
			});
		};

		return new Tips(cfg);
	},
	/* 解析数据
	 * @param obj			保存自定义属性的对象
	 * @param key			保存自定义属性的key
	 */
	analyseData: function(obj, key){
		if(!obj || !obj.length || !obj.attr(key)){
			console.log("请检查数据解析函数传入参数是否正确。");
			return;
		}
		var attr = obj.attr(key);
		var arr = attr.split("&");
		var len = arr.length;
		var data = {};
		for(var i=0;i<len;i++){
			var _arr = arr[i].split("=");
			data[_arr[0]] = _arr[1];
		}
		return data;
	},
	/* 计算单双字节字符长度 单字节0.5 双字节1
	 * @param str(string)	要计算的字符串
	 */
	strLen: function(str){
		var reg = /[\u0100-\uFFFF]/ig;
		return Math.round(str.replace(reg, 'ab').length/2);
	},
	//编辑工具（删除、编辑、发布按钮）
	tools: function(cfg){
		var _default = {
			module: '',
			del: '',
			edi: '',
			pub: '',
			callback: null
		};
		var opt = $.extend({}, _default, cfg);
		var btnWrap = $('<div></div>');
		btnWrap.css({
			'position': 'absolute',
			'right': '15px',
			'top': '10px',
			'display': 'none'
		});
		$(opt.module).hover(
			function(){
				var self = $(this);
				if(btnWrap.html() == ""){
					opt.del && $(opt.del).appendTo(btnWrap);
					opt.edi && $(opt.edi).appendTo(btnWrap);
					opt.pub && $(opt.pub).appendTo(btnWrap);
				}
				self.css('position', 'relative');
				btnWrap.appendTo(self);
				btnWrap.fadeIn(300);
				opt.callback && opt.callback(self);
			},
			function(){
				btnWrap.stop().css('display', 'none');
			}
		).trigger('mouseleave');
	},
	/* enter/esc事件
	 * @param elem(string)			需要绑定这个事件的选择器
	 * @param enter(fn)				enter事件
	 * @param esc(fn)				esc事件
	 */
	specialKey: function(cfg){
		$(cfg.elem).keydown(function(ev){
			var code = ev.keyCode;
			switch(code){
				case 13:
					if(cfg.enter){
						cfg.enter();
						return false;
					}
					break;
				case 27:
					if(cfg.esc){
						cfg.esc();
						return false;
					}
					break;
				default:
					return;
			}
		});
	},
	/* 表单验证
	 * @param reg(reg)						正则规则
	 * @param str(string)					要验证的字符串
	 * @return matched						返回的通过验证的字符
	 */
	validate: function(cfg){
		var _default = {
			reg: /[^0-9a-z\u3400-\u9FFF\-\_\@]/ig,//0-9 a-z A-Z 汉字  _ - @
			str: ''
		};
		var opt = $.extend({}, _default, cfg);
		this.validate.matched = opt.str.match(opt.reg) ? opt.str.match(opt.reg).join('') : '';
		return !opt.reg.test(opt.str);
	},
	/*上传图片
	 * @param url: str 						需要提交到的后台模板地址
	 * @param name: str 					后台借以获取图片数据的name值
	 * @param postData: object				要发送的其他参数
	 * @param progressfn: fn 				进度函数
	 * @param success: fn 					提交成功时的回调函数
	 * @param error: fn 					提交失败时的回调函数
	 * @param err: fn 						发生参数错误导致不能提交时的错误处理
	 * @param debug: boolean 				是否开启调试模式
	 */

	imgUpLoad: function(cfg){
		var _default = {
			url: '',
			name: '',
			postData: {},
			progressfn: null,
			success: null,
			error: null,
			err: null,
			debug: false,
			upLoading: false
		};
		var opt = $.extend({}, _default, cfg);
		var self = this;
		//创建input借以触发文件上传操作
		var oInput = $('<input type="file" id="upload_btn" style="display: none;">');
		!$('#upload_btn').length && $('body').append(oInput);
		//本地选择图片后 触发上传操作
		oInput[0].onchange = function(){
			var tar = this.files ? this.files[0] : null;
			//触发上传函数
			_submit(tar);
		};
		!opt.upLoading && oInput.click();
		//上传函数
		function _submit(file){
			if(!window.FormData || !file){
				self.dialog({
					html: '<div style="padding: 20px 0;">低版本浏览器不支持...<br>请使用IE9以上或者chrome/FF浏览器...</div>'
				});
				return;
			}

			opt.upLoading = true;
			//利用formdata对象
			var formdata = new FormData();
			//本地判断上传文件是否复合要求
			var rReg = /^\S+\.jpg$|^\S+\.jpg$|^\S+\.gif$|^\S+\.png$|^\S+\.bmp$/i;
			var maxSize = 4*1024*1024;
			var err = '';
			if(!rReg.test(file.name)){
				err = "请上传 jpg/gif/png/bmp格式的图片！";
			}
			if(file.size > maxSize){
				err = "请上传小于4M的图片！";
			}
			if(err){
				opt.upLoading = false;
				opt.err && opt.err(err);
				return false;
			}
			//若支持formdata
			var xhr = new XMLHttpRequest();
			var postData = opt.postData;
			for(var i in postData){
				formdata.append(i, postData[i]);
			}
			formdata.append(opt.name, file);
			xhr.upload.onprogress = function(ev){
				//如果有进度函数
				if(opt.progressfn){
					opt.progressfn(ev);
				}
			};
			xhr.onreadystatechange = function(){
				if(xhr.readyState === 4){
					opt.upLoading = false;
					if(xhr.status >= 200 && xhr.status < 300){
						opt.success && opt.success(JSON.parse(xhr.response));
					}
					else{
						opt.error && opt.error(xhr.response);
					}
					//是否开启调试
					opt.debug && console.log(xhr.response);
				}
			};
			//绑定事件要在open之前
			xhr.open("post", opt.url, true);
			xhr.send(formdata);
		};
	},
	//cookie解析
	cookieParser: function(key){
		var cookie = document.cookie;
		var cookieArr = cookie.split('; ');
		var value = null;
		if(!cookieArr.length || cookie.indexOf(key) < 0){
			return value = null;
		}
		cookieArr.forEach(function(tar){
			if(tar.indexOf(key) > -1){
				value = tar.split('=')[1];
			}
		});
		return value;
	},
	//检测登陆
	checkLogin: function(){
		return this.cookieParser('login') ? true : false;
	},
	//深拷贝
	deepCopy: function(p, c){
		var c = c || (p.constructor === Array ? [] : {});
		for(var i in p){
			if(typeof p[i] === 'object'){
				c[i] = (p[i].constructor === Array) ? [] : {};
				arguments.callee(p[i], c[i]);
			}
			else{
				c[i] = p[i];
			}
		}
		return c;
	},
	//灌水及评论
	comments: function(callback){
		var me = this;
		var pBtn = $('.publishBtn');
		var ta = $('#water-word');
		var max = ta.attr('max');
		var tips = $('.water-tips .pre-num');
		var num = $('.water-tips .num');
		pBtn.attr('flag', 1);
		pBtn.click(function(){
			var text = $.trim(ta.val());
			var len = me.strLen(text);
			var data = me.analyseData(pBtn, "data");
			data.text = text;
			if(!text.length || !parseInt(pBtn.attr('flag'))){
				return false;
			}
			pBtn.attr('flag', 0);
			$.ajax({
				url: data.url,
				type: 'POST',
				data: data,
				success: function(data){
					pBtn.attr('flag', 1);
					data.msg && me.tips({html: data.msg});
					callback && callback(ta, data);
				},
				error: function(){
					me.tips({html: '服务器出错'});
					pBtn.attr('flag', 1);
				}
			});
		});
		me.specialKey({
			elem: '#water-word',
			enter: function(){
				$(".publishBtn").click();
				return false;
			}
		});

		ta.keyup(function(){
			var len = me.strLen($(this).val());
			var _num = max - len;
			if(_num >= 0){
				tips.text('还可输入');
				num.text(_num).removeClass('redb');
				pBtn.attr('flag', 1);
			}
			else{
				tips.text('已超过');
				num.text(Math.abs(_num)).addClass('redb');
				pBtn.attr('flag', 0);
			}
		});
	},
	//特殊字符转义，防止xss
	fuckXss: function(str, reg){
		var re = reg || /\<|\>|\\|\//ig;
		return str.replace(re, function($1){
			return '&#' + $1.charCodeAt() + ';';
		});
	},
	/* 倒计时
	 * @param elem($obj) 					存放倒计时的节点
	 * @param toatl(num)					需要倒计时多少秒
	 * @param [fstring(str)]				格式化输出 例：{num}s后重发
	 * @param [callback(fn)]				倒计时结束后的回调
	 * @param [intervalCallback(fn)]		每1s触发的回调
	 */
	countDown: function(elem, total, fstring, callback, intervalCallback){
		function Count(){
			this.countdown();
		};
		Count.prototype.countdown = function(){
			var $elem = elem || $();
			var cur = total || 10;
			(function auto(){
				setTimeout(function(){
					cur--;
					if(cur <= 0){
						intervalCallback ? intervalCallback(cur) : $elem.text(fstring.replace('{num}', cur));
						callback && callback();
						clearTimeout(auto);
						return false;
					}
					else{
						intervalCallback ? intervalCallback(cur) : $elem.text(fstring.replace('{num}', cur));
						auto();
					}
				}, 1000);
			})();
		};
		return new Count();
	},
	//转化日期格式s = Y-m-d H:i:s, t = new Date()
	formatDate: function(s, t){
		var me = this;
		var re = /Y|m|d|H|i|s/g;
		t = t === undefined ? new Date() : isNaN(+t) ? t : new Date(t);
		function add0(str){
			str = str.toString();
			return str.length > 1 ? str : '0'+str;
		};
		return s.replace(re, function($1){
			switch($1){
				case "Y":
					return t.getFullYear();
				case "m":
					return add0(t.getMonth() + 1);
				case "d":
					return add0(t.getDate());
				case "H":
					return add0(t.getHours());
				case "i":
					return add0(t.getMinutes());
				case "s":
					return add0(t.getSeconds());
			}
			return $1;
		});
	},
	//将数字12345.123转成类似于12,345.123的形式，支持负数
	toLocale: function(str){
		str = str.toString();
		if(!str || !str.length || parseFloat(str) === 0){
			return str;
		}
		var _arr = str.split('.'),
			negative = /\-/.test(str) ? '-' : '',
			integer = negative ? _arr[0].slice(1) : _arr[0],
			decimal = _arr[1] ? '.' + _arr[1] : '';
		if(integer.length < 3){
			return negative + integer + decimal;
		}

		integer = integer.split('').reverse().join('');
		var reg = /[\d\D]{3}/ig,
			arr = integer.match(reg),
			last = integer.replace(reg, '');
		integer = last ? arr.join(',') + ',' + last : arr.join(',');
		return negative + integer.split('').reverse().join('') + decimal;
	},
	isLegalNum: function(num){
		return /^-?\d+(?:\.\d+)?(?:e[+\-]?\d+)?$/i.test(num.toString());
	},
	parseUrl: function(url){
		var conf = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'],
			reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
	}

};