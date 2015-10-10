<div class="wrap">
	<ul class="water-ul">
	<% for(var i=0,len=data.list.length;i<len;i++){ %>
		<li class="fix">
			<div class="w-avatar" title="<%= data.list[i].user %>"></div>
			<div class="w-info ib-wrap">
				<span class="w-name">
					<% if(data.list[i].user.indexOf('*') > 0){ %>
					 	<%= data.list[i].user %>
					<% }else{ %>
						<a href="/u/<%= data.list[i].user %>"><%= data.list[i].user %></a>
					<% } %>
				</span>
				<span class="w-text">：<%= data.list[i].text %></span>
				<span class="w-date"><%= data.list[i].date %></span>
			</div>
		</li>
	<% } %>
	</ul>
</div>