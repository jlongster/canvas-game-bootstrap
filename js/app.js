
// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

define(function(require) {

    // Simple input library for our game
    var input = require('./input');

    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 480;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    document.body.appendChild(canvas);

    // The player's state
    var player = {
        x: 0,
        y: 0,
        sizeX: 100,
        sizeY: 100
    };

    // Reset game to original state
    function reset() {
        player.x = 0;
        player.y = 0;
    };

    // Pause and unpause
    function pause() {
        running = false;
    }

    function unpause() {
        running = true;
        then = Date.now();
        main();
    }

    // Update game objects
    function update(dt) {
        // Speed in pixels per second
        var playerSpeed = 100;

        if(input.isDown('DOWN')) {
            // dt is the number of seconds passed, so multiplying by
            // the speed gives u the number of pixels to move
            player.y += playerSpeed * dt;
        }

        if(input.isDown('UP')) {
            player.y -= playerSpeed * dt;
        }

        if(input.isDown('LEFT')) {
            player.x -= playerSpeed * dt;
        }

        if(input.isDown('RIGHT')) {
            player.x += playerSpeed * dt;
        }

        // You can pass any letter to `isDown`, in addition to DOWN,
        // UP, LEFT, RIGHT, and SPACE:
        // if(input.isDown('a')) { ... }
    };

    // Draw everything
    function render() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(resources['enemy'], 100, 100, 50, 50);
        ctx.drawImage(resources['player'], player.x, player.y, player.sizeX, player.sizeY);
    };

    // The main game loop
    function main() {
        if(!running) {
            return;
        }

        var now = Date.now();
        var dt = (now - then) / 1000.0;

        update(dt);
        render();

        then = now;
        requestAnimFrame(main);
    };

    // Don't run the game when the tab isn't visible
    window.addEventListener('focus', function() {
        unpause();
    });

    window.addEventListener('blur', function() {
        pause();
    });

    var then, running;
    var numResources = 0;
    var loadedResources = 0;
    var resources = {};

    function loadResource(name, url) {
        var img = new Image();
        numResources++;
        img.onload = function() {
            loadedResources++;
            if(loadedResources == numResources) {
                // Let's play this game!
                reset();
                then = Date.now();
                running = true;
                main();
            }
        };
        img.src = url;
        resources[name] = img;
    }
    
    loadResource('player', 'img/player.png');
    loadResource('enemy', 'img/enemy.png');
});
