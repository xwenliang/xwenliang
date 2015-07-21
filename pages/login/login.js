
var $ = require('jquery');
var app = require('app');
var util = require('util');
var B = require('Backbone');

app.view.login = app.view.extend({

	el: '#page-login',
	events: {
		'click .js-btn-switch': 'switchLoginType',
		'click .js-btn-login': 'login'
	},
	init: function(){
		var me = this;
		//初始化页面框架
		this.$el.append(__inline('tpl/login.tpl')());
		//获取是否登录过
		var username = util.cookieParser('username');
		if(username){
			var $remember = this.$el.find('.remember_login').addClass('cur').fadeIn(300);
			var ajax = $.ajax({
				url: '/getUserInfo',
				type: 'get',
				data: {arr: [username]},
				dataType: 'json',
				timeout: 100000
			});
			ajax.then(function(ret){
				var user = ret.data.userArr[0] || {};
				user.img = user.img === 'default' ? __uri('../../img/img.jpg') : user.img;
				$remember.find('.remember_img').css('backgroundImage', 'url(' + user.img + ')');
				$remember.find('.remember_user').text(user.username);
			});
		}
		else{
			me.$el.find('.regbox').addClass('cur').fadeIn(300);
		}
	},
	switchLoginType: function(e){
		var me = this;
		var $tar = $(e.currentTarget).closest('.box');
		$tar.animate({
			'opacity': 0,
			'margin-left': $(window).width()/2 - 50 + 'px'},
			300,
			function(){
				$tar.remove();
				me.$el.find('.regbox').addClass('cur').fadeIn(300);
			}
		);
	},
	login: function(e){
		var $tar = $(e.currentTarget).closest('.box');
		var username, password;
		if($tar.hasClass('regbox')){
			username = $.trim($tar.find('#username').val());
		}
		else{
			username = $tar.find('.remember_user').text();
		}
		password = $tar.find('input[name=password]').val();

		this.model.set({
			username: username,
			password: password
		}, { 'validate': true });
		if(this.model.validationError){
			return util.tips(this.model.validationError);
		}
		this.model.post({
			data: this.model.toJSON(),
			success: function(ret){
				util.tips(ret.msg);
				if(ret.code == 1){
					B.history.navigate(ret.data.redirect, { 'trigger': true });
					//通知header视图
					app.$header.trigger('changeLogStatus', {from: 'login'});
				}
			}
		});
		this.model.pending = true;
	}

});

app.model.login = app.model.extend({
	url: '/login',
	init: function(){

	},
	validate: function(attrs){
		if(!attrs.username){
			return '请输入用户名';
		}
		else if(!attrs.password){
			return '请输入密码';
		}
	}
});