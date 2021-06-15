(() => {
    const App = {
        htmlElements: {
            taskForm: document.getElementById('task-form'),
            mainTaskList: document.querySelector('.main-task-list'),
        },
        init: () => {
            App.bindEvents();
        },
        bindEvents: () => {
            App.htmlElements.taskForm.addEventListener('submit', App.events.onTaskFormSubmit);
        },
        events: {
            onTaskFormSubmit: async (event) => {
                event.preventDefault();
                const { task: { value: taskValue } } = event.target.elements;
                App.htmlElements.mainTaskList.innerHTML += `<div><input type="checkbox" name="rendered-task"><label for="">${taskValue}</label></div><br>`;

                // Guardar en el servidor
                await App.utils.postData('http://localhost:4000/api/v1/tasks/', {
                    name: taskValue,
                    completed: false,
                })
            }
        },
        utils: {
            // Ejemplo implementando el metodo POST:
            postData: async (url = '', data = {}) => {
                // Opciones por defecto estan marcadas con un *
                const response = await fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(data) // body data type must match "Content-Type" header
                });
                return response.json(); // parses JSON response into native JavaScript objects
            }
        }
    };
    App.init();
})();