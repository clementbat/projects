var receipe = [];
var hist = {};

if(typeof sessionStorage.receipes === "undefined"){
  receipe=[{
      "title": "Gateau au chocolat",
      "ingredients":["Farine", "Oeufs", "Chocolat"]
    },
    {
      "title": "Cake à la carotte",
      "ingredients":["Carotte", "Oeufs", "Sucre"]
    },
    {
      "title": "Tarte aux pommes",
      "ingredients":["Pommes", "Compote", "Tarte"]
    }
];
}else{
  receipe = JSON.parse(sessionStorage.receipes);
}

class Receipe extends React.Component {


constructor(props){
  super(props);
  this.state = {
    receipes: receipe,
    title: '',
    content: '',
    editable: -1,
    viewable: -1
  };

  this.deleteReceipe = this.deleteReceipe.bind(this);
  this.handleChangeAddReceipe = this.handleChangeAddReceipe.bind(this);
  this.handleAddReceipe = this.handleAddReceipe.bind(this);
  this.handleEditTitleClick = this.handleEditTitleClick.bind(this);
  this.handleEditContentClick = this.handleEditContentClick.bind(this);
  this.editButton = this.editButton.bind(this);
  this.cancelEdit = this.cancelEdit.bind(this);
  this.displayReceipe = this.displayReceipe.bind(this);

}

displayReceipe(index){
  var a;
  if(this.state.viewable === index){
    a = -1;
  }else{
    a = index;
  }
  this.setState({viewable: a})
}

handleEditTitleClick(event, index) {
  const value = event.target.value;
  var copy = this.state.receipes.slice();
  copy[index].title = value;
  this.setState({receipes: copy});
  sessionStorage.receipes = JSON.stringify(copy);
}

handleEditContentClick(event, index) {
  const value = event.target.value;
  var copy = this.state.receipes.slice();
  copy[index].ingredients = value.split(',');
  this.setState({receipes: copy});
  sessionStorage.receipes = JSON.stringify(copy);
}

handleChangeAddReceipe(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name
    this.setState({[name]: value});
}

handleAddReceipe(event) {
  var copy = this.state.receipes.slice();
  copy.push({
      "title": this.state.title,
      "ingredients": this.state.content.split(',')
    });
  this.setState({
    receipes: copy,
    title: '',
    content: ''
  });
  sessionStorage.receipes = JSON.stringify(copy);
  event.preventDefault();
}

deleteReceipe(index){
  var copy = this.state.receipes.slice();
  copy.splice(index,1);
  this.setState({
    receipes: copy,
    viewable: -1
  });
  sessionStorage.receipes = JSON.stringify(copy);
}

editButton(index){  
  var copy = this.state.receipes.slice();
  hist = JSON.stringify(copy[index]);
  this.setState({editable: index})
}

validateEdit(index){
  this.setState({editable: -1})
}

cancelEdit(index){
  var copy = this.state.receipes.slice();
  copy[index] = JSON.parse(hist);
  this.setState({
    editable: -1,
    receipes: copy
  })
  sessionStorage.receipes = JSON.stringify(copy);
}



render(){
  const receipes = this.state.receipes;
  var listItems;

  listItems = receipes.map((receipe, index) =>
  {
    if(index === this.state.viewable){
    return (<div key={receipe.title}>
      {(index === this.state.editable) ?
      <div>
        <input name="editTitle" className="btn btn-dark btn-block" value={this.state.receipes[index].title} onChange={(e)=>this.handleEditTitleClick(e,index)} readOnly={false}/>
        <input name="editContent" className="btn btn-light btn-block" value={this.state.receipes[index].ingredients.join()} onChange={(e)=>this.handleEditContentClick(e,index)} readOnly={false}/>
        <div><small className="text-muted"><i>Use a comma to separate the ingredients</i></small></div>
        <button className="btn btn-success" onClick={()=>this.validateEdit(index)}>Validate</button>
        <button className="btn btn-outline-secondary" onClick={()=>this.cancelEdit(index)}>Cancel</button>
      </div>
      :
      <div>
        <input value={receipe.title} onClick={()=>this.displayReceipe(index)} className="btn btn-dark btn-block" readOnly={true}/>
        <IngredientsList ingredients = {receipe.ingredients} />
        <button className="btn btn-outline-success btn-block" onClick={()=>this.editButton(index)}>Edit</button>
        <button className="btn btn-outline-danger btn-block" onClick={()=>this.deleteReceipe(index)}>Delete</button>
      </div>
      }
      
    </div>);
    }else{
    return (
      <input key={receipe.title} value={receipe.title} onClick={()=>this.displayReceipe(index)} className="btn btn-secondary btn-block" readOnly={true}/>)
    }
  }
  );

    return (
      <div className="container">
        <h1 className="display-4">Receipes</h1>
        <div className="row">
        <div className="col-md-1"></div>
          <div className="col-md-5">
            <small className="text-muted">Click on each receipe to see the ingredients</small>
            <div>{listItems}</div>
          </div>
        <div className="col-md-5">
          <small className="text-muted">Add a new receipe to the list here</small>
          <form onSubmit={this.handleAddReceipe}>
            <input name="title" placeholder="Your new receipe" className="btn btn-outline-secondary btn-block" type="text" value={this.state.title} onChange={this.handleChangeAddReceipe} />
            <input name="content" placeholder="The ingredients separated by a comma" className="btn btn-outline-secondary btn-block" type="text" value={this.state.content} onChange={this.handleChangeAddReceipe} />
          <input type="submit" className="btn btn-outline-primary btn-block" value="Add a receipe" />
        </form>
      </div>
      </div>
    </div>
    );
}
}

function IngredientsList(props){
  const ingredients = props.ingredients;
  return ingredients.map((ingredient) =>
    <input key={ingredient} className="btn btn-light btn-block" value={ingredient} readOnly={true}/>
  )
}

class App extends React.Component {
  render(){
    return (
      <div>
        <Receipe/>  
      </div>
      );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'));    
