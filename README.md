Todo:
- [x] implement navigating
- [x] implement scrolling
- [x] implement fetching
- [ ] implement showing 'loading' and 'error' messages
- [ ] implement modifying single task
- [ ] optimize css rendering
- [x] implement focusing on task-list from any webpage via shortcuts
- [ ] see if you covered all of the functionalities from original GTask app
- [x] keyboard shortcuts must work on entire window
- [ ] implement styling
- [ ] create instructions
- [ ] hide api key? https://www.reddit.com/r/webdev/comments/7h9xb6/is_there_a_way_for_me_to_hide_my_google_api_key/
- [ ] task list CRUD

Current:
- [x] implement reordering
- [x] implement switching visibility of completed/active tasks
- [ ] clear and refactor the codebase
- [ ] optimize/cache key events and http requests

Current current:
- [x] delete unfocused throws
- [x] empty list throws
- [ ] space in the middle of edit? other mixed commands?

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
