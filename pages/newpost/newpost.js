
'use strict';

var $ = require('jquery');
var B = require('Backbone');
var app = require('app');
var util = require('util');
var zEditor = require('zEditor');
app.view.newpost = app.view.extend({

	el: '#page-newpost',
	events: {
		'click .js-post>a': 'sendPost'
	},
	init: function(params, action){
		var me = this;
		this.tpl = __inline('tpl/newpost.tpl');
		//新建文章
		if(params.id === 'new'){
			this.$el.html(this.tpl());
			this.rendCategory();
		}
		else{
			//传来了id，需要进行文章编辑
			this.listenTo(this.model, 'change:data', this.render);
		}
		
		//初始化编辑器，因为切页动画，页面不会立即展示，编辑器工具栏的位置计算会有问题，所以延时
		setTimeout(function(){
			new zEditor({container: '#zEditor'});
		}, 1000);
	},
	render: function(){
		var data = this.model.toJSON().data;
		this.$el.html(this.tpl(data));

		this.rendCategory(data.post.category);
	},
	rendCategory: function(category){
		var me = this;
		$.get('/getCategory', function(ret){
			var options = ret.data.categorys;
			var arr = [];
			for(var i=0,len=options.length;i<len;i++){
				if(category && category === options[i]['name']){
					arr.push('<option selected="selected">'+options[i]['name']+'</option>');
				}
				else{
					arr.push('<option>'+options[i]['name']+'</option>');
				}
			}
			me.$el.find('#category').html(arr.join(''));
		});
	},
	sendPost: function(e){
		var me = this;
		var el = $(e.currentTarget)[0];
		var $el = $(el);
		if(el.clicked){
			return false;
		}
		el.clicked = true;
		var data = util.analyseData($el, 'data-post');
		var title = this.$("#title").val();
		var err = '';
		var tagsArr = this.$('#tags').val().split(',');
		//去重复标签
		var tagsObj = {};
		var tags = [];
		$.each(tagsArr, function(key, val){
			var val = $.trim(val);
			val && (tagsObj[val] = 1);
		});
		$.each(tagsObj, function(key, val){
			tags.push(key);
		});

		if(!tags.length){
			err = '请输入标签';
		}
		if(!title){
			err = '请输入标题';
		}

		if(err){
			util.tips(err);
			el.clicked = false;
			return false;
		}
		
		$.ajax({
			url: data.url,
			type: 'POST',
			data: {
				postId: this.model.get('id'),
				title: title,
				content: this.$('.workplace').html(),
				category: this.$('#category').val(),
				status: data.status,
				tags: tags
			},
			success: function(data){
				util.tips({
					html: data.msg,
					closeCallback: function(){
						if(data.code != 1){
							return;
						}
						data.data.redirect && B.history.navigate(data.data.redirect, { 'trigger': true });
					}
				});
				el.clicked = false;
			},
			error: function(){
				el.clicked = false;
			}
		});
	}

});
app.model.newpost = app.model.extend({

	url: '/getPostInfo',
	init: function(params, action){
		//新增
		if(params.id === 'new'){

		}
		//编辑
		else{
			this.fetch({
				data: {'postId': params.id}
			});
		}
	}

});