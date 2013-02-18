
# Writing Games with Canvas (working title)

The
[canvas element](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html)
is part of HTML5 that allows you to render arbitrary 2d shapes and
images, taking advantage of hardware acceleration when possible. It
also allows access to
[WebGL](https://developer.mozilla.org/en-US/docs/WebGL), which uses
OpenGL to render complex 3d scenes.

You can pick between the 2d and 3d APIs by grabbing a context from the
canvas element:

```
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
```

The above `context` object implements the rendering API in the
[canvas documentation](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html).
If you passed "webgl" to `getContext`, you would get back a WebGL instance.

This article will focus on using 2d API to make a simple game. There
is a lot you can do with it!

# Game Basics

Games can be very complex, but you can make a simple game by
implementing the following tasks:

* Load images
* Handle input from the user and update the player
* Check collisions between objects in the scene and resolve
* Make enemies evil
* Continually render the scene

That is a basic skeleton of a 2d game. We are going to implement all
of the above to demonstrate how to make games with canvas.

# Loading Resources
# The Game Loop
# Updating the Scene
## Handling Input
## Checking for Collisions
# Rendering the Scene
