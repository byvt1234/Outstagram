### Database: `Outstagram`

# users
```markdown

{
	_id: ObjectId,
	userid: String,
	passwordHash: String,
	name: String,
	email: String,
	createdAt: Date,
	updatedAt: Date
}

유니크 + 인덱싱: userid, email
```

# posts

```markdown
{
	_id: ObjectId,
	authorId: ObjectId,
	authorUserid: String,
	title: String,
	content: String,
	imageUrls: [String], // 최대 3개
	viewCount: Number,
	createdAt: Date,
	updatedAt: Date
}
```

# comments

```markdown
{
	_id: ObjectId,
	postId: ObjectId,
	authorId: ObjectId,
	authorUserid: String,
	content: String,
	createdAt: Date
}

인덱스: { postId: 1, createdAt: 1 }
```

# bookmarks

```markdown
{
	_id: ObjectId,
	userId: ObjectId,
	postId: ObjectId,
	createdAt: Date
}

복합 유니크 인덱싱: { userId: 1, postId: 1 } // unique
```