import './style/style.scss'; 
import './style/normalize.css'

import { Game2048 } from './Script2048/g2048';

let log = (param)=> console.log(param);
const btnNewGame = document.querySelector('game_new-game-btn');
const g2048 = new Game2048('.game_2048-container');
document.addEventListener('click', handleClick)

document.addEventListener('keydown',  handleKeyDown)

function handleKeyDown(event){
    log(event.code);
    if(event.code==="KeyW"){
        g2048.moveUp()
    }
}

function handleClick(event){
    const target =  event.target
    if(target.classList.contains('game_new-game-btn')){
        g2048.initGame();
    }
    if(target.classList.contains('up')){
        g2048.moveUp();
        return;
    }
    if(target.classList.contains('down')){
        g2048.moveDown()
        return;
    }

}

