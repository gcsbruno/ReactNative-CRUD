import {create} from 'apisauce'

const api = create({
    baseURL: 'https://jsonplaceholder.typicode.com/todos/1'
})

api.addResponseTransform(response => {
    if (!response.ok) throw response
})

export default api;

