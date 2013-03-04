define(function(require) {
    var resources = require('./resources');

    function Sprite(url, pos, size, speed, frames, dir) {
            this.pos = pos;
            this.size = size;
            this.speed = typeof speed === 'number' ? speed : 0;
            this.frames = frames;
            this._index = 0;
            this.url = url;
            this.scale = [1, 1];
            this.dir = dir || 'horizontal';
    };

    Sprite.prototype = {
        update: function(dt) {
            this._index += this.speed*dt;
        },

        setScale: function(scale) {
            this.scale = scale;
        },

        flipHorizontal: function(val) {
            this.flipHoriz = val;
        },

        getNumFrames: function() {
            if(this.speed === 0) {
                return 1;
            }
            else if(this.frames) {
                return this.frames.length;
            }
            else {
                return Math.floor(resources.get(this.url).width / this.size[0]);
            }
        },

        render: function(ctx, clip) {
            var frame;
            var max = this.getNumFrames();
            clip = clip || this.size;

            if(this.frames) {
                frame = this.frames[Math.floor(this._index) % max];
            }
            else {
                frame = Math.floor(this._index % max);
            }

            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }

            ctx.drawImage(resources.get(this.url),
                          x, y,
                          Math.min(this.size[0], clip[0]),
                          Math.min(this.size[1], clip[1]),
                          0, 0,
                          Math.min(this.size[0], clip[0]),
                          Math.min(this.size[1], clip[1]));
        }
    };

    return Sprite;
});
