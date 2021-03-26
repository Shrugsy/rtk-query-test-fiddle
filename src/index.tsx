import { render } from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store";
import { worker } from "./mocks/browser";

const rootElement = document.getElementById("root");
worker.start().then(() => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement
  );
});
