<div class="w fix">
	<h1>web开发笔记</h1>
	<div class="logo l"><a href="/" title="web开发笔记">zooble</a></div>
	<div class="nav r">
		<% if(loginStatus){ %>
			<a class="js-u" href="javascript:">用户中心</a>
			<a class="js-logout" href="javascript:">退出</a>
		<% }else{ %>
			<a href="/login">登录</a>
			<a href="/reg">注册</a>
		<% } %>
	</div>
</div>