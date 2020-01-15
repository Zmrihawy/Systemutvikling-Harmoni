import React, { Component } from "react";
 import './OverviewPage.css';
 import Arr from './pictures/arr.jpg';
 import consert from './pictures/consert.jpg'
 import consert1 from './pictures/consert1.jpg'
 import consert2 from './pictures/consert2.jpg'
 import consert3 from './pictures/consert3.jpg'
export default class OverviewPage extends Component {


     arrangements =[{id:1,
                          name:'Konsert',
                          picture:Arr,
                          location:'Trondheim',
                          date:'02.02.2020'},
                          {id:1,
                           name:'Konsert',
                           picture:consert,
                           location:'Trondheim',
                           date:'02.02.2020'},
                           {id:1,
                            name:'Konsert',
                            picture:consert1,
                            location:'Trondheim',
                            date:'02.02.2020'},
                            {id:1,
                            name:'Konsert',
                            picture:consert2,
                            location:'Trondheim',
                            date:'02.02.2020'},
                            {id:1,
                             picture:consert3,                            name:'Konsert',
                            location:'Trondheim',
                            date:'02.02.2020'}]

    render() {
        
        return (
        <div className="container">
        <div className="grid">
        
        {this.arrangements.map(arr => (
                <div className="article">
                
                <img className="image" src={arr.picture}/>
                
                <div className="text">
                <h3>{arr.name}</h3>
                <p>Location: {arr.location} </p>
                <p>Date: {arr.date} </p>
                <button>More details</button>
                </div>
                </div>
        ))}
       
        
        
        
        </div>
        
        </div>
           
        );
      }
}
