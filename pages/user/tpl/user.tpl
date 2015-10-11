<div class="box user-info<%= data.isAuthor ? ' js-myinfo' : '' %>">
	<div class="user-img" data-default="<%= data.user.img %>" data-img="<%= data.user.img %>" style="background-image: url(<%= data.user.img %>);"></div>
	<div class="user-name">
		<span><%= data.user.username %></span>
	</div>
	<div class="user-des" data-default="<%= data.user.describe %>"><%= data.user.describe %></div>
</div>

<% if(data.isAuthor && data.user.power < 5){ %>
<div class="box user-btn ib-wrap">
	<a class="green" href="/newpost/new">写作</a>
	<% if(data.user.power < 2){ %>
		<a class="green" href="/postlist">文章列表</a>
		<a class="green" href="/userlist">用户列表</a>
	<% } %>
</div>
<% } %>