# gojs-react-basic

### By Northwoods Software for [GoJS](https://gojs.net)

This project provides a basic example of using GoJS in a React app.
Check out the [Intro page on using GoJS with React](https://gojs.net/latest/intro/react.html) for more information.

It makes use of the [gojs-react](https://github.com/NorthwoodsSoftware/gojs-react) package to handle some boilerplate for setting up and tearing down a Diagram component.

When running the sample, try moving around nodes, editing text, relinking, undoing (Ctrl-Z), etc. within the diagram
and you'll notice the changes are reflected in the inspector area. You'll also notice that changes
made in the inspector are reflected in the diagram. If you use the React dev tools,
you can inspect the React state and see it updated as changes happen.

For additional samples, see [gojs-react-samples](https://github.com/NorthwoodsSoftware/gojs-react-samples).

This project uses [immer](https://immerjs.github.io/immer/) to simplify state update operations.

## Installation

Start by running npm install to install all necessary dependencies.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
