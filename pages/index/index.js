//'use strict';

var $ = require('jquery');
var app = require('app');
var util = require('util');

app.view.index = app.view.extend({

	el: '#page-index',
	events: {
		'click .more': 	'loadMore',
		'click .js-publish': 'publishWater',
		'keyup #water-word': 'checkLen'
	},
	init: function(){
		//监听model修改
		this.listenTo(this.model, 'change:data', this.render);
		//初始化index框架
		this.$el.append(__inline('tpl/index.tpl')());
		//获取灌水
		this.renderWater();
	},
	loadMore: function(e){
		var model = this.model.toJSON();
		//改变model，触发加载
		if(model.data && model.data.date){
			this.model.set('date', model.data.date);
		}
		else{
			e.target.innerHTML = '没有了';
		}
	},
	render: function(){
		this.tpl = this.tpl || __inline('tpl/list.tpl');
		this.$('.js-ul').append(
			this.tpl({
				posts: this.model.toJSON().data.posts
			})
		);
	},
	renderWater: function(){
		var tpl = this.waterTpl = __inline('tpl/water.tpl');
		var $el = this.$('.js-water');
		$.get('/getWater', {len: 4}, function(ret){
			$el.html(tpl(ret.data));
		});
	},
	publishWater: function(e){
		var $ul = this.$('.js-water');
		var el = $(e.currentTarget)[0];
		var me = this;
		if(el.publishing || !this.canPublish){
			return false;
		}
		el.publishing = true;
		$.post('/postwater', {text: this.publishWord}, function(ret){
			el.publishing = false;
			$ul.prepend(
				me.waterTpl({waterArr: [ret.data]})
			);
			var $lis = $ul.find('li');
			if($lis.length > 4){
				$lis.last().remove();
			}

			util.tips(ret.msg);
			me.$wordContainer.val('');
		});
	},
	checkLen: function(e){
		var $el = this.$wordContainer = $(e.currentTarget);
		var $tips = this.$('.js-tips');
		var $num = this.$('.js-num');
		var max = $el.attr('max');
		var word = this.publishWord = $.trim($el.val());
		var len = util.strLen(word);
		var _num = max - len;
		if(_num >= 0){
			$tips.text('还可输入');
			$num.text(_num).removeClass('redb');
			this.canPublish = true;
		}
		else{
			$tips.text('已超过');
			$num.text(Math.abs(_num)).addClass('redb');
			this.canPublish = false;
		}
		if(len == 0){
			this.canPublish = false;
		}
	}

});

app.model.index = app.model.extend({

	url: '/getPosts',
	defaults: {
		date: 0
	},
	init: function(){
		//监听date变化
		this.on('change:date', function(){
			this.fetch({
				data: {
					date: this.get('date')
				}
			});
		});
		//初次请求
		this.set('date', Date.now());
	}

});

