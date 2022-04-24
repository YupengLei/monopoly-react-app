import React from 'react';
import './style/moneybar.css';
import {Button, PlayerIcon} from './setup.js'

class MoneyBarArrow extends React.Component {
  render() {
    const turn = this.props.turn;
    const player = this.props.player;
    const id = this.props.id;
    return (
      <td className='moneybararrowcell'>
        {turn === id ? 
          <i className='money-bar-arrow fa fa-arrow-right' style={{ color: player[id].color}} />
        : null }
      </td>
    );
  }
}

export class PlayerName extends React.Component {
  render() {
    const player = this.props.player;
    return (
      <span style={{verticalAlign: this.props.verticalAlign, backgroundColor: player.color, color: 'black'}} >{player.name}</span>
    );
  }
}

export class PlayerBalance extends React.Component {
  render() {
    const player = this.props.player;
    return (
      <span style={{color: 'white'}} >${player.balance}</span>
    );
  }
}

class MoneyBarPlayer extends React.Component {
  render() {
    const turn = this.props.turn;
    const id = this.props.id;
    const player = this.props.player;
    const moneyBarCellStyle = {
      borderColor: player[id].color, 
      backgroundColor: turn === id ? player[id].color : null, 
      animation: turn === id ? 'baranimation 2s infinite' : null 
    }
    return (
      <td  className='moneybarcell' style={moneyBarCellStyle}>
        <div>
          <PlayerIcon 
            player={player[id]} 
            fontSize='30px'
          />
        </div>        
        <div>
          <PlayerName  player={player[id]} />
        </div>
        <div>
          <PlayerBalance player={player[id]} />
        </div> 
      </td>
    );
  }
}

class MoneyBarRow extends React.Component {
  render() {
    return (
      <tr className='money-bar-row'>
        <MoneyBarArrow
          turn={this.props.turn} 
          player={this.props.player}
          id={this.props.id}
        />
        <MoneyBarPlayer
          turn={this.props.turn} 
          player={this.props.player}
          id={this.props.id}
        />
			</tr>
    );
  }
}

class ViewStats extends React.Component {
  render() {
    return (
      <tr>
        <td style={{border: 'none'}} className='moneybararrowcell'>&nbsp;</td>
        <td style={{border: 'none'}}>
          <Button
            value='Properties' 
            id='viewStatsButton'
            title='Show properties'
            onClick={this.props.handlePropertyStats}
          />
        </td>
			</tr>
    );
  }
}

export default class MoneyBar extends React.Component {
  render() {
    return (
      <div id='moneybarwrap'>
        <div id='moneybar'>
          <table>
            <tbody>
              {this.props.player.map((data, index) => { 
                return (
                  <MoneyBarRow 
                    key={index}
                    turn={this.props.turn}
                    player={this.props.player}
                    id={index}
                  />
                );
              })}
              <ViewStats handlePropertyStats={this.props.handlePropertyStats} />
            </tbody>
          </table>                    
        </div>
      </div>
    );
  }
}