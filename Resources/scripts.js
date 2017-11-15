
var canvas, ctx;
var spinPin;

var segments = 6;
var segAng = Math.PI / (segments * 0.5), halfSeg = segAng * 0.5;
var targetAng = halfSeg, ang = targetAng;

var pinSize = 0;

var spinTime = 0, spinTimer = 0, spinSpeed = 0, spinStartSpeed = 5, spinRunning = false;

var lastUpdate;

function easeOutQuad(t, b, c, d) {
    t /= d;
    return -c * t * (t - 2) + b;
}

function lerp(u, v, t) {
    return u + (v - u) * t;
}

function Draw(now) {
    if (!lastUpdate) { lastUpdate = now }
    var deltaTime = (now - lastUpdate) * 0.001;
    lastUpdate = now;
    
    var targetPinSize = (spinRunning ? 0 : 64);
    if (Math.abs(targetPinSize - pinSize) > 0.01) {
        pinSize = lerp(pinSize, targetPinSize, 0.25);
        if (Math.abs(targetPinSize - pinSize) <= 0.01) {
            pinSize = targetPinSize;
        }
        spinPin.style = "width: " + pinSize + "px; height: " + pinSize + "px;";
    }
    
    if (spinRunning) {
        spinTimer += deltaTime;
        spinSpeed = easeOutQuad(spinTimer, spinStartSpeed, -spinStartSpeed, spinTime);
        
        ang += deltaTime * spinSpeed;
        
        if (spinTimer >= spinTime || spinSpeed <= 0) { 
            spinRunning = false;
            targetAng = Math.floor(ang / segAng) * segAng + segAng * 0.5;
        }
    } 
    else if (Math.abs(targetAng - ang) > 0.01) {
        ang = lerp(ang, targetAng, 0.1);
        if (Math.abs(targetAng - ang) <= 0.01) {
            ang = targetAng;
        }
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
     
    ctx.strokeStyle = "#fff";
    for (var i = 0; i < segments; i++) {
        var curAng = ang + segAng * i;
        ctx.beginPath();
        ctx.moveTo(256, 256);
        ctx.lineTo(256 + Math.sin(curAng) * 256, 256 + Math.cos(curAng) * 256);
        ctx.stroke();
        
        ctx.save();
        ctx.translate(256 + Math.sin(curAng + halfSeg) * 164, 256 + Math.cos(curAng + halfSeg) * 164);
        ctx.rotate(-curAng+segAng+Math.PI*0.5);
        ctx.fillText("Food Type " + i, 0, 0);
        ctx.restore();
    }
    
    // Pointer
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(256 - 24, 0);
    ctx.lineTo(256, 32);
    ctx.lineTo(256 + 24, 0);
    ctx.closePath();
    ctx.fill();
    
    requestAnimationFrame(Draw);
}

function SpinPinPressed(e) {
    if (!spinRunning) {
        spinTime = 2 + Math.random() * 6;
        spinTimer = 0;
        spinSpeed = spinStartSpeed;
        spinRunning = true;
    }
}

function Init() {
    canvas = document.getElementById("food");
    ctx = canvas.getContext("2d");
    ctx.strokeWidth = 2;
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    
    requestAnimationFrame(Draw);
    
    spinPin = document.getElementsByClassName("pin")[0];
    spinPin.addEventListener("click", SpinPinPressed);
}

window.addEventListener("load", Init);