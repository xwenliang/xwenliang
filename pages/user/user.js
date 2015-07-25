var $ = require('jquery');
var B = require('Backbone');
var app = require('app');
var util = require('util');

app.view.user = app.view.extend({
	el: '#page-user',
	events: {
		'click .js-editProfile': 'editProfile',
		'click .js-myinfo .mask': 'uploadImg'
	},
	init: function(params, action){
		this.listenTo(this.model, 'change:data', function(){
			this.renderArtical(this.model.get('data'));
			this.renderAuthor(this.model.get('username'));
		});
		//初始化html框架
		this.$el.html(__inline('tpl/html.tpl')());
		//增加右侧个人信息编辑按钮
		util.tools({
			module: '.js-myinfo',
			edi: '<button class="green js-editProfile">编辑</button>'
		});
	},
	renderArtical: function(data){
		var tpl = __inline('tpl/artical.tpl');
		this.$('.js-list').html(tpl(data));
	},
	renderAuthor: function(username){
		var me = this;
		var tpl = __inline('tpl/user.tpl');
		//获取作者信息
		$.get('/getUserInfo', {arr: [username]}, function(ret){
			if(ret.data.userArr && ret.data.userArr.length){
				var user = ret.data.userArr[0];
				user.img = user.img === 'default' ? __uri('../../img/img.jpg') : user.img;
				me.$('.js-user').html(tpl({
					isAuthor: ret.data.curUser.username === user.username ? true : false,
					user: user
				}));
			}
		});
	},
	editProfile: function(e){
		var me = this;
		var $tar = $(e.currentTarget);
		var $par = $tar.closest('.js-myinfo');
		if($tar.text() == "编辑"){
			var $mask = $('<div class="mask">点击上传</div>');
			$mask.css({
				'position': 'absolute',
				'left': '-10px',
				'top': '-10px',
				'width': '100px',
				'height': '100px',
				'background': 'rgba(0, 0, 0, 0.4)',
				'color': '#fff',
				'line-height': '100px',
				'text-align': 'center',
				'cursor': 'pointer'
			});
			!$par.find('.mask').length
			&& $par.find(".a_img")
			.css('position', 'relative')
			.append($mask);

			$par.find(".a_des")
			.css({'border': '1px solid #55b131', 'padding': '4px 5px'})
			.attr('contenteditable', true)
			.focus();
			$tar.text('保存');
		}
		else{
			var defaultVal = $par.find('.a_des').attr('data-default');
			var defaultImg = $par.find('.a_img').attr('data-default');
			var curVal = $par.find('.a_des').text();
			var curImg = $('.a_img').attr('data-img');
			if(defaultVal != curVal || defaultImg != curImg){
				//保存信息
				me.saveProfile(curVal, curImg);
			}
			$par.find('.mask').remove();
			$par.find('.a_des')
			.text(curVal)
			.css({'border': 'none', 'padding': '5px'})
			.removeAttr('contenteditable');
			$tar.text('编辑');
			return;
		}
	},
	uploadImg: function(e){
		//上传图片
		util.imgUpLoad({
			url: '/uploadImg',
			name: 'img',
			postData: {type: 'avatar'},
			progressfn: function(ev){
				var sTemp = parseInt((ev.loaded/ev.total)*100) + "%";
				$('.mask').text(sTemp);
			},
			err: function(err){//图片上传前的预判断 不符合条件的回调
				util.tips(err);
			},
			success: function(data){
				if(data.code != 1){
					return util.tips(data.msg || '请求错误~');
				}
				var src = '/' + data.data.src.replace('\\', '/');
				$('.a_img').css({
					'background': 'url(' + src + ') center center',
					'background-size': 'cover'
				}).attr('data-img', src);
				$('.mask').text('点击上传');
			},
			error: function(data){
				$('.mask').text('点击上传');
				return util.tip(data.msg);
			}
		});
	},
	saveProfile: function(val, img){
		$.post('/updateUser', {
			describe: val,
			imgSrc: img
		},
		function(ret){
			if(ret.code = 1){
				defaultVal = img;
				defaultImg = img;
			}
			util.tips(ret.msg);
		});
	}
});

app.model.user = app.model.extend({
	url: '/getUserPosts',
	init: function(params, action){
		//监听model的username
		this.on('change:username', function(){
			this.fetchData(this.get('username'));
		});
		this.fetchData(params.username);
	},
	fetchData: function(username){
		this.fetch({
			data: {username: username}
		});
	}
});