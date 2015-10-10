
'use strict';

var $ = require('jquery');

var app = require('app');

var util = require('util');

app.view.category = app.view.extend({

	el: '#page-category',
	events: {

	},
	init: function(){
		this.listenTo(this.model, 'change:data', this.render);
	},
	render: function(){
		var data = this.model.toJSON();
		var tpl = __inline('tpl/category.tpl');
		this.$el.html(tpl(data.data));
	}

});

app.model.category = app.model.extend({

	url: '/getPosts',
	init: function(params, action){
		//获取分类文章
		this.getData(params.category);
		this.on('change:category', function(){
			this.getData(this.get('category'));
		});
	},
	getData: function(category){
		this.fetch({
			data: {
				category: category,
				status: 'publish',
				examine: 1
			}
		});
	}

});