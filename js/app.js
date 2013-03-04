
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
    var resources = require('./resources');
    var input = require('./input');
    var Sprite = require('./sprite');

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
        sizeY: 100,
        dir: 'right',
        sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
    };

    var lasers = [];
    var laserSprite = new Sprite('img/sprites.png', [0, 39], [18, 8]);

    var enemies = [];

    var lastFire = Date.now();
    var isGameOver;
    var terrainPattern;

    // Reset game to original state
    function reset() {
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('game-over-overlay').style.display = 'none';
        isGameOver = false;

        enemies = [];
        lasers = [];

        player.pos = [50, canvas.height / 2];
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

    // Game over
    function gameOver() {
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('game-over-overlay').style.display = 'block';
        isGameOver = true;
    }

    // Update game objects
    function update(dt) {
        // Speed in pixels per second
        var playerSpeed = 200;

        if(input.isDown('DOWN') || input.isDown('s')) {
            // dt is the number of seconds passed, so multiplying by
            // the speed gives u the number of pixels to move
            player.pos[1] += playerSpeed * dt;
        }

        if(input.isDown('UP') || input.isDown('w')) {
            player.pos[1] -= playerSpeed * dt;
        }

        if(input.isDown('LEFT') || input.isDown('a')) {
            player.pos[0] -= playerSpeed * dt;
        }

        if(input.isDown('RIGHT') || input.isDown('d')) {
            player.pos[0] += playerSpeed * dt;
        }

        if(input.isDown('SPACE')) {
            if(!isGameOver && Date.now() - lastFire > 100) {
                lasers.push({
                    pos: [player.pos[0] + player.sprite.size[0] / 2,
                          player.pos[1] + player.sprite.size[1] / 2]
                });
                lastFire = Date.now();
            }
        }

        if(player.pos[0] < 0) {
            player.pos[0] = 0;
        }
        else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
            player.pos[0] = canvas.width - player.sprite.size[0];
        }

        if(player.pos[1] < 0) {
            player.pos[1] = 0;
        }
        else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
            player.pos[1] = canvas.height - player.sprite.size[1];
        }

        player.sprite.update(dt);

        for(var i=0; i<lasers.length; i++) {
            lasers[i].pos[0] += 500 * dt;

            if(lasers[i].pos[0] > canvas.width) {
                lasers.splice(i, 1);
                i--;
            }
        }

        for(var i=0; i<enemies.length; i++) {
            enemies[i].pos[0] -= 100 * dt;
            enemies[i].sprite.update(dt);

            if(enemies[i].pos[0] + enemies[i].sprite.size[0] < 0) {
                enemies.splice(i, 1);
                i--;
            }
        }

        if(Math.random() < .1) {
            enemies.push({
                pos: [canvas.width,
                      Math.random() * (canvas.height - 39)],
                sprite: new Sprite('img/sprites.png', [0, 78], [80, 39], 6, [0, 1, 2, 3, 2, 1])
            });
        }

        checkCollisions();
    };

    function collides(x, y, r, b, x2, y2, r2, b2) {
        return !(r <= x2 || x > r2 ||
                 b <= y2 || y > b2);
    }

    function boxCollides(pos, size, pos2, size2) {
        return collides(pos[0], pos[1],
                        pos[0] + size[0], pos[1] + size[1],
                        pos2[0], pos2[1],
                        pos2[0] + size2[0], pos2[1] + size2[1]);
    }

    function checkCollisions() {
        for(var i=0; i<enemies.length; i++) {
            var pos = enemies[i].pos;
            var size = enemies[i].sprite.size;

            for(var j=0; j<lasers.length; j++) {
                var pos2 = lasers[j].pos;
                var size2 = laserSprite.size;

                if(boxCollides(pos, size, pos2, size2)) {
                    lasers.splice(j, 1);
                    j--;

                    enemies.splice(i, 1);
                    i--;
                }
            }

            if(boxCollides(pos, size, player.pos, player.sprite.size)) {
                gameOver();
            }
        }
    }

    // Draw everything
    function render() {
        ctx.fillStyle = terrainPattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if(!isGameOver) {
            ctx.save();
            ctx.translate(player.pos[0], player.pos[1]);
            player.sprite.render(ctx);
            ctx.restore();
        }

        for(var i=0; i<lasers.length; i++) {
            var laser = lasers[i];

            ctx.save();
            ctx.translate(laser.pos[0], laser.pos[1]);

            switch(laser.dir) {
            case 'up': ctx.rotate(-Math.PI / 2); break;
            case 'left': ctx.rotate(Math.PI); break;
            case 'down': ctx.rotate(Math.PI / 2); break;
            case 'right':
                // The default is pointed right
            }

            laserSprite.render(ctx);
            ctx.restore();
        }

        for(var i=0; i<enemies.length; i++) {
            var enemy = enemies[i];

            ctx.save();
            ctx.translate(enemy.pos[0], enemy.pos[1]);
            enemy.sprite.render(ctx);
            ctx.restore();
        }
    };

    // The main game loop
    var then, running;
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

    function start() {
        terrainPattern = ctx.createPattern(resources.get('img/terrain.png'), 'repeat');

        document.getElementById('play-again').addEventListener('click', function() {
            reset();

        });

        reset();
        then = Date.now();
        running = true;
        main();
    }

    // Don't run the game when the tab isn't visible
    // window.addEventListener('focus', function() {
    //     unpause();
    // });

    // window.addEventListener('blur', function() {
    //     pause();
    // });

    resources.load([
        'img/sprites.png',
        'img/terrain.png'
    ]);
    resources.onReady(start);
});
