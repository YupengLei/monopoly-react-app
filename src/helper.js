import React from "react";

export class Square extends React.Component {
  render() {
    const square = this.props.square;
    const position = this.props.position;
    return (
      <React.Fragment>
        &nbsp;
        <span onMouseEnter={(e) => this.props.onMouseEnter(e.pageX, e.pageY, position)} onMouseLeave={this.props.onMouseLeave} style={{backgroundColor: square[position].color, color: position < 40 ? 'black' : 'white'}}>
          {square[position].name}
        </span>
        &nbsp;
      </React.Fragment>
      
    );
  }
}

export class DollarSign extends React.Component {
  render() {
    return (
      <i className='drawing fa fa-dollar-sign' style={{color: this.props.player.color}} />
    );
  }
}