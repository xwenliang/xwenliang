/* 富文本编辑器
 * @depends jQuery, base.css
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
			workplace: '.workplace'
		};
		var me = this;
		me.opt = $.extend({}, _default, cfg);
		//所有段落的身份标记数组
		me.uniqueArr = [];
		//编辑器dom对象
		me.$editor = $(me.opt.container);
		//工作区
		me.$el = me.$editor.find(me.opt.workplace);
		//一些参数
		me.opt.offset = me.$el.offset();
		me.opt.lineHeight = parseInt(me.$el.css('lineHeight'));
		me.opt.parentPaddingTop = parseInt(me.$editor.css('paddingTop'));
		me.opt.parentPaddingBottom = parseInt(me.$editor.css('paddingBottom'));
		//初始为15行高度，减1是为了提前触发autoHeight
		me.$el.height(me.opt.lineHeight*15 - 1);
		//仅限chrome浏览器
		me.ua = window.navigator.userAgent.toLowerCase();
		if(me.ua.indexOf('chrome') > 0){
			me.ua = 'chrome';
		}
		else if(me.ua.indexOf('firefox') > 0){
			me.ua = 'firefox';
		}
		else{
			me.$el.html('仅支持Chrome浏览器');
			return me.ua = false;
		}
		me.clickController();
		me.inputController();
		me.tool();
		me.autoHeight();
		me.filterPaste();
	},
	//创建唯一的uid
	createUnique: function(){
		var me = this,
			uidpre = me.uniqueArr.length ? ++me.uniqueArr[me.uniqueArr.length - 1].split('-')[0] : '0',
			uidsuf = Math.floor(19999+Math.random()*29999).toString(16),
			uid = uidpre + '-' + uidsuf;
		me.uniqueArr.push(uid);
		return uid;
	},
	//生成第一行，并将光标置于该行的初始位置
	createFirstP: function(){
		var me = this;
		var selection = document.getSelection && document.getSelection();
		var uid = me.createUnique();
		var $group = $('<div class="z-line-group" name="'+ uid +'" cur="true"><br></div>');
		$group.appendTo(me.$el);
		//将光标移动到首段的第一个位置
		selection.collapse($group[0], 0);
	},
	//获取当前光标所处标签
	getCurTag: function(){
		var me = this;
		var selection = document.getSelection && document.getSelection();
		var parent = selection.getRangeAt(0).commonAncestorContainer;
		//当光标所在的位置为空文本时，其commonAncestorContainer为最外层可编辑div，不为空，才是文本节点
		var tag = parent.nodeType === 3 ? parent.parentNode : parent;
		while(tag.parentNode && tag.tagName != 'DIV'){
			tag = tag.parentNode;
		};
		//对tag修正
		if(tag.tagName != 'DIV'){
			tag = me.$el.find('div[cur=true]')[0];
		}
		else{
			$(tag).attr('cur', true).siblings().removeAttr('cur');
			me.setToolPos(tag);
		}
		return tag;
	},
	//展开收起工具栏
	tool: function(){
		var me = this;
		var $el = me.$el;
		var $editor = me.$editor;
		var $tool = $('<div class="z-tools"><span class="z-switch">+</span><span class="z-code">&lt;code&gt;</span><span class="z-img">&lt;img&gt;</span></div>');
		$editor.append($tool);
		var $codeBtn = $tool.find('.z-code');
		var $imgBtn = $tool.find('.z-img');
		var curTag = null;
		$tool.on('click', function(e){
			var $e = $(this);
			curTag = me.getCurTag();
			if($e.hasClass('active')){
				$e.removeClass('active');
			}
			else{
				$e.addClass('active');
			}
		});
		$tool[0].onselect = $tool[0].ondragstart = $tool[0].onselectstart = function(e){
			e.preventDefault();
			e.stopPropagation();
			return false;
		};
		//代码、上传图片事件
		$codeBtn.on('click', function(e){
			if(curTag.tagName != 'DIV'){
				return false;
			}
			//代码编辑器代码
			me.insertCode(curTag);
			me.autoHeight();
		});

		$imgBtn.on('click', function(e){
			if(curTag.tagName != 'DIV'){
				return false;
			}
			//上传图片代码
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
					$(curTag).html($img);
					selection.collapse(curTag, 1);

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
	setToolPos: function(curTag){
		var me = this,
			opt = me.opt,
			$el = $(curTag),
			height = me.$tool.outerHeight();
		//滚动条放到各个view身上了，那么编辑器的父元素的offset会跟着该view上下滚动而发生变化
		opt.offset = me.$el.offset();
		//该行没有内容，并且不是代码编辑器，才显示工具栏
		if(!$el.text() && !$el.closest('.ace').length){
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
				me.createFirstP();
			}
			//关闭工具栏
			me.$tool.removeClass('active');
			//设置工具栏位置 刚点下去，光标还没到要去的位置就触发了，所以要setTimeout
			setTimeout(function(){
				me.getCurTag();
			}, 0);
			//模拟点击过来的事件
			if(e.isTrigger){
				return ;
			}
			//在代码编辑器之后插入新行 (仅当鼠标点击非代码编辑器区，并且代码编辑器为最后一个子节点时插入)
			var last = $(this).children().last();
			if(last.hasClass('ace') && e.target.tagName === 'SECTION'){
				var selection = document.getSelection && document.getSelection();
				var uid = me.createUnique();
				var $p = $('<div class="z-line-group" name='+ uid +'><br></div>');
				$(this).append($p);
				selection.collapse($p[0], 0);
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
			//如果不幸点击的时候没有生成p，或者由于种种原因，编辑器中没有p了
			if(!$(this).children().length){
				me.createFirstP();
			}
			var tag = me.getCurTag();
			//对每个li里面默认的空格进行处理
			if(tag.tagName == 'LI' && (tag.innerHTML === '<br>' || tag.innerHTML === ' ')){
				var selection = document.getSelection && document.getSelection();
				selection.collapse(tag, 0);
			}
			//按键控制
			switch(ev.keyCode){
				//删除键控制
				case 8:
					//当前标签是代码编辑器，并且其内容为空，则将其删除
					var $ace = $(tag).closest('.ace');
					if($ace.length && $ace.find('.ace_text-layer').text() === ''){
						var selection = document.getSelection && document.getSelection();
						var uid = me.createUnique();
						var $div = $('<div class="z-line-group" name="'+ uid +'" cur="true"><br></div>');
						$div.insertAfter($ace);
						selection.collapse($div[0], 0);
						$ace.remove();
						ev.preventDefault();
						ev.stopPropagation();
						return false;
					}
					//只有一行，并且其内容为空，则禁止删除
					if($(this).find("div").length <= 1 && $(this).find("div").html() === '<br>' && !$(this).find(".ace").length){
						return false;
					}
					break;
				//enter键控制
				case 13:
					break;
				//tab控制
				case 9:
					break;
				default:
					console.log('not capture!');
					return;
			}
		});
		$el.keyup(function(ev){
			//修正工具栏位置bug
			setTimeout(function(){
				var tag = me.getCurTag();
				me.setToolPos(tag);
			}, 0);
			me.autoHeight();
		});
	},
	//插入代码模式
	insertCode: function(curTag){
		var me = this;
		var $el = $(curTag);
		var uid = me.createUnique();
		var editorId= 'ace-'+uid;
		var $div = $('<div class="z-line-group ace" name='+ uid +' data-editorId="'+editorId+'"></div>');
		$div.insertAfter($el);
		$el.remove();
		//创建代码编辑器，todo支持插入多种语言高亮的编辑器
		var editor = aceEditor.create({
			elem: $div[0],
			language: 'javascript'
		}, function(editor){
			//保存这个编辑器对象，方便后面获取其value
			me.aceEditors = me.aceEditors || {};
			me.aceEditors[editorId] = editor;
		});
	},
	//还原代码编辑器
	revertAceEditor: function(options){
		var opt = $.extend({}, {
			parent: null,
			language: 'javascript',
			readOnly: false
		}, options);

		var $parent = opt.parent ? $(opt.parent) : $(document);
		var $line = $parent.find('.z-line-group');
		$line.each(function(key, val){
			var $val = $(val);
			if($val.hasClass('ace')){
				aceEditor.create({
					elem: val,
					language: opt.language,
					readOnly: opt.readOnly
				});
			}
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
			if(!$target.closest('.ace').length){
				var $parent = $target.closest('div');
				setTimeout(function(){
					var $child = $parent.children();
					$.each($child, function(key, val){
						var $e = $(val);
						var html = $e.html().replace(reg, '') || '<br>';
						var name = me.createUnique();
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
	//获取页面的编辑内容，主要过滤掉ace编辑器的一些节点，等到复原的时候利用ace的insert方法还原
	getContent: function(){
		var me = this;
		var $el = this.$el.clone();
		var $lines = $el.find('.z-line-group');
		//将编辑器过滤
		$lines.each(function(key, val){
			var $val = $(val);
			if($val.hasClass('ace')){
				var editorId = $val.attr('data-editorId');
				$val.html(me.aceEditors[editorId].getValue());
			}
		});

		var html = $el.html();
		$el.remove();
		return html;
	}
};

module.exports = zEditor;