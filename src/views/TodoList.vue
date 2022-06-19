<template>
  <div class="todo">
    <h1>待辦清單</h1>
    <div class="todo-status">
      <router-link
        :to="{ name: 'TodoList' }"
        :class="{ active: checkStatus('all') }"
        replace
        >全部</router-link
      >
      <router-link
        :to="{ name: 'TodoList', query: { filter: 'active' } }"
        :class="{ active: checkStatus('active') }"
        replace
        >未完成</router-link
      >
      <router-link
        :to="{ name: 'TodoList', query: { filter: 'done' } }"
        :class="{ active: checkStatus('done') }"
        replace
        >已完成</router-link
      >
    </div>

    <div class="add-handler-container">
      <input type="text" v-model="newItem" class="add-handler__input" />
      <button @click="addItem" class="add-handler__add-btn">
        <img src="@/assets/plus.png" alt="完成" />
      </button>
    </div>
    <ul class="todo-items">
      <ToDoItem
        v-for="item of list"
        :key="item.tId"
        :todo="item.todo"
        :edit="edit === item.tId"
        @check="(value) => checkHandler(item.tId, value)"
        @editingStart="editingStart(item.tId)"
        @completeEdit="(value) => completeEdit(item.tId, value)"
        @cancelEdit="cancelEdit()"
        @deleteItem="deleteHandler(item.tId)"
      />
    </ul>
  </div>
</template>

<script>
import ToDoItem from '../components/ToDoItem.vue'
export default {
  components: { ToDoItem },
  data () {
    return {
      filter: 'all', // 1. all 2. done 3. active
      edit: null,
      newItem: ''
    }
  },
  computed: {
    list () {
      return this.$store.getters.filterList(this.filter)
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function (route) {
        this.edit = null
        const status = ['all', 'active', 'done']
        const nowQuery = route.query.filter
        if (!status.includes(nowQuery) && nowQuery) {
          this.$router.replace({ name: 'error' })
        }
        this.filter = nowQuery || 'all'
      }
    }
  },
  methods: {
    checkStatus (status) {
      switch (status) {
        case 'active':
          return this.$route.query.filter === 'active'
        case 'done':
          return this.$route.query.filter === 'done'
        case 'all':
          return !this.$route.query.filter
      }
    },
    addItem () {
      if (!this.newItem) return
      this.$store.dispatch('CREATE_TODO', {
        content: this.newItem,
        done: false
      })
      this.newItem = ''
    },
    checkHandler (tId, value) {
      this.$store.dispatch('CHECK_TODO', { tId: tId, done: value })
    },
    editingStart (tId) {
      this.edit = tId
    },
    completeEdit (tId, value) {
      this.$store.dispatch('UPDATE_TODO', { tId: tId, todo: value })
      this.edit = null
    },
    cancelEdit () {
      this.edit = null
    },
    deleteHandler (tId) {
      this.$store.dispatch('DELETE_TODO', { tId: tId })
      this.edit = null
    }
  },
  mounted () {
    this.$store.dispatch('READ_TODOS')
  }
}
</script>

<style scoped>
.todo {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 30em;
  margin: 0 auto;
}
.todo-status {
  display: flex;
  justify-content: center;
  gap: 0.5em;
  margin-bottom: 1em;
}
.todo-status a {
  text-decoration: none;
  padding: 0.5em 1em;
  color: rgb(82, 195, 255);
}
.todo-status .active {
  border-radius: 0.5em;
  background: rgba(152, 219, 255, 0.2);
}
.todo-items {
  width: 100%;
  padding: 0;
}
.add-handler-container {
  display: flex;
  justify-content: center;
  margin-left: 2em;
  width: 80%;
}
.add-handler__input {
  width: 100%;
  max-width: 30em;
  height: 3em;
  color: rgb(99, 99, 99);
  letter-spacing: 0.025em;
  font-size: 1em;
  padding-left: 1em;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 0.05);
  border: 1px solid rgb(0 0 0 / 0.05);
  border-radius: 0.5em;
}
.add-handler__add-btn {
  margin-left: 1em;
  padding: 0.5em;
  border: 0;
  border-radius: 0.5em;
  background: transparent;
  cursor: pointer;
}
.add-handler__add-btn img {
  display: block;
  width: 1.75em;
  height: 1.75em;
}
.add-handler__input:focus {
  outline: solid 2px rgb(82, 195, 255);
}
.add-handler__add-btn:active {
  background: rgb(244, 244, 244);
}
</style>
