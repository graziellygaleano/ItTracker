class Comment {
  constructor(commentType, commentID, authorId, content, commentDate, hasReplys, rootPostID) {
    this.commentType = commentType;
    this.commentID = commentID;
    this.authorId = authorId;
    this.content = content;
    this.commentDate = commentDate;
    this.hasReplys = hasReplys;
    this.rootPostID = rootPostID;
  }
}

module.exports = Comment;