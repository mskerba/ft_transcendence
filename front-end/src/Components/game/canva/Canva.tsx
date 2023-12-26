import React, { useEffect, useState } from 'react';
import p5, { Color } from 'p5';
import io from 'socket.io-client';
import '../Game.css';
import { Socket } from 'socket.io-client/debug';

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

  useEffect(() => {    const sketch = (p: any) => {
    p.setup = () => {
      const container = document.querySelector('.canva');


      canva= {x : props.size.width, y : props.size.width / 1.8}
      canvas = p.createCanvas(canva.x, canva.y);
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
      paddleHeight = canva.y * 70 /300;
      paddelWidth = canva.x * 10 /600;
    };

    p.draw = () => {
      shapesDraw()
    };

    
    function shapesDraw()
    {
      p.background(44, 43, 43);

      p.rectMode(p.CENTER);

      p.fill('rgb(160,160,46)')
      
      p.circle(ball.width * canva.x/1080, ball.height * canva.y / 600, ball.diameter )

      p.noStroke()

      p.fill('blue');
      p.rect(paddelWidth/2 + 5, player1, paddelWidth, paddleHeight, 5, 5);

      p.fill('green');
      p.rect(canva.x - paddelWidth/2 - 5, player2, paddelWidth, paddleHeight, 5, 5);  
    }

    
    
  };

  function paddleControl(event:any)
  {
    let p1 = player1;
    let p2 = player2;
    let paddeleMv = canva.y * 5 / 300;
    if (player1 > paddleHeight / 2 + paddeleMv && event.keyCode === 87)
      player1 -= paddeleMv; 
    else if (player1 < canva.y - paddeleMv - paddleHeight / 2  && event.keyCode === 83)
      player1 += paddeleMv;
  
    if (player2 > paddleHeight / 2 + paddeleMv && event.keyCode === 38)
    player2 -= paddeleMv;
    else if (player2 < canva.y - paddeleMv - paddleHeight / 2  && event.keyCode === 40)
    player2 += paddeleMv;
      props.socket.current.emit('gamepaddle', {'player1': player1 * 1080 / canva.x, 'player2': player2 * 600 / canva.y});
  }
  

  if (!p5Instance) {
    p5Instance = new p5(sketch);
  }

  // Add the event listener on mount
  const handleKeyDown = (event:any) => {
    paddleControl(event);
  };

  const ballPositionListener = (data:any) => {
      ball = data.ball;
    }
      
  setTimeout(()=>{
    if (props.socket && props.socket.current) {
      props.socket.current.on('ballPosition', ballPositionListener);
  }}, 0);

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    // p5Instance.remove();
    // p5Instance = null;
    window.removeEventListener('keydown', handleKeyDown);

    if (props.socket.current)
      props.socket.current.off('ballPosition', ballPositionListener);

  };

  }, [props.size, props.socket]);

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
      <P5Component size={canvaSize} socket={props.socket} />
    </div>
  );
};

export default Canva;
