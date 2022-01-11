import React from "react";
import { v4 as uuidV4 } from "uuid";

export default function App() {
  const [root, setRoot] = React.useState([]);

  const printCommentStructure = (comments) => {
    return comments.map((comment) => {
      return (
        <li key={comment.id}>
          <Comment
            id={comment.id}
            root={root}
            setRoot={setRoot}
            commentMessage={comment.commentMessage}
            parent={comment.parent}
          />
          {comment.child.length > 0 ? (
            <ul>{printCommentStructure(comment.child)}</ul>
          ) : (
            <></>
          )}
        </li>
      );
    });
  };

  return (
    <div style={{paddingInline: '10px'}}>
      <p>Comments</p>
      <Comment
        id={"root"}
        root={root}
        setRoot={setRoot}
        showCommentBoxInitial={true}
        parent={"groot"}
      />
      <ul>{printCommentStructure(root)}</ul>
    </div>
  );
}

export const Comment = ({
  id,
  root,
  setRoot,
  commentMessage,
  showCommentBoxInitial
}) => {
  const [comment, setComment] = React.useState("");
  const [showCommentBox, setShowCommentBox] = React.useState(
    showCommentBoxInitial ? showCommentBoxInitial : false
  );

  const findParentAndAddChild = (comments, parent, commentMessage) => {
    console.log("In findParentAndAddChild");
    if (comments.length === 0) {
      return [];
    }

    return comments.map((comment) => {
      console.log("comment: ", comment, "parent: ", parent);

      if (comment.id === parent) {
        console.log("matched");
        return {
          ...comment,
          child: [
            ...comment.child,
            {
              id: uuidV4(),
              commentMessage: commentMessage,
              child: [],
              parent: comment.id
            }
          ]
        };
      } else {
        return {
          ...comment,
          child: findParentAndAddChild(comment.child, parent, commentMessage)
        };
      }
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    let updatedRoot = [...root];

    if (id === "root") {
      updatedRoot.push({
        id: uuidV4(),
        commentMessage: comment,
        child: [],
        parent: "root"
      });
    } else {
      updatedRoot = findParentAndAddChild(root, id, comment);
    }

    setRoot(updatedRoot);
    setComment("");

    !showCommentBoxInitial && setShowCommentBox(false);
  };

  const handleClick = (e) => {
    setShowCommentBox((showCommentBox) => !showCommentBox);
  };

  return (
    <>
      <p>{commentMessage}</p>
      {showCommentBox ? (
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" disabled={comment.length === 0 ? true : false}>
            Submit
          </button>
        </form>
      ) : (
        <button onClick={handleClick}>Reply</button>
      )}
    </>
  );
};
