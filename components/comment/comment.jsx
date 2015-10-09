
'use strict';

var React = require('react');
var util = require('util');
var $ = require('jquery');
//polyfill for Promise
var lie = require('lie');

var Item = React.createClass({
	render: function(){
		var comment = this.props.comment;
		var userItem = comment.isRegisted ? <a href={"/u/" + comment.user}>{comment.user}</a> : comment.user;
		return (
			<li>
				<span className="c-name">{userItem}</span>
				<span className="c-text">：{comment.text}</span>
				<span className="c-date">{comment.date}</span>
			</li>
		);
	}
});

/*
 * @props:
 * 		className			评论框的class
 *		title 				评论框的标题，没有该值则不显示title
 *		maxLen 				输入框最多允许输入字符数
 *		showListNum 		只显示前多少条数据，没有该值则全部显示
 * 		getMoreUrl 			更多数据的页面地址，给首页用，没有该值则不显示更多按钮
 * 		publishUrl			发布数据的地址
 * 		publishData 		发布数据的附加参数(用户输入内容已自动获取了评论框中的textarea的值)
 * 		listData 			初始数据
 * 		reversed 			数据是否倒序显示，默认正序
 * 		showListTotal 		显示数据统计，没有该值则不显示
 */
var Comment = React.createClass({
	getInitialState: function(){
		var maxLen = this.props.maxLen;
		var state = {
			number: maxLen,
			errText: '还可输入',
			errClass: '',
			comment: this.props.listData,
			commentLength: this.props.listData.length
		};
		return state;
	},
	componentWillMount: function(){
		//插件将要挂载
	},
	render: function(){
		var items = [];
		this.state.comment.map(function(comment, index){
			items.push(<Item key={index} comment={comment}/>);
		});
		var total = this.props.showListTotal ? <span className="c-total">({this.state.commentLength})</span> : null;
		var title = this.props.title ? <h6 className="c-tit">{this.props.title}{total}</h6> : null;
		var getMoreBtn = this.props.getMoreUrl ? <a className="c-all gray" href={this.props.getMoreUrl}>查看所有</a> : null;

		return (
			<div className={"comment " + this.props.className}>
				{title}
				<ul className="c-ul">
					{items}
				</ul>
				<div className="c-input">
					<textarea onInput={this.inputHandler} onKeyDown={this.enterKeyPublish} />
					<div className="c-btns ib-wrap">
						<button className="c-pub green" onClick={this.publish}>发表</button>
						{getMoreBtn}
						<span className="c-tips">
							<em>{this.state.errText}</em>
							<em className={"c-num " + this.state.errClass}>{Math.abs(this.state.number)}</em>个字
						</span>
					</div>
				</div>
			</div>
		);
	},
	inputHandler: function(e){
		var state = {
			number: this.props.maxLen - util.strLen(e.target.value)
		};
		if(state.number < 0){
			state.errClass = 'c-red';
			state.errText = '已超过';
		}
		else{
			state.errClass = '';
			state.errText = '还可输入';
		}
		
		this.setState(state);
	},
	publish: function(e){
		var el = e.currentTarget;
		var parent = this.getDOMNode();
		var $input = $(parent).find('textarea');
		var val = $.trim($input.val());
		var publishData = $.extend({}, {text: val}, this.props.publishData);
		if(el.ajaxing || !val || util.strLen(val) > this.props.maxLen){
			return;
		}
		el.ajaxing = true;

		$.ajax({
			url: this.props.publishUrl,
			data: publishData,
			type: 'post',
			dataType: 'json',
			context: this,
			success: function(ret){
				//首页的灌水，只显示四条，所以多于四条的时候要做下处理
				if(this.props.showListNum && this.state.comment.length > this.props.showListNum - 1){
					this.state.comment.pop();
				}
				var comment = this.props.reversed ? [ret.data].concat(this.state.comment) : this.state.comment.concat([ret.data]);
				//增加评论和评论数
				this.setState({
					comment: comment,
					commentLength: ++this.state.commentLength
				});
				//删除输入框中已发布的内容
				$input.val('');
				this.setState({number: this.props.maxLen});
			},
			complete: function(){
				el.ajaxing = false;
			}
		});
	},
	enterKeyPublish: function(e){
		if(e.keyCode === 13){
			this.publish(e);
			e.preventDefault();
		}
	}
});

module.exports = Comment;