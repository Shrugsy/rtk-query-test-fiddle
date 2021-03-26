import { useGetTodosQuery } from "../service";
import TodoItem from "./TodoItem";

function TodoList() {
  const { data } = useGetTodosQuery();

  if (!data) return null;

  return (
    <div>
      {data.map(({ id }) => (
        <TodoItem key={id} id={id} />
      ))}
    </div>
  );
}

export default TodoList;
