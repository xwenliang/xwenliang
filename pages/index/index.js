//'use strict';

var app = require('app');

app.pageview.index = app.view.extend({

	el: '#page-index',
	events: {
		'click .more': 	'loadMore'
	},
	init: function(){
		//监听model修改
		this.listenTo(this.model, 'change:data', this.render);
		//初始化index框架
		this.$el.append(__inline('tpl/index.tpl')());
	},
	loadMore: function(e){
		var model = this.model.toJSON();
		//改变model，触发加载
		if(model.data && model.data.date){
			this.model.set('date', model.data.date);
		}
		else{
			e.target.innerHTML = '没有了'
		}
	},
	render: function(){
		this.tpl = this.tpl || __inline('tpl/list.tpl');
		this.$el.find('.js-ul').append(
			this.tpl({
				posts: this.model.toJSON().data.posts
			})
		);
	}

});

app.pagemodel.index = app.model.extend({

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

