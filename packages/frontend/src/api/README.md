# API Structure

Alphaday's frontend API consists of three main modules:

-   `services/`: which contains all the backend API logic, as well as external API modules. All API queries are provided as hooks and are written using `rtk-query`.
-   `store/`: which provides the global state tree definition as well as all the store actions/reducers (ie. functions that modify the app state). These are defined using redux toolkit's primitives like `createSlice`.
-   `hooks/`: which provides common hooks to be reused accross diferent components

# Guidelines for consumer components

In general, only React container components should interact with the hooks in `services/`
and dispatch actions in the `store/` API.
UI components, in turn, may consume the `hooks` API, as long as these do not handle global state
logic.
