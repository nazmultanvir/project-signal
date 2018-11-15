import React, { Component } from 'react';
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
    this.state = { signalLeft: red, signalTop : red, signalRight: red,signalBottom: green };
  }
  componentWillMount(){
    var client  = mqtt.connect("mqtt://192.168.0.113:9001",{clientId:"mqttjs01"});
    client.on("connect",()=>console.log("connected !"));

    client.on('connect', function () {
      client.subscribe('path1', function (err) {
        console.log(err)
        if (!err) {
          client.publish('presence', 'Hello mqtt')
        }
      })
    })

    client.on('message', (topic, message)=> {

      function signalConvter(num){
        if(num==1){
          return green;
        }else if(num == 2){
          return yellow;
        }else{
          return red;
        }
      }
      let data = message.toString();
      let lightSignal = data.split(",");
      this.setState({signalLeft: signalConvter(lightSignal[0]), signalTop : signalConvter(lightSignal[1]), signalRight: signalConvter(lightSignal[2]),signalBottom: signalConvter(lightSignal[3])});
    })
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

        </div>
    );
  }
}

export default App;

