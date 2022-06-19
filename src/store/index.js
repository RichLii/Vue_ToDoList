import { createStore } from 'vuex'
import LocalStorage from '../modules/LocalStorage'

const STORE = new LocalStorage('todo-vue')

export default createStore({
  state: {
    todos: []
  },
  getters: {
    // 加入ID
    list (state) {
      return state.todos.map((todo, tId) => {
        return {
          tId: tId,
          todo
        }
      })
    },
    // 判斷狀態
    filterList (state, getters) {
      return function (filter) {
        let status = null
        switch (filter) {
          case 'all':
            document.title = '待辦清單'
            return getters.list
          case 'active':
            document.title = '待辦清單-未完成'
            status = false
            break
          case 'done':
            document.title = '待辦清單-已完成'
            status = true
            break
        }
        return getters.list.filter((todo) => {
          return todo.todo.done === status
        })
      }
    }
  },
  mutations: {
    SET_TODOS (state, todos) {
      state.todos = todos
    }
  },
  actions: {
    CREATE_TODO ({ commit }, todo) {
      const todos = STORE.load() ? STORE.load() : []
      todos.push(todo)
      STORE.save(todos)
      commit('SET_TODOS', todos)
      return {
        tId: todos.length - 1,
        todo
      }
    },
    READ_TODOS ({ commit }) {
      const todos = STORE.load() ? STORE.load() : []
      commit('SET_TODOS', todos)
      return {
        todos
      }
    },
    UPDATE_TODO ({ commit, state }, { tId, todo }) {
      if (state.todos[tId].content === todo) return
      const todos = STORE.load()
      // todos.splice(tId, 1, todo)'
      todos[tId].content = todo
      STORE.save(todos)
      commit('SET_TODOS', todos)
      return {
        tId: tId,
        content: todo
      }
    },
    CHECK_TODO ({ commit }, { tId, done }) {
      const todos = STORE.load()
      // todos.splice(tId, 1, todo)'
      todos[tId].done = done
      STORE.save(todos)
      commit('SET_TODOS', todos)
      return {
        tId: tId,
        todo: todos[tId]
      }
    },
    DELETE_TODO ({ commit }, { tId }) {
      const todos = STORE.load()
      const todo = todos.splice(tId, 1)[0]
      STORE.save(todos)
      commit('SET_TODOS', todos)
      return {
        tId: null,
        content: todo
      }
    }
  }
})
