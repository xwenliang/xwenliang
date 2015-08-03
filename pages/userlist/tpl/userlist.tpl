<div class="content">
	<div class="w fix">
		<div class="userlist">
			<% data.user_arr.forEach(function(user){ %>
				<div class="item marb10 s">
					<span class="u-name marr10">用户名： <em><a class="js-username" href="/u/<%= user.username %>"><%= user.username %></a></em></span>
					<span class="u-power marr10">权限：
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
					<span class="u-time marr10">注册时间:  <%= user.date %></span>
					<button class="gray js-del" data-post="url=/delUser">删除</button>
				</div>
			<% }) %>
		</div>
	</div>
</div>