
'use strict';

var $ = require('jquery');
var app = require('app');
var util = require('util');
var React = require('react');

app.view.index = app.view.extend({

	el: '#page-index',

	events: {
		'click .more': 	'loadMore'
	},
	init: function(){
		//监听model修改
		this.listenTo(this.model, 'change:data', this.render);
		
		//灌水组件
		var Comment = require('components/comment');
		$.ajax({
			url: '/getWater',
			data: {len: 4},
			type: 'get',
			dataType: 'json',
			context: this,
			success: function(ret){
				React.render(
					<Comment 
						className="index-comment"
						title="灌水"
						//输入框最多允许输入70字符
						maxLen="70"
						//只显示前4条数据
						showListNum="4"
						//更多数据的页面地址
						getMoreUrl="/water"
						//发布数据的地址
						publishUrl="/postwater"
						//初始数据
						listData={ret.data.list}
						reversed={true} />,
					document.getElementById('water')
				);
			}
		});

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
					date: this.get('date'),
					len: 4,
					examine: 1,
					status: 'publish'
				}
			});
		});
		//初次请求
		this.set('date', Date.now());
	}

});