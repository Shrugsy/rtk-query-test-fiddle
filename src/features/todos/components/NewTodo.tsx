import { css } from "@emotion/css";
import { FormEvent, useState } from "react";
import { useAddTodoMutation } from "../service";

const classes = {
  box: css`
    border: 1px solid black;
    border-radius: 8px;
    padding: 0 8px 8px 8px;
    margin: 8px 8px 32px 8px;
  `,
  row: css`
    width: 300px;
    display: flex;
  `,
  label: css`
    min-width: 80px;
  `,
  input: css`
    flex-grow: 1;
  `
}

function NewTodo() {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [addTodo, { isLoading }] = useAddTodoMutation();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) {
      console.error("Submission pending!");
      return;
    }
    addTodo({
      userName,
      message
    })
      .unwrap()
      .then(() => {
        setUserName("");
        setMessage("");
      })
      .catch((err) =>{ 
        console.error('Error submitting todo: ', err);
      })
  }

  return (
    <div className={classes.box}>
    <h3>Add a todo</h3>
    <form onSubmit={handleSubmit}>
      <div className={classes.row}>
        <label className={classes.label}>name: </label>
        <input
          className={classes.input}
          disabled={isLoading}
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className={classes.row}>
        <label className={classes.label}>message: </label>
        <input
          className={classes.input}
          disabled={isLoading}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button type="submit">submit</button>
    </form>
    </div>
  );
}

export default NewTodo;
