(() => {
    const App = {
        htmlElements: {
            taskForm: document.getElementById('task-form'),
            mainTaskList: document.querySelector('.main-task-list'),
            task: document.getElementById('task'),
            tasksList: document.getElementById('tasks_list'),
            updateReg: document.getElementById('update-data'),
            doneT: document.getElementById('check3'),
            indice: "",
        },
        init: () => {
            App.bindEvents();
            App.initializeData.showTasks();
            App.htmlElements.tasksList.addEventListener('click', App.events.tasksList)
            App.htmlElements.updateReg.addEventListener('click', App.events.actualizarRegistro)
            App.htmlElements.doneT.addEventListener('click', App.initializeData.doneTasks)
        },
        bindEvents: () => {
            App.htmlElements.taskForm.addEventListener('submit', App.events.onTaskFormSubmit);
        },
        initializeData: {
            showTasks: async () => {
                const { count, data } = await App.endpoints.getTasks();
                for(var i=0;i<data.length;i++) {
                    App.functions.showTask(data[i], i);
                }
            },
            doneTasks: async () => {
                const { count, data } = await App.endpoints.getTasks();
                for(var i=0;i<data.length;i++) {
                    App.functions.doneTask(data[i], i);
                }
            },
        },
        events: {
            onTaskFormSubmit: async (event) => {
                event.preventDefault();
                const { task: { value: taskValue } } = event.target.elements;
                // App.htmlElements.mainTaskList.innerHTML +==`
                // <div>
                //     <input type="checkbox" name="rendered-task">
                //     <label id="${id}">${taskValue}</label>
                //     <button class="actualizar" id="${id}">Actualizar</button>
                //     <button class="borrar" id="${id}">Borrar</button>
                // </div>
                // <br>
                // `;
                // Guardar en el servidor
                await App.utils.postData('http://localhost:4000/api/v1/tasks/', {
                    name: taskValue,
                    completed: false,
                })
                App.htmlElements.mainTaskList.innerHTML="";
                App.initializeData.showTasks();
            },
            tasksList: (e) => {
                e.preventDefault();
                if(e.target.classList=="borrar"){
                    let id = e.target.parentNode.querySelector('button').id
                    let name = e.target.parentNode.querySelector('label').innerHTML
                    App.events.borrar(id, name);
                } else if(e.target.classList=="actualizar") {
                    let id = e.target.parentNode.querySelector('button').id
                    let name = e.target.parentNode.querySelector('label').innerHTML
                    App.events.actualizar(id, name);
                }
            },
            actualizar: (id, name) => {
                App.htmlElements.task.value = name;
                App.htmlElements.indice = id;

            },
            actualizarRegistro: async () => {
                let id = App.htmlElements.indice
                let valTask = App.htmlElements.task.value
                await App.endpoints.patchTasks({
                    name: valTask
                }, id);

                App.htmlElements.task.value =""
                App.htmlElements.indice = ""
                App.htmlElements.mainTaskList.innerHTML="";
                App.initializeData.showTasks();
            },
            borrar: async (id, name) => {
                const taskName = name
                await App.endpoints.deleteUsers({
                    name: taskName
                }, id);
                App.htmlElements.mainTaskList.innerHTML="";
                App.initializeData.showTasks();
            },
        },
        endpoints: {
            getTasks: () => {
                return App.utils.get("http://localhost:4000/api/v1/tasks/", "GET")
            },
            patchTasks: (payload, id) => {
                // console.log(payload)
                return App.utils.patch(`http://localhost:4000/api/v1/tasks/${id}`, payload);
            },
            deleteUsers: (payload, id) => {
                return App.utils.delete(`http://localhost:4000/api/v1/tasks/${id}`, payload);
            },
        },
        utils: {
            get: async (url, method) => {
                const requestOptions = { method };
                const response = await fetch(url, requestOptions);
                return response.json();
            },
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
            },
            patch: async (url = "", data = {}) => {
                console.log(data)
                const response = await fetch(url, {
                  method: "PATCH",
                  dataType: 'json',
                  headers: {"Content-Type": "application/json",},
                  body: JSON.stringify(data),
                });
                return response.json();
            },
            delete: async (url = "", data = {}) => {
                const response = await fetch(url, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json",},
                    body: JSON.stringify(data),
                });
                console.log('tiene respuesta')
                return await response.json();
            }
        },
        functions: {
            showTask: ({name, completed}, id) => {
                const newDiv =`
                <div>
                    <input type="checkbox" name="render-task" id="check3">
                    <label id="${id}" class="tachado">${name}</label>
                    <button class="actualizar" id="${id}">Actualizar</button>
                    <button class="borrar" id="${id}">Borrar</button>
                </div>
                <br>
                `;
                App.htmlElements.mainTaskList.innerHTML  += newDiv
            },
            doneTask: ({name, completed}, id) => {
                const newDiv =`
                <div>
                    <input type="checkbox" name="check3" id="check3">
                    <label id="${id}" class="tachado" for="check3">${name}</label>
                    <button class="actualizar" id="${id}">Actualizar</button>
                    <button class="borrar" id="${id}">Borrar</button>
                </div>
                <br>
                `;
                App.htmlElements.mainTaskList.innerHTML  += newDiv
            },
        },
    };
    App.init();
})();

//rendered-task 