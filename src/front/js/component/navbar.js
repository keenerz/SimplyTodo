import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../store/appContext.js";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const session = actions.getCurrentSession();
  const history = useHistory();

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        {!session ? (
          <Link to="/">
            <span className="navbar-brand mb-0 h1">SimplyTodo</span>
          </Link>
        ) : (
          <Link to="/todos">
            <span className="navbar-brand mb-0 h1">SimplyTodo</span>
          </Link>
        )}
        <div className="ml-auto">
          {!session ? (
            <Link to="/">
              <button className="btn btn-primary me-2">
                Login / Create User
              </button>
            </Link>
          ) : (
            <button
              className="btn btn-danger log me-2"
              onClick={() => {
                actions.logout();
                history.push("/");
              }}
            >
              Log me out!
            </button>
          )}
          {session ? (
            <Link to="/settings">
              <button className="btn btn-primary">
                <i className="fas fa-user-lock me-1"></i>
                Account Settings
              </button>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  );
};
