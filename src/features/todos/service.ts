import { createApi, fetchBaseQuery } from "@rtk-incubator/rtk-query";
import { Todo } from "./types";

export const todosApi = createApi({
  reducerPath: "todos",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/"
  }),
  entityTypes: ["Todo"],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => "todos",
      provides: (todos) => [
        ...todos.map((todo) => ({ type: "Todo", id: todo.id } as const)),
        { type: "Todo", id: "LIST" }
      ]
    }),
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (body) => ({
        url: "todos",
        method: "POST",
        body
      }),
      invalidates: [{ type: "Todo", id: "LIST" }]
    }),
    updateTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (body) => ({
        url: "todos",
        method: "POST",
        body
      }),
      invalidates: (response, body) => [{ type: "Todo", id: body.id }]
    }),
    deleteTodo: builder.mutation<Todo[], number>({
      query: (body) => ({
        url: `todos/${body}`,
        method: "DELETE"
      }),
      invalidates: (response, body) => [{ type: "Todo", id: body }]
    })
  })
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation
} = todosApi;

/**
 * Picks todo by id from result of all todos
 * @param id - ID of desired todo
 */
export const useGetTodoById = (id: number) => {
  const query = useGetTodosQuery(void 0, {
    selectFromResult: (query) => ({
      todo: query.data?.find((todo) => todo.id === id),
      ...query
    })
  });

  return query;
};
