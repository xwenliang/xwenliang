/**
 * @desc 基于ace封装的代码编辑器
 * @date 2015-08-25
 * @auth zooble
 */

'use strict';

var $ = require('jquery');

var options = {
	elem: null,
	language: 'javascript',
	theme: 'monokai',
	readOnly: false,
	minLines: 5,
	maxLines: Infinity,
	showPrintMargin: false,
	highlightActiveLine: false
};

var aceEditor = {
	create: function(opt, callback){
		var me = this;
		var opt = $.extend({}, options, opt);
		require.async(['ace/ace', 'ace/mode/'+opt.language, 'ace/theme/monokai'], function(ace, language){
			var editor = ace.edit(opt.elem);
			var Mode = language.Mode;
			//关闭错误提示，不使用worker
			editor.getSession().setUseWorker(false);
		    //设置语言
			editor.getSession().setMode(new Mode());
		    //设置主题
		    editor.setTheme("ace/theme/monokai");
		    //获取编辑器的value
		    //editor.getValue();
		    //在光标处插入内容
			//editor.insert("//Something cool");
		    //设置编辑器只读
		    //editor.setReadOnly(true);
		    //关闭当前行高亮
		    //editor.setHighlightActiveLine(false);
		    //尺寸改变的时候，编辑器resize
		    //editor.resize()
		    //设置编辑器的行数为无穷大，即可自适应高度
		    editor.setOptions({
		    	readOnly: opt.readOnly,
		        minLines: opt.minLines,
		        maxLines: opt.maxLines,
		        showPrintMargin: opt.showPrintMargin,
		        highlightActiveLine: opt.highlightActiveLine
		    });

		    callback && callback(editor);
		});
	},
	destroy: function(editor){

	}
};

module.exports = aceEditor;