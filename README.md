# rtk-query-test-fiddle

This repo is intended to explore the behaviour of rtk-query in certain test environments.

Run `npm run test` to run the tests, or check the tests in the latest build under the [github actions](https://github.com/Shrugsy/rtk-query-test-fiddle/actions) for this project.  

Current observed behaviour:  

- Test 3 - Mocking the 'Date' object using `sinon.useFakeTimers` with no 'now' date specified (i.e. using the unix epoch date, with a timestamp of 0) causes additional requests to be sent compared to normal in a situation.  
  e.g. when one component uses a `query`, and many other components use the same `query`, only one request should be sent. However in the scenario for this test, multiple requests get sent.  
  NOTE: does not seem to occur if providing a 'now' date to `sinon.useFakeTimers` (as in Test 2)

- Test 4 - Mocking the `setTimeout` function using `sinon.useFakeTimers` prevents data from being received. Unknown what might cause this.  
  NOTE: does not seem to occur when using `jest.useFakeTimers()` (as in Test 5)
