import { useNavigate } from "react-router-dom";
import { useParams, useEffect, useState } from "react";

import styles from "./Todos.module.css";

function Todos() {
  const [user, setUser] = useState([]);
  const [Todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editTitle, setEditTitle] = useState(null);
  const [editCheck, setEditCheck] = useState(null);



  const navigate = useNavigate();

  const usern = JSON.parse(localStorage.getItem('currentUser'));
  useEffect(() => {
    if (Todos.length === 0) {
      // טעינת הנתונים כאן
      fetchTodos();
    }
  }, []);

  const fetchTodos = async () => {
    try {
      await fetch(`http://localhost:3000/todos/${usern.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },

      })
        .then(response => {
          if (response.ok) {
            console.log(response.status); // הדפסת הסטטוס
            return response.json(); // מחזיר פרומיס עם תוכן התשובה בפורמט JSON
          } else {
            throw new Error('Error: ' + response.status); // זריקת שגיאה אם יש שגיאה בתגובה
          }
        })
        .then(data => {
          console.log(data); // הדפסת האובייקט המלא
          setTodos(data);
        })
      }catch (error) {
        console.error('Failed to fetch todos:', error.message);
      }
    
  };
  // פונקציה שמבצעת בקשת מחיקה לשרת
  const handleDelete = async (id) => {
      try {
        const response = await fetch(`http://localhost:3000/todos/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          console.log('Todo deleted successfully');
          fetchTodos();
          // setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)); // עדכון התצוגה לאחר מחיקת המשימה
        } else {
          throw new Error('Failed to delete todo');
        }
      } catch (error) {
        console.error('Failed to delete todo:', error.message);
      }
    };
    const handleUpdate = (id, compn) => {
      console.log(Todos);
      setTodos(prevTodos => {
        const updatedTodos = prevTodos.map(todo => {
          if (todo.id === id) {
            return { ...todo, completed: compn };
          }
          return todo;
        });
        console.log(updatedTodos);
        return updatedTodos;
      });
    };

    const handleSave = async () => {
      if (editingTodoId != null) {
        try {
          const response = await fetch(`http://localhost:3000/todos/update-title/${editingTodoId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: editTitle
            })
          });
          if (response.ok) {
            const updatedTodo = await response.json();
            console.log(updatedTodo);
            fetchTodos();

            // עדכון המשימה בסטור או מסד הנתונים
          } else {
            throw new Error('Error: ' + response.status);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    const handleCheckChange = async (id, completed) => {
      console.log(id, completed);
      try {
        const response = await fetch(`http://localhost:3000/todos/update-completed/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            completed: completed,
            // co: editTitle
          })
        });
        if (response.ok) {
          fetchTodos();

          console.log(response);
          console.log(Todos);
          // handleUpdate(id, completed)
          console.log(Todos);

          // עדכון המשימה בסטור או מסד הנתונים
        } else {
          throw new Error('Error: ' + response.status);
        }
      } catch (error) {
        console.error(error);
      }
    }
    const handleEdit = (id) => {
      setEditingTodoId(id);
    };
    return (
      <section className={styles["todos-select"]}>
        <div className={styles["lists"]}>
          <div className={styles["todos-list"]}>
            {Todos.map(todo => (
              <div className={styles["todos-item"]} key={todo.id}>
                <div className={styles["todo-case"]}>
                  <input
                    className={styles["todos-checkbox"]}
                    type="checkbox"
                    checked={todo.completed}
                    // onChange={(e) => setEditCheck(!e.target.value)}
                    onChange={() => handleCheckChange(todo.id, !todo.completed)}
                  />
                  <span className={todo.completed ? '' : 'completed'}>
                    {editingTodoId === todo.id ? (
                      <input
                        className={styles["todos-input"]}
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    ) : (
                      todo.title
                    )}
                  </span>
                  {/* {todos.title}</span> */}
                  <button onClick={() => handleDelete(todo.id)}>DELETE</button>
                  <button onClick={() => handleEdit(todo.id)}>EDIT</button>
                  <button onClick={() => handleSave()}>SAVE</button>
                </div>
              </div>
            ))}
            {/* כפתור הוספה */}
            {/* <h4>Not Completed</h4>
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
          ))} */}
          </div>
        </div>
      </section>
    );
  }

  export default Todos;
