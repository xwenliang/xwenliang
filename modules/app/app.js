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
	new this.router();
	Backbone.history.start({
		pushState: true,
		hashChange: false
	});
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
};

app.router = Backbone.Router.extend({
	initialize: function(){
		//保存视图
		this.views = {};
	},
	routes: {
		''		: 	'index',
		'login'	: 	'login',
		'reg'	: 	'reg',
		'p/:id'	: 	'post'
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
	post: function(id){
		this.routeChange('post', {
			id: id
		});
	},
	routeChange: function(action, params){
		var view = this.views[action];
		if(!view){
			view = this.views[action] = new app.pageview[action](params, action);
		}
		this.previousView = this.currentView;
		this.previousHash = this.currentHash;
		this.currentView = view;
		this.currentHash = window.location.hash;
		//切换页面前
		this.boforeSwitchPage(this.previousView, this.currentView);
		//切换页面
		this.switchPage(this.previousView, this.currentView, function(){
			//切换页面后
			this.afterSwitchPage(this.previousView, this.currentView);
		});
		
	},
	switchPage: function(from, to, callback){
		//todo 简单的显示隐藏，待优化
		from && from.$el.addClass('hide');
		to && to.$el.removeClass('hide');
		callback && callback.call(this, from, to);
	},
	boforeSwitchPage: function(from, to){

	},
	afterSwitchPage: function(from, to){
		//console.log(from, to);
	}
});

app.model = Backbone.Model.extend({
	initialize: function(params, action){
		//子类初始化
		this.init && this.init(params, action);
	},
	post: function(conf){
		var me = this;
		if(me.pending){
			return false;
		}
		$.ajax({
			url: me.url,
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

app.collection = Backbone.Collection.extend({
	initialize: function(){

	}
});

app.view = Backbone.View.extend({
	initialize: function(params, action){
		if(!this.model){
			var modelName = this.$el.attr('data-model');
			this.model = new app.pagemodel[modelName](params, action);
		}
		//子类初始化
		this.init && this.init(params, action);
	}
});

app.pageview = {};
app.pagemodel = {};

module.exports = app;