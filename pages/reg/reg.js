'use strict';

var app = require('app');

app.pageview.reg = app.view.extend({

	el: '#page-reg',
	events: {

	},
	init: function(){
		console.log(this.model);
	}

});

app.pagemodel.reg = app.model.extend({

	url: '/reg',
	init: function(){
		
	}

});