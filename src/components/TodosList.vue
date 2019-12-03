<template>
  <div v-if="isLoadingTodosList">
    <div>Fetching todos...</div>
  </div>
  <div v-else class="container mx-auto px-4">
    <ul class="mb-4">
      <li v-for="i in todos" :key="i.id" class="pb-2 h-12">
        <input
          :id="i.id"
          :checked="i.status === 'Completed'"
          :value="i.status"
          class="mr-4"
          type="checkbox"
          @change="
            changeTodoStatus({
              id: i.id,
              status: i.status === 'Completed' ? 'Incomplete' : 'Completed',
            })
          "
        />
        <span>{{ i.title }}</span>
        <button
          v-if="i.createdBy.id === currentUser.id"
          class="ml-4 text-red-500 font-bold p-1 rounded outline-none focus:outline-none focus:shadow-outline"
          :disabled="i.id === todoBeingDeleted"
          @click="handleDeleteTodo(i.id)"
        >
          {{ i.id === todoBeingDeleted ? 'Deleting...' : 'Delete' }}
        </button>
      </li>
    </ul>
    <form @submit.prevent="addTodo">
      <input
        v-model="title"
        autofocus
        class="mr-4 px-2 py-2 border-2 border-blue-500 rounded outline-none focus:shadow-outline"
        type="text"
        name="new-todo"
      />
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded outline-none focus:outline-none focus:shadow-outline"
        type="submit"
        :disabled="isAddingTodo"
      >
        {{ isAddingTodo ? 'Adding...' : 'Add Todo' }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import {
  ADD_TODO,
  CHANGE_TODO_STATUS,
  DELETE_TODO,
} from '@/graphql/documents/mutations';
import { CURRENT_USER, TODOS_LIST } from '@/graphql/documents/queries';
import { SUBSCRIBE_TO_TODOS } from '@/graphql/documents/subscriptions';
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import { createComponent, ref } from '@vue/composition-api';

const TodosList = createComponent({
  setup() {
    const title = ref('');

    const {
      loading: isLoadingCurrentUser,
      result: currentUserQueryResult,
    } = useQuery(CURRENT_USER);

    const currentUser = useResult(currentUserQueryResult);

    // GET

    const {
      loading: isLoadingTodosList,
      result: todosListQueryResult,
      subscribeToMore: subscribeToMoreTodos,
    } = useQuery(TODOS_LIST, null, {
      enabled: !!currentUser.value,
    });

    const todos = useResult(
      todosListQueryResult,
      [],
      data => data.todosList.items,
    );

    // SUB

    subscribeToMoreTodos(() => ({
      document: SUBSCRIBE_TO_TODOS,
      updateQuery: (prev, { subscriptionData }) => {
        const { mutation, node, previousValues } = subscriptionData.data.Todos;

        if (mutation === 'create' && node) {
          const todoExists = prev.todosList.items.some(
            (i: any) => i.id === node.id,
          );

          if (!todoExists) {
            return {
              todosList: {
                ...prev.todosList, // __typename stuffs :sigh:
                items: [...prev.todosList.items, node],
                count: prev.todosList.count + 1,
              },
            };
          }
        }

        if (mutation === 'update' && previousValues && node) {
          const todo = prev.todosList.items.find((i: any) => i.id === node.id);

          if (todo) {
            todo.status === node.status;
          }

          return prev;
        }

        if (mutation === 'delete' && previousValues) {
          const todoExists = prev.todosList.items.some(
            (i: any) => i.id === previousValues.id,
          );

          if (todoExists) {
            return {
              todosList: {
                ...prev.todosList,
                items: prev.todosList.items.filter(
                  (i: any) => i.id !== previousValues.id,
                ),
                count: prev.todosList.count - 1,
              },
            };
          }
        }

        return prev;
      },
    }));

    // CREATE

    const {
      mutate: addTodo,
      loading: isAddingTodo,
      onDone: onTodoAdded,
    } = useMutation(ADD_TODO, () => ({
      variables: { title: title.value },
      update: (cache, { data: { todoCreate: newTodo } }) => {
        const queryOptions = { query: TODOS_LIST };
        const { todosList } = cache.readQuery<any>({ ...queryOptions });
        const todoExists: boolean = todosList.items.some(
          (i: any) => i.id === newTodo.id,
        );
        if (!todoExists) {
          const data = {
            todosList: {
              ...todosList,
              items: [...todosList.items, newTodo],
              count: todosList.count + 1,
            },
          };
          cache.writeQuery({ data, ...queryOptions });
        }
      },
    }));

    onTodoAdded(() => {
      title.value = '';
    });

    // DELETE

    const todoBeingDeleted = ref<string>(null);

    const { mutate: deleteTodo, onDone: onTodoDeleted } = useMutation(
      DELETE_TODO,
    );

    onTodoDeleted(() => {
      todoBeingDeleted.value = null;
    });

    const handleDeleteTodo = (id: string) => {
      todoBeingDeleted.value = id;
      return deleteTodo({ id });
    };

    // UPDATE

    const { mutate: changeTodoStatus } = useMutation(CHANGE_TODO_STATUS);

    return {
      isLoadingCurrentUser,
      currentUser,
      isLoadingTodosList,
      todos,
      addTodo,
      isAddingTodo,
      title,
      todoBeingDeleted,
      handleDeleteTodo,
      changeTodoStatus,
    };
  },
});

export default TodosList;
</script>
