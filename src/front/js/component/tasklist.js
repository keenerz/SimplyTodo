import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/tasklist.css";

export const TaskList = () => {
  const { store, actions } = useContext(Context);
  const todos = JSON.parse(sessionStorage.getItem("todos"));
  let [task, setTask] = useState("");
  let [duedate, setDuedate] = useState("");
  let [list, setList] = useState([]);

  // Input and mechanics
  // const handleInput = (e) => {
  //   if (e.keyCode === 13 && task != "") {
  //     if (task.trim() === "") {
  //       alert("Error 404: words not found");
  //       setTask("");
  //     } else {
  //       setTask(e.target.value);
  //       setList([...list, { label: task, stage: "notdone" }]);
  //       setTask("");
  //       actions.saveTodoList({ label: task, stage: "notdone" });
  //     }
  //   }
  // };

  useEffect(() => {
    actions.loadTodos;
  }, []);

  return (
    <div className="justify-content-center w-100" id="whole">
      <div className="fw-light input-group">
        <form
          className="inputs"
          onSubmit={() => {
            if (task != "") {
              if (task.trim() === "") {
                alert("Error 404: words not found");
                setTask("");
              } else {
                actions.addTodo({
                  task: task,
                  duedate: duedate,
                  stage: "notdone",
                });
              }
            }
          }}
        >
          <div className="float-start ms-4 my-3">
            <span className="input-group-addon fw-light me-2 float-start">
              Task:
            </span>
            <input
              className="form-control fw-light task-input"
              type="text"
              placeholder={
                list?.length === 0
                  ? "No tasks, add a task"
                  : "What needs to be done?"
              }
              onChange={(event) => setTask(event.target.value)}
              // onKeyDown={(e) => {
              //   handleInput(e);
              // }}
              value={task}
            />
          </div>
          <div className="float-end my-3">
            <span className="input-group-addon fw-light float-start me-2">
              Due Date:
            </span>
            <input
              className="form-control fw-light"
              type="date"
              onChange={(event) => setDuedate(event.target.value)}
            ></input>
          </div>
        </form>
      </div>
      <div id="list">
        <ul>
          {store.todos.map((singleTask, i) => {
            return (
              <li
                className={`d-flex justify-content-between ps-5 py-2 text-muted fw-light fs-5 ${
                  singleTask.done ? "done" : ""
                }`}
                key={i}
              >
                {singleTask.task}{" "}
                <div className="theButtons">
                  <div
                    className="listDone"
                    onClick={() => {
                      let newList = [...list];
                      newList[i].done = !newList[i].done;
                      setList(newList);
                      actions.saveTodoList(newList);
                    }}
                  >
                    <i className="fas fa-check"></i>
                  </div>
                  <div
                    className="listDelete"
                    onClick={() => {
                      setList(store.todos.filter((deleteTask, j) => j !== i));
                      actions.saveTodoList(
                        store.todos.filter((deleteTask, j) => j !== i)
                      );
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="ps-3 py-2 fw-light text-start" id="footer">
          <span id="footerText">
            {list?.length} {list?.length === 1 ? "item" : "items"} left
          </span>
        </div>
      </div>
    </div>
  );
};
