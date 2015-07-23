<div class="content" user="<%= user && user.username %>">
	<div class="w fix">
		<div class="c-l l">
			<% if(isAuthor && draft_arr.length > 0){ %>
				<div class="draft-tit marb20 s">
					<p class="tit">草稿箱</p>
					<span class="total r">共 <%= draft_arr.length %> 篇</span>
				</div>
				<div class="c-l-ul draft">
				<% draft_arr.forEach(function(post){ %>
					<div class="c-l-li marb20 s" data="url=/e/<%= post._id %>&_id=<%= post._id %>">
						<h2 class="title"><a href="/p/<%= post._id %>" ><%= post.title %></a></h2>
						<div><%= post.content %></div>
						<div class="fontr"><a href="/c/<%= post.category %>" title="分类"><%= post.category %></a><em class="dot">•</em><%= post.date %></div>
					</div>
				<% }) %>
				</div>
			<% } %>
			<% if(publish_arr.length > 0){ %>
				<div class="published-tit marb20 s">
					<p class="tit">已发布</p>
					<span class="total r">共 <%= publish_arr.length %> 篇</span>
				</div>
				<div class="c-l-ul <%= isAuthor && 'publish' %>">
				<% publish_arr.forEach(function(post){ %>
					<div class="c-l-li marb20 s" data="url=/e/<%= post._id %>&_id=<%= post._id %>">
						<h2 class="title"><a href="/p/<%= post._id %>" ><%= post.title %></a></h2>
						<div class="total ib-wrap">
							<span class="tag marr10"><%= post.examine %></span>
							<span class="tag marr10"><%= post.comments.length || 0 %>评论</span>
							<span class="tag"><%= post.like.length || 0 %>赞</span>
						</div>
						<div><%= post.content %></div>
						<div class="fontr ib-wrap">
							<a href="/c/<%= post.category %>" title="分类"><%= post.category %></a>
							<span class="dot"></span>
							<span><%= post.date %></span>
						</div>
					</div>
				<% }) %>
				</div>
			<% } %>
		</div>
	</div>
</div>