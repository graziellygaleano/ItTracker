class Comment {
  constructor(commentType, commentID, authorId, content, commentDate, hasReplys, rootPostID, authorName = "Utilizador") {
    this.commentType = commentType;
    this.commentID = commentID;
    this.authorId = authorId;
    this.content = content;
    this.commentDate = commentDate;
    this.hasReplys = hasReplys;
    this.rootPostID = rootPostID;
    this.authorName = authorName; 
    
  }
}

export default Comment;