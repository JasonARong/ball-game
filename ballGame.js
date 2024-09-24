/**
 *
 * Main logic for the Ball Game
 *
 * @summary Ball Game Main Logic
 * @author Jason Chen
 *
 * Reference: https://github.com/WebDevSimplified/js-pong
 */

import Ball from "./Ball.js"
import Paddle from "./Paddle.js";


const shooter = document.getElementById('shooter');
const shooterRect = shooter.getBoundingClientRect();

const balls = [];
let numberOfBalls = 3;
const maxNumberOfBalls = 20;

let pause = false;
let lastTime;

// Loop to create and append elements
for (let i = 0; i < numberOfBalls; i++) {
    const newBallObj = createBall(null);
    balls.push(newBallObj);
}

function update(time){
    //update loop
    if (lastTime !=  null){
        const delta = time - lastTime;   

        if (!pause){
            for (let i = 0; i < numberOfBalls; i++){
                const otherBalls = balls.slice(0, i).concat(balls.slice(i + 1));
                balls[i].update(delta, otherBalls);
            }
        }
    }
     
    lastTime = time
    window.requestAnimationFrame(update);
}

document.addEventListener('mousemove', mouse => {
    if (pause){
        return;
        //playerPaddle.position = (mouse.y / window.innerHeight) * 100; //player paddle postion is in percentage
    }
    shooter.style.setProperty("--x", (mouse.x / window.innerWidth) * 100);

})

//Puase
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (pause == false){
            pause = true;  
        }else{
            pause = false;  
        }
        console.log(pause);
    }

});

document.addEventListener('click', (event)=>{
    if(numberOfBalls >= maxNumberOfBalls){
        return;
    }

    console.log(event.x);
    console.log(event.y);
    
    const direction = calculateUnitVector(getShooterX(), getShooterY(), event.clientX, event.clientY);

    const newBallObj = createBall(direction);
    balls.push(newBallObj);
    numberOfBalls++;

});

// Create and return the ball obj 
// Append to HTML
function createBall(direction){
    const newBall = document.createElement('div');
    newBall.className = 'ball';
    document.body.appendChild(newBall);

    return new Ball(newBall, direction);
}

// Calculate the unit vector from 2 sets of xy values
function calculateUnitVector(x1, y1, x2, y2) {
    // Calculate the difference in x and y coordinates
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    // Calculate the magnitude (length) of the vector
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    //let magnitude = 500;
    
    // Normalize the vector to get the unit vector
    const unitX = dx / magnitude;
    const unitY = dy / magnitude;
    
    return { x: unitX, y: unitY };
  }

function getShooterX(){
    return shooterRect.left + (shooterRect.width / 2);
}
function getShooterY(){
    return shooterRect.top + (shooterRect.height / 2);
}

window.requestAnimationFrame(update);