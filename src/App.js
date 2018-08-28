import React, { Component } from 'react';
import Navigation from './Component/Navigation/Navigation.js';
import Logo from './Component/Logo/Logo.js';
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm.js';
import Rank from './Component/Rank/Rank.js';
import Particles from 'react-particles-js';
import './App.css';
import Clarifai from 'clarifai';
import FaceRecognition from './Component/FaceRecognition/FaceRecognition.js';
import Signin from './Component/Signin/Signin.js';
import Register from './Component/Register/Register.js';

// initialize with your api key. 
const app = new Clarifai.App({
 apiKey: 'e2f4e76400884ce29d2f3417ab199a3b'
});


const particlesOptions = {
                particles: {
                   number : {
                    value : 130,
                    density : {
                      enable : true,
                      value_area : 800
                    }
                   }
                }
              }

class App extends Component {
  constructor() {
     super();
     this.state = {
       input: '',
       imageUrl: '',
       box: {},
       route: 'signin',
       isSignedIn : false,
     }
  }

calculateFaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputimage');
   const width = Number(image.width);
   const height = Number(image.height);
   return{
    leftCol : clarifaiFace.left_col * width,
    topRow : clarifaiFace.top_row * height,
    rightCol : width - (clarifaiFace.right_col * width),
    bottomRow : height - (clarifaiFace.bottom_row * height)
   }
}

displayFaceBox = (box) => {
  this.setState({box : box});
}


onInputChange = (event) => {
  this.setState({input: event.target.value});
}

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
  app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
  .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
  .catch(err => console.log(err));
}

onRouteChange = (route) => {
   if(route === 'signout'){
    this.setState({isSignedIn : false});
   }
   else 
   if(route === 'home'){
    this.setState({isSignedIn : true});
   } 
   this.setState({route : route });
}

  render() {
    const {isSignedIn,imageUrl,box,route} = this.state;
    return (
      <div className="App">
            <Particles className="particles"
              params={particlesOptions}
            />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {
          route === 'home' ? 
              <div>
                  <Logo />
                  <Rank />
                  <ImageLinkForm 
                      onInputChange={this.onInputChange} 
                      onButtonSubmit={this.onButtonSubmit} 
                  /> 
                  <FaceRecognition box={box} imageUrl={imageUrl}/>
              </div>   
             :  // Ternary Operator
                (
                  route === 'signin' ? 
                      <Signin onRouteChange={this.onRouteChange}/>
                  :  // Ternary Operator
                      <Register onRouteChange={this.onRouteChange}/>
                )       
        }     
      </div>
    );
  }
}

export default App;
