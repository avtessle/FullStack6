import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Login.module.css";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  if (localStorage.length !== 0) {
    localStorage.clear();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !password) {
      return;
    }

    const url = "http://localhost:3000/login";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          throw "Wrong username or password";
        }
      })
      .then((user) => {
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/info");
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  };

  return (
    <section className={styles.section}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h5>LOGIN</h5>
        <div className={styles["form-row"]}>
          <input
            type="text"
            placeholder="Username"
            className={styles["form-input"]}
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles["form-row"]}>
          <input
            type="password"
            placeholder="Password"
            className={styles["form-input"]}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.btn}>
          LOGIN
        </button>
      </form>
    </section>
  );
}

export default Login;
