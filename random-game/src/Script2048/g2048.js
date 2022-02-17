let log = (param)=> console.log(param);


export class Game2048{
    constructor(selector){
        this.board = document.querySelector(selector),
        this.squares = document.querySelectorAll('.game_2048-item-square'),
        this.containerSquares = document.querySelector('.game_2048-container'),
        this.containerActiveSquares = document.querySelector('.game_2048-container-active-square'),
        this.scoreTable = document.querySelector('.game_2048-score__value');
        this.countInRow = Math.sqrt(this.squares.length),
        this.squaresCoords = []
        this.isNextSquareShow=false;

    }
    
    initGame(){
        this.setCoords()
        this.initTime = Date.now();
        this.timer = 0;
        this.score = 0;
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

        this.createActiveSquare(this.choseRandomActiveSquare())
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

    createActiveSquare(squarePlace){
        let ASquare = document.createElement('div');
        ASquare.innerText = 2;
        ASquare.classList.add('game_2048-active-square')
        ASquare.style.width = this.squareSizes.width + 'px';
        ASquare.style.height = this.squareSizes.height + 'px';
        ASquare.style.top = this.squaresCoords[squarePlace.row][squarePlace.column].top + 'px';
        ASquare.style.left = this.squaresCoords[squarePlace.row][squarePlace.column].left + 'px';
        ASquare.dataset.value = 2;
        ASquare.dataset.isCanChange = true;
        this.ArrayOfSquares[squarePlace.row][squarePlace.column]=ASquare;
        ASquare.hidden=true;
        this.containerActiveSquares.append(ASquare);

        setTimeout(()=>{
            ASquare.hidden=false;
            this.isNextSquareShow=true;
            this.setScore();
            if(this.arrayOfEmpty.length==1 && this.isGameOver()){
                setTimeout(()=>handleGameOver(),200)
            }
        }, 300);
    }

    handleGameOver(){

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

    setScore(){
        this.score += 2;
        this.scoreTable.innerText=this.score;
    }
    getIndexesEmptySquares(){
        this.arrayOfEmpty = [];
        this.ArrayOfSquares.forEach((row, index)=>{
            let indexRow = index;
            row.forEach((square, indexSquare)=>{
                if(square===null){
                    this.arrayOfEmpty.push({'row':indexRow,'column':indexSquare});
                }
            })
        })
    };
    
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
            this.createActiveSquare(this.choseRandomActiveSquare());
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
            this.createActiveSquare(this.choseRandomActiveSquare());
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
            this.createActiveSquare(this.choseRandomActiveSquare());
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
            this.createActiveSquare(this.choseRandomActiveSquare());
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
            this.changeColor(currentSquare);
            currentSquare.dataset.isCanChange = true;
        }
        if(isMergeSquare){
            currentSquare.dataset.value = (+currentSquare.dataset.value) * 2;
            currentSquare.dataset.isCanChange = false;
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
