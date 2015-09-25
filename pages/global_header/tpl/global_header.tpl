<% if(data.loginStatus){ %>
	<a class="js-u user" href="/u/<%= data.username %>">
		<img src="<%= data.img %>"><span><%= data.username %></span>
	</a>
	<a class="vline" href="javascript:"></a>
	<a class="js-logout" href="javascript:">退出</a>
<% }else{ %>
	<a href="/login">登录</a>
	<a href="/reg">注册</a>
<% } %>
