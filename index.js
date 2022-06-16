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

// Shuffle an array
const shuffle = (arr) => {
    // Initialize counter to array length
    let counter = arr.length;

    while (counter > 0) {
        // Get a random index of the array
        const index = Math.floor(Math.random() * counter);

        // Decrement
        counter--;

        // Swap two array entries
        let temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }

    return arr;
};

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

// Random start coordinates (in cells) for our maze generator
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

// Now we're going to define a function that take the startRow 
// and startColumn variables, and iterate through our grid
// and this function will then generate our maze for us

const stepThroughCell = (row, column) => {
    // If I have visited the cell at [row, column], then return
    if (grid[row][column]) {
        return;
    }
    
    // Mark this cell as being visited
    grid[row][column] = true;

    // Assemble randomly-ordered list of neighbours

    // Create orientable references to neighbouring cells from current cell
    const neighbours = shuffle([
        [row - 1, column, 'up'], // Above
        [row, column + 1, 'right'], // Right
        [row + 1, column, 'down'], // Below
        [row, column - 1, 'left'], // Left
    ]);

    console.log(neighbours);

    // Randomly sort the list of references



    // For each neighbour ...
    for (let neighbour of neighbours) {

        const [nextRow, nextColumn, direction] = neighbour;

        // check to see if that neighbour is out of bounds
        if (nextRow < 0 || 
            nextRow >= cells ||
            nextColumn < 0 ||
            nextColumn >= cells
            ) {
                continue;
        }

        // If we have visited that neighbor, continue to next neighbour
        if (grid[nextRow][nextColumn]) {
            continue;
        }
        
        // Remove a wall from either verticals or horizontals
        // If going up or down, update horizontals
        // If going left or right, update verticals
        

        // visit the next cell
    }
};

// TEST:
//
// Input: (1, 1)
// Expected Output: (1,0), (0, 1), (1, 2), (2, 1)
// These are the neighbours of (1, 1) cell on a square 3x3 grid
stepThroughCell(1, 1); 