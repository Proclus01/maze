//jshint esversion:9

// Please open index.html in browser to run this app

// import and destructure objects from matter.js
const { Engine, Render, Runner, World, Bodies } =
  Matter;

const engine = Engine.create(); // Initialize engine
const { world } = engine; // Capture world object

// Config variables for vertical and horizontal walls initializer
const cells = 3;

// Square canvas shapes simplifies our maze generating logic for prototype
const width = 600;
const height = 600;

const render = Render.create({
  // Render.create() takes config object
  // where to display our element (inserts canvas element to HTML)
  element: document.body,
  engine: engine,
  options: {
    // declare size of canvas in pixels
    width,
    height,
    wireframes: false // render solid objects w/ random colours
  },
});

Render.run(render); // Activate renderer
Runner.run(Runner.create(), engine); // Link the runner

// Render a static shape
const shape = Bodies.rectangle(
    200, 200, 50, 50, // pos(x), pos(y), len(x), len(y)
    {
    isStatic: true, // show the shape but never move it
    }   
);

// Walls added to borders of canvas
const walls = [
  Bodies.rectangle(
    width / 2, // pos x
    0, // pos y
    width, // len x
    40, // len y
    { isStatic: true } // show the shape but never move it
    ),
  Bodies.rectangle(
    width / 2, 
    height, 
    width, 
    40, 
    { isStatic: true }
    ),
  Bodies.rectangle(
    0, 
    height / 2, 
    40, 
    height, 
    { isStatic: true }
    ),
  Bodies.rectangle(
    width, 
    height / 2, 
    40, 
    height, 
    { isStatic: true }
    ),
];

// You can pass in an array of shapes into World.add
World.add(world, walls);

// Maze Generations

// Our grid is an N x N matrix with FALSE in every entry. 
// Once we visited a cell, we modify its value to TRUE. 
// Then our selector randomly visits another neighbour, 
// and converts it to TRUE until the whole matrix is TRUE

// Initialize grid
const grid = Array(cells)
    .fill(null) // initialize 3 empty rows
    .map( () => Array(cells).fill(false)); // add in 3 columns with FALSE in each col

// Verticals array - initialize a 3x2 matrix
const verticals = Array(cells)
    .fill(null) // initialize 3 empty rows
    .map( () => Array(cells - 1).fill(false));

// Horizontals array - initialize a 2x3 matrix
const horizontals = Array(cells - 1)
    .fill(null) // initialize 2 empty rows
    .map( () => Array(cells).fill(false));

console.log(horizontals);