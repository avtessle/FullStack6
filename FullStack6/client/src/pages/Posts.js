import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Posts.module.css";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [commentsPost, setCommentsPost] = useState("null");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const getData = async (url, setData) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
        navigate("/error");
      });
  };

  useEffect(() => {
    const url = `http://localhost:3000/posts?userId=${user.id}&_sort=id`;
    getData(url, setPosts);
    // const requestOptions = {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };

    // fetch(url, requestOptions)
    //   .then((response) => response.json())
    //   .then((data) => setPosts(data))
    //   .catch((error) => {
    //     console.error("Error fetching posts:", error);
    //     navigate("/error");
    //   });
  }, []);

  const handleComments = async (postId) => {
    if (commentsPost === postId) {
      setCommentsPost(null);
      setComments([]);
    } else {
      setCommentsPost(postId);
      const url = `http://localhost:3000/comments?postId=${postId}&_sort=id`;
      getData(url, setComments);
    }
  };

  const addPost = async () => {
    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;

    const url = "http://localhost:3000/posts";
    const post = {
      userId: user.id,
      title: title,
      body: body,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.json);
          const newPost = response.json();
          setPosts([...posts, newPost]);
        }
      })
      .catch((error) => {
        console.error("Error adding new post:", error);
        navigate("/error");
      });
  };

  const addComment = async () => {
    // let title = document.getElementById("title").value;
    // let body = document.getElementById("body").value;
    // const url = "http://localhost:3000/posts";
    // const post = {
    //   userId: user.id,
    //   title: title,
    //   body: body,
    // };
    // const requestOptions = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(post),
    // };
    // fetch(url, requestOptions)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       console.log(response.json);
    //       const newPost = response.json();
    //       setPosts([...posts, newPost]);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error adding new post:", error);
    //     navigate("/error");
    //   });
  };

  const deletePost = async (postId) => {};

  return (
    <section className={styles.posts}>
      <div className={styles["new-post"]}>
        <textarea id="title" placeholder="Title"></textarea>
        <textarea id="body" placeholder="Body"></textarea>
        <button onClick={addPost}>Add Post</button>
      </div>
      <div className={styles["grid-container"]}>
        {posts.map((post) => (
          <div className={styles["post-card"]} key={post.id}>
            <h5>{`${post.id}. ${post.title}`}</h5>
            <p>{post.body}</p>
            <div className={styles["post-btns"]}>
              <button onClick={() => deletePost(post.id)}>Delete Post</button>
              <button
                className={styles["comments-btn"]}
                onClick={() => handleComments(post.id)}
              >
                {commentsPost === post.id
                  ? "Hide Comments"
                  : "Display Comments"}
              </button>
            </div>
            {commentsPost === post.id && (
              <div className={styles.comments}>
                {comments.map((comment) => (
                  <section>
                    <h5>{`${comment.id}. ${comment.name}`}</h5>
                    <p>{comment.body}</p>
                  </section>
                ))}
                <button onClick={addComment}>Add Comment</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Posts;
