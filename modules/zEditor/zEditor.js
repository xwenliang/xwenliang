/* 富文本编辑器
 * @param cfg.container(string)			zEditor的选择器
 * @param [cfg.workplace(string)]		zEditor的可编辑区
 */

'use strict';

var $ = require('jquery');
var util = require('util');
var aceEditor = require('aceEditor');

function zEditor(cfg){
	if(!(this instanceof zEditor)){
		return new zEditor(cfg);
	}
	this.init(cfg);
};
zEditor.prototype = {
	constructor: zEditor,
	init: function(cfg){
		var _default = {
			container: '',
			workplace: '.workplace',
			languages: {
				'javascript': {
					'title': 'javascript'
				},
				'html': {
					'title': 'html'
				},
				'xml': {
					'title': 'xml'
				},
				'css': {
					'title': 'css'
				},
				'less': {
					'title': 'less'
				},
				'php': {
					'title': 'php'
				}
			}
		};
		var me = this;
		me.opt = $.extend({}, _default, cfg);
		//所有段落的身份标记数组
		me.uidArr = [];
		//编辑器dom对象
		me.$editor = $(me.opt.container);
		//工作区
		me.$el = me.$editor.find(me.opt.workplace);
		me.opt.offset = me.$el.offset();
		me.opt.lineHeight = parseInt(me.$el.css('lineHeight'));
		me.opt.parentPaddingTop = parseInt(me.$editor.css('paddingTop'));
		//仅限chrome浏览器
		me.ua = window.navigator.userAgent.toLowerCase();
		if(me.ua.indexOf('chrome') > 0){
			me.ua = 'chrome';
		}
		else{
			me.$el.html('仅支持Chrome浏览器');
			return false
		}
		me.tool();
		me.collectuid();
		me.collectAce();
		me.clickController();
		me.inputController();
		me.autoHeight();
		me.filterPaste();
	},
	//创建ace编辑器的基础html
	initAceHtml: function(language, html){
		var language = language || '';
		var html = html || '';
		//将html中的特殊字符转换，否则不能正常显示
		html = util.fuckXss(html);
		return '<div class="ace-topbar" contenteditable="false">\
					<span class="ace-title">'+this.opt.languages[language]['title']+'</span>\
				</div>\
				<div class="ace-editor">'+html+'</div>';
	},
	//收集目前已有的uid
	collectuid: function(){
		var $lines = this.$el.find('.z-line-group');
		this.uidArr = this.uidArr || [];
		$lines.each(function(key, val){
			var uid = val.getAttribute('name');
			if(!(uid in this.uidArr)){
				this.uidArr.push(uid);
			}
		}.bind(this));
	},
	//收集并还原已有的ace编辑器
	collectAce: function(){
		var me = this;
		//this.$el怎么会不存在呢？因为这个方法会在post页面还原代码编辑器的时候用到
		var $lines = this.$el ? this.$el.find('.z-line-group') : $('.z-line-group');
		this.aceEditors = this.aceEditors || {};
		$lines.each(function(key, val){
			var $val = $(val);
			//为了兼容老数据
			if($val.hasClass('ace')){
				$val.addClass('ace-line').removeClass('ace ace_editor ace-monokai ace_dark');
			}
			
			if($val.hasClass('ace-line')){
				var editorId = $val.attr('data-editorId');
				var language = $val.attr('data-language') || 'javascript';
				val.innerHTML = me.initAceHtml(language, val.innerHTML);
				var editor = aceEditor.create({
					elem: $val.find('.ace-editor')[0],
					language: language,
					readOnly: false
				}, function(editor){
					//保存这个编辑器对象，方便后面操作它
					me.aceEditors[editorId] = editor;
					me.autoHeight();
				});
			}
		});
	},
	//创建唯一的uid, 1-9f6d的形式，-前面是递增数字，-后面是4位16进制随机数
	createuid: function(){
		var uidpre = this.uidArr.length ? ++this.uidArr[this.uidArr.length - 1].split('-')[0] : '0';
		//4位16进制的10进制范围是1000-ffff=>4096-65535，所以取x：10000<x<65535即可
		//var uidsuf = Math.floor(19999+Math.random()*29999).toString(16);
		//上面的方法真是蠢到哭啊，如果知道16进制的表示方法，就不会这么蠢了
		var uidsuf = Math.floor(0x1000+Math.random()*(0xffff-0x1000)).toString(16);
		var uid = uidpre + '-' + uidsuf;
		this.uidArr.push(uid);
		return uid;
	},
	//生成第一行，并将光标置于该行的初始位置
	createFirstLine: function(){
		var selection = document.getSelection && document.getSelection();
		var uid = this.createuid();
		var $line = $('<div class="z-line-group" name="'+ uid +'" cur="true"><br></div>');
		$line.appendTo(this.$el);
		//将光标移动到首段的第一个位置
		selection.collapse($line[0], 0);
	},
	//获取当前光标所处段落
	getCurLine: function(){
		var selection = document.getSelection && document.getSelection();
		var parent = selection.getRangeAt(0).commonAncestorContainer;
		//当光标所在的位置为空文本时，其commonAncestorContainer为最外层可编辑div，不为空，才是文本节点
		var curLine = parent.nodeType === 3 ? parent.parentNode : parent;
		while(curLine.parentNode && !$(curLine).hasClass('z-line-group')){
			curLine = curLine.parentNode;
		}
		//对tag修正
		if(!$(curLine).hasClass('z-line-group')){
			curLine = this.$el.find('.z-line-group[cur=true]')[0];
		}
		else{
			$(curLine).attr('cur', true).siblings().removeAttr('cur');
			this.setToolPos(curLine);
		}
		return curLine;
	},
	//工具栏
	tool: function(){
		var me = this;
		var $el = me.$el;
		var $editor = me.$editor;
		//共有几种语言
		var options = [];
		for(var i in me.opt.languages){
			options.push('<option>'+i+'</option>');
		}
		var $tool = $('	<div class="z-tools">\
							<div class="z-switch">+</div>\
							<div class="z-code-wrap">\
								<select class="z-select">\
									'+options.join('')+'\
								</select>\
								<span class="z-code">ok</span>\
							</div>\
							<div class="z-img">&lt;img&gt;</div>\
						</div>\
					');
		$editor.append($tool);
		var $select = $tool.find('.z-select');
		var $codeBtn = $tool.find('.z-code');
		var $imgBtn = $tool.find('.z-img');
		var curLine = null;
		//禁用工具栏的选择
		$tool[0].onselect = $tool[0].ondragstart = $tool[0].onselectstart = function(e){
			e.preventDefault();
			e.stopPropagation();
			return false;
		};
		$tool.on('click', function(e){
			var $e = $(this);
			curLine = me.getCurLine();
			if($e.hasClass('active')){
				$e.removeClass('active');
			}
			else{
				$e.addClass('active');
			}
		});
		//选择代码语言
		$select.on('click', function(e){
			e.stopPropagation();
			return false;
		});
		//插入代码编辑器
		$codeBtn.on('click', function(e){
			var language = $select.val();
			me.insertCode(curLine, language);
			me.autoHeight();
		});
		//上传图片
		$imgBtn.on('click', function(e){
			util.imgUpLoad({
				url: '/uploadImg',
				name: 'img',
				postData: {type: 'artical'},
				err: function(err){//图片上传前的预判断 不符合条件的回调
					zooble._tips({html: err});
				},
				success: function(data){
					if(data.code != 1){
						return util.tips(data.msg || '请求错误');
					}
					var src = data.data.src.replace('\\', '/');
					var selection = document.getSelection && document.getSelection();
					var $img = $('<img src="'+src+'">');
					$(curLine).html($img);
					selection.collapse(curLine, 1);

					$img.on('load', function(){
						me.autoHeight();
					});
				},
				error: function(data){
					return util.tips(data.msg);
				}
			});
		});

		me.$tool = $tool;
	},
	//设置工具栏位置
	setToolPos: function(curLine){
		var me = this,
			opt = me.opt,
			$el = $(curLine),
			height = me.$tool.outerHeight();
		//滚动条放到各个view身上了，那么编辑器的父元素的offset会跟着该view上下滚动而发生变化
		opt.offset = me.$el.offset();
		//该行没有内容，并且不是代码编辑器，才显示工具栏
		if(!$el.text() && !$el.hasClass('ace-line')){
			me.$tool.show();
			me.$tool.css('top', $el.offset().top - opt.offset.top + opt.parentPaddingTop + (opt.lineHeight - height)/2 - 1);
		}
		else{
			me.$tool.removeClass('active');
			me.$tool.hide();
		}
	},
	//点击控制
	clickController: function(){
		var me = this;
		var $el = me.$el;
		
		$el.on('mousedown', function(e){
			var $el = $(this);
			//首次点击
			if(!$el.html()){
				me.createFirstLine();
			}
			//关闭工具栏
			me.$tool.removeClass('active');
			//设置工具栏位置 刚点下去，光标还没到要去的位置就触发了，所以要setTimeout
			setTimeout(function(){
				me.getCurLine();
			}, 0);
			//模拟点击过来的事件
			if(e.isTrigger){
				return ;
			}
			//在代码编辑器之后插入新行 (仅当鼠标点击非代码编辑器区，并且代码编辑器为最后一个子节点时插入)
			var last = $(this).children().last();
			if(last.hasClass('ace-line')){
				var selection = document.getSelection && document.getSelection();
				var uid = me.createuid();
				var $line = $('<div class="z-line-group" name='+ uid +'><br></div>');
				$(this).append($line);
				selection.collapse($line[0], 0);
			}
		});
		$el.on('focus', function(){
			$(this).trigger('mousedown');
		});
	},
	//输入控制
	inputController: function(){
		var me = this;
		var $el = me.$el;
		$el.keydown(function(ev){
			//如果不幸点击的时候没有生成div，或者由于种种原因，编辑器中没有div了
			if(!$(this).children().length){
				me.createFirstLine();
			}
			var curLine = me.getCurLine();
			var $curLine = $(curLine);
			//按键控制，在aceEditor中按删除键，捕捉不到keydown，只能捕捉keyup
			switch(ev.keyCode){
				//删除键控制
				case 8:
					var curLine = me.getCurLine();
					var $curLine = $(curLine);
					var $lines = $(this).find('.z-line-group');
					//有这种特殊情况：从普通行一直按住删除键进入aceEditor，会引发异常
					if($curLine.hasClass('ace-line')){
						ev.preventDefault();
					}
					//只有一行，并且其内容为空，则禁止删除
					if($lines.length <= 1 && $lines.html() === '<br>'){
						ev.preventDefault();
					}
					break;
				//enter键控制
				case 13:
					setTimeout(function(){
						//换行后，生成另外一个带有uid的div
						var line = me.getCurLine();
						var uid = me.createuid();
						line.setAttribute('name', uid);
					});
					break;
				//tab控制
				case 9:
					break;
				default:
					return;
			}
		});
		$el.keyup(function(ev){
			//捕捉ace中的删除键
			var curLine = me.getCurLine();
			var $curLine = $(curLine);
			if($curLine.hasClass('ace-line') && ev.keyCode === 8){
				var editorId = curLine.getAttribute('data-editorid');
				var editor = me.aceEditors[editorId];
				//当代码编辑器中没有东西时，按删除键应该将该编辑器删除
				if($curLine.find('.ace_text-layer').text() === ''){
					var selection = document.getSelection && document.getSelection();
					var uid = me.createuid();
					var $div = $('<div class="z-line-group" name="'+ uid +'" cur="true"><br></div>');
					$div.insertAfter($curLine);
					selection.collapse($div[0], 0);
					$curLine.remove();
				}
				//从普通行跳入代码编辑器行的时候，要手动将代码编辑器获取焦点
				else{
					editor.focus();
				}
			}
			me.autoHeight();
			//修正工具栏位置bug
			setTimeout(function(){
				var curLine = me.getCurLine();
				me.setToolPos(curLine);
			});
		});
	},
	//插入代码模式
	insertCode: function(curLine, language){
		var me = this;
		var $el = $(curLine);
		var uid = me.createuid();
		var editorId= 'ace-'+uid;
		var language = language === undefined ? 'javascript' : language;
		var $div = $('	<div class="z-line-group ace-line" name="'+ uid +'" \
							data-editorId="'+editorId+'" \
							data-language="'+language+'">\
							'+me.initAceHtml(language)+'\
						</div>\
					');
		$div.insertAfter($el);
		$el.remove();
		//创建代码编辑器，支持插入多种语言高亮的编辑器
		var editor = aceEditor.create({
			elem: $div.find('.ace-editor')[0],
			language: language
		}, function(editor){
			//保存这个编辑器对象
			me.aceEditors[editorId] = editor;
			//直接获取焦点会触发ace的bug
			setTimeout(function(){
				me.autoHeight();
				me.setToolPos(curLine);
				editor.focus();
			});
		});
	},
	//可编辑div根据内容自动伸长
	autoHeight: function(e){
		var me = this,
			opt = this.opt,
			nowHeight = me.$el.height(),
			relHeight = me.$el[0].scrollHeight;
		if(relHeight > nowHeight){
			me.$el.animate({'height': relHeight - 1 + opt.lineHeight*3 + 'px'}, 200);
		}
	},
	//过滤粘贴html字符
	filterPaste: function(){
		var me = this;
		var $el = me.$el;
		var reg = /<[^>]+>+|<\/[^>]+>+/ig;
		//注意paste事件兼容性
		$el.on("paste", function(ev){
			var $target = $(ev.target);
			//如果不在代码编辑器中粘贴
			if(!$target.closest('.ace-line').length){
				var $parent = $target.closest('.z-line-group');
				setTimeout(function(){
					var $child = $parent.children();
					$.each($child, function(key, val){
						var $e = $(val);
						var html = $e.html().replace(reg, '') || '<br>';
						var name = me.createuid();
						var newHtml = '<div class="z-line-group" name="'+ name +'">'+ html +'</div>';
						$(newHtml).insertBefore($parent);
						$e.remove();
					});
					$parent.remove();
					// var selection = document.getSelection && document.getSelection();
					// var last = $el.children().last()[0];
					// selection.collapse(last, 1);
				}, 0);
			}
			me.autoHeight();
		});
	},
	//获取页面的编辑内容，主要过滤掉ace编辑器的一些节点
	getContent: function(){
		var me = this;
		var $el = this.$el.clone();
		var $lines = $el.find('.z-line-group');
		//将编辑器过滤
		$lines.each(function(key, val){
			var $val = $(val);
			if($val.hasClass('ace-line')){
				var editorId = $val.attr('data-editorId');
				//此处需要将ace的value中的html标签转换，否则下面获取html会被当成节点
				var value = me.aceEditors[editorId].getValue();
				value = util.fuckXss(value);
				$val.html(value);
			}
		});

		var html = $el.html();
		$el.remove();
		return html;
	}
};

module.exports = zEditor;