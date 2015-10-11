<div class="wrap">
	<ul class="water-ul">
	<% for(var i=0,len=data.list.length;i<len;i++){ %>
		<li class="fix">
			<a class="w-avatar <%= data.list[i].className %>" title="<%= data.list[i].user %>" href="<%= data.list[i].href %>"></a>
			<div class="w-info ib-wrap">
				<span class="w-name">
					<a class="<%= data.list[i].className %>" href="<%= data.list[i].href %>"><%= data.list[i].user %></a>
				</span>
				<span class="w-text">：<%= data.list[i].text %></span>
				<span class="w-date"><%= data.list[i].date %></span>
			</div>
		</li>
	<% } %>
	</ul>
</div>