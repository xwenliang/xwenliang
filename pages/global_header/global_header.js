app.view.global_header =  app.view.extend({

	el: '#page-header',
	events: {

	},
	init: function(){
		var me = this;
		this.model.on('change:data', function(){
			me.render();
		});
	},
	render: function(){
		var tpl = __inline('tpl/global_header.tpl');
		var data = this.model.toJSON();
		this.$el.html(
			tpl({
				loginStatus: data.data.loginStatus
			})
		);
	}

});

app.model.global_header = app.model.extend({

	url: '/checkLogin',
});