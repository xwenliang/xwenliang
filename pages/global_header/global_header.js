var $ = require('jquery');

app.view.global_header = app.view.extend({

	el: '#page-header',
	events: {
		'click .js-logout': 'logout'
	},
	init: function(){
		var me = this;
		//登录或注册的时候重新检查登录状态
		this.on('changeLogStatus', function(params){
			this.model.fetch({
				url: '/checkLogin'
			});
		});
		//所有登录状态的变化，都会走到这里
		this.model.on('change:data', function(){
			me.render();
		});
	},
	render: function(){
		var tpl = __inline('tpl/global_header.tpl');
		var data = this.model.toJSON();
		this.$('#header-wrap').html(
			tpl({
				loginStatus: data.data.loginStatus
			})
		);
	},
	logout: function(){
		this.model.fetch({
			url: '/logout'
		});
	}

});

app.model.global_header = app.model.extend({

	url: '/checkLogin'
	
});