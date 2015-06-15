/*
 * @desc 	基于backbone拓展出的单页面应用
 * @date 	2015.06.15
 * @auth 	zooble
 */

'use strict';

var $ = require('Zepto');

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

		var extras = {time: Date.now()};
		window.history.pushState(extras, '', this.href);
		$(window).trigger('popstate');
		e.stopPropagation();
		e.preventDefault();
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
		'reg'	: 	'reg'
	},
	index: function(){
		this.routeChange('index');
	},
	login: function(){

	},
	reg: function(){
		this.routeChange('reg');
	},
	routeChange: function(router){
		var view = this.views[router];
		if(!view){
			this.views[router] = new app.pageview[router]();
		}
	}
});

app.model = Backbone.Model.extend({
	initialize: function(){
		//子类初始化
		this.init && this.init();
	}
});

app.collection = Backbone.Collection.extend({
	initialize: function(){

	}
});

app.view = Backbone.View.extend({
	initialize: function(){
		if(!this.model){
			var modelName = this.$el.attr('data-model');
			this.model = new app.pagemodel[modelName]();
		}
		//子类初始化
		this.init && this.init();
	}
});

app.pageview = {};
app.pagemodel = {};

module.exports = app;