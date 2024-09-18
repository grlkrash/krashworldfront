import { useRouter } from 'next/router';
import React from 'react'
import { useEffect, useState, useRef } from "react";

export default function game() {
    const router = useRouter();
    const { id } = router.query;


    useEffect(() => {
        if(!id){
            return
        }

        const handleMessage = (event) => {
          // Ensure the message is from your game

          // Process the message data
          const message = event.data;
        //   console.log('Received message:', message);
    
          // Update the score state
          if (typeof message === 'string' && message.startsWith('SCORE: ')) {
            // setScore(message.split(' ')[1]);
            fetch(`/api/user`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'address':id,
                  'timestamp':message.split(' ')[1]
                }
              })
              .then(data => {
                data.json().then( res =>{
                    console.log('=========================')
                  console.log(res)
                }
              )
            })
          } else {
            
          }
        };
    
        // Add event listener for receiving messages
        window.addEventListener('message', handleMessage);
    
        return () => {
          // Cleanup event listener
          window.removeEventListener('message', handleMessage);
        };
      }, [id]);
    useEffect(() => {
        const iframe = document.createElement('iframe');
        iframe.src = "/game/index.html"; 
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
    
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
          gameContainer.appendChild(iframe);
        }
        return () => {
          if (gameContainer) {
            gameContainer.removeChild(iframe);
          }
        };
      }, []);
    
      return (
        <div id="game-container" style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
        </div>
      );
}
