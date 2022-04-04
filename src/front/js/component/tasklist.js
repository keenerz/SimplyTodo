import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/tasklist.css";

export const TaskList = () => {
  const { store, actions } = useContext(Context);
  const todos = JSON.parse(sessionStorage.getItem("todos"));
  let [task, setTask] = useState("");
  let [duedate, setDuedate] = useState(null);

  useEffect(() => {
    actions.loadTodos();
  }, []);

  return (
    <div className="justify-content-center w-100" id="whole">
      <div className="fw-light input-group">
        <form
          className="inputs"
          onSubmit={(e) => {
            if (task.trim() === "") {
              alert("Error 404: words not found");
              setTask("");
            } else {
              actions
                .addTodo({
                  task: task,
                  duedate: duedate,
                })
                .then(e.preventDefault());
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
                store.todos?.length === 0
                  ? "No tasks, add a task"
                  : "What needs to be done?"
              }
              onChange={(event) => {
                setTask(event.target.value);
                console.log(event.target.value);
              }}
              value={task}
            />
          </div>
          <div className="float-end my-3 me-4">
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
                <div className="theSelectors">
                  <select
                    className="feedback-input-selector"
                    aria-label="project_type"
                    value={singleTask.stage}
                    onChange={(e) => {
                      actions.changeTodoStage({
                        ...singleTask,
                        stage: e.target.value,
                      });
                    }}
                  >
                    <option value="">Stage</option>
                    <option value="notdone">Not Done</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="theButtons">
                  <div
                    className="listDelete"
                    onClick={(e) => {
                      actions.deleteTodo({ id: singleTask.id });
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
            {store.todos?.length} {store.todos?.length === 1 ? "item" : "items"}{" "}
            left
          </span>
        </div>
      </div>
    </div>
  );
};
