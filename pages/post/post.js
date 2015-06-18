var $ = require('jquery');
var app = require('app');
var util = require('util');

app.pageview.post = app.view.extend({

	el: '#page-post',
	events: {

	},
	init: function(params, action){
		this.listenTo(this.model, 'change:data', this.getUserInfo);
	},
	getUserInfo: function(){
		if(!this.model.isValid()){
			return util.tips(this.model.validationError);
		}
		//获取用户信息
		var me = this;
		var postInfo = this.model.toJSON().data.post;
		$.ajax({
			url: '/getUserInfo',
			type: 'get',
			data: { arr: [postInfo.author] },
			dataType: 'json',
			success: function(ret){
				me.render({
					post: postInfo,
					author: ret.data.userArr[0],
					user: me.model.toJSON().data.user
				});
			}
		});
	},
	render: function(data){
		var tpl = __inline('tpl/post.tpl');
		this.$el.append(tpl(data));
	}

});

app.pagemodel.post = app.model.extend({

	url: '/getPostInfo',
	init: function(params, action){
		//获取文章数据
		this.fetch({
			data: {postId: params.id}
		});
	},
	validate: function(attrs){
		if(attrs.code === -1){
			return '参数错误~~!';
		}
	}

});