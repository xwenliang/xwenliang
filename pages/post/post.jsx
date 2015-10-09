
'use strict';

var $ = require('jquery');
var app = require('app');
var util = require('util');
var React = require('react');
var zEditor = require('zEditor');

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
		var Comment = require('components/comment');
		React.render(
			<Comment 
				className="post-comment"
				title="评论"
				maxLen="200"
				//发布数据的地址
				publishUrl="/comment"
				//发布数据的附加参数
				publishData={{_id: data.post._id}}
				//初始数据
				listData={data.post.comments}
				showListTotal={true} />,
			document.getElementById('comments')
		);

		//要加延时，否则渲染出来的时候 此webview还处于rotate(90deg)的状态，会影响aceEditor的渲染计算
		zEditor.prototype.revertAceEditor({
			parent: this.$el,
			language: 'javascript',
			readOnly: false
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
	//,
	//使用流氓手段，每次重新打开该页面就更新
	// beforeAction: function(){
	// 	this.model.set('time', Date.now());
	// }
});

app.model.post = app.model.extend({

	url: '/getPostInfo',
	init: function(params, action){
		//获取文章数据
		// this.on('change:time', function(){
		// 	this.getData(this.get('id'));
		// });
		this.on('change:id', function(){
			this.getData(this.get('id'));
		});
		this.getData(params.id);
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