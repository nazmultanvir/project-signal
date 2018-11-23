import React, { Component, Button } from 'react';
//import logo from './logo.svg';
import './App.css';
import red from "./asscets/red.png";
import yellow from "./asscets/yellow.png";
import green from "./asscets/green.png";


import mqtt from "mqtt";
//import { parser } from 'mqtt-packet';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { signalLeft: red, signalTop : red, signalRight: red,signalBottom: green, btn:false, btn1:false, btn2:true, btn3:false };
    this.changeSignalData = this.changeSignalData.bind(this); 
  }
  
  componentWillMount(){
    var client  = mqtt.connect("ws://iot.eclipse.org:80/ws",{clientId:"mqttjs01"});
    client.on("connect",()=>console.log("connected !"));
    client.on('connect', function () {
      client.subscribe('fromNode1', function (err) {
        console.log(err)
        if (!err) {
          client.publish('presence', 'Hello mqtt')
        }
      })
    })
    client.on('message', (topic, message)=> {
      console.log(message, topic);

      function signalConvter(range, range1, range2){
        if(range==0 && range1==0 && range2==1){
          return red;
        } else if(range==0 && range1==1 && range2==0){
          return yellow;
        }else{
          return green;
        }
      }
      function signalConvterButton(range, range1, range2){
        let btnGreen = '#34a853';
        let btnRed ="#ea4335";
        let btnYellow="#fbbc05";
        if(range==0 && range1==0 && range2==1){
          return btnRed;
        } else if(range==0 && range1==1 && range2==0){
          return btnYellow;
        }else{
          return btnGreen;
        }
      }
      let data = message.toString();
      let lightSignal = data.split(",");
      //console.log(lightSignal);


      this.setState({btn3: signalConvterButton(lightSignal[0], lightSignal[1], lightSignal[2]), btn : signalConvterButton(lightSignal[3], lightSignal[4], lightSignal[5]), btn1: signalConvterButton(lightSignal[6], lightSignal[7], lightSignal[8]),btn2: signalConvterButton(lightSignal[9], lightSignal[10], lightSignal[11])});
      this.setState({signalLeft: signalConvter(lightSignal[0], lightSignal[1], lightSignal[2]), signalTop : signalConvter(lightSignal[3], lightSignal[4], lightSignal[5]), signalRight: signalConvter(lightSignal[6], lightSignal[7], lightSignal[8]),signalBottom: signalConvter(lightSignal[9], lightSignal[10], lightSignal[11])});
    })
  }

  changeSignalData(data){
    var client  = mqtt.connect("ws://iot.eclipse.org:80/ws",{clientId:"mqttjs01"});
    if(data==1){
      client.publish('fromCentralServer', '0,0,1,1,0,0,1,0,0,1,0,0');
    }else if(data==2){
      client.publish('fromCentralServer', '1,0,0,0,0,1,1,0,0,1,0,0');
    }else if(data==3){
      client.publish('fromCentralServer', '1,0,0,1,0,0,0,0,1,1,0,0');
    }else if(data==4){
      client.publish('fromCentralServer', '1,0,0,1,0,0,1,0,0,0,0,1');
    }else{
      client.publish('fromCentralServer', '0,0,0,0,0,0,0,0,0,0,0,0'); 
    }
  }
  render() {

    return (
      <div class="wrapper">
            <div className="traffic">
                <div className=" signalLeft">
                        <img className="signal" src={this.state.signalLeft}/>
                </div>
                <div className=" signalTop">
                        <img className="signal" src={this.state.signalTop}/>
                </div>
                <div className=" signalRight">
                        <img className="signal" src={this.state.signalRight}/>
                </div>
                <div class=" signalBottom">
                        <img className="signal" src={this.state.signalBottom}/>
                </div>
            </div>
            <div className="RoadNumber">
              <p className="RoadNumberOne">1</p>
              <p className="RoadNumberTwo">2</p>
              <p className="RoadNumberThree">3</p>
              <p className="RoadNumberFour">4</p>
            </div>
            <div className="signalController">
              <button className="signalControllerButton" style={{background: this.state.btn}} onClick={()=>{this.changeSignalData(1)}}>ROAD 1</button>
              <button className="signalControllerButton" style={{background: this.state.btn1}} onClick={()=>{this.changeSignalData(2)}}>ROAD 2</button>
              <button className="signalControllerButton" style={{background: this.state.btn2}} onClick={()=>{this.changeSignalData(3)}}>ROAD 3</button>
              <button className="signalControllerButton" style={{background: this.state.btn3}} onClick={()=>{this.changeSignalData(4)}}>ROAD 5</button>
            </div>

        </div>
    );
  }
}

export default App;

