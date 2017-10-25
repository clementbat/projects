const size = 60;
var intervalid;

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
    if(this.props.value === true){
      return <button className="btn on" onClick={() => this.props.onClick()}></button>
    }else{
      return <button className="btn off" onClick={() => this.props.onClick()}></button>
    }
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    const random =[];
    for (var i = 0; i < size*size; i++) {
      random[i]= (Math.random() >= 0.8)
    }
    this.state = {
      squares: random
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = !squares[i];
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return <Square
            key={i}
            value={this.state.squares[i]} 
            onClick={()=> this.handleClick(i)}
            />;
  }
  

  next(){
    var self=this;
    intervalid = setInterval(function(){
      const squares = self.state.squares.slice();
      const copy2 = self.state.squares.slice();
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
      self.setState({squares: copy2});
      }
      , 100);
    
  }

  stop(){
    clearInterval(intervalid);
  }

  SquareLine(j) {
    let squareline = [];
    for (var i = j*size; i < size*(j+1) ; i++) {
      squareline.push(this.renderSquare(i))
    } 
    return  <div key={j} className="row">{squareline}</div>;
  }

  render() {
    let board=[]
    for (var j = 0; j < size ; j++) {
      board.push(this.SquareLine(j));
    }
    return (
      <div>
        <button id='go' className="btn btn-primary" onClick={() => this.next()}>GO</button>
        <button id='stop' className="btn btn-danger" onClick={() => this.stop()}>stop</button>
        {board}
      </div>
    );
  }
}

class App extends React.Component {
  render(){
    return (
      <div className="container">
        <div className="row justify-content-center">
          <Board />
        </div>
      </div>
      );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'));