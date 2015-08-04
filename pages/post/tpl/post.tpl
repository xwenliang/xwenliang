<div class="content">
	<div class="w fix">
		<div class="post-wrap">
			<div class="a_i">
				<div class="a_img">
					<a href="/u/<%= data.author.username %>" style="
						background: url(<%= data.author.img === 'default' ?
							__uri('../../../img/img.jpg') :
							data.author.img %>) center center;
						background-size: cover"></a>
				</div>
				<div class="a_name">
					<a href="/u/<%= data.author.username %>"><%= data.author.username %></a>
				</div>
				<div class="a_des"><%= data.author.describe %></div>
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
</div>

<div class="post-footer">
	<div class="w fix">
		<div class="post-footer-wrap">
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
		</div>
		<div class="post-comments-wrap">
			<p class="p-c-t">评论(<em><%= data.post.comments.length %></em>)</p>
			<div class="p-c-box">
				<ul class="water-ul">
					<% if(data.post.comments == 0){ %>
						<li class="p-c-nodata">暂无评论，求挽尊...</li>
					<% }else{ %>
						<% for(var i=0,len=data.post.comments.length;i<len;i++){ %>
							<li class="ib-wrap">
								<% if(data.post.comments[i].user.indexOf('*') > 0){ %>
									<!--未注册用户没有链接-->
									<span class="wname marr10" title="<%= data.post.comments[i].user %>"><%= data.post.comments[i].user %>:</span>
								<% }else{ %>
									<a class="wname marr10" href="/u/<%= data.post.comments[i].user %>" title="<%= data.post.comments[i].user %>"><%= data.post.comments[i].user %>:</a>
								<% } %>
								<span class="wtext marr20"><%= data.post.comments[i].text %></span><br>
								<span class="wdate"><%= data.post.comments[i].date %></span>
							</li>
						<% } %>
					<% } %>
				</ul>
				<div class="water-input ib-wrap">
					<textarea id="water-word" max="200" class="marb10"></textarea><br>
					<button class="green marr10 publishBtn" data="url=/comments&_id=<%= data.post._id %>" flag="1">发布</button>
					<span class="water-tips"><em class="pre-num">还可输入</em><em class="num">200</em>个字</span>
				</div>
			</div>
		</div>
	</div>
</div>