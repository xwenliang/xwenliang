/*
 * @desc 	基于backbone拓展出的单页面应用
 * @date 	2015.06.15
 * @auth 	zooble
 */

'use strict';

var $ = require('jquery');

var Backbone = require('Backbone');

var app = window.app || {};

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

	new this.router();

	Backbone.history.start({
		pushState: true,
		hashChange: false
	});

	//全局视图实例化
	app.$header = app.router.prototype.views['global_header'] = new app.view.global_header();
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
		'water'			: 	'water',
		'newpost'		: 	'newpost',
		'postlist'		: 	'postlist',
		'userlist'		: 	'userlist'
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
	water: function(){
		this.routeChange('water', {
			
		});
	},
	newpost: function(){
		this.routeChange('newpost', {
			
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
		if(!from){
			to.$el.css({
				'display': 'block',
				'-webkit-transform': 'translateZ(500px)'
			});
			callback && callback.call(me, from, to, params);
		}
		else{
			//记忆滚动条位置
			from.scrollPosY = window.scrollY;
			//将要切换的view准备好
			from.$el.css({
				'-webkit-transform': 'translateZ(500px)'
			});
			to.$el.css({
				'display': 'block',
				'-webkit-transform': 'rotateY(90deg) translateZ(500px)'
			});
			//一切就绪后，旋转其父容器
			to.$el.parent().css({
				'-webkit-transform': 'translateZ(-500px) rotateY(-90deg)',
				'-webkit-transition': 'all .5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
			});
			clearTimeout(this.delay);
			this.delay = setTimeout(function(){
				//重置滚动条位置
				window.scrollTo(0, to.scrollPosY || 0);
				//重置样式
				from.$el.css({
					'display': 'none',
					'-webkit-transform': 'none'
				});
				to.$el.css({
					'-webkit-transform': 'translateZ(500px)'
				});
				to.$el.parent().css({
					'-webkit-transform': 'translateZ(-500px)',
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