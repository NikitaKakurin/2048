let log = (param)=> console.log(param);
import {statistic} from '../index';
import cardboard  from '../assets/sounds/619685_strangehorizon_small-cardboard-box-8.mp3';
import flawlessVictory from '../assets/sounds/564920_audeption_flawless-victory-game-over-deep-voice (online-audio-converter.com).mp3';
import gameOver from '../assets/sounds/368367_thezero_game-over-sound.mp3';
import wrong from '../assets/sounds/331912_kevinvg207_wrong-buzzer.mp3';
import metkir from '../assets/sounds/619714__metkir__3.mp3';

const beep = new Audio(cardboard);
const victory = new Audio(flawlessVictory);
const gameOverSound = new Audio(gameOver);
const wrongBeep = new Audio(wrong);
const moveBack = new Audio(metkir);



export class Game2048{
    constructor(selector){
        this.board = document.querySelector(selector);
        this.squares = document.querySelectorAll('.game__2048-item-square');
        this.containerSquares = document.querySelector('.game__2048-container');
        this.containerActiveSquares = document.querySelector('.game__2048-container-active-square');
        this.scoreTable = document.querySelector('.game__2048-score-value');
        this.gameTime = document.querySelector('.game__2048-time-value');
        this.maxScore = document.querySelector('.game__2048-max-score-value');
        this.countInRow = Math.sqrt(this.squares.length);
        this.squaresCoords = [];
        this.isNextSquareShow=false;
        this.isGameGoing = false;
        this.isNotGet2048 = true;
        
        this.propertyGame = {'steps':0,'score':0, 'time':'00:00', 'value':0}
        this.statisticObj = localStorage.getItem('statisticObj')?JSON.parse(localStorage.getItem('statisticObj')):
                            {"maximum":{'steps':0,'score':0, 'time':'00:00', 'value':0},'history':[]};
        
        // this.previousPosition=localStorage.getItem('PositionBeforeUnload')?JSON.parse(localStorage.getItem('PositionBeforeUnload')):null;
                                                                       
    }
    
    setPropertyGame(){
        this.propertyGame = {}
        this.propertyGame.time = this.gameTime.innerText;
        this.propertyGame.score = this.score;
        this.propertyGame.steps = this.steps;
        this.propertyGame.value = this.value
    }

    setPrevPropertyGame(){
        this.prevPropertyGame = {};
        this.prevPropertyGame.time = this.gameTime.innerText;
        this.prevPropertyGame.score = this.score;
        this.prevPropertyGame.steps = this.steps;
        this.prevPropertyGame.value = this.value
    }

    setStatisticObj(){
        this.statisticObj.maximum = (this.statisticObj.maximum.score>this.score)?this.statisticObj.maximum:this.propertyGame;
        if(this.statisticObj.history.length>=9 && this.propertyGame.score > this.statisticObj.history[8].score){
                this.statisticObj.history.pop();
        }
        this.statisticObj.history.push(this.propertyGame);
        this.statisticObj.history=this.statisticObj.history.sort((a,b)=>{
            return +b.score - +a.score;
        })
    }

    saveLocalStorage(){
        if(this.value==0||this.score==0||this.steps==0){
            return;
        }
        this.setPropertyGame();
        this.setStatisticObj();

        localStorage.setItem('propertyGame', JSON.stringify(this.propertyGame))
        localStorage.setItem('statisticObj', JSON.stringify(this.statisticObj))
    }

    initGameOver(){
        this.isGameGoing = false;
        this.saveLocalStorage();
        statistic.renderAds('Game over','gameOver');
        statistic.renderStatistic();
        statistic.showStatistic();
        gameOverSound.play();
    }

    initGet2048(){
        victory.play();
        this.setPropertyGame()
        statistic.renderAds('You Win!','win');
        statistic.renderStatistic();
        statistic.showStatistic();
    }

    initGame(){
        this.prevPropertyGame = {'steps':0,'score':0, 'time':'00:00', 'value':0}
        this.propertyGame = localStorage.getItem('propertyGame')?JSON.parse(localStorage.getItem('propertyGame')):
        {'steps':0,'score':0, 'time':'00:00', 'value':0};
        this.statisticObj = localStorage.getItem('statisticObj')?JSON.parse(localStorage.getItem('statisticObj')):
                            {"maximum":{'steps':0,'score':0, 'time':'00:00', 'value':0},'history':[]};
        
        if(this.isGameGoing){
            this.saveLocalStorage();
        }

        this.isGameGoing=true;
        this.isNotGet2048=true;
        this.gameTime.innerHTML = '00:00';
        this.score = 0;
        this.steps = 0;
        this.value = 0;
        this.maximumScore = 0||this.statisticObj.maximum.score;
        this.maxScore.innerHTML = this.maximumScore;

        this.setCoords()
        this.initTime = Date.now();
        // this.timer = 0;
        this.timerInterval = setInterval(() => {
            let currentTime = Date.now()
            this.gameTime.innerText = this.calcTime(Math.floor((currentTime - this.initTime)/1000));
        }, 1000);
        
        this.scoreTable.innerText = this.score;
        this.squareSizes = {
            'width':this.squares[0].clientWidth,
            'height':this.squares[0].clientHeight,
            };


        this.containerActiveSquares.innerHTML="";
        this.ArrayOfSquares = [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
        ]

        this.previousMove = {"positions":[
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
        ],"values":[
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
        ]}

        this.createActiveSquare(this.choseRandomActiveSquare(),this.choseRandomValue())
    }

    calcTime(sec){
        let hh = this.fixTime((Math.floor(sec/3600))?`${Math.floor(sec/3600)}:`:'');
        let mm = this.fixTime(Math.floor((sec%3600)/60));
        let ss = this.fixTime(Math.floor((sec%3600)%60));
        return `${hh}${mm}:${ss}`;
    }

    fixTime(number){
        if(number===''){
            return number;
        }
        return(number<10)?`0${number}`:`${number}`
    }

    setCoords(){
        let containerCords = this.containerSquares.getBoundingClientRect();
        this.squaresCoords = [];
        let row = []
        Array.from(this.squares).forEach((square, index)=>{
            const cords = square.getBoundingClientRect();
            row.push({
                    'top': cords.top - containerCords.top,
                    'bottom': cords.bottom - containerCords.bottom,
                    'left': cords.left - containerCords.left,
                    'right': cords.right - containerCords.right
                    })
            if (((index+1) % this.countInRow)==0){
                this.squaresCoords.push(row);
                row = [];
            }
       })
    }

    choseRandomActiveSquare(){
        this.getIndexesEmptySquares();
        const limit = this.arrayOfEmpty.length
        const numberOfEmpty = Math.floor(Math.random()*limit);
        const chosenEmptySquare = this.arrayOfEmpty[numberOfEmpty];
        return chosenEmptySquare
    }
    choseRandomValue(){
        return (Math.random()<0.1)?4:2;
    }
    createActiveSquare(squarePlace, value){
        let ASquare = document.createElement('div');
        ASquare.innerText = value;
        ASquare.dataset.value = value;
        ASquare.classList.add('game_2048-active-square')
        if(value===4){
            ASquare.classList.add(`game_2048-active-square-4`)
        }
        ASquare.style.width = this.squareSizes.width + 'px';
        ASquare.style.height = this.squareSizes.height + 'px';
        ASquare.style.top = this.squaresCoords[squarePlace.row][squarePlace.column].top + 'px';
        ASquare.style.left = this.squaresCoords[squarePlace.row][squarePlace.column].left + 'px';
        ASquare.dataset.isCanChange = "true";
        this.ArrayOfSquares[squarePlace.row][squarePlace.column]=ASquare;
        
        this.containerActiveSquares.append(ASquare);
        ASquare.style.opacity=0;
        this.steps++;
        let delayBeforeShowASquare = setTimeout(()=>{
            ASquare.style.opacity=1;
            this.isNextSquareShow=true;
            this.isPreviousBoardCopied = false;
            if(this.arrayOfEmpty.length==1 && this.isGameOver()){
                setTimeout(()=>this.initGameOver(),200)
            }
        }, 300);
        return ASquare;
    }




    isGameOver(){
        for(let row = 0; row<this.countInRow; row++){
            for(let column = 0; column < this.countInRow; column++){
                let currentSquareValue=this.ArrayOfSquares[row][column].dataset.value;
                if(row !== 0){
                    if(currentSquareValue==this.ArrayOfSquares[row-1][column].dataset.value){
                        return false;
                    }
                }
                
                if(row !== this.countInRow-1){
                    if(currentSquareValue==this.ArrayOfSquares[row+1][column].dataset.value){
                        return false;
                    };
                }

                if(column !== 0){
                    if(currentSquareValue==this.ArrayOfSquares[row][column-1].dataset.value){
                        return false;
                    }
                }
                
                if(column !== this.countInRow-1){
                    if(currentSquareValue==this.ArrayOfSquares[row][column+1].dataset.value){
                        return false;
                    };
                }
            }
        }
        return true;

    }
    checkMergeNeighbors(row,column){
        this.ArrayOfSquares[row][column]==this.ArrayOfSquares[row-1][column];
        this.ArrayOfSquares[row][column]==this.ArrayOfSquares[row+1][column];
        
        this.ArrayOfSquares[row][column]==this.ArrayOfSquares[row-1][column];
        this.ArrayOfSquares[row][column]==this.ArrayOfSquares[row+1][column];
    }

    setScore(value){
        this.score += +value;
        this.scoreTable.innerText=this.score;
    }
    getIndexesEmptySquares(){
        this.arrayOfEmpty = [];
        this.ArrayOfSquares.forEach((row, index)=>{
            let indexRow = index;
            row.forEach((square, indexSquare)=>{
                if(square===null){
                    this.arrayOfEmpty.push({'row':indexRow,'column':indexSquare});
                }else{
                    this.setIsCanChangeTrue(square);
                }

            })
        })
    };

    setIsCanChangeTrue(square){
        square.dataset.isCanChange = "true";
    }

    moveUp(){
        if(this.isNextSquareShow==false){
            return;
        }
        this.isChange = false;
        for(let column = 0; column < this.countInRow; column++){
            this.moveSteps = 0;
            for(let row = 0; row<this.countInRow; row++){
                this.calcMove((row - (this.moveSteps+1)>=0), row, column, row - (this.moveSteps+1), column, row - this.moveSteps, column)
            }
        }
        this.finishMove()
    }

    moveDown(){
        if(this.isNextSquareShow==false){
            return;
        }
        this.isChange = false;
        for(let column = 0; column < this.countInRow; column++){
            this.moveSteps = 0;
            for(let row = this.countInRow-1; row>=0; row--){
                this.calcMove((row + (this.moveSteps+1)<this.countInRow),row, column, row + (this.moveSteps+1), column, row + this.moveSteps, column)
            }
        }
        this.finishMove()
    }

    moveLeft(){
        if(this.isNextSquareShow==false){
            return;
        }
        this.isChange = false;
        for(let row = 0; row < this.countInRow; row++){
            this.moveSteps = 0;
            for(let column = 0; column<this.countInRow; column++){
                this.calcMove((column - (this.moveSteps+1)>=0),row, column, row, column - (this.moveSteps+1), row, column - this.moveSteps)
            }
        }
        this.finishMove()
    }

    moveRight(){
        if(this.isNextSquareShow==false){
            return;
        }
        this.isChange = false;
        for(let row = 0; row < this.countInRow; row++){
            this.moveSteps = 0;
            for(let column= this.countInRow-1; column>=0; column--){
                this.calcMove((column + (this.moveSteps+1)<this.countInRow),row, column, row, column + (this.moveSteps+1), row, column + this.moveSteps)
            }
        }
        this.finishMove()
    }

    calcMove(checkLimit,row, column, mergeRow, mergeColumn, moveRow, moveColumn){
        if(this.ArrayOfSquares[row][column]!==null){
            if((checkLimit)
                && this.ArrayOfSquares[mergeRow][mergeColumn]!==null
                && this.ArrayOfSquares[mergeRow][mergeColumn].dataset.isCanChange
                && this.ArrayOfSquares[mergeRow][mergeColumn].dataset.value == this.ArrayOfSquares[row][column].dataset.value){
                    this.changeArrayOfSquares(row, column, mergeRow, mergeColumn , true);
                    this.moveSteps++;
                    this.isChange=true;
            }else if(this.moveSteps>0){
                this.changeArrayOfSquares(row, column, moveRow, moveColumn, false)
                this.isChange=true;
            }
        }else{
            this.moveSteps++
        }
        
    }

    copyPreviousBoard(){
        if(this.isPreviousBoardCopied){
            return;
        }
        this.previousMove.positions=[];
        this.ArrayOfSquares.forEach((row,indexRow)=>{
            this.previousMove.positions[indexRow]=[]
            row.forEach((square, indexColumn)=>{
                this.previousMove.positions[indexRow][indexColumn] = square || null;
                this.previousMove.values[indexRow][indexColumn] = square? square.innerText : null;
            })
        })
        this.setPrevPropertyGame();
        this.isPreviousBoardCopied = true;
    }

    renderPreviousBoard(){
        this.previousMove.positions.forEach((row,indexRow)=>{
            row.forEach((square, indexColumn)=>{
                if(square){
                    this.containerActiveSquares.append(square);
                    square.dataset.value=this.previousMove.values[indexRow][indexColumn];
                    
                    setTimeout(()=>{
                        square.style.top = this.squaresCoords[indexRow][indexColumn].top + 'px';
                        square.style.left = this.squaresCoords[indexRow][indexColumn].left + 'px';
                        square.classList.remove(`game_2048-active-square-${square.innerText}`);
                        square.innerText=this.previousMove.values[indexRow][indexColumn];
                        square.classList.add(`game_2048-active-square-${square.innerText}`)
                    },50)

                }
            })
            this.animateBoard();
            moveBack.play();
        })
        this.ArrayOfSquares=this.previousMove.positions;
        this.lastSquare.remove();
        this.score=this.prevPropertyGame.score;
        this.value=this.prevPropertyGame.value;
        this.scoreTable.innerText=this.score;
    }


    finishMove(){
        if(this.isChange){
            this.isNextSquareShow=false;
            this.lastSquare=this.createActiveSquare(this.choseRandomActiveSquare(),this.choseRandomValue());
            beep.play();
        }else{
            wrongBeep.play()
        }
    }

    changeArrayOfSquares(currentRow, currentColumn, targetRow, targetColumn, isMergeSquare){
        this.copyPreviousBoard();
        let previousSquare = this.ArrayOfSquares[targetRow][targetColumn];
        this.ArrayOfSquares[targetRow][targetColumn]=this.ArrayOfSquares[currentRow][currentColumn];
        this.ArrayOfSquares[currentRow][currentColumn]=null
        this.moveSquare(targetRow, targetColumn, previousSquare, isMergeSquare)
    }

    moveSquare(targetRow, targetColumn, previousSquare, isMergeSquare){
        let prevSquare = previousSquare;
        const currentSquare = this.ArrayOfSquares[targetRow][targetColumn]
        const handleTransitionEnd = (event)=>{
            currentSquare.removeEventListener('transitionend', handleTransitionEnd)
            if(prevSquare){
                prevSquare.remove();
                prevSquare = null; 
            }
            currentSquare.innerText = (+currentSquare.innerText)*2;
            this.setScore(currentSquare.innerText)
            this.changeColor(currentSquare);

        }
        if(isMergeSquare){
            currentSquare.dataset.value = (+currentSquare.dataset.value) * 2;
            this.value = Math.max(+currentSquare.dataset.value, +this.value)
            if(this.value === 16 && this.isNotGet2048){
                this.initGet2048();
                this.isNotGet2048 = false;
            }
            currentSquare.dataset.isCanChange = "";
            currentSquare.addEventListener('transitionend', handleTransitionEnd)
        }
        currentSquare.style.top = this.squaresCoords[targetRow][targetColumn].top + 'px';
        currentSquare.style.left = this.squaresCoords[targetRow][targetColumn].left + 'px';
        this.animateBoard()
    }

    animateBoard(){
        debugger
        const topLeft = this.checkValue(this.ArrayOfSquares[0][0])+
                        this.checkValue(this.ArrayOfSquares[0][1])+
                        this.checkValue(this.ArrayOfSquares[1][0])+
                        this.checkValue(this.ArrayOfSquares[1][1]);

        const topRight = this.checkValue(this.ArrayOfSquares[0][2])+
                            this.checkValue(this.ArrayOfSquares[0][2])+
                            this.checkValue(this.ArrayOfSquares[1][2])+
                            this.checkValue(this.ArrayOfSquares[1][3]);

        const bottomLeft = this.checkValue(this.ArrayOfSquares[2][0])+
                            this.checkValue(this.ArrayOfSquares[2][1])+
                            this.checkValue(this.ArrayOfSquares[3][0])+
                            this.checkValue(this.ArrayOfSquares[3][1]);

        const bottomRight = this.checkValue(this.ArrayOfSquares[2][2])+
                            this.checkValue(this.ArrayOfSquares[2][3])+
                            this.checkValue(this.ArrayOfSquares[3][2])+
                            this.checkValue(this.ArrayOfSquares[3][3]);
        
        let max = Math.max(topLeft,topRight,bottomLeft,bottomRight);

        switch(max){
            case topLeft:
            this.containerSquares.dataset.side = "bottom-right" ;
            break;
            case topRight:
                this.containerSquares.dataset.side = "bottom-left";
                break;
            case bottomLeft:
                this.containerSquares.dataset.side = "top-right";
                break;
            case bottomRight:
                this.containerSquares.dataset.side = "top-left";
                break;
        }

    }
    checkValue(square){
        return (square)? +square.innerText:0;
    }

    changeColor(square){
        square.classList.remove(`game_2048-active-square-${+square.innerText/2}`);
        square.classList.add(`game_2048-active-square-${square.innerText}`)
    }


}
