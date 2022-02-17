let log = (param)=> console.log(param);


export class Game2048{
    constructor(selector){
        this.board = document.querySelector(selector);
        this.squares = document.querySelectorAll('.game_2048-item-square');
        this.containerSquares = document.querySelector('.game_2048-container');
        this.containerActiveSquares = document.querySelector('.game_2048-container-active-square');
        this.scoreTable = document.querySelector('.game_2048-score__value');
        this.gameTime = document.querySelector('.game_2048-time__value');
        this.countInRow = Math.sqrt(this.squares.length);
        this.squaresCoords = [];
        this.isNextSquareShow=false;
        this.gameTime.innerHTML = '00:00';
    }
    
    initGame(){
        this.setCoords()
        this.initTime = Date.now();
        // this.timer = 0;
        this.timerInterval = setInterval(() => {
            let currentTime = Date.now()
            this.gameTime.innerText = this.calcTime(Math.floor((currentTime - this.initTime)/1000));
        }, 1000);
        this.score = 0;
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
        debugger
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


        let delayBeforeShowASquare = setTimeout(()=>{
            debugger
            ASquare.style.opacity=1;
            this.isNextSquareShow=true;
            // if(this.arrayOfEmpty.length==1 && this.isGameOver()){
            //     setTimeout(()=>handleGameOver(),200)
            // }
        }, 300);
    }

    // handleGameOver(){
    //     this.showAds('GameOver')
    // }
    // showAds(adsText){
        
    // }

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
        let isChange = false;
        for(let column = 0; column < this.countInRow; column++){
            let steps = 0;
            for(let row = 0; row<this.countInRow; row++){
                if(this.ArrayOfSquares[row][column]!==null){
                    if((row - (steps+1)>=0)
                        && this.ArrayOfSquares[row - (steps+1)][column]!==null
                        && this.ArrayOfSquares[row - (steps+1)][column].dataset.isCanChange
                        && this.ArrayOfSquares[row - (steps+1)][column].dataset.value == this.ArrayOfSquares[row][column].dataset.value){
                            this.changeArrayOfSquares(row, column, row - (steps+1), column , true);
                            steps++;
                            isChange=true;
                    }else if(steps>0){
                        this.changeArrayOfSquares(row, column, row - steps, column, false)
                        isChange=true;
                    }
                }else{
                    steps++
                }
            }
        }
        if(isChange){
            this.isNextSquareShow=false;
            this.createActiveSquare(this.choseRandomActiveSquare(),this.choseRandomValue());
        }
    }

    moveDown(){
        if(this.isNextSquareShow==false){
            return;
        }
        let isChange = false;
        for(let column = 0; column < this.countInRow; column++){
            let steps = 0;
            for(let row = this.countInRow-1; row>=0; row--){
                if(this.ArrayOfSquares[row][column]!==null){
                    if((row + (steps+1)<this.countInRow)
                        && this.ArrayOfSquares[row + (steps+1)][column]!==null 
                        && this.ArrayOfSquares[row + (steps+1)][column].dataset.isCanChange
                        && this.ArrayOfSquares[row + (steps+1)][column].dataset.value == this.ArrayOfSquares[row][column].dataset.value){
                            this.changeArrayOfSquares(row, column, row + (steps+1), column , true);
                            steps++;
                            isChange=true;
                    }else if(steps>0){
                        this.changeArrayOfSquares(row, column, row + steps, column, false)
                        isChange=true;
                    }
                }else{
                    steps++
                }
            }
        }
        if(isChange){
            this.isNextSquareShow=false;
            this.createActiveSquare(this.choseRandomActiveSquare(),this.choseRandomValue());
        }
    }

    moveLeft(){
        if(this.isNextSquareShow==false){
            return;
        }
        let isChange = false;
        for(let row = 0; row < this.countInRow; row++){
            let steps = 0;
            for(let column = 0; column<this.countInRow; column++){
                if(this.ArrayOfSquares[row][column]!==null){
                    if((column - (steps+1)>=0) 
                        && this.ArrayOfSquares[row][column - (steps+1)]!==null
                        && this.ArrayOfSquares[row][column - (steps+1)].dataset.isCanChange
                        && this.ArrayOfSquares[row][column - (steps+1)].dataset.value == this.ArrayOfSquares[row][column].dataset.value){
                            this.changeArrayOfSquares(row, column, row, column - (steps+1) , true);
                            steps++;
                            isChange=true;
                    }else if(steps>0){
                        this.changeArrayOfSquares(row, column, row, column - steps, false)
                        isChange=true;
                    }
                }else{
                    steps++
                }
            }
        }
        if(isChange){
            this.isNextSquareShow=false;
            this.createActiveSquare(this.choseRandomActiveSquare(),this.choseRandomValue());
        }
    }

    moveRight(){
        if(this.isNextSquareShow==false){
            return;
        }
        let isChange = false;
        for(let row = 0; row < this.countInRow; row++){
            let steps = 0;
            for(let column= this.countInRow-1; column>=0; column--){
                if(this.ArrayOfSquares[row][column]!==null){
                    if((column + (steps+1)<this.countInRow) 
                        && this.ArrayOfSquares[row][column + (steps+1)]!==null
                        && this.ArrayOfSquares[row][column + (steps+1)].dataset.isCanChange
                        && this.ArrayOfSquares[row][column + (steps+1)].dataset.value == this.ArrayOfSquares[row][column].dataset.value){
                            this.changeArrayOfSquares(row, column, row, column + (steps+1) , true);
                            steps++;
                            isChange=true;
                    }else if(steps>0){
                        this.changeArrayOfSquares(row, column, row, column + steps, false)
                        isChange=true;
                    }
                }else{
                    steps++
                }
            }
        }
        if(isChange){
            this.isNextSquareShow=false;
            this.createActiveSquare(this.choseRandomActiveSquare(),this.choseRandomValue());
        }
    }


    changeArrayOfSquares(currentRow, currentColumn, targetRow, targetColumn, isMergeSquare){
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
            currentSquare.dataset.isCanChange = "";
            currentSquare.addEventListener('transitionend', handleTransitionEnd)
        }
        currentSquare.style.top = this.squaresCoords[targetRow][targetColumn].top + 'px';
        currentSquare.style.left = this.squaresCoords[targetRow][targetColumn].left + 'px';
    }

    changeColor(square){
        square.classList.remove(`game_2048-active-square-${+square.innerText/2}`);
        square.classList.add(`game_2048-active-square-${square.innerText}`)
    }


}
