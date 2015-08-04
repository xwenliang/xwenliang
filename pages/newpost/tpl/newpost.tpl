<div class="content">
	<div class="w fix">

		<% if(data && data.post){ %>
		<div class="new-post">
			<div class="post-tit marb10">
				<input tabIndex="1" type="text" placeholder="标题" id="title" class="input-tit" value="<%= data.post.title %>">
			</div>
			<div class="post-category marb10">
				分类:
				<select id="category" class="marr20" tabIndex="2"></select>
				标签：
				<input tabIndex="3" type="text" placeholder="以英文,分隔" id="tags" class="input-tags" value="<%= data.post.tags.join(',') %>">
			</div>
			
			<div class="post-content artical" id="zEditor">
				<div tabIndex="4" class="workplace" contenteditable="true">
					<%= data.post.content %>
				</div>
			</div>
			<div class="post-ui fix">
				<div class="ui-cancel l"><a class="gray" href="/">取消</a></div>
				<div class="js-post ui-post r"><span>不用预览，所见即所得哦亲~</span><a class="gray marl10" href="javascript:" data-post="url=/updatePost&status=draft">保存到草稿</a><a class="green marl10" href="javascript:" data-post="url=/updatePost&status=publish">发布</a></div>
			</div>
		</div>
		<% }else{ %>
		<div class="new-post">
			<div class="post-tit marb10">
				<input tabIndex="1" type="text" placeholder="标题" id="title" class="input-tit">
			</div>
			<div class="post-category marb10">
				分类:
				<select id="category" class="marr20" tabIndex="2"></select>
				标签：
				<input tabIndex="3" type="text" placeholder="以英文,分隔" id="tags" class="input-tags">
			</div>
			
			<div class="post-content artical" id="zEditor">
				<div tabIndex="4" class="workplace" contenteditable="true"></div>
			</div>
			<div class="post-ui fix">
				<div class="ui-cancel l"><a class="gray" href="/">取消</a></div>
				<div class="js-post ui-post r"><span>不用预览，所见即所得哦亲~</span><a class="gray marl10" href="javascript:" data-post="url=/publishPost&status=draft">保存到草稿</a><a class="green marl10" href="javascript:" data-post="url=/publishPost&status=publish">发布</a></div>
			</div>
		</div>
		<% } %>
	</div>
</div>