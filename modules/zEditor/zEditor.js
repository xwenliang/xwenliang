/* 富文本编辑器
 * @depends jQuery, base.css
 * @param cfg.container(string)			zEditor的选择器
 * @param [cfg.workplace(string)]		zEditor的可编辑区
 */

'use strict';

var $ = require('jquery');
var util = require('util');

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
	//创建独一的uid
	createUnique: function(){
		var me = this,
			uidpre = me.uniqueArr.length ? ++me.uniqueArr[me.uniqueArr.length - 1].split('-')[0] : '0',
			uidsuf = Math.floor(19999+Math.random()*29999).toString(16),
			uid = uidpre + '-' + uidsuf;
		me.uniqueArr.push(uid);
		return uid;
	},
	//生成第一个p，并将光标置于改p的初始位置
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
		while(tag.parentNode && tag.tagName != 'DIV' && tag.tagName != 'PRE' && tag.tagName != 'LI'){
			tag = tag.parentNode;
		};
		//对tag修正
		if(tag.tagName != 'DIV' && tag.tagName != 'PRE' && tag.tagName != 'LI'){
			tag = me.$el.find('div[cur=true]')[0] || me.$el.find('pre[cur=true]')[0] || me.$el.find('li[cur=true]')[0];
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

		if(!$el.text() && curTag && curTag.tagName == 'DIV'){
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
			//在pre之后插入p (仅当鼠标点击非pre区，并且pre为最后一个子节点时插入)
			var last = $(this).children().last();
			if(last[0].tagName === "PRE" && e.target.tagName === 'SECTION'){
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
					//当前标签是pre，并且其内容为空，则将其删除
					var tagParent = tag.tagName === 'LI' ? tag.parentNode.parentNode : tag;
					if(tagParent.tagName === 'PRE' && ($(tagParent).text() === ' ' || !$(tagParent).text())){
						var selection = document.getSelection && document.getSelection();
						var uid = me.createUnique();
						var $p = $('<div class="z-line-group" name="'+ uid +'" cur="true"><br></div>');
						$p.insertAfter($(tagParent));
						selection.collapse($p[0], 0);
						$(tagParent).remove();
						ev.preventDefault();
						ev.stopPropagation();
						return false;
					}
					//只有一个p，并且其内容为空，则禁止删除
					if($(this).find("p").length <= 1 && $(this).find("div").html() === '<br>' && !$(this).find("pre").length){
						return false;
					}
					/*todo 如果是四个连续的空格，则删除的时候，要一次全部删除
					if(tag.tagName === 'Li'){
					}*/
					break;
				//enter键控制
				case 13:
					setTimeout(function(){
						//换行后，生成另外一个带有uid的p或pre
						var tag = me.getCurTag();
						var uid = me.createUnique();
						$(tag).attr("name", uid);
						//在pre中，当前行内无内容，再次enter会跳出pre的li...所以在换行后 给重新生成的li一个空格
						if(tag.tagName === 'LI'){
							if(tag.innerHTML === '<br>'){
								tag.innerHTML = ' ';
							}
							if(tag.previousSibling && (tag.previousSibling.innerHTML === '<br>')){
								tag.previousSibling.innerHTML = ' ';
							}
						}
					}, 0);
					break;
				//tab控制
				case 9:
					ev.preventDefault();
					ev.stopPropagation();
					//pre中代码的tab缩进
					/*if(tag.tagName === 'LI'){
						var range = document.getSelection && document.getSelection(),
							curIndex = range.baseOffset,
							html = tag.innerHTML,
							prevHtml = html.substr(0, curIndex),
							nextHtml = html.substring(curIndex, html.length);
							tag.innerHTML = prevHtml + '    ' + nextHtml;
						range.collapse(tag, 1);
					}*/
					if(tag.tagName === 'LI'){
						var selection = document.getSelection && document.getSelection(),
							range = selection.getRangeAt(0),
							span = document.createElement('span');
						span.className = 'tab';
						span.innerHTML = '    ';
						range.insertNode(span);
						selection.collapse(span, 1);
					}

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
		var $pre = $('<pre class="z-line-group" name='+ uid +'><ul><li> </li></ul></pre>');
		var selection = document.getSelection && document.getSelection();
		$pre.insertAfter($el);
		$el.remove();
		selection.collapse($pre.find('li')[0], 0);
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
			//如果在pre中粘贴：
			if($target.closest('pre').length){
				setTimeout(function(){
					$target = $(me.getCurTag());
					var $pre = $target.closest('pre');
					var $child = $pre.find('li');
					var temp = [];
					$.each($child, function(key, val){
						var $e = $(val);
						var html = $e.html().replace(reg, '') || '';
						temp.push('<li>'+ html +'</li>');
					});
					$pre.html('');
					$pre.append('<ul>'+ temp.join('') +'</ul>');
					var selection = document.getSelection && document.getSelection();
					var last = $pre.find('li').last()[0];
					selection.collapse(last, 1);
				}, 0);
			}
			//在div中粘贴
			else if($target.closest('div').length){
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
					var selection = document.getSelection && document.getSelection();
					var last = $el.children().last()[0];
					selection.collapse(last, 1);
				}, 0);
			}
			me.autoHeight();
		});
	}
};

module.exports = zEditor;