var $ = require('jquery');
var B = require('Backbone');
var app = require('app');
var util = require('util');

app.view.user = app.view.extend({
	el: '#page-user',
	events: {

	},
	init: function(params, action){
		this.listenTo(this.model, 'change:data', function(){
			this.renderArtical(this.model.get('data'));
			this.renderAuthor(this.model.get('username'));
		});
		//初始化html框架
		this.$el.html(__inline('tpl/html.tpl')());
	},
	renderArtical: function(data){
		var tpl = __inline('tpl/artical.tpl');
		this.$('.js-list').html(tpl(data));
	},
	renderAuthor: function(username){
		var me = this;
		var tpl = __inline('tpl/user.tpl');
		//获取作者信息
		$.get('/getUserInfo', {arr: [username]}, function(ret){
			if(ret.data.userArr && ret.data.userArr.length){
				var user = ret.data.userArr[0];
				user.img = user.img === 'default' ? __uri('../../img/img.jpg') : user.img;
				me.$('.js-user').html(tpl({
					isAuthor: ret.data.curUser.username === user.username ? true : false,
					user: user
				}));
			}
		});
	}
});

app.model.user = app.model.extend({
	url: '/getUserPosts',
	init: function(params, action){
		//监听model的username
		this.on('change:username', function(){
			this.fetchData(this.get('username'));
		});
		this.fetchData(params.username);
	},
	fetchData: function(username){
		this.fetch({
			data: {username: username}
		});
	}
});