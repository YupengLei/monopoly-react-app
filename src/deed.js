import React from 'react';
import './style/deed.css';
import { Hotel, House } from './board';
import { PlayerName } from './moneybar';
import { PlayerIcon } from './setup';

class DeedTable extends React.Component {
  render() {
    const square = this.props.square;
    const deedPos = this.props.deedPos;
    return (
      <table id='deed-table'>
        <tbody>
          <tr>
            <td colSpan='2'>RENT&nbsp;$<span>{square[deedPos].baseRent}</span>.</td>
          </tr>
          <tr>
            <td style={{textAlign: 'left'}}>With 1 House</td>
            <td style={{textAlign: 'right'}}>$&nbsp;&nbsp;&nbsp;<span>{square[deedPos].rent1}</span>.</td>
          </tr>
          <tr>
            <td style={{textAlign: 'left'}}>With 2 Houses</td>
            <td style={{textAlign: 'right'}}><span>{square[deedPos].rent2}</span>.</td>
          </tr>          
          <tr>
            <td style={{textAlign: 'left'}}>With 3 Houses</td>
            <td style={{textAlign: 'right'}}><span>{square[deedPos].rent3}</span>.</td>
          </tr>          
          <tr>
            <td style={{textAlign: 'left'}}>With 4 Houses</td>
            <td style={{textAlign: 'right'}}><span>{square[deedPos].rent4}</span>.</td>
          </tr>          
          <tr>
            <td colSpan='2'>
              <div>With HOTEL $<span>{square[deedPos].rent5}</span>.</div>
              <div>Mortgage Value $<span>{square[deedPos].price/2}</span>.</div>
              <div>Houses cost $<span>{square[deedPos].housePrice}</span>. each</div>
              <div>Hotels, $<span>{square[deedPos].housePrice}</span>. plus 4 houses</div>
              <div style={{fontSize: '9px', fontStyle: 'italic', marginTop: '5px'}}>If a player owns ALL the Lots of any Color-Group, the rent is Doubled on Unimproved Lots in that group</div>
            </td>
          </tr>
        </tbody>		
			</table>
    );
  }
}

class DeedHeader extends React.Component {
  render() {
    const square = this.props.square;
    const deedPos = this.props.deedPos;
    return (
      <React.Fragment>
        <div className='deed-header' style={{backgroundColor: square[deedPos].color}}>
          <div id='deed-title'>T I T L E&nbsp;&nbsp;D E E D</div>
          <div id='deed-name'>
            {square[deedPos].name}&nbsp;
            {square[deedPos].id !== 40 && square[deedPos].id !== 41 ?
              square[deedPos].hotelCount === 0 ? 
              <House houseCount={square[deedPos].houseCount} />
            : <Hotel />
            : null} 
          </div>
			  </div>
        <i id='deed-special-icon' className={square[deedPos].icon} style={{color: square[deedPos].color}}/>
      </React.Fragment>
      
    );
  }
}

class DeedOwner extends React.Component {
  render() {
    const square = this.props.square;
    const deedPos = this.props.deedPos;
    const player = this.props.player;
    return (
      <div className='deed-owner' > 
        <span style={{ verticalAlign: 'middle'}}>Owner:&nbsp;&nbsp;</span>
        <PlayerIcon player={player[square[deedPos].ownerID]} /> <PlayerName player={player[square[deedPos].ownerID]} />  
      </div>
    );
  }
}

class DeedNormal extends React.Component {
  render() {
    const square = this.props.square;
    const deedPos = this.props.deedPos;
    return (
      <div className='deed-normal'>
        <DeedHeader 
          square={this.props.square}
          deedPos={this.props.deedPos}
        />
        {square[deedPos].owner !== '' ?
          <DeedOwner
            player={this.props.player}
            square={this.props.square}
            deedPos={this.props.deedPos}
          />
        : null}          
        <DeedTable 
          square={this.props.square}
          deedPos={this.props.deedPos}
        />
      </div>
    );
  }
}

class DeedMortgagedText extends React.Component {
  render() {
    const square = this.props.square;
    const deedPos = this.props.deedPos;
    return (
      <React.Fragment>
        <p>&bull;</p>
        <div>MORTGAGED</div>
        <div> for $<span>{square[deedPos].price/2}</span></div>
        <p>&bull;</p>
        <div style={{fontStyle: 'italic', fontSize: '13px', margin: '10px'}}>Property is mortgaged</div>
      </React.Fragment>
    );
  }
}

class DeedMortgaged extends React.Component {
  render() {
    const square = this.props.square;
    const deedPos = this.props.deedPos;
    return (
      <div id='deed-mortgaged'>
        <DeedHeader
          square={square}
          deedPos={this.props.deedPos} 
        />
        <DeedOwner
          player={this.props.player}
          square={square}
          deedPos={deedPos}
        />
        <DeedMortgagedText 
          square={square}
          deedPos={deedPos}
        />
		  </div>
    );
  }
}

class DeedSpecialText extends React.Component {
  render() {
    const square = this.props.square;
    const deedPos = this.props.deedPos;
    const utilText = <div>&nbsp;&nbsp;&nbsp;&nbsp;If one "Utility" is owned rent is 4 times amount shown on dice.<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;If both "Utilitys" are owned rent is 10 times amount shown on dice.</div>;
    const transText = <div style={{fontSize: '14px', lineHeight: '1.5'}}>Rent
                        <span style={{float: 'right'}}>$25.</span><br />If 2 Railroads are owned
                        <span style={{float: 'right'}}>50.</span><br />If 3 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "
                        <span style={{float: 'right'}}>100.</span><br />If 4 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "
                        <span style={{float: 'right'}}>200.</span>
                      </div>;
    return (
      <div id='deed-special-text'>
        {square[deedPos].group === 2 ? utilText : null}
        {square[deedPos].group === 1 ? transText : null}
      </div>
    );
  }
}

class DeedSpecialFooter extends React.Component {
  render() {
    const square = this.props.square;
    const deedPos = this.props.deedPos;
    return (
      <div id='deed-special-footer'>
        Mortgage Value
        <span style={{float: 'right'}}>
          $<span>{square[deedPos].price/2}</span>.
        </span>
      </div>
    );
  }
}

class DeedSpecial extends React.Component {
  render() {
    const square = this.props.square;
    const deedPos = this.props.deedPos;
    return (
      <div id='deed-special' className='deedSpecial'>
        <DeedHeader
          square={square}
          deedPos={deedPos}
        />
        {square[deedPos].owner !== '' ?
          <DeedOwner
            player={this.props.player}
            square={square}
            deedPos={deedPos}
          />
        : null}
        <DeedSpecialText 
          square={square}
          deedPos={deedPos}
        />
        <DeedSpecialFooter
          square={square}
          deedPos={deedPos} 
        />
		  </div>
    );
  }
}

export default class Deed extends React.Component {
  render() {
    const deedStyle = {
      position: 'absolute', 
      left: this.props.deedLeft, 
      top: this.props.deedTop
    };

    return (
      <div className='deed' style={deedStyle}>
        {this.props.showNormalDeed ? 
          <DeedNormal 
            player={this.props.player}
            square={this.props.square}
            deedPos={this.props.deedPos}
          /> : null }
        {this.props.showSpecialDeed ? 
          <DeedSpecial
            player={this.props.player}
            square={this.props.square}
            deedPos={this.props.deedPos}
          /> : null }
        {this.props.showMortgagedDeed ? 
          <DeedMortgaged
            player={this.props.player}
            square={this.props.square}
            deedPos={this.props.deedPos}
          /> : null }
      </div>
    );
  }
}