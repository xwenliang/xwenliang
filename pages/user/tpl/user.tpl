<div class="c-r r">

	<div class="<%= isAuthor && 'myinfo'%> a_info marb20 s">
		<div class="a_img marb10" imgSrc="<%= user.img %>" style="background-image: url(<%= user.img %>);"></div>
		<div class="a_name marb10">
			<span><%= user.username %></span>
		</div>
		<div class="a_des"><%= user.describe %></div>
	</div>

	<% if(isAuthor){ %>
	<div class="marb20 s">
		<% if(user.power < 5){ %>
			<a class="green" href="/new-post">写作</a>
		<% } %>
	</div>
	<% } %>

</div>