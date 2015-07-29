
'use strict';

var $ = require('jquery');
var B = require('Backbone');
var app = require('app');
var util = require('util');

app.view.reg = app.view.extend({

	el: '#page-reg',
	events: {
		'click .js-btn-reg': 'doReg'
	},
	init: function(){
		this.$el.append(__inline('tpl/reg.tpl')());
	},
	doReg: function(){
		//获取value，并触发validate
		this.model.set({
			'username': $.trim(this.$el.find('#username').val()),
			'password': $.trim(this.$el.find('#password').val()),
			'password_r': $.trim(this.$el.find('#password_r').val())
			
		}, { 'validate': true });
		//未通过
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
					app.$header.trigger('changeLogStatus', {from: 'reg'});
				}
			}
		});
		this.model.pending = true;
	}

});

app.model.reg = app.model.extend({

	url: '/reg',
	init: function(){

	},
	validate: function(attributes){
		if(!attributes.username){
			return '请输入用户名';
		}
		else if(!attributes.password){
			return '请输入密码';
		}
		else if(attributes.password != attributes.password_r){
			return '两次输入密码不一致';
		}
	}

});