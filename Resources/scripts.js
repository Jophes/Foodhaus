
var canvas, ctx, foodImages;
var imgList = [];
var spinPin;

var segments = 6;
var segAng = Math.PI / (segments * 0.5), halfSeg = segAng * 0.5, pi2 = Math.PI * 2;
var targetAng = halfSeg, ang = targetAng;

var pinSize = 0;

var spinTime = 0, spinTimer = 0, spinSpeed = 0, spinStartSpeed = 5, spinRunning = false;

var foodItems = ["Burgers", "Chicken", "Chinese", "Curry", "Desert", "Fish & Chips", "Grill", "Indian", "Italian", "Jamaican",
    "Kebab", "Korean", "Mexican", "Oriental", "Peri Peri", "Pizza", "Thai", "Turkish"];
var selectedItems = [], unselectedItems = [], rollingId = 5;
for (var i = 0; i < foodItems.length; i++) {
    unselectedItems.push(i);
}
for (var i = 0; i < segments; i++) {
    var randInd = Math.floor(Math.random() * unselectedItems.length);
    selectedItems.push(unselectedItems[randInd]);
    unselectedItems.splice(randInd, 1);
}

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
        
        ang += (deltaTime * spinSpeed);
        
        
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
    
    ang = ang % pi2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    for (var i = (segments - 1); i >= 0; i--) {
        var curAng = (ang + segAng * i) % pi2;
        
    }
    for (var i = 0; i < segments; i++) {
        var curAng = (ang + segAng * i) % pi2;
        
        if (i == rollingId && curAng > segAng * 5) {
            unselectedItems.push(selectedItems[i]);
            var randInd = Math.floor(Math.random() * unselectedItems.length);
            selectedItems[i] = unselectedItems[randInd];
            unselectedItems.splice(randInd, 1);
            imgList[i].src = "Resources/Images/" + foodItems[selectedItems[i]] + ".jpg";
            rollingId = (rollingId-1)%segments;
            if (rollingId < 0) {
                rollingId += segments;
            }
        }
        
        // Clipping plane setup
        ctx.save();
        
        ctx.translate(256, 256);
        ctx.rotate(-curAng+segAng+Math.PI*0.5);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.sin(Math.PI-halfSeg) * 320, Math.cos(Math.PI-halfSeg) * 320);
        ctx.lineTo(Math.sin(Math.PI+halfSeg) * 320, Math.cos(Math.PI+halfSeg) * 320);
        ctx.clip();
        
        // Drawing for each segment
        ctx.drawImage(imgList[i], -128, -256, 256, 256);
        ctx.fillText(foodItems[selectedItems[i]], 0, -164);
        ctx.strokeStyle = "#000";
        ctx.strokeText(foodItems[selectedItems[i]], 0, -164);
        
        ctx.restore();
        
        // Segment lines
        ctx.beginPath();
        ctx.moveTo(256, 256);
        ctx.lineTo(256 + Math.sin(curAng) * 256, 256 + Math.cos(curAng) * 256);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
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
    foodImages = document.getElementById("foodImages");
    for (var i = 0; i < segments; i++) {
        var foodImg = document.createElement("img");
        foodImg.src = "Resources/Images/" + foodItems[selectedItems[i]] + ".jpg";
        foodImages.appendChild(foodImg);
        imgList.push(foodImg);
    }
    
    canvas = document.getElementById("food");
    ctx = canvas.getContext("2d");
    ctx.strokeWidth = 2;
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.save();
    
    requestAnimationFrame(Draw);
    
    spinPin = document.getElementsByClassName("pin")[0];
    spinPin.addEventListener("click", SpinPinPressed);
}

window.addEventListener("load", Init);