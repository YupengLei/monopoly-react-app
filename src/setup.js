import React from 'react';
import './style/setup.css';

class RadioButton extends React.Component {
  render() {
    return (
      <React.Fragment>
        <input className={this.props.className} type='radio' value={this.props.value} onChange={this.props.onChange}  checked={this.props.checked} id={this.props.id} />
        <label className={this.props.className} htmlFor={this.props.id}>{this.props.value}</label>
      </React.Fragment>
    );
  }
}

class ColorPicker extends React.Component { 
  render() {
    const id = this.props.id;
    const player = this.props.player;
    const colorGroup = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'brown', 'violet'];
    return (
      <div className='colorPicker'>
        {colorGroup.map( (element, index) => {
          return (
            <React.Fragment key={element}>
              <RadioButton
                className={element}
                value={element}
                onChange={(e) => this.props.handleColorChange(id, e.target.value)}
                id={id + element}
                checked={player[id].color === element}
              />
            </React.Fragment>  
          );
        })}
      </div>
    );
  }
}

class PlayerTypePicker extends React.Component {
  render() { 
    const id = this.props.id;
    const player = this.props.player;
    return (
      <div className='colorPicker'>
        <RadioButton
          className='human'
          value='human'
          onChange={(e) => this.props.handleControlChange(id, e.target.value)}
          checked={player[id].controlledBy === 'human'}
          id={id + 'human'}
        />
        <RadioButton
          className='ai'
          value='ai'
          onChange={(e) => this.props.handleControlChange(id, e.target.value)}
          checked={player[id].controlledBy === 'ai'}
          id={id + 'ai'}
        />
      </div>      
    );
  }
}

export class TextInput extends React.Component {
  render() {
    return (
      <input type='text'  className='textinput' maxLength='16' value={this.props.value} onChange={this.props.onChange} />
    );
  }
}

export class PlayerIcon extends React.Component {
  render() {
    const player = this.props.player;
    const icon = player.controlledBy === 'human' ? player.img : 'fas fa-robot';
    return (
      <i className={icon} style={{color: player.color, verticalAlign: this.props.verticalAlign, fontSize: this.props.fontSize, animation: this.props.animation}} />
    );
  }
}

class UserInfo extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.player.filter((item, index) => index < this.props.pcount).map((player, index) => { 
          return (
            <div key={player.id} className='player-setup'>
              <div className='playerNameSetup'> 
                <PlayerIcon player={player} />               
                <TextInput 
                  player={player}
                  onChange={(event) => this.props.handleNameChange(index, event.target.value)}
                  value={player.name}
                />
              </div> 
                            
              <ColorPicker 
                id={index}
                player={this.props.player}
                pcount={this.props.pcount}
                handleColorChange={this.props.handleColorChange}
              />
              <PlayerTypePicker
                id={index}
                player={this.props.player}
                pcount={this.props.pcount}
                handleControlChange={this.props.handleControlChange}
              />
            </div>
          );
        })}    
      </React.Fragment>
    );

  }
}

class RangeSlider extends React.Component {
  render() {
    return (
      <div className='range-slider'>
        <label> {this.props.pcount} players  
          <input id='playernumber' type='range' min='2' max='4' value={this.props.pcount} onChange={this.props.handlePlayerCountChange} step='1' />
        </label>
      </div>
    );
  }
}

export class Button extends React.Component {
  render() {
    return (
      <input type='button' value={this.props.value} id={this.props.id} style={{marginTop: this.props.marginTop}} title={this.props.title} onClick={this.props.onClick} />
    );
  }
}

export default class Setup extends React.Component {
  render() { 
    return (
      <React.Fragment>
        <div className='popupbackground'></div>
        <div className='setupwrap'>
          <div className='setup'>
            <RangeSlider
              pcount={this.props.pcount}
              handlePlayerCountChange={this.props.handlePlayerCountChange} 
            />        
            <UserInfo 
              pcount={this.props.pcount}
              handleColorChange={this.props.handleColorChange}
              handleNameChange={this.props.handleNameChange}
              player={this.props.player}
              handleControlChange={this.props.handleControlChange}
            />
            <Button
              value='Start Game'
              id='startButton'
              title='Starting the game' 
              onClick={this.props.handleStartButton} 
            />
          </div>
        </div>
      </React.Fragment>  
    );
  }
}


