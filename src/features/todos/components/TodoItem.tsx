import { css } from "@emotion/css";
import { useDeleteTodoMutation, useGetTodoById } from "../service";

type TodoItemProps = {
  id: number;
};
function TodoItem({ id }: TodoItemProps) {
  const { todo } = useGetTodoById(id);

  const [deleteTodo, { isLoading }] = useDeleteTodoMutation();

  if (!todo) return null;

  function handleDelete(id: number) {
    deleteTodo(id);
  }

  return (
    <div
      key={todo.id}
      className={css`
        margin: 8px;
        padding: 8px;
        border: 1px solid black;
        border-radius: 8px;
      `}
    >
      {isLoading ? <div>Deleting...</div> : null}
      <div>
        <strong>id:</strong> {todo.id}
      </div>
      <div>
        <strong>user:</strong> {todo.userName}
      </div>
      <div>
        <strong>message:</strong> {todo.message}
      </div>
      <button onClick={() => handleDelete(todo.id)} disabled={isLoading}>
        delete
      </button>
    </div>
  );
}

export default TodoItem;
