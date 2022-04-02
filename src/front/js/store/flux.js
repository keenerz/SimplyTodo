const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      user: {},
      todos: [],
    },
    actions: {
      //Login and Token items
      getCurrentSession: () => {
        const session = JSON.parse(localStorage.getItem("session"));
        return session;
      },
      login: async (email, password) => {
        const store = getStore();
        const actions = getActions();
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        };

        try {
          const response = await fetch(
            process.env.BACKEND_URL + `/api/token`,
            options
          );
          if (response.status !== 200) {
            alert("Incorrect Email or Password");
            return false;
          }

          const data = await response.json();
          localStorage.setItem("session", JSON.stringify(data));
          setStore({ session: data });
          actions.loadTodos();
          return true;
        } catch (error) {
          console.error("Error in login zone");
        }
      },
      logout: () => {
        const store = getStore();
        const actions = getActions();
        localStorage.removeItem("session");
        setStore({ session: null });
      },
      //Todo Functions
      loadTodos: async () => {
        const store = getStore();
        const actions = getActions();
        const session = actions.getCurrentSession();
        let options = {
          headers: {
            Authorization: "Bearer " + session.token,
          },
        };
        const response = await fetch(
          process.env.BACKEND_URL + `/api/todos`,
          options
        );
        if (response.status === 200) {
          const payload = await response.json();
          sessionStorage.setItem("todos", JSON.stringify(payload));
          setStore({ todos: payload });
        }
      },
      addTodo: async (newTodos) => {
        const actions = getActions();
        const session = actions.getCurrentSession();
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session.token,
          },
          body: JSON.stringify({
            todos: newTodos.todos,
            stage: newTodos.stage,
            due_date: newTodos.due_date,
          }),
        };
        const response = await fetch(
          process.env.BACKEND_URL + `/api/todos`,
          options
        );
        if (response.status === 200) {
          const payload = await response.json();
          console.log("project created successfully!");
          actions.loadTodos();
          return payload;
        }
      },
      deleteTodo: async (todo) => {
        const actions = getActions();
        const session = actions.getCurrentSession();
        const options = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session.token,
          },
          body: JSON.stringify({
            id: todo.id,
          }),
        };
        const response = await fetch(
          process.env.BACKEND_URL + `/api/todos`,
          options
        );
        if (response.status !== 200) {
          alert("Error in first");
        }
        actions.loadTodos();
      },
    },
  };
};

export default getState;
