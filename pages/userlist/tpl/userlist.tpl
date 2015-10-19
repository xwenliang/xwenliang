<div class="content">
	<div class="wrap">
		<div class="userlist">
			<% data.user_arr.forEach(function(user){ %>
				<div class="item box">
					<span class="u-name">用户名： <em><a class="js-username" href="/u/<%= user.username %>"><%= user.username %></a></em></span>
					<span class="u-power">权限：
						<% if(user.power == 0){ %>
							<%= user.power %>
						<% }else{ %>
							<select class="js-power c-power" data-post="url=/updateUser">
								<% for(var i=6;i>0;i--){ %>
									<% if(i == user.power){ %>
										<option selected="selected"><%= i %></option>
									<% }else{ %>
										<option><%= i %></option>
									<% } %>
								<% } %>
							</select>
						<% } %>
					</span>
					<span class="u-time">注册时间:  <%= user.date %></span>
					<span class="u-time">最后访问:  <%= user.lastVisitTime %></span>
					<button class="gray js-del" data-post="url=/delUser">删除</button>
				</div>
			<% }) %>
		</div>
	</div>
</div>