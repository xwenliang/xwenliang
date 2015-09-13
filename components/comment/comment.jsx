
'use strict';

var React = require('react');
var util = require('util');
var $ = require('jquery');

var Item = React.createClass({
	render: function(){
		var comment = this.props.comment;
		var userItem = comment.user.indexOf('*') > 0 ? comment.user : <a href={"/u/" + comment.user}>{comment.user}</a>;
		return (
			<li className="ib-wrap">
				<span className="wname marr10">{userItem}</span>
				<span className="wtext marr20">{comment.text}</span><br/>
				<span className="wdate">{comment.date}</span>
			</li>
		);
	}
});

var Comment = React.createClass({
	componentWillMount: function(){
		//获取之前的评论
		$.ajax({
			url: '/getWater',
			data: {len: 4},
			type: 'get',
			dataType: 'json',
			context: this,
			success: function(ret){
				this.setState({comment: ret.data.waterArr});
			}
		});
	},
	getInitialState: function(){
		var maxLen = this.props.maxLen;
		var state = {
			number: maxLen,
			errText: '还可输入',
			errClass: '',
			comment: []
		};
		return state;
	},
	render: function(){
		var items = [];
		this.state.comment.map(function(comment, index){
			items.push(<Item key={index} comment={comment}/>);
		});

		return (
			<div className="comment">
				<p className="tit">{this.props.title}</p>
				<ul className="water-ul mart10 marb10 js-water">
					{items}
				</ul>
				<div className="water-input ib-wrap">
					<textarea id="comment" className="marb10" onInput={this.inputHandler} onKeyDown={this.enterKeyPublish} />
					<span className="water-tips">
						<em className="pre-num">{this.state.errText}</em>
						<em className={"num " + this.state.errClass}>{Math.abs(this.state.number)}</em>个字
					</span>
					<a className="gray marl10" href="/water">查看所有</a>
					<button className="green marl10" onClick={this.publish}>发表</button>
				</div>
			</div>
		);
	},
	inputHandler: function(e){
		var state = {
			number: 70 - util.strLen(e.target.value)
		};
		if(state.number < 0){
			state.errClass = 'redb';
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
		var val = $.trim($('#comment').val());
		if(el.ajaxing || !val){
			return;
		}
		el.ajaxing = true;

		$.ajax({
			url: '/postwater',
			data: {
				text: val
			},
			type: 'post',
			dataType: 'json',
			context: this,
			success: function(ret){
				if(this.state.comment.length > 3){
					this.state.comment.pop();
				}
				this.setState({comment: [ret.data].concat(this.state.comment)});
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
			e.currentTarget.value = '';
		}
	}
});

module.exports = Comment;