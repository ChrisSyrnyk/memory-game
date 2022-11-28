import styles from './styles.css';
import React, {Component} from 'react';


/*
To do:

(1) change color of clicked tile--
(2) cant click already clicked square--
(3) change color of already clicked square--
(4) cant click until numbers go away--
    -cant keep clicking after nine have been clicked--
    -cant click while showing numbers --
(5) replace top icons--
      -create high score
(6) replace difficulty buttons with reset button and highscore
(7) end game functions (use setstate)--
      --erase order
      --erase pieces
      --reset tiles left to zero
      --set color of tiles back to white
*/


class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      order: [],
      piece:{
        id: 0,
        value: 0,
        choice: 0,
        match: false,
        clicked: false,
      },
      pieces: [],
      tilesLeft: 0,
      isBoardPlayable: false,
      highscore: 0,
      score: 0,
    };

    

  }

  selectTile(id){
    console.log('clicked: ' + id);
  }

  tileListener(id){
    /*when tile is clicked
    (1) check for end game
    (2) increment tiles clicked counter
    (3) get that tile from pieces[], set choice value, set match value
    */
    if (this.state.isBoardPlayable){
      this.setPieceChoice(id);
    }
  }

  checkEnd = async() =>{
    if (this.state.tilesLeft >= 8){
      //change playable state
      this.togglePlayable()
      console.log('endGame');
      //change tile colors
      let i = 0;
      while (i<9){
        this.changeColor(i);
        i++;
      };
      //update score and highscore
      this.determineScore();
      //wait five seconds
      let delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(4000); //wait 4 seconds
      /*--erase order
      --erase pieces
      --reset tiles left to zero
      --set color of tiles back to white*/
      this.setState({
        order: [],
        piece:{
          id: 0,
          value: 0,
          choice: 0,
          match: false,
          clicked: false,
        },
        pieces: [],
        tilesLeft: 0,
        isBoardPlayable: false,
        score: 0,
      })
      //change tiles back to white
      i = 0;
      while (i<9){
        let element = document.getElementById(i);
        let element2 = document.getElementById(i+10);
        this.changebackgroundColor('white', element);
        element2.innerHTML = '';
        i++;
      }
    }
  }

  decrementTilesLeft(){
    this.setState({
      tilesLeft: this.state.tilesLeft + 1,
    });
  };

  setPieceChoice(id){
    //let piece = [];   //piece place holder
    let piece = this.getPieceByid(id);  //select piece with matching id
    //only continue if piece has not been clicked
    if (!piece[0][4]){
      console.log(piece);
      piece[0][2] = this.state.tilesLeft; //set choice
      piece = this.setMatch(piece); //check for and set match state
      //set piece clicked to true
      piece[0][4] = true;
      //remove piece
      this.setState({
        pieces: this.state.pieces.filter(piece => piece[0] != id),
      }, () => {
      //add new piece after removing old piece
      this.setState({
        pieces: this.state.pieces.concat(piece),
      });}
      );
      //change color of clicked piece
      this.changebackgroundColor('grey', document.getElementById(id));
      this.displayChoice(id);
      //decrement tiles left
      this.decrementTilesLeft();
      //check end
      this.checkEnd();
    }
  }

  changebackgroundColor(color, element){
    console.log(element);
    element.style.backgroundColor = color;
  }

  //element loaded is null..
  displayChoice(id){
    let elementid = id + 10
    let element = document.getElementById(elementid); 
    console.log(elementid);
    console.log(element); 
    element.innerHTML= this.state.tilesLeft + 1;
    
  }

  getPieceByid(id){
    let piece = this.state.pieces.filter(piece => piece[0] == id);
    return piece;
  }

  setMatch(piece){
    let pieceChoice = piece[0][2];
    let pieceValue = piece[0][1];
    if(pieceChoice == pieceValue -1){
      piece[0][3] = true;
    }
    return piece;
  }

  changeColor(id){
    let piece = this.state.pieces.filter(piece => piece[0] == id);
    let match = piece[0][3];
    //get element by id
    let element = document.getElementById(id);
    //element.style.backgroundColor = 'red';
    if (match == true){
      element.style.backgroundColor = 'rgb(74, 145, 74)';
    } else {
      element.style.backgroundColor = 'rgb(201, 66, 66)';
    }
  }

  


  

  //produce random number between min and max
  ranNum(min, max){
    let rNum = Math.random() * (max-min) + min;
    let rINum = parseInt(rNum);
    return rINum;
  }

  //shuffle deck
  shuffle(){
    let set = [1,2,3,4,5,6,7,8,9];
    let lastElement = set.length-1;
    let i = 0;
    let j = this.ranNum(0,100);    //determine number of times to rotate
    while (i<j){
      let newSet = [0,0,0,0,0,0,0,0,0];
      let m=0;
      //rotate
      while(m<set.length){
        if (m==0){
          newSet[m] = set[lastElement];
        } else {
          newSet[m] = set[m-1];
        }
        m++;
      }
      //flip
      let f = this.ranNum(0,8);     
      let f2 = this.ranNum(0,8);
      let fIndex = newSet[f];
      let f2Index = newSet[f2];
      newSet[f] = f2Index;
      newSet[f2] = fIndex;
      set = newSet; //setup set for next shuffle
      i++;
    }
    return set;
  }

  //set order
  setupOrder(e){
    this.setState({
      order: this.state.order.concat(e),
    }, ()=>{
      this.setupBoard();
    })
  };


  //set piece
  setupPiece(pieceNum){
    let pieceValue = this.state.order[pieceNum];
    //id,value,choice,match
    let piece = [];
    piece[0] = pieceNum;
    piece[1] = pieceValue;
    piece[2] = 0;
    piece[3] = false;
    return piece;
  }

  setupPieces(){
    console.log(this.state);
    let i = 0;
    let j = this.state.order.length;
    while (i<j){
      this.setupPiece(i);
    }
  }

  //set board
  setupBoard(){
    let numOfPieces = this.state.order.length;
    let i =0;
    let newPieces = [];
    while (i<numOfPieces){
      let piece = this.setupPiece(i)
      newPieces[i] = piece;
      i++;
    }
    this.setState({
      pieces: this.state.pieces.concat(newPieces),
    }, ()=>{
      this.displayNumbers();
    })
  }

  displayNumbers(){
    let i = 0;
    let length = this.state.order.length
    while(i<length){
      let id = 10 + i;
      let element = document.getElementById(id)
      element.innerHTML = this.state.order[i];
      i++;
    }
    setTimeout(function(){
      i = 0;
      while (i<length){
        let id = 10 + i
        let element = document.getElementById(id);
        element.innerHTML = '';
        i++;
      };
    },4000);
  }

  togglePlayable(){
    if (this.state.isBoardPlayable == true){
      this.setState({
        isBoardPlayable: false,
      });
    } else {
      this.setState({
        isBoardPlayable: true,
      })
    }
  }

  //new
  determineScore(){
    let pieces = this.state.pieces;
    let i = 0;
    let currentScore = 0;
    while (i < 9){
      if (pieces[i][3] == true){
        currentScore += 1;
      }
      i++;
    }
    console.log(currentScore);
    let highscore = this.state.highscore;
    if (currentScore > highscore){
      this.setState({
        highscore: currentScore,
      })
    }

  }






  //start game
  startGame= async () =>{
    //add erase old game function and call
    console.log('startGame'); //log game start
    let newOrder = this.shuffle(); //determine order of tiles
    this.setupOrder(newOrder); //set value in order[] and pieces[]
    let delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(4000); //wait 4 seconds
    this.togglePlayable();
    //this.yable(); //make board playable after numbers have been shown
    //function which shows correct choice for 3 seconds
    //setup listeners
      //on click mark choice
      //check for end game
        //on end game if match = true that tile is green else it is red
    
  }


  render(){
    return (
      <div className="game-container round-corners">
        <div className = "game-menu">
          <button className = "menu-button round-corners" onClick = {()=> this.startGame()}>
            <div className = "menu-text">Start Game</div>
          </button>
          <div className = "highscore_container">HighScore: {this.state.highscore}</div>
        </div>
        <div className = "piece-container round-corners">
          <div className = "piece round-corners" id ="0" onClick = {()=> this.tileListener(0)}>
            <div className = "number-holder" id = "10"></div>
          </div>
          <div className = "piece round-corners" id ="1" onClick = {()=> this.tileListener(1)}>
            <div className = "number-holder" id ="11"></div>
          </div>
          <div className = "piece round-corners" id ="2" onClick = {()=> this.tileListener(2)}>
            <div className = "number-holder" id ="12"></div>
          </div>
          <div className = "piece round-corners" id ="3" onClick = {()=> this.tileListener(3)}>
            <div className = "number-holder" id ="13"></div>
          </div>
          <div className = "piece round-corners" id ="4" onClick = {()=> this.tileListener(4)}>
            <div className = "number-holder" id ="14"></div>
          </div>
          <div className = "piece round-corners" id ="5" onClick = {()=> this.tileListener(5)}>
            <div className = "number-holder" id ="15"></div>
          </div>
          <div className = "piece round-corners" id ="6" onClick = {()=> this.tileListener(6)}>
            <div className = "number-holder" id ="16"></div>
          </div>
          <div className = "piece round-corners" id ="7" onClick = {()=> this.tileListener(7)}>
            <div className = "number-holder" id ="17"></div>
          </div>
          <div className = "piece round-corners" id ="8" onClick = {()=> this.tileListener(8)}>
            <div className = "number-holder" id ="18"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
