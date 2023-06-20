import { NavLink, Outlet } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const username = JSON.parse(localStorage.getItem("currentUser")).username;
  return (
    <>
      <nav className={styles.navbar}>
        <NavLink to={`/users/${username}/info`} className={styles.link}>
          Info
        </NavLink>
        <br />
        <NavLink to="/login" className={styles.link}>
          Logout
        </NavLink>
        <br />
        <NavLink to={`/users/${username}/todos`} className={styles.link}>
          Todos
        </NavLink>
        <br />
        <NavLink to={`/users/${username}/posts`} className={styles.link}>
          Posts
        </NavLink>
        <br />
      </nav>
      <Outlet />
    </>
  );
}
export default Navbar;
