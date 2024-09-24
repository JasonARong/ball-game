const INITIAL_VELOCITY = 0.025;
const SHOOT_VELOCITY = 0.06;
const VELOCITY_INCREASE = -0.000003;

const shooter = document.getElementById('shooter');

export default class Ball {
    constructor(ballElem, direction) {
        this.ballElem = ballElem;
        if (direction === null){
            this.reset();  
        }else{
            this.shoot(direction);             
        }   
    }

    get x(){
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue('--x'));
    }
    set x(value){
        this.ballElem.style.setProperty('--x', value);
    }
    get y(){
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue('--y'));
    }
    set y(value){
        this.ballElem.style.setProperty('--y', value);
    }

    get velo(){
        return this.velocity
    }

    rect(){
        return this.ballElem.getBoundingClientRect();
    }

    reset(){
        this.x = randomNumberBetween(10, 90);
        this.y = randomNumberBetween(10, 90);

        // Use Unit vector so that direction only determines direction not velocity
        // Intialize direction variable
        this.direction = {x:0}
        while(Math.abs(this.direction.x) <= 0.2 || // when x is small the ball moves up and down
        Math.abs(this.direction.x) >= 0.9){ // when x is big the ball moves left and right
            // from 0 to 360 where is the ball heading
            const heading = randomNumberBetween(0, 2 * Math.PI);
            // calculate unit vector that r is always 1
            this.direction = {x:Math.cos(heading), y:Math.sin(heading)} // x = r*cosθ; y = r*sinθ that r = 1
        }
        this.velocity = INITIAL_VELOCITY;
        //console.log(this.direction);
    }

    shoot(direction){
        this.x = parseFloat(getComputedStyle(shooter).getPropertyValue('--x'));
        this.y = parseFloat(getComputedStyle(shooter).getPropertyValue('--y'));;
        console.log('this.x', this.x);
        console.log('this.y', this.y);
        this.direction = direction;
        this.velocity = SHOOT_VELOCITY;
    }



    // delta = time between each frame
    // if the time between each frame is longer, the ball should also move longer distance
    update(delta, balls){
        // Making the ball move
        this.x += this.direction.x * this.velocity * delta;
        this.y += this.direction.y * this.velocity * delta;

        if (this.velocity > 0){
            this.velocity += VELOCITY_INCREASE * delta;    
        }
        
        
        // Making the ball bounce
        const rect = this.rect();
        if (rect.bottom >= window.innerHeight || rect.top <= 0) {
            this.direction.y *= -1;
        }
        if (rect.right >= window.innerWidth || rect.left <= 0) {
            this.direction.x *= -1;
        }
      
        // Hit other balls
        for (let i = 0; i < balls.length; i++) {
            if (isCollision(balls[i].rect(), rect)){
                // change direction
                this.direction.x *= -1;
                this.direction.y *= -1;

                // Make a faster ball can push the slower ball
                let veloDifference = balls[i].velo - this.velocity;
                if (veloDifference > 0){
                    this.velocity += veloDifference * 0.5;
                }
                //console.log(balls[i].velo);
            }
        }
        // if (balls.some(ballObj => isCollision(ballObj.rect(), rect))) {
        //     this.direction.x *= -1;
        //     this.direction.y *= -1;
            
        // }
    }
}

function randomNumberBetween(min, max){
    return Math.random()*(max - min) + min;
}

function isCollision(rect1, rect2){
    return (
        rect1.left <= rect2.right &&
        rect1.right >= rect2.left &&
        rect1.top <= rect2.bottom &&
        rect1.bottom >= rect2.top
    ); 
}