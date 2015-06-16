<% posts.forEach(function(post){ %>
	<div class="c-l-li marb20 s">
		<h2 class="title">
			<a href="/p/<%= post._id %>" ><%= post.title %></a>
		</h2>
		<div class="total">
			<%= post.comments.length %>评论
			<em class="dot">•</em>
			<%= post.like.length %>赞
		</div>
		<div class="cont"><%= post.content %></div>
		<div class="fontr">
			<a href="/u/<%= post.author %>" title="作者"><%= post.author %></a>
			<em class="dot">•</em>
			<a href="/c/<%= post.category %>" title="分类"><%= post.category %></a>
			<em class="dot">•</em>
			<%= post.date %>
		</div>
	</div>
<% }) %>
