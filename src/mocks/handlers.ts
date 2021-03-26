import { rest } from "msw";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { Todo } from "../features/todos/types";

/* eslint-disable @typescript-eslint/no-use-before-define */

const adapter = createEntityAdapter<Todo>();
let state = adapter.getInitialState();
let currentId = 1;
populateInitialData();

export { state };

export const numRequests = {
  get: 0,
  post: 0,
  delete: 0
}

export const handlers = [
  rest.get("/api/todos", (req, res, ctx) => {
    numRequests.get++;
    console.log('[GET] - received request: ', req)
    return res(ctx.json(Object.values(state.entities)));
  }),

  rest.post("/api/todos", (req, res, ctx) => {
    numRequests.post++;

    if (!req.body || typeof req.body !== "object") {
      return res(
        ctx.status(404),
        ctx.json({ detail: `Bad request received` }),
        ctx.delay(800)
      );
    }
    if ("id" in req.body) {
      const { id } = req.body;
      if (state.ids.includes(id)) {
        // update existing
        state = adapter.updateOne(state, {
          id: id,
          changes: req.body as Todo
        });
      } else {
        return res(
          ctx.status(404),
          ctx.json({ detail: `Todo ${id} does not exist` }),
          ctx.delay(800)
        );
      }
    } else {
      // add new
      const newTodo = req.body as Omit<Todo, "id">;
      state = adapter.addOne(state, { ...newTodo, id: currentId });
      currentId += 1;
    }
    return res(ctx.json(Object.values(state.entities)), ctx.delay(800));
  }),

  rest.delete("/api/todos/:id", (req, res, ctx) => {
    numRequests.delete++;
    const { id } = req.params;
    state = adapter.removeOne(state, id);
    return res(ctx.json(Object.values(state.entities)), ctx.delay(800));
  })
];

export function populateInitialData() {
  state = adapter.setAll(state, [
    { id: 1, userName: "john", message: "do stuff" },
    { id: 2, userName: "frank", message: "do some other stuff" }
  ]);
  currentId = 3;
}

export function resetData() {
  populateInitialData();
  numRequests.get = 0;
  numRequests.post = 0;
  numRequests.delete = 0;
}