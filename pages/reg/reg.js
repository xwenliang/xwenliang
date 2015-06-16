//'use strict';

var app = require('app');

app.pageview.reg = app.view.extend({

	el: '#page-reg',
	events: {
		'click .js-btn-reg': 'doReg'
	},
	init: function(){
		this.$el.append(__inline('tpl/reg.tpl')());
	},
	doReg: function(){
		this.model.post({
			data: {
				'username': 'abc',
				'password': '123',
				'password_r': '123'
			},
			success: function(ret){
				console.log(ret);
			}
		});
		this.model.pending = true;
	}

});

app.pagemodel.reg = app.model.extend({

	url: '/reg',
	init: function(){

	}

});