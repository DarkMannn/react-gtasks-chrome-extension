Todo:
- [x] implement navigating
- [x] implement scrolling
- [x] implement fetching
- [x] implement focusing on task-list from any webpage via shortcuts
- [x] keyboard shortcuts must work on entire window
- [x] implement reordering
- [x] implement switching visibility of completed/active tasks
- [x] clear and refactor the codebase
- [x] implement showing 'loading' and 'error' messages
- [x] optimize/cache key events and http requests
- [x] write better tests
- [x] throttle creation of tasks, so it will be optimistic
- [x] move completed items at the bottom, lock moving them above, have different color for them
- [ ] reducer actions don't make sense sometimes // watch for edit/delete/reload task in near future
- [ ] performance - too much resetting of listeners (maybe pass state in action fn-s)
- [ ] tasklist CRUD
- [ ] implement modifying single task
- [ ] see if you covered all of the functionalities from original GTask app
- [ ] see if some requests can be parallelized
- [ ] optimize css rendering
- [ ] implement styling
- [ ] create instructions

Refactor hooks:
- useEffect:
  - fetch inside useEffect
  - if you have a function as a dependency:
    - try to move it outside function component
    - try to make it a pure function and put it outside useEffect
    - use useCallback and put it inside useEffect
  - look if you need to cancel the actions if outdated
  - check if you have stale values inside useEffect:
    - use functional setState() update
    - use useReducer()
    - use useRef()