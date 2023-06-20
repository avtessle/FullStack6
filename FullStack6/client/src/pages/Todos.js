import { useNavigate } from "react-router-dom";
import { useParams, useEffect, useState } from "react";
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';

import styles from "./Todos.module.css";

function Todos() {
  const [Todos, setTodos] = useState([]);//רשימה של כל הטודוס
  const [editingTodoId, setEditingTodoId] = useState(null);//שומר את מספר הכותרת שעושים עליה שינוי
  const [editTitle, setEditTitle] = useState(null);//השינוי שעושים לכותרת
  const [newTodo, setnewTodo] = useState([]);//תוכן של טודו חדש

  const navigate = useNavigate();

  const usern = JSON.parse(localStorage.getItem('currentUser'));
  const todos = JSON.parse(localStorage.getItem("currentTodos"));

  useEffect(() => {
    if (Todos.length === 0) {
      if (!todos) {

      console.log('fetch');
      fetchTodos();
    }
    else {
      console.log('set todos');
      setTodos(todos)
    }
    }
  }, []);

  useEffect(() => {
    console.log('useeffectttttt');
    localStorage.setItem("currentTodos", JSON.stringify(Todos));

  }, [Todos]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${usern.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if (response.ok) {
        console.log(response.status); // הדפסת הסטטוס
        const newData = await response.json(); // מחזיר פרומיס עם תוכן התשובה בפורמט JSON
        localStorage.setItem("currentTodos", JSON.stringify(newData));
        setTodos(newData);
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error.message);
    }
  };
  const handleDelete = async (id) => {
    try {
      console.log("delete");
      const response = await fetch(`http://localhost:3000/todos/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      console.log("if");
      console.log(response);
      if (response.ok) {
        console.log('Todo deleted successfully');
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)); // עדכון התצוגה לאחר מחיקת המשימה
      } else {
        throw new Error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Failed to delete todo:', error.message);
    }
  };

  const handleSave = async (id, title, c) => {
    console.log(id, title, c);
    if (editingTodoId != null) {
      try {
        const todo = {
          userId: usern.id,
          id: editingTodoId,
          title: editTitle,
          completed: c ? 1 : 0
        };
        console.log(todo);
        const response = await fetch(`http://localhost:3000/todos/update-title/${editingTodoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(todo)
        });
        console.log(response);
        if (response.ok) {
          const updatedTodo = await response.json();
          console.log(updatedTodo);

          await setTodos(prevTodos => {
            return prevTodos.map(todo => {
              if (todo.id === updatedTodo.id) {
                return updatedTodo;
              }
              return todo;
            });
          });
        }
      } catch (error) {
        console.error("Error updating data:", error);
        navigate("/error");
      } finally {
        setEditingTodoId(null);
        setEditTitle(null);
      }
    }
  };

  const handleCheckChange = async (id, title, completed) => {
    console.log(id, completed);
    try {
      const todo = {
        userId: usern.id,
        id: id,
        title: title,
        completed: completed
      };
      const response = await fetch(`http://localhost:3000/todos/update-completed/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
      });
      console.log(response);
      if (response.ok) {
        const updatedTodo = await response.json();

        await setTodos(prevTodos => {
          return prevTodos.map(todo => {
            if (todo.id === updatedTodo.id) {
              return updatedTodo;
            }
            return todo;
          });
        });

      } else {
        throw new Error('Error: ' + response.status);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleEdit = async (id, title) => {
    await setEditingTodoId(id);
    await setEditTitle(title);
  };

  const addTodo = async () => {
    if (newTodo.trim() !== '') {

      try {
        const todo = {
          userId: usern.id,
          id: 0,
          title: newTodo,
          completed: 0
        };
        const response = await fetch(`http://localhost:3000/todos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(todo)
        });
        console.log(response);
        if (response.ok) {
          const updatedTodo = await response.json();
          await setTodos(prevTodos => [...prevTodos, updatedTodo]);
          setnewTodo('');
        } else {
          throw new Error('Error: ' + response.status);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <section className={styles["todos-select"]}>
      <div className={styles["lists"]}>
        <div className={styles["todos-list"]}>
          <input
            type="text"
            value={newTodo}
            onChange={e => setnewTodo(e.target.value)}
          />
          <button onClick={addTodo}>Add Todo</button>
          {Todos.map(todo => (
            <div className={styles["todos-item"]} key={todo.id}>
              <div className={styles["todo-case"]}>
                <input
                  className={styles["todos-checkbox"]}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleCheckChange(todo.id, todo.title, !todo.completed)}
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
                <button onClick={() => handleDelete(todo.id)}>
                  <FaTrash />
                </button>
                <button onClick={() => handleEdit(todo.id, todo.title)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleSave(todo.id, todo.title, todo.completed)}>
                  <FaSave />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Todos;
