class Comment {
  constructor(commentType, commentID, authorId, content, commentDate, hasReplys, rootPostID, authorName = "Utilizador", tags = []) {
    this.commentType = commentType;
    this.commentID = commentID;
    this.authorId = authorId;
    this.content = content;
    this.commentDate = commentDate;
    this.hasReplys = hasReplys;
    this.rootPostID = rootPostID;
    this.authorName = authorName; 
    this.tags = tags; 
  }
}

export default Comment;