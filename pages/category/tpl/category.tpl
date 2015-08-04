<div class="w c-l-ul js-ul">
<% for(var i=0,len=data.posts.length;i<len;i++){ %>
	<div class="c-l-li marb20 s">
		<h2 class="title">
			<a href="/p/<%= data.posts[i]._id %>" ><%= data.posts[i].title %></a>
		</h2>
		<div class="total ib-wrap">
			<span class="tag marr10"><%= data.posts[i].comments.length %>评论</span>
			<span class="tag"><%= data.posts[i].like.length %>赞</span>
		</div>
		<div class="cont"><%= data.posts[i].content %></div>
		<div class="box-foot fontr ib-wrap">
			<a href="/u/<%= data.posts[i].author %>" title="作者"><%= data.posts[i].author %></a>
			<span class="dot"></span>
			<a href="/c/<%= data.posts[i].category %>" title="分类"><%= data.posts[i].category %></a>
			<span class="dot"></span>
			<span><%= data.posts[i].date %></span>
		</div>
	</div>
<% } %>
</div>
