import React, { useEffect, useState } from 'react';
import '../Game.css';
import p5, { Color } from 'p5';

let p5Instance: any;
let canva:any;
let player1:any;
let player2:any;
let diam:any = 25;
let ball:any;
let derection:any;
let speed:any = 9;
let sign:any;
let paddleHeight:any;
let paddelWidth:any;


const P5Component = (props: any) => {
  let canvas: any;

  useEffect(() => {
    const sketch = (p: any) => {
      p.setup = () => {
        const container = document.querySelector('.canva');


        canva= {x : props.size.width, y : props.size.width / 1.8}
        canvas = p.createCanvas(props.size.width, props.size.height);
        canvas.parent(container);
        player1 = canva.y / 2;
        player2 = canva.y / 2;
        let diameter = canva.x * diam /600;
        if (!ball)
        {
          ball = {
            diameter : diameter,
            x : canva.x / 2,
            y : canva.y  - diameter//ball.diameter 
          };
        }
          sign = {
                    x : 1,
                    y : 1
                  };
        derection = {
          x : canva.x * speed / 600,
          y : -p.random(0.1, canva.x * 10 / 600)
        };
        paddleHeight = canva.y * 70 /300;
        paddelWidth = canva.x * 10 /600;
      };

      p.draw = () => {
        shapesDraw()
    
        paddleControl();
    
        if (ball.y <= ball.diameter/2 || ball.y >= canva.y - ball.diameter /2)
          derection.y *= -1;
    
        restIsGoal();
      
        //calculate green paddle 
        ballInPlayer1();
        
        //calculate blue paddle 
        ballInPlayer2();
    
        ball.x += derection.x * sign.x;
        ball.y += derection.y;
      };

      
      function shapesDraw()
      {
        // scale(test);
        // resizeCanvas(canva.x, canva.y);
        p.background(44, 43, 43);

        // setGradient(0, 0, canva.x, canva.y, p.color(44, 43, 43), p.color(0));
        p.rectMode(p.CENTER);

        p.fill('rgb(160,160,46)');
        // translate(width / 2, height / 2);
        // rotateDrawBall();
        p.circle(ball.x, ball.y, ball.diameter )

        p.noStroke()

        p.fill('blue');
        p.rect(paddelWidth/2 + 5, player1, paddelWidth, paddleHeight, 5, 5);

        p.fill('green');
        p.rect(canva.x - paddelWidth/2 - 5, player2, paddelWidth, paddleHeight, 5, 5);  
      }

      function paddleControl()
      {
        let paddeleMv = canva.y * 5 / 300;
        if (player1 > paddleHeight / 2 + paddeleMv && p.keyIsDown(87))
          player1 -= paddeleMv; 
        else if (player1 < canva.y - paddeleMv - paddleHeight / 2  && p.keyIsDown(83))
          player1 += paddeleMv;
      
        if (player2 > paddleHeight / 2 + paddeleMv && p.keyIsDown(38))
          player2 -= paddeleMv;
        else if (player2 < canva.y - paddeleMv - paddleHeight / 2  && p.keyIsDown(40))
          player2 += paddeleMv;
        let playerCount = p.map(p.mouseY, 0, p.width, 0, canva.x, canva.y - canva.x);
        if ((p.mouseY - paddleHeight / 2) > 0  && (p.mouseY + paddleHeight / 2) < 600)
          player1 = p.mouseY
      }

      function ballInPlayer1()
      {
        let sizeH = paddleHeight / 2 + ball.diameter / 2;
        let sizeW = paddelWidth + 5 + ball.diameter / 2;
        if (ball.x <= sizeW && ball.x >=  ball.diameter / 2 + 5 && (ball.y >= player1 - sizeH && ball.y <= player1 + sizeH))
        { 
          sign.x *= -1;
          derection.y = derectionY(ball.y - player1, derection.x);
        }
      }

      function ballInPlayer2()
      {
        let sizeH = paddleHeight / 2 + ball.diameter / 2;
        let sizeW = canva.x - paddelWidth - 5 - ball.diameter / 2;
        if (ball.x >= sizeW && ball.x <=  canva.x - ball.diameter / 2 - 5 && (ball.y >= player2 - sizeH && ball.y <= player2 + sizeH))
        {
          sign.x *= -1;
          derection.y = 5;
          derection.y = derectionY(ball.y - player2, derection.x);
        }
      }

      function restIsGoal()
      {
          if(ball.x < 0 || ball.x > canva.x)
          {
            derection.y = -p.random(0.1, canva.x * 10 / 600);
            ball.x = canva.x / 2;
            ball.y = canva.y - ball.diameter;
          }
      }

      function derectionY(val:number, x:number)
      {
        let mapVal = p.map(p.abs(val), 0, paddleHeight / 2, 90, 120);
        let angle = (val > 0) ? 180 - mapVal : mapVal;
        let adjacent = (val > 0) ? canva.y - ball.y : ball.y;
        let hypotenuse = adjacent / p.cos(p.radians(angle));
        let opposit = p.sqrt(p.pow(hypotenuse, 2) - p.pow(adjacent, 2));
        let stepsXinc = opposit / x;
        let y = adjacent / stepsXinc;
        y = (y > 0.01) ? y: 0;
        return y * (val / p.abs(val));
      }

    };

    if (!p5Instance)
      p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
      p5Instance = null;
    };

  }, [props.size]);

  return null;
};


const Canva = (props: any) => {
  let [style, setStyle] = useState({
    width: `${props.size.width - 20}`,
    height: `${(props.size.width - 20) / 1.8}`,
  });
  let [canvaSize, setCanvaSize] = useState({
    width: props.size.width - 20,
    height: (props.size.width - 20) / 1.8,
  });

  useEffect(() => {
    setStyle((prev: any) => {
      return {
        ...prev,
        width: `${props.size.width - 20}px`,
        height: `${(props.size.width - 20) / 1.8}px`,
      };
    });
    setCanvaSize((prev: any) => {
      return {
        ...prev,
        width: props.size.width - 20,
        height: (props.size.width - 20) / 1.8,
      };
    });
  }, [props.size]);

  return (
    <div className={`${props.className} grow`} style={style}>
      <P5Component size={canvaSize} />
    </div>
  );
};

export default Canva;
