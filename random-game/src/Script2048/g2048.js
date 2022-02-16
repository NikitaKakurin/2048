let log = (param)=> console.log(param);


export class Game2048{
    constructor(selector){
        this.board = document.querySelector(selector),
        this.squares = document.querySelectorAll('.game_2048-item-square'),
        this.containerSquares = document.querySelector('.game_2048-container'),
        this.countInRow = Math.sqrt(this.squares.length),
        this.squaresCoords = []
    }
    
    initGame(){
        this.setCoords()

        this.squareSizes = {
            'width':this.squares[0].clientWidth,
            'height':this.squares[0].clientHeight,
            };


        
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
        this.ArrayOfSquares[squarePlace.row][squarePlace.column]=ASquare;
        ASquare.hidden=true;
        this.containerSquares.append(ASquare);
        setTimeout(()=>ASquare.hidden=false, 300);
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
        for(let column = 0; column < this.countInRow; column++){
            let stepsUp = 0;
            for(let row = 0; row<this.countInRow; row++){
                if(this.ArrayOfSquares[row][column]===null){
                    stepsUp++
                }else if(this.ArrayOfSquares[row][column]!==null){
                    if(stepsUp===0){
                        if((row - (stepsUp+1)>=0) && this.ArrayOfSquares[row - (stepsUp+1)][column]!==null){
                            if(this.ArrayOfSquares[row - (stepsUp+1)][column].innerText == this.ArrayOfSquares[row][column].innerText){
                                this.changeArrayOfSquares(row, column, row - (stepsUp+1), column , true);
                                stepsUp++;
                            }
                        }else{
                            continue;
                        }
                    }else if((row - (stepsUp+1)>=0) && this.ArrayOfSquares[row - (stepsUp+1)][column]!==null){
                        if(this.ArrayOfSquares[row - (stepsUp+1)][column].innerText == this.ArrayOfSquares[row][column].innerText){
                            this.changeArrayOfSquares(row, column, row - (stepsUp+1), column , true);
                            stepsUp++;
                        }else{
                            this.changeArrayOfSquares(row, column, row - stepsUp, column, false)
                        }
                    }else{
                        this.changeArrayOfSquares(row, column, row - stepsUp, column, false)
                    }


                }
            }
        }
        this.createActiveSquare(this.choseRandomActiveSquare())
    }

    moveDown(){
        let isChange = false;
        for(let column = 0; column < this.countInRow; column++){
            let stepsUp = 0;
            for(let row = this.countInRow-1; row>=0; row--){
                if(this.ArrayOfSquares[row][column]===null){
                    stepsUp++
                }else if(this.ArrayOfSquares[row][column]!==null){
                    if(stepsUp===0){
                        if((row + (stepsUp+1)<=3) && this.ArrayOfSquares[row + (stepsUp+1)][column]!==null){
                            if(this.ArrayOfSquares[row + (stepsUp+1)][column].innerText == this.ArrayOfSquares[row][column].innerText){
                                this.changeArrayOfSquares(row, column, row + (stepsUp+1), column , true);
                                stepsUp++;
                                isChange=true;
                            }
                        }else{
                            continue;
                        }
                    }else if((row + (stepsUp+1)<=3) && this.ArrayOfSquares[row + (stepsUp+1)][column]!==null){
                        if(this.ArrayOfSquares[row + (stepsUp+1)][column].innerText == this.ArrayOfSquares[row][column].innerText){
                            this.changeArrayOfSquares(row, column, row + (stepsUp+1), column , true);
                            stepsUp++;
                            isChange=true;
                        }else{
                            this.changeArrayOfSquares(row, column, row + stepsUp, column, false)
                            isChange=true;
                        }
                    }else{
                        this.changeArrayOfSquares(row, column, row + stepsUp, column, false)
                        isChange=true;
                    }
                }
            }
        }
        if(isChange){
            this.createActiveSquare(this.choseRandomActiveSquare())
        }
        
    }



    changeArrayOfSquares(currentRow, currentColumn, targetRow, targetColumn, isMergeSquare){
        let previousSquare = this.ArrayOfSquares[targetRow][targetColumn];
        this.ArrayOfSquares[targetRow][targetColumn]=this.ArrayOfSquares[currentRow][currentColumn];
        this.ArrayOfSquares[currentRow][currentColumn]=null
        this.moveSquareUp(targetRow, targetColumn, previousSquare, isMergeSquare)
    }

    moveSquareUp(targetRow, targetColumn, previousSquare, isMergeSquare){
        let prevSquare = previousSquare;
        const currentSquare = this.ArrayOfSquares[targetRow][targetColumn]
        const handleTransitionEnd = (event)=>{
            if(prevSquare){
                prevSquare.remove();
                prevSquare = null; 
            }
            currentSquare.innerText = (+currentSquare.innerText)*2;
            currentSquare.removeEventListener('transitionend', handleTransitionEnd)
        }
        if(isMergeSquare){
            currentSquare.addEventListener('transitionend', handleTransitionEnd)
        }
        currentSquare.style.top = this.squaresCoords[targetRow][targetColumn].top + 'px';
    }


}
