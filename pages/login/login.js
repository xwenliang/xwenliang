
var $ = require('jquery');
var app = require('app');

app.pageview.login = app.view.extend({

	el: '#page-login',
	events: {},
	init: function(){
		this.$el.append(__inline('tpl/login.tpl')());
	}

});

app.pagemodel.login = app.model.extend({
	url: '/login',
	init: function(){

	},
	validate: function(attrs){
		
	}
});