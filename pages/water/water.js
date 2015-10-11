
'use strict';

var $ = require('jquery');
var app = require('app');
app.view.water = app.view.extend({

	el: '#page-water',
	init: function(params, action){
		this.listenTo(this.model, 'change:data', this.render);
	},
	render: function(){
		var tpl = __inline('tpl/water.tpl');
		var data = this.model.toJSON().data;
		$.each(data.list, function(key, list){
			var username = list['user'];
			data.list[key].href = username.indexOf('*') > 0 ? 'javascript:' : '/u/' + list['user'];
			data.list[key].className = username.indexOf('*') > 0 ? 'reset-cursor' : '';
		});
		this.$el.html(tpl(data));
		this.setWaterUserAvatar(data);
	},
	beforeAction: function(params){
		//改变model触发渲染
		this.model.set('time', Date.now());
	},
	afterAction: function(params){

	},
	setWaterUserAvatar: function(data){
		//查询头像
		var me = this;
		var lists = data.list || [];
		var userFilter = {};
		var userArr = [];
		$.each(lists, function(key, list){
			userFilter[list['user']] = 1;
		});
		for(var i in userFilter){
			userArr.push(i);
		}
		$.ajax({
			url: '/getUserInfo',
			type: 'get',
			data: { arr: userArr },
			success: function(ret){
				if(!ret.data.userArr.length){
					return false;
				}
				$.each(ret.data.userArr, function(key, user){
					if(user.img != 'default'){
						me.$('[title='+user.username+']').css('background-image', 'url('+ user.img +')');
					}
				});
			}
		});
	}

});
app.model.water = app.model.extend({
	url: '/getWater',
	init: function(){
		this.on('change:time', function(){
			this.fetch();
		});
		this.set('time', Date.now());
	}
});