<% waterArr.forEach(function(water){ %>
	<li class="ib-wrap">
		<span class="wname marr10">
			<% if(water.user.indexOf('*') > 0){ %>
			 	<%= water.user %>:
			<% }else{ %>
				<a href="/u/<%= water.user %>"><%= water.user %></a>:
			<% } %>
		</span>
		<span class="wtext marr20"><%= water.text %></span><br>
		<span class="wdate"><%= water.date %></span>
	</li>
<% }) %>