<div class="w">
	<ul class="water-ul mart10 marb10">
	<% for(var i=0,len=data.waterArr.length;i<len;i++){ %>
		<li class="ib-wrap">
			<span class="wname marr10">
				<% if(data.waterArr[i].user.indexOf('*') > 0){ %>
				 	<%= data.waterArr[i].user %>:
				<% }else{ %>
					<a href="/u/<%= data.waterArr[i].user %>"><%= data.waterArr[i].user %></a>:
				<% } %>
			</span>
			<span class="wtext marr20"><%= data.waterArr[i].text %></span><br>
			<span class="wdate"><%= data.waterArr[i].date %></span>
		</li>
	<% } %>
	</ul>
</div>