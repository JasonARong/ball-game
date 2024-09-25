/**
 * Main logic for the Ball Game
 *
 * @summary Ball Game Main Logic
 * @author Jason Chen
 *
 * Reference: https://github.com/WebDevSimplified/js-pong
 */

import Ball from "./Ball.js"

const shooter = document.getElementById('shooter');
const shooterRect = shooter.getBoundingClientRect();

const balls = [];
let numberOfBalls = 1;
const maxNumberOfBalls = 20;

let pause = false;
let lastTime;
const maxAngle = 160;
const minAngle = 20;
let angle = 20;
let rightToLeft = true;

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

            if(angle < maxAngle && rightToLeft){
                angle += 0.5;
            }
            else if(angle >= maxAngle && rightToLeft){
                rightToLeft = false;
            }

            if(angle > minAngle && !rightToLeft){
                angle -= 0.5;
            }
            else if(angle <= minAngle && !rightToLeft){
                rightToLeft = true;
            }
            //console.log(angle);
            shooter.style.setProperty('--r', `-${angle}deg`);
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
    const direction = unitVectorFromDegree(angle);

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


function unitVectorFromDegree(degrees){
    const currRadians = -degrees * (Math.PI / 180);
    console.log('degrees',degrees);
    console.log({x:Math.cos(currRadians), y:Math.sin(currRadians)});
    return {x:Math.cos(currRadians), y:Math.sin(currRadians)};
}

window.requestAnimationFrame(update);