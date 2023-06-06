import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Posts.module.css";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [IdPost, setIdPOst] = useState("null");
  const [isBoldId, setIsBoldId] = useState(false);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) =>
        setPosts(
          data.filter(
            (post) =>
              post.userId === JSON.parse(localStorage.getItem("currentUser")).id
          )
        )
      )
      .catch((error) => {
        console.error("Error fetching todos:", error);
        navigate("/error");
      });
  }, []);

  const handleComments = async (postId) => {
    if (IdPost === postId) {
      setIdPOst(null);
      setComments([]);
    } else {
      setIdPOst(postId);
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
        );
        const comments = await response.json();
        setComments(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  return (
    <section className="section posts-container">
      {posts.map((post) => (
        <div className={styles["post-card"]} key={post.id}>
          <div className={styles["post-header"]}>
            <h5>Title: {post.title}</h5>
            <button onClick={() => setIsBoldId(post.id)}>Bold</button>
          </div>
          <p style={{ fontWeight: isBoldId === post.id ? "bold" : "normal" }}>
            {post.body}
          </p>
          <button onClick={() => handleComments(post.id)}>
            {IdPost === post.id ? "Hide the comments" : "See the comments"}
          </button>
          {IdPost === post.id && (
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>
                  <h6>{comment.email}</h6>
                  <h6>{comment.name}</h6>
                  <p>{comment.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

export default Posts;
