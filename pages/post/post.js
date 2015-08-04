
'use strict';

var $ = require('jquery');
var app = require('app');
var util = require('util');

app.view.post = app.view.extend({

	el: '#page-post',
	events: {
		'click #like': 'like'
	},
	init: function(params, action){
		//监听数据修改，重新渲染
		this.listenTo(this.model, 'change:data', this.getUserInfo);
	},
	getUserInfo: function(){
		if(!this.model.isValid()){
			return util.tips(this.model.validationError);
		}
		//获取用户信息
		var me = this;
		var postInfo = this.model.toJSON().data.post;
		//清空之前的节点
		this.$el.html('');
		//重置滚动条位置
		this.scrollPosY = 0;

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
				me.getLikeUserInfo(postInfo.like);
			}
		});

	},
	render: function(data){
		var me = this;
		var tpl = __inline('tpl/post.tpl');
		this.$el.html(tpl(data));
		//评论
		var $waterUl = this.$('.water-ul');
		util.comments(function(ta, data){
			if(data.code === 1){
				me.$('.p-c-nodata').remove();
				ta.val('').keyup();
				var str = $('<li class="ib-wrap whide">\
						<span class="wname marr10">'+data.data.user+':</span>\
						<span class="wtext marr20">'+data.data.text+'</span><br>\
						<span class="wdate">'+data.data.date+'</span>\
					</li>');
				var total = $('.p-c-t em');
				total.text(parseInt(total.text(), 10) + 1);
				$waterUl.append(str);
				str.fadeIn(500);
			}
		});
	},
	getLikeUserInfo: function(users){
		if(!users.length){
			return;
		}
		$.ajax({
			url: '/getUserInfo',
			type: 'get',
			data: { arr: users },
			dataType: 'json',
			success: function(ret){
				if(!ret.data.userArr){
					return;
				}

				ret.data.userArr.forEach(function(user){
					this.$('.liked-li a[title='+user.username+']').css({
						'background': 'url('+ user.img +') center center',
						'background-size': 'cover'
					});
				});
			}
		});
	},
	beforeAction: function(){

	},
	afterAction: function(){

	},
	like: function(e){
		var me = this;
		var $el = $(e.currentTarget);
		var data = util.analyseData($el, 'data-post');

		this.model.post({
			url: '/like',
			data: data,
			success: function(ret){
				util.tips(ret.msg);
				if(ret.code === 1){
					var html = '';
					if(!data.user){
						html = '<span class="liked-li"><span title="'+ret.data.user+'"></span></span>';
					}
					else{
						html = '<span class="liked-li">\
									<a href="/u/'+ data.user +'"\
									title="'+ data.user +'" target="_blank"\
									style="background: url('+ data.img +') center center;\
									background-size: cover;"></a>\
								</span>';
					}
					$el.text(parseInt($el.text())+1);
					me.$('.liked-ul').prepend(html);
				}
			}
		});
		this.model.pending = true;
	}

});

app.model.post = app.model.extend({

	url: '/getPostInfo',
	init: function(params, action){
		//获取文章数据
		this.getData(params.id);
		this.on('change:id', function(){
			this.getData(this.get('id'));
		});
	},
	getData: function(id){
		this.fetch({
			data: {postId: id}
		});
	},
	validate: function(attrs){
		if(attrs.code === -1){
			return '参数错误~~!';
		}
	}

});