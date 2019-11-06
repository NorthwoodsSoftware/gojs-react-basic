# gojs-react-basic

### By Northwoods Software for [GoJS 2.1](https://gojs.net)

This project provides a basic example of using GoJS in a React app.
Check out the [Intro page on using GoJS with React](https://gojs.net/latest/intro/react.html) for more information.

It makes use of the [gojs-react](https://github.com/NorthwoodsSoftware/gojs-react) package to handle some boilerplate for setting up and tearing down a Diagram component.

When running the sample, try moving around nodes, editing text, relinking, undoing (Ctrl-Z), etc. within the diagram
and you'll notice the changes are reflected in the inspector area. You'll also notice that changes
made in the inspector are reflected in the diagram. If you use the React dev tools,
you can inspect the React state and see it updated as changes happen.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
It also uses [immer](https://immerjs.github.io/immer/docs/introduction) to simplify state update operations.

## Installation

Start by running npm install to install all necessary dependencies.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
