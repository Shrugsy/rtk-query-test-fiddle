import TodoApp from "./features/todos/components/TodoApp";
import { format } from "date-fns";

export default function App() {
  return (
    <div className="App">
      <h1>RTK Query - Date mocking test demo</h1>
      <h2>Todays date: {format(new Date(), "do MMM yyyy")}</h2>
      <TodoApp />
    </div>
  );
}
