import React from "react";

export default class Popup extends React.Component {
  render() {    
    return (
      <React.Fragment>
        <div className='popupbackground'></div>
        <div className='popupwrap'>
          <div className='popup'>
            <div className='popup-layout'>
              <div id='popuptext'>{this.props.text}</div>
              <div id='popupdrag'></div>
            </div>
          </div>
        </div>
      </React.Fragment>  
    );
  }
}

