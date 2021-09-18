# TODO

> Info: Order of to-dos is not strict.

- Move auth middleware to route-level from root-level
- Implement authorization using JWT
- Implement account creation and deletion
- Check the requested content ID globally instead of filtering for current user
- Remove boilerplate code that unifies all model objects returned in each route and instead write reusable code for that
- Seperate database operations and middlewares thus make controllers reusable
- Add unit and integration tests
- Add email verification requirement for account creation and deletion
- Add tasks/events with recurrible dates
- Encrypt the _most_ data as possible while not sacrificing functionality
- Prevent spam requests and DDOS attacks
- Dockerize the project
- Create a descriptive `README.md`
