//jshint esversion:9

// Please open index.html in browser to run this app

// import and destructure objects from matter.js
const { Engine, Render, Runner, World, Bodies, Body, Events } =
  Matter;

const engine = Engine.create(); // Initialize engine
engine.world.gravity.y = 0; // Disable gravity in y direction
const { world } = engine; // Capture world object

// Determine number of cells in X and Y direction, e.g. 4 x 3 rectangular maze vs. 3 x 5
const cellsHorizontal = 14; // corresponds to COLUMNS
const cellsVertical = 10; // corresponds to ROWS

// Variable-sized canvas fits browser window
const width = window.innerWidth;
const height = window.innerHeight;

// Size of cell in pixels
const unitLengthX = width / cellsHorizontal;
const unitLengthY = width / cellsVertical;

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
    2, // len y
    { isStatic: true } // show the shape but never move it
    ),
  Bodies.rectangle(
    width / 2, 
    height, 
    width, 
    2, 
    { isStatic: true }
    ),
  Bodies.rectangle(
    0, 
    height / 2, 
    2, 
    height, 
    { isStatic: true }
    ),
  Bodies.rectangle(
    width, 
    height / 2, 
    2, 
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
const grid = Array(cellsVertical) // cellsVertical is no. of rows
    .fill(null) // initialize 3 empty rows
    .map( () => Array(cellsHorizontal).fill(false)); // add in 3 columns with FALSE in each col

// Verticals array - initialize a 3x2 matrix
const verticals = Array(cellsVertical)
    .fill(null) // initialize 3 empty rows
    .map( () => Array(cellsHorizontal - 1).fill(false));

// Horizontals array - initialize a 2x3 matrix
const horizontals = Array(cellsVertical - 1)
    .fill(null) // initialize 2 empty rows
    .map( () => Array(cellsHorizontal).fill(false));

// Random start coordinates (in cells) for our maze generator
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

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
    // Randomly sort the list of references
    // These are your possible directions of travel
    const neighbours = shuffle([
        [row - 1, column, 'up'], // Above
        [row, column + 1, 'right'], // Right
        [row + 1, column, 'down'], // Below
        [row, column - 1, 'left'], // Left
    ]);

    // Cell wall detection
    // For each neighbour of current cell,
    for (let neighbour of neighbours) {

        const [nextRow, nextColumn, direction] = neighbour;

        // check to see if that neighbour is out of bounds
        if (nextRow < 0 || 
            nextRow >= cellsVertical ||
            nextColumn < 0 ||
            nextColumn >= cellsHorizontal
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
        if (direction === 'left') { // Verticals
            verticals[row][column - 1] = true;
        } else if (direction === 'right') {
            verticals[row][column] = true; 
        } else if (direction === 'up') { // Horizontals
            horizontals[row - 1][column] = true;
        } else if (direction === 'down') {
            horizontals[row][column] = true;
        }

        // visit the next cell recursively
        stepThroughCell(nextRow, nextColumn);
    }
};

stepThroughCell(startRow, startColumn); 

// Iterate over all verticals and horizontals
// and for every true or false in the array
// either keep or remove a vertical or horizontal wall

// Render the Horizontals Array as horizontal walls of maze
horizontals.forEach(
    // capture row 
    (row, rowIndex) => {
        
        // iterate over row values
        row.forEach(
            // if true, proceed
            (open, columnIndex) => {
                // if already open, then return
                if (open) {
                    return;
                }

                // render horizontals
                const wall = Bodies.rectangle(
                    columnIndex * unitLengthX + unitLengthX / 2, // X centrepoint bottom of cell
                    rowIndex * unitLengthY + unitLengthY, // Y coord for bottom of cell
                    unitLengthX, // width
                    10, // height
                    { 
                        isStatic: true, // immobile in engine
                        label: 'wall',
                        render: {
                            fillStyle: 'red' // make the wall color red
                        }
                    } 
                );
                
                // Add the walls to the world
                World.add(world, wall);
            }
        );

    }
);

// Render the Verticals array as vertical walls of maze
verticals.forEach(
    // capture row 
    (row, rowIndex) => {
        
        // iterate over row values
        row.forEach(
            // if true, proceed
            (open, columnIndex) => {
                // if already open, then return
                if (open) {
                    return;
                }

                // render verticals
                const wall = Bodies.rectangle(
                    columnIndex * unitLengthX + unitLengthX, // X coord for right wall of cell
                    rowIndex * unitLengthY + unitLengthY / 2, // Y centrepoint right wall of cell
                    10, // width
                    unitLengthY, // height
                    { 
                        isStatic: true, // immobile in engine
                        label: 'wall',
                        render: {
                            fillStyle: 'red' // make the wall color red
                        }
                    } 
                );
                
                // Add the walls to the world
                World.add(world, wall);
            }
        );

    }
);

// Render the goal
const goal = Bodies.rectangle(
    width - unitLengthX / 2, // X coord
    height - unitLengthY / 2, // Y coord
    unitLengthX * 0.7, // width
    unitLengthY * 0.7, // height
    { 
        isStatic: true,
        label: 'goal',
        render: {
            fillStyle: 'green' // make the color green
        }
    }
);
World.add(world, goal);

// Render the ball

// Get the smallest of the X,Y values and divide by 4 to get radius for ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;

const ball = Bodies.circle(
    unitLengthX / 2, // X coord
    unitLengthY / 2, // Y coord
    ballRadius / 4, // radius
    {
        label: 'ball',
        render: {
            fillStyle: 'blue' // make the color blue
        }
    }
);
World.add(world, ball);

// Controls for ball
// Event handler for turning WASD keypresses  to 2D directions
document.addEventListener('keydown', (event) => {
    // Get velocity of ball object
    const { x, y } = ball.velocity;

    if (event.keyCode === 87) {
        Body.setVelocity(ball, { x, y: y - 5}); // move ball up by 5
    }
    if (event.keyCode === 68) {
        Body.setVelocity(ball, { x: x + 5, y}); // move ball right
    }
    if (event.keyCode === 83) {
        Body.setVelocity(ball, { x, y: y + 5}); // move ball down
    }
    if (event.keyCode === 65) {
        Body.setVelocity(ball, { x: x - 5, y}); // move ball left
    }
});

// Win Condition

Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach(
        (collision) => {
            // Capture the labels from the config object inside of the world objects
            const labels = ['ball', 'goal'];

            if (
                labels.includes(collision.bodyA.label) && 
                labels.includes(collision.bodyB.label)
                ) {
                    // Reveal win message
                    document.querySelector('.winner').classList.remove('hidden');

                    // Reintroduce gravity
                    world.gravity.y = 1;

                    // On win, make the maze fall apart
                    world.bodies.forEach( body => {
                        // Make the walls non-static so they fall down under gravity
                        if (body.label === 'wall') {
                            Body.setStatic(body, false);
                        }
                    });
                }
        }
    );
});

// 
