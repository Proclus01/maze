//jshint esversion:9

// import and destructure objects from matter.js
const { Engine, Render, Runner, World, Bodies } = Matter;

const engine = Engine.create(); // Initialize engine
const { world } = engine; // Capture world object

const render = Render.create({ // Render.create() takes config object
    element: document.body, // where to display element
    engine: engine,
    options: { // declare size of canvas
        width: 800,
        height: 600
    }
});

Render.run(render); // Activate renderer
Runner.run(Runner.create(), engine); // Link the runner

// Render a static shape
const shape = Bodies.rectangle(200, 200, 50, 50, {
    isStatic: true
});

// Add the shape object into the world canvas
World.add(world, shape); 