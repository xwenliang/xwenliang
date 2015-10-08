
'use strict';

var $ = require('jquery');

var app = require('app');

var util = require('util');

app.view.postlist = app.view.extend({

	el: '#page-postlist',
	events: {
		'change .js-status': 'changeStatus',
		'click .js-del': 'delPost'
	},
	init: function(){
		this.listenTo(this.model, 'change:data', this.render);
	},
	render: function(){
		var tpl = __inline('tpl/postlist.tpl');
		var data = this.model.toJSON().data;
		this.$el.append(tpl(data));
	},
	//每次进来，触发刷新
	beforeAction: function(){
		this.model.set('date', Date.now());
	},
	//文章审核
	changeStatus: function(e){
		var $el = $(e.currentTarget);
		var data = util.analyseData($el, 'data-post');
		var val = $el.val();

		$.post(data.url, {
			_id: data._id,
			examine: val
		}, function(data){
			util.tips(data.msg);
		});
	},
	//删除文章
	delPost: function(e){
		if(!confirm('确定要删除该文章吗？')){
			return false;
		}

		var $el = $(e.currentTarget);
		var data = util.analyseData($el, 'data-post');
		$.post(data.url, {
			_id: data._id
		}, function(data){
			$el.closest('.item').css('borderColor', '#55b131').delay(500).fadeOut(500);
			util.tips(data.msg);
		});
	}

});

app.model.postlist = app.model.extend({

	url: '/getPosts',
	defaults: {
		date: 0
	},
	init: function(){
		//监听date变化
		this.on('change:date', function(){
			this.fetch({
				data: {
					status: 'publish'
				}
			});
		});
	}

});