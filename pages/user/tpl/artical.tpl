<div class="content" user="<%= data.user && data.user.username %>">
	<div class="w fix">
		<div class="c-l l">
			<% if(data.isAuthor && data.draft_arr.length > 0){ %>
				<div class="draft-tit marb20 s">
					<p class="tit">草稿箱</p>
					<span class="total r">共 <%= data.draft_arr.length %> 篇</span>
				</div>
				<div class="c-l-ul draft">
				<% for(var i=0,len=data.draft_arr.length;i<len;i++){ %>
					<div class="c-l-li marb20 s" data="url=/e/<%= data.draft_arr[i]._id %>&_id=<%= data.draft_arr[i]._id %>">
						<h2 class="title"><a href="/p/<%= data.draft_arr[i]._id %>" ><%= data.draft_arr[i].title %></a></h2>
						<div><%= data.draft_arr[i].content %></div>
						<div class="box-foot fontr ib-wrap">
							<a href="/c/<%= data.draft_arr[i].category %>" title="分类"><%= data.draft_arr[i].category %></a>
							<span class="dot"></span>
							<span><%= data.draft_arr[i].date %></span>
						</div>
					</div>
				<% } %>
				</div>
			<% } %>
			<% if(data.publish_arr.length > 0){ %>
				<div class="published-tit marb20 s">
					<p class="tit">已发布</p>
					<span class="total r">共 <%= data.publish_arr.length %> 篇</span>
				</div>
				<div class="c-l-ul <%= data.isAuthor && 'publish' %>">
				<% for(var i=0,len=data.publish_arr.length;i<len;i++){ %>
					<div class="c-l-li marb20 s" data="url=/e/<%= data.publish_arr[i]._id %>&_id=<%= data.publish_arr[i]._id %>">
						<h2 class="title"><a href="/p/<%= data.publish_arr[i]._id %>" ><%= data.publish_arr[i].title %></a></h2>
						<div class="total ib-wrap">
							<span class="tag marr10"><%= data.publish_arr[i].examine %></span>
							<span class="tag marr10"><%= data.publish_arr[i].comments.length || 0 %>评论</span>
							<span class="tag"><%= data.publish_arr[i].like.length || 0 %>赞</span>
						</div>
						<div><%= data.publish_arr[i].content %></div>
						<div class="box-foot fontr ib-wrap">
							<a href="/c/<%= data.publish_arr[i].category %>" title="分类"><%= data.publish_arr[i].category %></a>
							<span class="dot"></span>
							<span><%= data.publish_arr[i].date %></span>
						</div>
					</div>
				<% } %>
				</div>
			<% } %>
		</div>
	</div>
</div>