import React, { Component } from 'react';
import Navigation from './Component/Navigation/Navigation.js';
import Logo from './Component/Logo/Logo.js';
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm.js';
import Rank from './Component/Rank/Rank.js';
import Particles from 'react-particles-js';
import './App.css';
import Clarifai from 'clarifai';
import FaceRecognition from './Component/FaceRecognition/FaceRecognition.js';

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
       imageUrl : '',
     }
  }

onInputChange = (event) => {
  this.setState({input: event.target.value});
}

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
  app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
    function(response) {
      console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    },
    function(err) {
      // there was an error
    }
  );
}

  render() {
    return (
      <div className="App">
            <Particles className="particles"
              params={particlesOptions}
            />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit} 
        /> 
        <FaceRecognition imageUrl={this.state.imageUrl}/>
             
      </div>
    );
  }
}

export default App;
