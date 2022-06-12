//jshint esversion:9

// import and destructure objects from matter.js
const { Engine, Render, Runner, World, Bodies } = Matter;

const engine = Engine.create(); // Initialize engine
const { world } = engine; // Capture world object

const render = Render.create({ // Render.create() takes config object
    // where to display our element (inserts canvas element to HTML)
    element: document.body, 
    engine: engine,
    options: { // declare size of canvas in pixels
        width: 800,
        height: 600
    }
});

Render.run(render); // Activate renderer
Runner.run(Runner.create(), engine); // Link the runner

// Render a static shape
const shape = Bodies.rectangle(200, 200, 50, 50, { // pos(x), pos(y), len(x), len(y)
    isStatic: true // show the shape but never move it
});

// Walls added to borders of canvas
const walls = [
    Bodies.rectangle(400, 0, 800, 40, {isStatic: true}),
    Bodies.rectangle(400, 600, 800, 40, {isStatic: true}),
    Bodies.rectangle(0, 300, 40, 600, {isStatic: true}),
    Bodies.rectangle(800, 300, 40, 600, {isStatic: true})
];

// You can pass in an array of shapes into World.add
World.add(world, walls); 

// Test rectangle to fall with gravity and hit the walls
World.add(world, Bodies.rectangle(200, 200, 50, 50));