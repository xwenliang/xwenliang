var $ = require('jquery');
var app = require('app');
app.view.water = app.view.extend({

	el: '#page-water',
	init: function(params, action){
		this.listenTo(this.model, 'change:data', this.render);
	},
	render: function(){
		var tpl = __inline('tpl/water.tpl');
		this.$el.html(tpl(this.model.toJSON().data));
	},
	beforeAction: function(params){
		//改变model触发渲染
		this.model.set('time', Date.now());
	},
	afterAction: function(params){
		
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