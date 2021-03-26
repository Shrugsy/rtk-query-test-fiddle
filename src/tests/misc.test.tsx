import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { setupServer } from "msw/node";
import { format } from "date-fns";

import App from "../App";
import { setUpStore } from "../store";
import { handlers, resetData, numRequests } from "../mocks/handlers";
import sinon, { SinonFakeTimers } from "sinon";

const server = setupServer(...handlers);

async function setup() {
  const store = setUpStore();

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}

let clock: SinonFakeTimers;
beforeAll(() => {
  server.listen();
});
afterEach(() => {
  resetData();
  debugger
  server.resetHandlers();

  if (clock) clock.restore();
  jest.resetAllMocks();
});
afterAll(() => {
  server.close();
});

/*========================================*\
|             TEST 1 - no mocks            |
| passes as expected,                      |
| but logic to test date is duplicated     |
| from the app                             |
\*========================================*/
test("Tests miscellaneous stuff", async () => {
  console.log("====START TEST 1====");
  // [ASSERT] - should be no get requests sent before setup
  expect(numRequests.get).toBe(0);

  // [ACT] - render the app
  await setup();

  // [ASSERT] - should show the current formatted date
  const currentFormattedDate = format(new Date(), "do MMM yyyy");
  screen.getByText(`Todays date: ${currentFormattedDate}`);

  // [ASSERT] - should find the name of the user fetched as part of the todo data
  await screen.findByText(/john/i);

  // [ASSERT]- one request should be sent after setup (a single 'getTodos' query)
  expect(numRequests.get).toBe(1);

  console.log("====END TEST 1====");
});

/*========================================*\
|       TEST 2 - mocked 'Date' object      |
| Mock makes 'new Date()' always return    |
| date at 2020-03-01T00:00:00.000Z         |
| Side effect of this is that comparing    |
| timestamp diffs results in same value,   |
| but I can't see side effects in behavior |
\*========================================*/
test("Tests miscellaneous stuff, but with a mocked date at a given time", async () => {
  console.log("====START TEST 3====");
  clock = sinon.useFakeTimers({
    now: new Date("2020-03-01"),
    toFake: ["Date"],
  });

  // [ASSERT] - should be no get requests sent before setup
  expect(numRequests.get).toBe(0);

  // [ACT] - render the app
  await setup();

  // [ASSERT] - should show the 'current' formatted date (using the mocked date)
  screen.getByText("Todays date: 1st Mar 2020");

  // [ASSERT] - should find the name of the user fetched as part of the todo data
  await screen.findByText(/john/i);

  // [ASSERT]- one request should be sent after setup (a single 'getTodos' query)
  expect(numRequests.get).toBe(1);

  console.log("====END TEST 2====");
});

/*========================================*\
|       TEST 3 - mocked 'Date' object      |
| Mock makes 'new Date()' always return    |
| date at 1970-01-01T00:00:00.000Z         |
| Side effect of this is that              |
| extra requests get sent                  |
\*========================================*/
test("Tests miscellaneous stuff, but with a mocked date at unix epoch", async () => {
  console.log("====START TEST 3====");
  clock = sinon.useFakeTimers({
    toFake: ["Date"],
  });

  // [ASSERT] - should be no get requests sent before setup
  expect(numRequests.get).toBe(0);

  // [ACT] - render the app
  await setup();

  // [ASSERT] - should show the 'current' formatted date (using the mocked date)
  screen.getByText("Todays date: 1st Jan 1970");

  // [ASSERT] - should find the name of the user fetched as part of the todo data
  await screen.findByText(/john/i);

  // [ASSERT] - one request should be sent after setup (a single 'getTodos' query)
  // [NOTE] - fails here, sends additional requests
  expect(numRequests.get).toBe(1);

  console.log("====END TEST 3====");
});


/*========================================*\
|  TEST 4 - mocked 'setTimeout' function   |
| Mock makes 'setTimeout' calls get        |
| handled manually in tests using an api   |
| like 'clock.tick(500)'                   |
| Mocking 'setTimeout' prevents data from  |
| being received.                          |
| Unsure of the cause.                     |
\*========================================*/
test("Tests miscellaneous stuff, but with a mocked setTimeout", async () => {
  console.log("====START TEST 4====");

  clock = sinon.useFakeTimers({
    toFake: ["setTimeout"],
  });

  // [ASSERT] - should be no get requests sent before setup
  expect(numRequests.get).toBe(0);

  // [ACT] - render the app
  await setup();

  // [ASSERT] - should show the current formatted date
  const currentFormattedDate = format(new Date(), "do MMM yyyy");
  screen.getByText(`Todays date: ${currentFormattedDate}`);

  // [ACT] - run all pending timers (doesn't seem to help)
  await act(async () => {
    clock.runAll();
  })

  // [ASSERT] - should find the name of the user fetched as part of the todo data
  // [NOTE] - fails here
  await screen.findByText(/john/i);

  // [ASSERT]- one request should be sent after setup (a single 'getTodos' query)
  expect(numRequests.get).toBe(1);

  console.log("====END TEST 4====");
});

/*========================================*\
|  TEST 5 - mocked timers via jest         |
| Passes fine                              |
\*========================================*/
test("Tests miscellaneous stuff, but with mocked timers using jest", async () => {
  console.log("====START TEST 5====");

  jest.useFakeTimers();

  // [ASSERT] - should be no get requests sent before setup
  expect(numRequests.get).toBe(0);

  // [ACT] - render the app
  await setup();

  // [ASSERT] - should show the current formatted date
  const currentFormattedDate = format(new Date(), "do MMM yyyy");
  screen.getByText(`Todays date: ${currentFormattedDate}`);

  // [ASSERT] - should find the name of the user fetched as part of the todo data
  await screen.findByText(/john/i);

  // [ASSERT]- one request should be sent after setup (a single 'getTodos' query)
  expect(numRequests.get).toBe(1);

  console.log("====END TEST 5====");
});

/*========================================*\
|             TEST 6 - no mocks            |
| Passes as expected,                      |
| but logic to test date is duplicated     |
| from the app.                            |
| Same as test 1, just repeated as a       |
| sanity check to ensure failures aren't   |
| caused by test bleeding                  |
\*========================================*/
test("[Sanity check] - Tests miscellaneous stuff after other tests", async () => {
  console.log("====START TEST 6====");

  // [ASSERT] - should be no get requests sent before setup
  expect(numRequests.get).toBe(0);

  // [ACT] - render the app
  await setup();

  // [ASSERT] - should show the current formatted date
  const currentFormattedDate = format(new Date(), "do MMM yyyy");
  screen.getByText(`Todays date: ${currentFormattedDate}`);

  // [ASSERT] - should find the name of the user fetched as part of the todo data
  await screen.findByText(/john/i);

  // [ASSERT]- one request should be sent after setup (a single 'getTodos' query)
  expect(numRequests.get).toBe(1);

  console.log("====END TEST 6====");
});
