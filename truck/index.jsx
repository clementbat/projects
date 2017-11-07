const my_api_key = '83ff6Kex0v8W7uZEE0Dx5eZK85kmwsBQ';
const numberOfGifs = 40;
const url = "https://api.giphy.com/v1/gifs/search?q=truck&sort=recent&api_key="+my_api_key+"&limit="+numberOfGifs

const scaled = {
  transform: 'scale(2)',
  marginTop:'150px'
}

class Gif extends React.Component {
  render() {
    var scale;
    if(this.props.scale){
      scale = scaled;
    }
    return(
        <div className="col-md-3">
          <img
          className="d-block mx-auto"
          style={scale}
          src={this.props.gifUrl}  
          alt={this.props.gifUrl}
          title={this.props.gifTitle}
          onClick={()=>{this.props.onClick(this.props.gifUrl,this.props.gifTitle)}}/>
        </div>
      )
  }
}

class GifList extends React.Component {
  render() {
    return (   
        <div className="row">
          {this.props.gifs.map(gif => (
            <Gif key={gif.url} gifUrl={gif.url} gifTitle={gif.title} onClick={(url,title)=>{this.props.onClick(url,title)}}/>
          ))}
        </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleViewOneGif = this.handleViewOneGif.bind(this);
    this.handleViewAllGif = this.handleViewAllGif.bind(this);
    this.refresh = this.refresh.bind(this);
    
    this.state = {gifs: [], viewAllGifs:true};
    this.currentGifUrl = '';
    this.currentGifTitle = '';
  }

  handleViewOneGif(url,title) {
    this.setState({viewAllGifs: false});
    this.currentGifUrl = url
    this.currentGifTitle = title
  }

  handleViewAllGif() {
    this.setState({viewAllGifs: true});
  }

  apiCall(url) {
    fetch(url).then((data)=>data.json())
    .then((parsedData)=>{
        var arr = parsedData.data.map((x)=>{
          return {'url':x.images.fixed_width.url.replace(/media\d{1}/,'i'),
            'title':x.title
          }
        })
        this.setState({gifs: arr})
      }
    ).catch(()=>{});
  }

  componentDidMount() {
    this.apiCall(url);
  }

  refresh(){
    this.apiCall(url);
  }

  render(){
    const viewAllGifs = this.state.viewAllGifs;
    let view = null;
    if(viewAllGifs){
      view = 
      <div className="container">
        <div className="row">
          <p className="display-4 text-center">Truck GIFS from GIPHY</p>
          <button className="btn btn-outline-primary" onClick={this.refresh}>Refresh</button>
        </div>
        <GifList gifs={this.state.gifs} onClick={(url,title)=>{this.handleViewOneGif(url,title)}}/>
      </div>
    }else{
      view = 
      <div className="container">
        <button className="btn btn-outline-primary" onClick={this.handleViewAllGif}>Back</button>
        <div className="row">
          <p className="display-4 text-center" id="title">{this.currentGifTitle}</p>
        </div>
        <div className="row">
          <div class="col-md-4"></div>
          <Gif scale={true} gifUrl={this.currentGifUrl} onClick={this.handleViewAllGif} />
        </div>
      </div>
    }
    return (
      view
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'));
