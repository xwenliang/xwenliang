<div class="content">
	<div class="wrap">
		<div class="postlist">
			<% data.posts.forEach(function(post){ %>
				<div class="item box">
					<span class="u-name"><a href="/p/<%= post._id %>"><%= post.title %></a></span>
					<span class="a-name"><a href="u/<%= post.author %>"><%= post.author %></a></span>
					<span class="u-power">
						<select class="js-status c-power" data-post="url=/examine&_id=<%= post._id %>">
							<option <%= (post.examine == 0) && 'selected="selected"' %> value="0">待审核</option>
							<option <%= (post.examine == 1) && 'selected="selected"' %> value="1">已审核</option>
							<option <%= (post.examine == 2) && 'selected="selected"' %> value="2">未通过</option>
						</select>
					</span>
					<span class="del-btn"><button class="gray js-del" data-post="url=/delPost&_id=<%= post._id %>">删除</button></span>
				</div>
			<% }) %>
		</div>
	</div>
</div>