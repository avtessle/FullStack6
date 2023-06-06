import styles from "./Albums.module.css";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom/dist";
import { useNavigate } from "react-router-dom";

function Albums() {
  const [albums, setAlbums] = useState([]);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/albums?userId=${user.id}`)
      .then((response) => response.json())
      .then((data) => setAlbums(data))
      .catch((error) => {
        console.error("Error fetching albums:", error);
        navigate("/error");
      });
  }, []);

  return (
    <div className={styles.albumList}>
      {albums.map((album) => (
        <div className={styles.albumItem} key={album.id}>
          <NavLink to={`/albums/${album.id}`} className={styles.albumLink}>
            {album.title}
          </NavLink>
        </div>
      ))}
    </div>
  );
}
export default Albums;
