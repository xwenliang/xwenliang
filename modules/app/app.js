/*
 * @desc 	基于backbone拓展出的单页面应用
 * @date 	2015.06.15
 * @auth 	zooble
 */

'use strict';

var $ = require('jquery');

var Backbone = require('Backbone');

var app = window.app || {};

app.isMobile = /mobile/i.test(navigator.userAgent);

app.init = function(){
	//页面点击监听
	$('body').on('click', 'a', function(e){
		if(this.target || this.href.indexOf('javascript') > -1){
			return true;
		}
		//相同链接不允许点击
		if(this.href == window.location.href){
			return false;
		}

		// var extras = {time: Date.now()};
		// window.history.pushState(extras, '', this.href);
		// $(window).trigger('popstate');
		//注意 this.href 和 this.getAttribute('href') 的区别
		Backbone.history.navigate(this.getAttribute('href'), { 'trigger': true });

		return false;
	});
	//监听浏览器的后退事件，实现跟前进相反的动画
	window.addEventListener('popstate', function(e){
		//这里监听的是浏览器的前进或后退事件，todo:区分前进和后退
		app.backbtnclicked = true;
	});

	new this.router();

	Backbone.history.start({
		pushState: true,
		hashChange: false
	});

	//全局视图实例化
	app.$header = app.router.prototype.views['global_header'] = new app.view.global_header();
	//获取滚动条宽度
	var $html = $('html');
	$html.css('overflow', 'scroll');
	var scrollWid = $html.width();
	$html.css('overflow', 'hidden');
	var hiddenWid = $html.width();
	app.scrollBarWidth = hiddenWid - scrollWid;
};
//获取view
app.getViewByAction = function(action){
	return app.router.prototype.views[action];
};

app.router = Backbone.Router.extend({
	initialize: function(){
		//保存视图,为何写在这里，就不能通过app.router.prototype.views在外部访问？
		//this.views = {};
	},
	//保存视图
	views: {},
	routes: {
		''				: 	'index',
		'login'			: 	'login',
		'reg'			: 	'reg',
		'u/:username'	: 	'user',
		'p/:id'			: 	'post',
		'c/:category'	: 	'category',
		'water'			: 	'water',
		'newpost/:id'	: 	'newpost',
		'postlist'		: 	'postlist',
		'userlist'		: 	'userlist',
		'music' 		: 	'music',
		'chat'			: 	'chat'
	},
	index: function(){
		this.routeChange('index');
	},
	login: function(){
		this.routeChange('login');
	},
	reg: function(){
		this.routeChange('reg');
	},
	user: function(username){
		this.routeChange('user', {
			username: username
		});
	},
	post: function(id){
		this.routeChange('post', {
			id: id
		});
	},
	category: function(category){
		this.routeChange('category', {
			category: category
		});
	},
	water: function(){
		this.routeChange('water', {
			
		});
	},
	newpost: function(id){
		this.routeChange('newpost', {
			id: id
		});
	},
	postlist: function(){
		this.routeChange('postlist', {

		});
	},
	userlist: function(){
		this.routeChange('userlist', {

		});
	},
	music: function(){
		this.routeChange('music', {

		});
	},
	chat: function(){
		this.routeChange('chat', {

		});
	},
	routeChange: function(action, params){
		var view = this.views[action];
		if(!view){
			view = this.views[action] = new app.view[action](params, action);
		}
		this.previousView = this.currentView;
		this.previousHash = this.currentHash;
		this.currentView = view;
		this.currentHash = window.location.hash;

		//将数据变化，通知model
		if(view.model && params){
			for(var i in params){
				view.model.set(i, params[i]);
			}
		}

		//切换页面前
		this.beforeSwitchView(this.previousView, this.currentView, params);
		//切换页面
		this.switchPage(this.previousView, this.currentView, params, function(){
			//切换页面后
			this.afterSwitchView(this.previousView, this.currentView, params);
		});
	},
	switchPage: function(from, to, params, callback){
		var me = this;
		var $box = to.$el.parent();
		//旋转盒子的绝对宽度
		var boxWidth = window.innerWidth;
		//盒子中心点的真正位置，默认取盒子宽度的1/2
		var boxRealPos = boxWidth/2;
		//将整个旋转盒子的中心点沿z轴向屏幕内移动盒子宽度的1/2，这样盒子的每一个当前面都会跟屏幕所在的位置重合了
		//将中心点放置于z轴离原点大于盒子宽度1/2的位置，看上去盒子就被缩小了
		$box.css({
			'-webkit-transform': 'translateZ(-'+boxRealPos+'px)'
		});

		/*
		 * 	这里有个小技巧：
		 * 		如果带着滚动条切换页面，看上去太丑，于是想隐藏掉
		 *		具体做法是，切换过程中overflow:hidden 切换结束overflow:auto
		 *		但这样会使得页面在切换之后抖动一下
		 * 		于是先通过设置html overflow scroll获取其宽度
		 * 		再设置overflow hidden获取其宽度
		 *		两者相减得到滚动条的宽度，在overflow hidden的时候加上padding-right这个宽度，就ok了
		 * 		当然这个操作只需要执行一次，所以放到app初始化的时候就可以了
		 */

		//直接打开的页面，直接显示
		if(!from){
			to.$el.css({
				'display': 'block',
				//为何移动端要单独处理？如果overflow中的任何一个设置了任何其他属性，都将导致滑动缓冲失效
				'overflow-x': app.isMobile ? 'initial' : 'hidden',
				'overflow-y': app.isMobile ? 'initial' : 'scroll',
				'padding-right': 0,
				'-webkit-transform': 'translateZ('+boxWidth/2+'px)'
			});
			callback && callback.call(me, from, to, params);
		}
		else{
			//将要切换的view准备好
			from.$el.css({
				'overflow': 'hidden',
				'padding-right': app.scrollBarWidth + 'px',
				'-webkit-transform': 'translateZ('+boxWidth/2+'px)'
			});

			var rotate = -90;
			//点击浏览器的后退，要执行相反的动画
			if(app.backbtnclicked){
				app.backbtnclicked = false;
				rotate = -rotate;
			}
			to.$el.css({
				'display': 'block',
				'overflow': 'hidden',
				'padding-right': app.scrollBarWidth + 'px',
				'-webkit-transform': 'rotateY('+(-rotate)+'deg) translateZ('+boxWidth/2+'px)'
			});
			//一切就绪后，旋转其父容器
			$box.css({
				'-webkit-transform': 'translateZ(-'+boxRealPos+'px) rotateY('+rotate+'deg)',
				'-webkit-transition': 'all .5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
			});
			clearTimeout(this.delay);
			this.delay = setTimeout(function(){
				//存在from和to是同一个view的情况，比如都是用户中心，但用户名不一样，这时候from就不能隐藏了
				if(from.cid != to.cid){
					from.$el.css({
						'display': 'none',
						'-webkit-transform': 'none'
					});
				}
				to.$el.css({
					'overflow-x': app.isMobile ? 'initial' : 'hidden',
					'overflow-y': app.isMobile ? 'initial' : 'scroll',
					'padding-right': 0,
					'-webkit-transform': 'translateZ('+boxWidth/2+'px)'
				});
				$box.css({
					'-webkit-transform': 'translateZ(-'+boxRealPos+'px)',
					'-webkit-transition': 'none'
				});
				callback && callback.call(me, from, to, params);
			}, 600);
		}
	},
	beforeSwitchView: function(from, to, params){
		//下个view的beforeAction
		to.beforeAction(params);
	},
	afterSwitchView: function(from, to, params){
		//下个view的afterAction
		to.afterAction(params);
	},
	getViewByAction: function(action){
		return this.views[action];
	}
});

app.model = Backbone.Model.extend({
	initialize: function(params, action){
		//子类初始化
		this.init(params, action);
	},
	init: function(params, action){
		this.fetch();
	},
	post: function(conf){
		var me = this;
		if(me.pending){
			return false;
		}
		$.ajax({
			url: conf.url || me.url,
			data: conf.data,
			type: 'post',
			dataType: 'json',
			success: function(ret){
				conf.success && conf.success(ret);
			},
			error: function(e){
				conf.error && conf.error(e);
			},
			complete: function(){
				setTimeout(function(){
					me.pending = false;
				}, 500);
				conf.complete && conf.complete();
			}
		});
	}
});

app.view = Backbone.View.extend({
	initialize: function(params, action){
		if(!this.model){
			//必须为当前view的el指定data-model属性，会自动实例化app.model.该属性的model
			var modelName = this.$el.attr('data-model');
			this.model = new app.model[modelName](params, action);
		}
		//子类初始化
		this.init && this.init(params, action);
	},
	beforeAction: function(params){

	},
	afterAction: function(params){

	}
});

//实现进度条控制
var $el = $('#processor');
$(document)
.ajaxStart(function(){
	$el.css({
		width: '30%',
		transition: 'width 10s cubic-bezier(0.22, 0.61, 0.36, 1)'
	});
})
.ajaxComplete(function(){
	$el.css({
		width: '100%',
		transition: 'all 1s cubic-bezier(0.22, 0.61, 0.36, 1)'
	});
	
	setTimeout(function(){
		$el.css({
			opacity: 0
		});
		setTimeout(function(){
			$el.css({
				width: 0,
				opacity: 1,
				transition: 'none'
			});
		}, 1000);
	}, 1000);
});

module.exports = app;