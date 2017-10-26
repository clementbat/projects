const size = 60;

function neighborhood(el){
    switch(el){
      case 0:
        return [1,size, size+1];
        break;
      case size-1:
        return [size-2, 2*size - 1, 2*size - 2]
        break;
      case size*size-1:
        return [size*size-2, size*size-size-1,size*size-size-2]
        break;
      case size*size-size:
        return [size*size-size+1, size*size-2*size, size*size-2*size+1]
        break;
    }
    if(el < size - 1 && el > 0){
      return [el-1,el+1,el+size, el+size-1, el+size+1]
    }
    if(el % size === 0 && el < size * size && el > 0){
      return [el+1, el-size, el-size+1, el+size, el+size+1]
    }
    if((el+1) % size === 0 && el < size * size - 1 && el > size){
      return [el-1, el-size, el-size-1, el+size, el+size-1]
    }
    if(el < size * size && el > size*size-size){
      return [el+1,el-1, el-size, el-size+1, el-size-1]
    }
    return [el-1,el+1,el-size,el+size,el-size-1,el-size+1,el+size+1,el+size-1]
  }

var voisins = [];
for (var j = 0; j < size*size; j++) {
  voisins[j] = neighborhood(j);
}

class Square extends React.Component {
  render() {
    let classname;
    if(this.props.index === size*(size - 1)){
      classname = "angle"
    }else if(this.props.index % size === 0){
      classname = "side"
    }else if(this.props.index >= size*(size - 1)){
      classname = "bottom"
    }

    if(this.props.value === true){
      classname = classname + " btn on"
    }else if(this.props.value === false){
      classname = classname + " btn off"
    }
    
    return <button className={classname} onClick={() => this.props.onClick()}></button>
    
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
    this.stopAnimate = this.stopAnimate.bind(this);

    const random =[];
    for (var i = 0; i < size*size; i++) {
      random[i]= (Math.random() >= 0.8)
    }
    this.state = {
      squares: random
    };
    this.now;
    this.fpsInterval;
    this.then;
    this.elapsed;
    this.stop = false;
    this.generation = 0;
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = !squares[i];
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return <Square
            key={i}
            index={i}
            value={this.state.squares[i]} 
            onClick={()=> this.handleClick(i)}
            />;
  }
  
  startAnimating(fps){
    this.stop = false;
    this.fpsInterval = 1000/fps;
    this.then = Date.now();
    this.animate();
  }

  animate(){
    if(this.stop){return;}

    requestAnimationFrame(this.animate);

    this.now = Date.now();
    this.elapsed = this.now - this.then;

    if(this.elapsed > this.fpsInterval){
      this.then = this.now - (this.elapsed % this.fpsInterval);
      this.next();
      this.generation++;

    }
  }

  next(){
    const squares = this.state.squares.slice();
    const copy2 = this.state.squares.slice();
    for (var j = 0; j < size*size; j++) {
      let count= 0;
      const voisinscourant = voisins[j];
      for (var i = 0; i < voisinscourant.length; i++) {
        if(squares[voisinscourant[i]] === true){
            count = count + 1;
        }
      }
      if(count < 2){
        copy2[j] = false
      }else if(count === 3 && squares[j] === false){
        copy2[j] = true;
      }else if((count === 2 || count === 3) && squares[j] === true){
        copy2[j] = true;
      }else{
        copy2[j] = false;
      }
    }
    this.setState({squares: copy2});
  }

  stopAnimate(){
    this.stop = true
  }

  clearBoard(){
    var copy = Array(size*size).fill(false);
    this.setState({squares: copy});
    this.generation = 0;
  }

  SquareLine(j) {
    let squareline = [];
    for (var i = j*size; i < size*(j+1) ; i++) {
      squareline.push(this.renderSquare(i))
    } 
    return  <div key={j}>{squareline}</div>;
  }

  render() {
    let board=[]
    for (var j = 0; j < size ; j++) {
      board.push(this.SquareLine(j));
    }
    return (
      <div>
        <button id='go' className="btn btn-success" onClick={() => this.startAnimating(10)}>start</button>
        <button id='stop' className="btn btn-danger" onClick={() => this.stopAnimate()}>stop</button>
        <button id='clear' className="btn btn-secondary" onClick={() => this.clearBoard()}>clear</button>
        Generation {this.generation}
        <div className="board">{board}</div>
      </div>
    );
  }
}

class App extends React.Component {
  render(){
    return (
      <div className="page">
        <Board />
      </div>
      );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'));
