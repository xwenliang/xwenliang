<div class="c-r r">

	<div class="<%= data.isAuthor && 'js-myinfo'%> a_info marb20 s">
		<div class="a_img marb10" data-default="<%= data.user.img %>" data-img="<%= data.user.img %>" style="background-image: url(<%= data.user.img %>);"></div>
		<div class="a_name marb10">
			<span><%= data.user.username %></span>
		</div>
		<div class="a_des" data-default="<%= data.user.describe %>"><%= data.user.describe %></div>
	</div>

	<% if(data.isAuthor){ %>
	<div class="marb20 s">
		<% if(data.user.power < 5){ %>
			<a class="green" href="/newpost/new">写作</a>
		<% } %>
		<% if(data.user.power < 2){ %>
			<a class="green" href="/postlist">文章列表</a>
			<a class="green" href="/userlist">用户列表</a>
		<% } %>
	</div>
	<% } %>

</div>