import { NavLink, Outlet } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <>
      <nav className={styles.navbar}>
        <NavLink
          to="/info"
          activeClassName={styles.active}
          className={styles.link}
        >
          Info
        </NavLink>
        <br />
        <NavLink
          to="/login"
          activeClassName={styles.active}
          className={styles.link}
        >
          Logout
        </NavLink>
        <br />
        <NavLink
          to="/todos"
          activeClassName={styles.active}
          className={styles.link}
        >
          Todos
        </NavLink>
        <br />
        <NavLink
          to="/posts"
          activeClassName={styles.active}
          className={styles.link}
        >
          Posts
        </NavLink>
        <br />
        <NavLink
          to="/albums"
          activeClassName={styles.active}
          className={styles.link}
        >
          Albums
        </NavLink>
        <br />
      </nav>
      <Outlet />
    </>

    //   <nav className="navbar">
    //     <NavLink
    //       to="/info"
    //       className={({ isActive }) => (isActive ? "link active" : "link")}
    //     >
    //       Info
    //     </NavLink>
    //     <br />
    //     <NavLink
    //       to="/login"
    //       className={({ isActive }) => (isActive ? "link active" : "link")}
    //     >
    //       Logout
    //     </NavLink>
    //     <br />
    //     <NavLink
    //       to="/todos"
    //       className={({ isActive }) => (isActive ? "link active" : "link")}
    //     >
    //       Todos
    //     </NavLink>
    //     <br />
    //     <NavLink
    //       to="/posts"
    //       className={({ isActive }) => (isActive ? "link active" : "link")}
    //     >
    //       Posts
    //     </NavLink>
    //     <br />
    //     <NavLink
    //       to="/albums"
    //       className={({ isActive }) => (isActive ? "link active" : "link")}
    //     >
    //       Albums
    //     </NavLink>
    //     <br />
    //   </nav>
    //   <Outlet />
    // </>
  );
}
export default Navbar;
