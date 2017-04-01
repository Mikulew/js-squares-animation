var canvas = document.createElement('canvas');

layout();

window.addEventListener('resize', layout, false);
window.addEventListener('mousemove', onMove ,false);

var source_x = 0.5;
var source_y = 0.5;
var global_target_r = 0.4;

document.body.appendChild(canvas);

var ctx = canvas.getContext('2d'),
    allSquares = [],
    visibleSquares = [],
    fps = 50,
    ease = 'easeOutQuad',
    lastTime = 0;

animationLoop();

function animationLoop(time){
    requestAnimationFrame(animationLoop);
    if(time - lastTime >= 1000/fps){
        lastTime = time;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        global_target_r = Math.min(0.4, global_target_r + 0.01);

        visibleSquares.length = 0;

        for (var i = 0; i < 15; i++) {
            allSquares.push({
                start_x: source_x,
                start_y: source_y,
                h: rand(5,15),
                target_r: global_target_r,
                start_a: rand(0, 360),
                target_x: rand(0, Math.round(canvas.width)),
                target_y: rand(0, Math.round(canvas.height)),
                t: 0,
                d: 2000,
                start_r: 255,
                start_g: rand(0,240),
                start_b: rand(0,100)
            });
        }

        for (var j = 0; j < allSquares.length; j++) {
            var square = allSquares[j];

            square.t += 1000/fps;

            square.r = Easing.get(ease, 0, square.target_r * canvas.height, square.t, square.d);
            square.a = Easing.get(ease, square.start_a, square.start_a + 180, square.t, square.d);

            square.x = Math.sin(Math.PI/180 * square.a) * square.r + square.start_x * canvas.width;
            square.y = Math.cos(Math.PI/180 * square.a) * square.r + square.start_y * canvas.height;

            square.r = Easing.getRound(ease, square.start_r, 255, square.t, square.d);
            square.g = Easing.getRound(ease, square.start_g, 255, square.t, square.d);
            square.b = Easing.getRound(ease, square.start_b, 255, square.t, square.d);

            ctx.fillStyle = 'rgba(' + square.r + ',' + square.g + ',' + square.b + ',1)';
            ctx.fillRect(square.x - square.h/2 ,square.y - square.h/2, square.h, square.h);

            if(square.t < square.d){
                visibleSquares.push(square)
            }
        }

        allSquares = visibleSquares.concat();
    }
}
function onMove(e) {
    source_x = e.x/canvas.width;
    source_y = e.y/canvas.height;

    global_target_r = Math.max(0.1, global_target_r - 0.01);
}

function layout() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function rand(min, max){
    return Math.floor(Math.random()*(max - min + 1)) + min;
}