<div class="w fix">
	<h1>web开发笔记</h1>
	<div class="logo l"><a href="/" title="web开发笔记">zooble</a></div>
	<div class="nav marl20 l ib-wrap">
		<!-- <a href="/">music</a>
		<a href="/chatroom">chatroom</a> -->
	</div>
	<div class="nav r ib-wrap">
		<% if(loginStatus){ %>
			<a class="js-u user" href="/u/<%= username %>"><img src="<%= img %>"><span><%= username %></span></a>
			<a class="vline" href="javascript"></a>
			<a class="js-logout" href="javascript:">退出</a>
		<% }else{ %>
			<a href="/login">登录</a>
			<a href="/reg">注册</a>
		<% } %>
	</div>
</div>