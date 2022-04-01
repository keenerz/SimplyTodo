import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { TaskList } from "../component/tasklist";
import "../../styles/home.css";

export const Home = () => {
  return (
    <div className="container-flex">
      <div className="row px-5 d-flex justify-content-center" id="outerTask">
        <div
          className="text-center d-flex justify-content-center"
          id="innerTask"
        >
          <TaskList />
        </div>
      </div>
    </div>
  );
};
