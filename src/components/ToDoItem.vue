<template>
  <li
    class="todo-item"
    :style="{ '--item-hight': textHeight }"
    @click="expand()"
  >
    <template v-if="!edit">
      <label class="check-container">
        <input type="checkbox" v-model="done" />
        <div class="check-mark">
          <span class="check-mark__fill"></span>
        </div>
      </label>
      <span
        class="todo-text"
        :class="{ truncate: ellipsis && !isExpand }"
        ref="todoText"
        >{{ todo.content }}</span
      >
      <button @click="editingStart" class="btn modify">
        <img src="@/assets/more.png" alt="完成" class="btn__image" />
      </button>
    </template>
    <template v-else>
      <textarea v-model="editContent" class="modify-input" />
      <div class="btn-container">
        <button @click="completeEdit" class="btn">
          <img src="@/assets/checked.png" alt="完成" class="btn__image" />
        </button>
        <button @click="cancelEdit" class="btn">
          <img src="@/assets/x-button.png" alt="取消" class="btn__image" />
        </button>
        <button @click="$emit('deleteItem')" class="btn">
          <img src="@/assets/delete.png" alt="刪除" class="btn__image" />
        </button>
      </div>
    </template>
  </li>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      require: true
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editContent: this.todo.content,
      isExpand: false,
      textHeight: '3em'
    }
  },
  computed: {
    done: {
      get () {
        return this.todo.done
      },
      set (value) {
        this.$emit('check', value)
      }
    },
    ellipsis () {
      return this.todo.content.length > 20
    }
  },
  methods: {
    expand () {
      if (this.todo.content.length > 20) {
        this.isExpand = !this.isExpand
        setTimeout(() => {
          const realHeight = this.$refs.todoText.offsetHeight + 30 + 'px'
          this.textHeight = this.isExpand ? realHeight : '3em'
        }, 0)
      }
    },
    editingStart () {
      this.$emit('editingStart')
    },
    completeEdit () {
      this.$emit('completeEdit', this.editContent)
    },
    cancelEdit () {
      this.editContent = this.todo.content
      this.$emit('cancelEdit')
    }
  }
}
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.todo-item {
  --item-hight: 3em;
  display: flex;
  align-items: center;
  padding: 0.8em 1em;
  border: 1px solid rgb(240, 240, 240);
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 0.05);
  border-radius: 1em;
  height: var(--item-hight);
  margin-top: 0.5em;
  cursor: pointer;
  transition: height 200ms;
  overflow: hidden;
}
.todo-item .modify {
  margin-left: auto;
}
.todo-text {
  width: 75%;
  text-align: left;
  letter-spacing: 0.05em;
  color: rgb(108, 108, 108);
  margin-left: 1em;
  word-break: break-all;
}
.check-container {
  cursor: pointer;
}
.check-container input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
}
.check-mark {
  position: relative;
  width: 1.25em;
  height: 1.25em;
  border-radius: 100%;
  border: 2px solid rgb(240, 240, 240);
  background: transparent;
}
.check-mark__fill {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1em;
  height: 1em;
  border-radius: 100%;
  transform: translate(-50%, -50%);
}
.check-container input:checked ~ .check-mark {
  border-color: rgb(96, 184, 255);
}
.check-container input:checked ~ .check-mark .check-mark__fill {
  background: rgb(96, 184, 255);
}
.modify-input {
  padding: 0.3em 0.8em;
  width: 65%;
  height: 100%;
  border-radius: 0.5em;
  border: 1px solid rgb(240, 240, 240);
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 0.1);
  font-size: 1.2em;
  letter-spacing: 0.05em;
  word-break: break-all;
  color: rgb(108, 108, 108);
  resize: none;
}
.modify-input:focus {
  outline: transparent;
  border: 2px solid rgb(188, 188, 188);
}
.btn-container {
  margin-left: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
}
.btn {
  background: rgb(255, 255, 255);
  border: 0;
  padding: 0.5em;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 0.1);
  border-radius: 0.5em;
  cursor: pointer;
}
.btn__image {
  display: block;
  width: 1.5em;
  height: 1.5em;
}
.btn:active {
  background: rgb(244, 244, 244);
}
</style>
