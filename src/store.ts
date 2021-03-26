import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@rtk-incubator/rtk-query/dist";
import { todosApi } from "./features/todos/service";

export function setUpStore() {
  const store = configureStore({
    reducer: {
      [todosApi.reducerPath]: todosApi.reducer
    },
    middleware: (gDM) =>
      gDM({
        // immutableCheck: {
        //   warnAfter: 200
        // },
        // serializableCheck: {
        //   warnAfter: 200
        // }
      }).concat(todosApi.middleware)
  });

  setupListeners(store.dispatch);

  return store;
}

const store = setUpStore();

export type RootState = ReturnType<typeof store.getState>;

export default store;
