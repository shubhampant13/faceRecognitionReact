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
       user : {
         id: '',
         name: '',
         email: '',
         entries: 0,
         joined: ''
       } 
     }

  }

// componentDidMount(){
//    fetch('http://localhost:3000/').then(response => response.json()).then(console.log); 
// }

loadUser = (data) => {
   this.setState({user: {
                         id: data.id,
                         name: data.name,
                         email: data.email,
                         entries: data.entries,
                         joined: data.joined, 
                       }
                     }
                )
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
  .then(response => 
         {
            if(response)
            {
                fetch('http://localhost:3000/image',
                       {
                        method : 'put',
                        headers : {'Content-Type': 'application/json'},
                        body : JSON.stringify({
                            id : this.state.user.id
                          })
   })
                .then(response => response.json())
                .then(count => {
                       this.setState(Object.assign(this.state.user,{entries:count})) 
                })
            }  
            this.displayFaceBox(this.calculateFaceLocation(response))
         }
  ).catch(err => console.log(err));
 

/*
 app.models.initModel({id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40"})
      .then(generalModel => {
        return generalModel.predict(this.state.input);
      })
      .then(response => {
        var concepts = response['outputs'][0]['data']['concepts'] 
        console.log(response);
      })
*/
  
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
                  <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                  <ImageLinkForm 
                      onInputChange={this.onInputChange} 
                      onButtonSubmit={this.onButtonSubmit} 
                  /> 
                  <FaceRecognition box={box} imageUrl={imageUrl}/>
              </div>   
             :  // Ternary Operator
                (
                  route === 'signin' ? 
                      <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                  :  // Ternary Operator
                      <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                )       
        }     
      </div>
    );
  }
}

export default App;
