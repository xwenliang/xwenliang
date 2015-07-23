<% posts.forEach(function(post){ %>
	<div class="c-l-li marb20 s">
		<h2 class="title">
			<a href="/p/<%= post._id %>" ><%= post.title %></a>
		</h2>
		<div class="total ib-wrap">
			<span class="tag marr10"><%= post.comments.length %>评论</span>
			<span class="tag"><%= post.like.length %>赞</span>
		</div>
		<div class="cont"><%= post.content %></div>
		<div class="fontr ib-wrap">
			<a href="/u/<%= post.author %>" title="作者"><%= post.author %></a>
			<span class="dot"></span>
			<a href="/c/<%= post.category %>" title="分类"><%= post.category %></a>
			<span class="dot"></span>
			<span><%= post.date %></span>
		</div>
	</div>
<% }) %>
