<div class="wrap fix">
	<div class="post-wrap">
		<div class="user-i">
			<div class="user-img">
				<a href="/u/<%= data.author.username %>" style="
					background: url(<%= data.author.img === 'default' ?
						__uri('../../../img/img.jpg') :
						data.author.img %>) center center;
					background-size: cover"></a>
			</div>
			<div class="user-name">
				<a href="/u/<%= data.author.username %>"><%= data.author.username %></a>
			</div>
			<div class="user-des"><%= data.author.describe %></div>
		</div>
		<h1 class="title"><%= data.post.title %></h1>
		<div class="status ib-wrap">
			<a href="/c/<%= data.post.category %>"><%= data.post.category %></a>
			<span class="dot"></span>
			<span class="date-num"><%= data.post.date %></span>
		</div>
		<div class="artical">
			<%= data.post.content %>
		</div>
	</div>
</div>

<div class="post-footer">
	<div class="wrap">
		<div class="footer-content">
			<p class="like-tips">觉得本文对你有帮助？</p>
			<div class="like-wrap fix">
				<div class="btn-wrap l">
					<button class="like green" id="like" data-post="_id=<%= data.post._id %>&user=<%= data.user ? data.user.username : '' %>&img=<%= data.user ? data.user.img : __uri('../../../img/img.jpg') %>"><%= data.post.like.length %></button>
				</div>
				<div class="liked-ul-wrap">
					<div class="liked-ul ib-wrap">
						<% for(var i=0,len=data.post.like.length;i<len;i++){ %>
							<span class="liked-li">
								<% if(data.post.like[i].user.indexOf('*') > 0){ %>
									<!--未注册用户没有链接-->
									<span title="<%= data.post.like[i].user %>"></span>
								<% }else{ %>
									<a href="/u/<%= data.post.like[i].user %>" title="<%= data.post.like[i].user %>"></a>
								<% } %>
							</span>
						<% } %>
					</div>
				</div>
			</div>
			<div class="comment-box" id="comments"></div>
		</div>
	</div>
</div>