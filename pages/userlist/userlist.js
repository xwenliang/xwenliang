
'use strict';

var $ = require('jquery');

var app = require('app');

var util = require('util');

app.view.userlist = app.view.extend({

	el: '#page-userlist',
	events: {
		'change .js-power': 'changePower'
	},
	init: function(){
		this.listenTo(this.model, 'change:data', this.render);
	},
	render: function(){
		var tpl = __inline('tpl/userlist.tpl');
		var data = this.model.toJSON().data;
		this.$el.html(tpl(data));
	},
	//每次进来，触发刷新
	beforeAction: function(){
		this.model.set('date', Date.now());
	},
	//修改权限
	changePower: function(e){
		var $el = $(e.currentTarget);
		var data = util.analyseData($el, 'data-post');
		var val = $el.val();
		var username = $el.closest('.item').find('.js-username').text();

		$.post(data.url, {
			username: username,
			power: val
		}, function(data){
			util.tips(data.msg);
		});
	}

});

app.model.userlist = app.model.extend({

	url: '/getAllUser',
	defaults: {
		date: 0
	},
	init: function(){
		//监听date变化
		this.on('change:date', function(){
			this.fetch();
		});
	}

});