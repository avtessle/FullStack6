import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Todos.module.css";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [sortedBy, setSortedBy] = useState("random");
  const navigate = useNavigate();
  // .then((data) =>
  //setAlbums(data.filter((album) => album.userId === user.id))
  //)
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const filteredTodos = data.filter(
          (todo) => todo.userId === currentUser.id
        );
        setTodos(filteredTodos);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
        navigate("/error");
      });
  }, []);

  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleChangeTodo = (todoId) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const notCompletedTodos = todos.filter((todo) => !todo.completed);

  const completedTodos = todos.filter((todo) => todo.completed);

  const sortTodos = (event) => {
    const sortBy = event.target.value;
    setSortedBy(sortBy);
  };

  const sortAndFilterTodos = (todoList) => {
    switch (sortedBy) {
      case "random":
        return todoList.sort(() => Math.random() - 0.5);
      case "alphabetical":
        return todoList.sort((a, b) => a.title.localeCompare(b.title));
      case "by id":
        return todoList.sort((a, b) => a.id - b.id);
      default:
        return todoList;
    }
  };

  return (
    <section className={styles["todos-select"]}>
      <div>
        Sort by:
        <select value={sortedBy} onChange={sortTodos}>
          <option value="by id">By id</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="random">Random</option>
        </select>
      </div>
      <br />
      <br />

      <div className={styles["lists"]}>
        <div className={styles["todos-list"]}>
          <h4>Not Completed</h4>
          {sortAndFilterTodos(notCompletedTodos).map((todo) => (
            <div className={styles["todos-item"]} key={todo.id}>
              <div className={styles["todo-case"]}>
                <input
                  className={styles["todos-checkbox"]}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleChangeTodo(todo.id)}
                />
                <label className={styles["todos-label"]}>{todo.title}</label>
              </div>
            </div>
          ))}
        </div>
        <div className={styles["todos-list"]}>
          <h4>Completed</h4>
          {sortAndFilterTodos(completedTodos).map((todo) => (
            <div className={styles["todos-item"]} key={todo.id}>
              <div className={styles["todo-case"]}>
                <input
                  className={styles["todos-checkbox"]}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleChangeTodo(todo.id)}
                />
                <label className={styles["todos-label"]}>{todo.title}</label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Todos;
