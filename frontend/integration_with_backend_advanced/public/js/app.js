(() => {
  const App = {
    htmlElements: {
      taskForm: document.getElementById("task-form"),
      mainTaskList: document.querySelector(".main-task-list"),
    },
    init: () => {
      App.initializeData.tasks();
      App.bindEvents();
    },
    bindEvents: () => {
      App.htmlElements.taskForm.addEventListener(
        "submit",
        App.events.onTaskFormSubmit
      ),
        App.htmlElements.mainTaskList.addEventListener(
          "change",
          App.events.onCompletedTask
        );
      App.htmlElements.mainTaskList.addEventListener(
        "click",
        App.events.onDeleteTask
      );
    },
    initializeData: {
      tasks: async () => {
        const { data } = await App.utils.getData(
          "http://localhost:4000/api/v1/tasks/"
        );
        data.forEach((task) => {
          App.events.addTask({ name: task.name, status: task.completed });
        });
      },
    },
    events: {
      addTask: ({ name, status }) => {
        App.htmlElements.mainTaskList.innerHTML += `<div class="task-list"><div><input ${
          status === true ? "checked" : ""
        } type="checkbox" class="checkbox" name="rendered-task" data-status="${status}" id="${name}" ><label for="${name}" style="text-decoration:${
          status === true ? "line-through" : ""
        }">${name}</label></div><button type="button">Borrar</button></div>`;
      },
      onCompletedTask: async (event) => {
        if (event.target.nodeName === "INPUT") {
          const nameInput = event.target.id;
          const completedInput =
            event.target.getAttribute("data-status") === "false";

          if (completedInput) {
            event.target.parentElement.children[1].style.textDecoration =
              "line-through";
          } else {
            event.target.parentElement.children[1].style.textDecoration =
              "none";
          }

          const data = {
            name: nameInput,
            completed: completedInput,
          };
          document
            .getElementById(event.target.id)
            .setAttribute("data-status", completedInput);

          await App.utils.patchData(
            "http://localhost:4000/api/v1/tasks/",
            data,
            nameInput
          );
        }
      },
      onDeleteTask: async (event) => {
        if (event.target.nodeName === "BUTTON") {
          event.target.parentElement.remove();
          await App.utils.deleteData(
            "http://localhost:4000/api/v1/tasks/",
            event.target.parentElement.children[0].children[0].id
          );
        }
      },
      onTaskFormSubmit: async (event) => {
        event.preventDefault();
        const {
          task: { value: taskValue },
        } = event.target.elements;
        App.events.addTask({ name: taskValue, status: "false" });
        // Guardar en el servidor
        await App.utils.postData("http://localhost:4000/api/v1/tasks/", {
          name: taskValue,
          completed: false,
        });
      },
    },
    utils: {
      getData: async (url = "") => {
        const response = await fetch(url);
        return response.json();
      },
      // Ejemplo implementando el metodo POST:
      postData: async (url = "", data = {}) => {
        // Opciones por defecto estan marcadas con un *
        const response = await fetch(url, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      },
      patchData: async (url = "", data = {}, id) => {
        const response = await fetch(url + id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        return response.json();
      },
      deleteData: async (url = "", id) => {
        const response = await fetch(url + id, {
          method: "DELETE",
        });
        return response.json();
      },
    },
  };
  App.init();
})();
