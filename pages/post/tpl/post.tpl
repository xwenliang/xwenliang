<div class="content">
	<div class="w fix">
		<div class="post-wrap">
			<div class="a_i">
				<div class="a_img"><a href="/u/<%= author.username %>" style="background: url(<%= author.img === 'default' ? __uri('../../../img/img.jpg') : author.img %>) center center; background-size: cover"></a></div>
				<div class="a_name"><a href="/u/<%= author.username %>"><%= author.username %></a></div>
				<div class="a_des"><%= author.describe %></div>
			</div>
			<h1 class="title"><%= post.title %></h1>
			<div class="status"><em class="read-num"><%= post.pageviews %>阅读</em><em class="dot">•</em><em class="comment-num"><%= post.comments.length %>评论</em><em class="dot">•</em><a href="/c/<%= post.category %>"><%= post.category %></a><em class="dot">•</em><em class="date-num"><%= post.date %></em></div>
			<div class="artical">
				<%= post.content %>
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
					<button class="like green" id="like" data="url=/like&_id=<%= post._id %>&user=<%= user ? user.username : '*undefined' %>&img=<%= user ? user.img : __inline('../../../img/img.jpg') %>"><%= post.like.length %></button>
				</div>
				<div class="liked-ul-wrap">
					<div class="liked-ul ib-wrap">
						<% post.like.forEach(function(liker){ %>
							<span class="liked-li">
								<% if(liker.user.indexOf('*') > 0){ %>
									<!--未注册用户没有链接-->
									<span title="<%= liker.user %>"></span>
								<% }else{ %>
									<a href="/u/<%= liker.user %>" title="<%= liker.user %>" target="_blank"></a>
								<% } %>
							</span>
						<% }) %>
					</div>
				</div>
			</div>
		</div>
		<div class="post-comments-wrap">
			<p class="p-c-t">评论(<em><%= post.comments.length %></em>)</p>
			<div class="p-c-box">
				<ul class="water-ul">
					<% if(post.comments == 0){ %>
						<li class="p-c-nodata">暂无评论，求挽尊...</li>
					<% }else{ %>
						<% post.comments.forEach(function(comment){ %>
							<li class="ib-wrap">
								<% if(comment.user.indexOf('*') > 0){ %>
									<!--未注册用户没有链接-->
									<span class="wname marr10" title="<%= comment.user %>"><%= comment.user %>:</span>
								<% }else{ %>
									<a class="wname marr10" href="/u/<%= comment.user %>" title="<%= comment.user %>" target="_blank"><%= comment.user %>:</a>
								<% } %>
								<span class="wtext marr20"><%= comment.text %></span><br>
								<span class="wdate"><%= comment.date %></span>
							</li>
						<% }) %>
					<% } %>
				</ul>
				<div class="water-input ib-wrap">
					<textarea id="water-word" max="200" class="marb10"></textarea><br>
					<button class="green marr10 publishBtn" data="url=/comments&_id=<%= post._id %>" flag="1">发布</button>
					<span class="water-tips"><em class="pre-num">还可输入</em><em class="num">200</em>个字</span>
				</div>
			</div>
		</div>
	</div>
</div>