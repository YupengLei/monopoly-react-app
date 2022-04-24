import React from 'react';
import './style/board.css';
import {Button, PlayerIcon, TextInput} from './setup';
import {PlayerName, PlayerBalance} from './moneybar';

class Alert extends React.Component {
  render() {
    return (
      <div id='alert' ref={this.props.alertContainer}>    
        {this.props.alert.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    );
  }
}

class Landed extends React.Component {
  render() {
    return (
      <div id='landed'>{this.props.landed}</div>
    );
  }
}

class Buy extends React.Component {
  render() {
    return (
      <div>
        <Alert 
          alertContainer={this.props.alertContainer}
          alert={this.props.alert}
        />
        {this.props.showLandedPanel ? 
          <Landed landed={this.props.landed} />
        : null}        
      </div>
    );
  }
}

class MenuButtonGroup extends React.Component {
  render() {
    const player = this.props.player;
    const turn  = this.props.turn;
    const square = this.props.square;
    return (
      <div id='menu'>
        <table style={{cellSpacing: '0', display: 'inline-table'}}>
          <tbody>
            <tr>
              <td>
                <Button
                  title={'View alerts and buy the property you landed on.'}
                  value={'Buy'}
                  onClick={this.props.handleBuy}
                  id='menuButton'
                />
              </td>
              <td>
                <Button
                  title={'View, mortgage, and improve your property.'}
                  value={'Manage'} 
                  onClick={this.props.handleManage}
                  id='menuButton'
                />
              </td>
              <td>
                <Button
                  title={'Exchange property with other players.'}
                  value={'Trade'} 
                  id='menuButton'
                  onClick={this.props.handleShowTradePanel}
                />
              </td>
              {player[turn].balance < 0 ?
                <td>
                  <Button
                    title={'If you cannot pay your debt then you must resign from the game.'}
                    value={'Resign'} 
                    id='menuButton'
                    onClick={this.props.handleResign}
                  />
                </td>
              : <td>
                  <Button
                    title={'Roll the dice and move your token accordingly.'}
                    value={this.props.isTurnEnded  ? 'End Turn' : (player[turn].doubleCount === 0 ? 'Roll Dice' : 'Roll Again')}
                    onClick={this.props.isTurnEnded ? (square[player[turn].position].owner === '' && square[player[turn].position].price !== 0 ? this.props.handleAuction : () => this.props.handleEndTurn(0)) : this.props.handleDiceRoll}
                    id='menuButton'
                  />
                </td>  
              }                                                           
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class CheckBox extends React.Component {
  render() {
    return (
      <td className='propertycellcheckbox'>
        <input type='checkbox' checked={this.props.checked} onChange={this.props.onChange} />
      </td>
    );
  }
}

export class House extends React.Component {
  render() {
    return (
      [...Array(this.props.houseCount)].map((data, index) => {
        return (
          <i className='fa fa-home' title='House' key={index} />
        );
      })      
    );
  }
}

export class Hotel extends React.Component {
  render() {
    return (
      <i className='fa fa-building' title='Hotel' />
    );
  }
}

class OwnedProperty extends React.Component {
  render() {
    const player = this.props.player;
    return (
      <table>
        <tbody>
          {player.properties.map((property, index) => {
            return (
              <tr className='property-cell-row' key={property.id} onMouseEnter={(e) => this.props.handleShowDeed(e.pageX, e.pageY, property.id)} onMouseLeave={this.props.handleHideDeed}>
                {this.props.showCheckBox ?
                  <CheckBox
                    checked={this.props.multipleCheck ? null : this.props.propertyChecked === property.id}
                    onChange={(e) => this.props.handlePropertyCheckedChange(property.id, e.target.checked)}
                  />
                : null}                
                <td className='propertycellcolor' style={{background: property.color}} ></td>
                <td className='propertycellname' >
                  {property.name}
                  {property.id !== 40 && property.id !== 41 ?
                    property.hotelCount === 0 ? 
                    <House houseCount={property.houseCount} />
                  : <Hotel />
                  : null}                   
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export class Owned extends React.Component{
  render() {
    const player = this.props.player;
    const turn = this.props.turn;
    return (
        <React.Fragment>
          {player[turn].properties.length !== 0 ?
            <OwnedProperty 
              player={player[turn]}
              handleShowDeed={this.props.handleShowDeed}
              handleHideDeed={this.props.handleHideDeed}
              propertyChecked={this.props.propertyChecked}
              handlePropertyCheckedChange={this.props.handlePropertyCheckedChange}
              showCheckBox={this.props.showCheckBox}
              multipleCheck={this.props.multipleCheck}
            />
          : <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} />, you don't have any properties yet</div>} 
        </React.Fragment>           
    );
  }
}

class AvailableBuildings extends React.Component {
  render() {
    return (
      <div id='buildings' title='Available buildings'>
        <div className='fa fa-home' title='Available houses'>: {32 - this.props.houseSum}&nbsp;&nbsp;</div>
        <div className='fa fa-building' title='Available hotels'>: {12 - this.props.hotelSum}  </div>
      </div>
    );
  }
}


class OptionButtonGroup extends React.Component {
  render() {
    const square = this.props.square;
    const propertyChecked = this.props.propertyChecked;
    const showUnMortgageButton = this.props.showUnMortgageButton;
    return (
      <div style={{ textAlign: 'center', marginTop: '15px'}}>
        {this.props.showBuyHouseButton ? 
          <Button 
            value={square[propertyChecked].houseCount < 4 ? `Buy house $${square[propertyChecked].housePrice}` : `Buy hotel $${square[propertyChecked].housePrice}`}
            id='optionButton'
            onClick={() => this.props.handleBuyHouse(propertyChecked)}
          />
        : null}
        {square[propertyChecked].id < 40 ?
          <Button 
            value={showUnMortgageButton && square[propertyChecked].isMortgaged ? 'UnMortgage $' + square[propertyChecked].price * 0.6 : 'Mortgage $' + square[propertyChecked].price * 0.5}
            id='optionButton'
            onClick={showUnMortgageButton && square[propertyChecked].isMortgaged ? this.props.handleUnMortgage : () => this.props.handleMortgage(propertyChecked)}
          />
        : null}        
        {square[propertyChecked].houseCount > 0 ?
          <Button 
            value={square[propertyChecked].hotelCount > 0 ? `Sell hotel $${square[propertyChecked].housePrice/2}` : `Sell house $${square[propertyChecked].housePrice/2}`}
            id='optionButton'
            onClick={() => this.props.handleSellHouse(propertyChecked)}
          /> 
        : null}        
      </div>
    );
  }
}

class Option extends React.Component {
  render() {
    return (
        <div id='option'>
          {!this.props.showOptionButton ? 
            <AvailableBuildings 
              houseSum={this.props.houseSum}
              hotelSum={this.props.hotelSum}
            />
          : <OptionButtonGroup 
              handleMortgage={this.props.handleMortgage}
              handleUnMortgage={this.props.handleUnMortgage}
              showUnMortgageButton={this.props.showUnMortgageButton}
              propertyChecked={this.props.propertyChecked}
              square={this.props.square}
              showBuyHouseButton={this.props.showBuyHouseButton}
              handleBuyHouse={this.props.handleBuyHouse}
              handleSellHouse={this.props.handleSellHouse}
            />
          }
        </div>
    );
  }
}

class Manage extends React.Component {
  render() {
    return (
      <div id='manage'>
        <div id='owned'>
          <Owned
            player={this.props.player}
            turn={this.props.turn}
            handleShowDeed={this.props.handleShowDeed}
            handleHideDeed={this.props.handleHideDeed}
            propertyChecked={this.props.propertyChecked}
            handlePropertyCheckedChange={this.props.handlePropertyCheckedChange}
            showCheckBox={true}
            multipleCheck={false}
          />
        </div>
          <Option 
            showOptionButton={this.props.showOptionButton}
            handleMortgage={this.props.handleMortgage}
            handleUnMortgage={this.props.handleUnMortgage}
            showUnMortgageButton={this.props.showUnMortgageButton}
            propertyChecked={this.props.propertyChecked}
            square={this.props.square}
            showBuyHouseButton={this.props.showBuyHouseButton}
            handleBuyHouse={this.props.handleBuyHouse}
            handleSellHouse={this.props.handleSellHouse}
            houseSum={this.props.houseSum}
            hotelSum={this.props.hotelSum}
          />
      </div>
    );
  }
}

class Menu extends React.Component {
  render() {
    const menuStyle = {
      textAlign: 'center', 
      verticalAlign: 'top', 
      border: 'none',
    };
    return (
      <td style={menuStyle}>
        <MenuButtonGroup
          isTurnEnded={this.props.isTurnEnded}
          player={this.props.player}
          turn={this.props.turn}
          handleEndTurn={this.props.handleEndTurn}
          handleDiceRoll={this.props.handleDiceRoll}
          handleManage={this.props.handleManage}
          handleBuy={this.props.handleBuy}
          handleShowTradePanel={this.props.handleShowTradePanel}
          square={this.props.square}
          handleAuction={this.props.handleAuction}
          handleResign={this.props.handleResign}
        />     
        {this.props.showBuy ? 
          <Buy 
            alertContainer={this.props.alertContainer}
            alert={this.props.alert}
            showLandedPanel={this.props.showLandedPanel}
            landed={this.props.landed}
          />
        : <Manage 
            player={this.props.player}
            turn={this.props.turn}
            square={this.props.square}
            handleShowDeed={this.props.handleShowDeed}
            handleHideDeed={this.props.handleHideDeed}
            propertyChecked={this.props.propertyChecked}
            handlePropertyCheckedChange={this.props.handlePropertyCheckedChange}
            showOptionButton={this.props.showOptionButton}
            handleMortgage={this.props.handleMortgage}
            handleUnMortgage={this.props.handleUnMortgage}
            showUnMortgageButton={this.props.showUnMortgageButton}
            showTradePanel={this.props.showTradePanel}
            showBuyHouseButton={this.props.showBuyHouseButton}
            handleBuyHouse={this.props.handleBuyHouse}
            handleSellHouse={this.props.handleSellHouse}
            houseSum={this.props.houseSum}
            hotelSum={this.props.hotelSum}
          />
        }  
      </td>
    );
  }
}

class Die extends React.Component {
  render() {
    return (
      <div>
        <i className={this.props.className} style={{ color: this.props.dieColor, fontSize: this.props.fontSize}} />
      </div>
    );
  }
}

export class Dice extends React.Component {
  render() {
    const player = this.props.player;
    const turn = this.props.turn;
    const dice = this.props.dice;
    const sides = ['', 'one', 'two', 'three', 'four', 'five', 'six']
    return (
      <div style={{display: this.props.display}}>
        <Die
          className={`die fa fa-dice-${sides[dice['die0']]}`}
          dieColor={player[turn].color}
          fontSize={this.props.fontSize}
        />
        <Die
          className={`die fa fa-dice-${sides[dice['die1']]}`}
          dieColor={player[turn].color}
          fontSize={this.props.fontSize}
        />
      </div>
    );
  }
}

class QuickStats extends React.Component {
  render() {
    const player = this.props.player;
    const turn = this.props.turn;
    return (
      <div id='quickstats' style={{borderColor: player[turn].color}}>
        <div>
          <PlayerIcon 
            player={player[turn]} 
            fontSize='30px'
          />
        </div>        
        <div><PlayerName player={player[turn]} /></div>
        <div><PlayerBalance player={player[turn]} /></div> 
      </div>
    );
  }
}

class Display extends React.Component {  
  render() {    
    return (
      <td style={{verticalAlign: 'top', border: 'none'}}>
        <QuickStats 
          turn={this.props.turn}
          player={this.props.player}
        />
        {this.props.dice['areDiceRolled'] ? 
          <Dice 
            dice={this.props.dice}
            turn={this.props.turn}
            player={this.props.player}
          /> 
        : null}      
      </td>
    );
  }
}

class Control extends React.Component {
  render() {
    return (
      <div id='control'>
        <table>
          <tbody>
            <tr>
              <Menu 
                handleDiceRoll={this.props.handleDiceRoll}
                alert={this.props.alert}
                handleEndTurn={this.props.handleEndTurn}
                turn={this.props.turn}
                player={this.props.player}
                handleShowDeed={this.props.handleShowDeed}
                handleHideDeed={this.props.handleHideDeed}
                showLandedPanel={this.props.showLandedPanel}
                landed={this.props.landed}
                alertContainer={this.props.alertContainer}
                isTurnEnded={this.props.isTurnEnded}
                square={this.props.square}
                handleManage={this.props.handleManage}
                showPopup={this.props.showPopup}
                showBuy={this.props.showBuy}
                handleBuy={this.props.handleBuy}
                propertyChecked={this.props.propertyChecked}
                handlePropertyCheckedChange={this.props.handlePropertyCheckedChange}
                showOptionButton={this.props.showOptionButton}
                handleMortgage={this.props.handleMortgage}
                handleUnMortgage={this.props.handleUnMortgage}
                showUnMortgageButton={this.props.showUnMortgageButton}
                handleShowTradePanel={this.props.handleShowTradePanel}
                showTradePanel={this.props.showTradePanel}
                showBuyHouseButton={this.props.showBuyHouseButton}
                handleBuyHouse={this.props.handleBuyHouse}
                handleSellHouse={this.props.handleSellHouse}
                handleAuction={this.props.handleAuction}
                handleResign={this.props.handleResign}
                houseSum={this.props.houseSum}
                hotelSum={this.props.hotelSum}
              />
              <Display 
                handleDiceRoll={this.props.handleDiceRoll}
                dice={this.props.dice}
                turn={this.props.turn}
                player={this.props.player}
              />
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class TradePlayer extends React.Component {
  render() {
    const player = this.props.player;
    const turn = this.props.turn;
    const tradeOpponentID = this.props.tradeOpponentID;
    return (
      <tr>  
        <td className='trade-cell'>
          <div id='trade-leftp-name' >
            <PlayerIcon
              player={player[turn]}
              verticalAlign='middle'
              animation={this.props.tradeResponseToggle ? 'myanimation 2s infinite' : null}
            />
            <PlayerName player={player[turn]} />
          </div>
        </td>
        <td className='trade-cell' >
          <div id='trade-rightp-name'>
            <PlayerIcon
              player={player[tradeOpponentID]}
              verticalAlign='middle' 
              animation={this.props.tradeResponseToggle ? null : 'myanimation 2s infinite'}
            />
            {!this.props.hideTradePlayerSelect ?
              <select title='Select a player to trade with' defaultValue={tradeOpponentID} onChange={(e) => this.props.handleTradeOpponentID(e.target.value)} style={{backgroundColor: player[tradeOpponentID].color}}>
                {player.map((data, index) => {
                  if (data.id !== turn) {
                    return (
                      <option key={data.id}  value={data.id} >
                        {data.name}
                      </option>
                    );
                  } else {
                    return null;
                  }
                })}
              </select>
            : <PlayerName player={player[tradeOpponentID]} />}            
          </div>
        </td>
      </tr>
    );
  }
}

class Trade extends React.Component {
  render() {
    return (
      <div id='trade'>
        <table style={{borderSpacing: '3px'}}>
          <tbody>
            <TradePlayer
              player={this.props.player}
              turn={this.props.turn}
              handleTradeOpponentID={this.props.handleTradeOpponentID}
              tradeOpponentID={this.props.tradeOpponentID}
              hideTradePlayerSelect={this.props.hideTradePlayerSelect}
              tradeResponseToggle={this.props.tradeResponseToggle}
            />
            <tr style={{pointerEvents: this.props.showTradeResponseButton ? 'none' : null}}>
              <td className='trade-cell'>
                $ <TextInput
                    player={this.props.player} 
                    value={this.props.tradeOwnAmount}
                    title='Enter amount to exchange with the other player.'
                    onChange={(e) => this.props.handleTradeAmountChange(0, e.target.value)}
                  />
                
              </td>
              <td className='trade-cell'>
                $ <TextInput
                    player={this.props.player} 
                    value={this.props.tradeOpponentAmount}
                    title='Enter amount to exchange with the other player.'
                    onChange={(e) => this.props.handleTradeAmountChange(1, e.target.value)}
                  />
              </td>
            </tr>

            <tr style={{pointerEvents: this.props.showTradeResponseButton ? 'none' : null}}>
              <td style={{border: 'none'}}>
                <div id='trade-leftp-property' className='trade-cell'>
                  <Owned
                    player={this.props.player}
                    turn={this.props.turn}
                    handleShowDeed={this.props.handleShowDeed}
                    handleHideDeed={this.props.handleHideDeed}
                    propertyChecked={this.props.tradeOwnPropertyChecked}
                    handlePropertyCheckedChange={this.props.handleTradeOwnPropertyCheckedChange}
                    showCheckBox={true}
                    multipleCheck={true}
                  />
                </div>
              </td>

              <td style={{border: 'none'}} >
                <div id='trade-rightp-property' className='trade-cell'>
                  <Owned
                    player={this.props.player}
                    turn={this.props.tradeOpponentID}
                    handleShowDeed={this.props.handleShowDeed}
                    handleHideDeed={this.props.handleHideDeed}
                    propertyChecked={this.props.tradeOpponentPropertyChecked}
                    handlePropertyCheckedChange={this.props.handleTradeOpponentPropertyCheckedChange}
                    showCheckBox={true}
                    multipleCheck={true}
                  />
                </div>
              </td>
            </tr>
            <tr>              
              {!this.props.showTradeResponseButton ?
                <td colSpan='2' className='trade-cell'>
                  <Button 
                    id='optionButton' 
                    value='Propose Trade'  
                    title='Exchange the money and properties that are checked above.'
                    onClick={() => 
                      this.props.popup(
                        <div>
                          <div className='drawing fa fa-envelope' style={{color: '#5a6dba', fontSize: '50px'}}></div>
                          <div style={{fontWeight: 'bold', fontSize: '16px', color: '#5a6dba'}}>Trade Offer</div>
                          <div><p><PlayerIcon player={this.props.player[this.props.turn]} /> <PlayerName player={this.props.player[this.props.turn]} /> has proposed a trade with you, <PlayerIcon player={this.props.player[this.props.tradeOpponentID]} /> <PlayerName player={this.props.player[this.props.tradeOpponentID]} /> . You may accept, reject, or modify the offer.</p></div>
                          <div>
                            <Button
                              value='Go see the offer'
                              onClick={this.props.handleOfferContent}
                              id='menuButton'
                            />
                          </div>
                        </div>
                      )
                    } 
                  />
                  <Button 
                    id='optionButton' 
                    value='Cancel Trade'  
                    title='Cancel the trade.' 
                    onClick={this.props.handleHideTradePanel}
                  />
                </td>
              : <td colSpan='2' className='trade-cell'>
                  <Button 
                    id='optionButton' 
                    value='Accept Trade'  
                    title='Accept the proposed trade.' 
                    onClick={this.props.handleAcceptTrade}
                  />
                  <Button 
                    id='optionButton' 
                    value='Reject Trade'  
                    title='Reject the proposed trade.' 
                    onClick={this.props.handleRejectTrade}
                  />
                  <Button 
                    id='optionButton' 
                    value='Modify Trade'  
                    title='Modify and propose a new trade back.'
                    onClick={this.props.handleModifyTrade} 
                  />
                </td>              
              }                                        
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class DashBoard extends React.Component {
  render() {
    return (
      <div id='control-wrap' style={{pointerEvents: this.props.showPopup ? 'none' : null}}>
        {!this.props.showTradePanel ?
          <Control 
            handleDiceRoll={this.props.handleDiceRoll}
            dice={this.props.dice}
            alert={this.props.alert}
            handleEndTurn={this.props.handleEndTurn}
            turn={this.props.turn}
            player={this.props.player}
            handleShowDeed={this.props.handleShowDeed}
            showDeed={this.props.showDeed}
            handleHideDeed={this.props.handleHideDeed}
            showLandedPanel={this.props.showLandedPanel}
            landed={this.props.landed}
            isTurnEnded={this.props.isTurnEnded}
            alertContainer={this.props.alertContainer}
            square={this.props.square}
            handleManage={this.props.handleManage}
            showPopup={this.props.showPopup}
            showBuy={this.props.showBuy}
            handleBuy={this.props.handleBuy}
            propertyChecked={this.props.propertyChecked}
            handlePropertyCheckedChange={this.props.handlePropertyCheckedChange}
            showOptionButton={this.props.showOptionButton}
            handleMortgage={this.props.handleMortgage}
            handleUnMortgage={this.props.handleUnMortgage}
            showUnMortgageButton={this.props.showUnMortgageButton}
            handleShowTradePanel={this.props.handleShowTradePanel}
            showBuyHouseButton={this.props.showBuyHouseButton}
            handleBuyHouse={this.props.handleBuyHouse}
            handleSellHouse={this.props.handleSellHouse}
            handleAuction={this.props.handleAuction}
            handleResign={this.props.handleResign}
            houseSum={this.props.houseSum}
            hotelSum={this.props.hotelSum}
          />
        : <Trade
            handleHideTradePanel={this.props.handleHideTradePanel}
            player={this.props.player}
            turn={this.props.turn}
            handleTradeOpponentID={this.props.handleTradeOpponentID}
            tradeOpponentID={this.props.tradeOpponentID}
            handleShowDeed={this.props.handleShowDeed}
            handleHideDeed={this.props.handleHideDeed}
            propertyChecked={this.props.propertyChecked}
            handlePropertyCheckedChange={this.props.handlePropertyCheckedChange}
            tradeOwnPropertyChecked={this.props.tradeOwnPropertyChecked}
            tradeOpponentPropertyChecked={this.props.tradeOpponentPropertyChecked}
            handleTradeOwnPropertyCheckedChange={this.props.handleTradeOwnPropertyCheckedChange}
            handleTradeOpponentPropertyCheckedChange={this.props.handleTradeOpponentPropertyCheckedChange}
            tradeOwnAmount={this.props.tradeOwnAmount}
            tradeOpponentAmount={this.props.tradeOpponentAmount}
            handleTradeAmountChange={this.props.handleTradeAmountChange}
            popup={this.props.popup}
            handleOfferContent={this.props.handleOfferContent}
            hideTradePlayerSelect={this.props.hideTradePlayerSelect}
            showTradeResponseButton={this.props.showTradeResponseButton}
            handleRejectTrade={this.props.handleRejectTrade}
            handleAcceptTrade={this.props.handleAcceptTrade}
            handleModifyTrade={this.props.handleModifyTrade}
            tradeResponseToggle={this.props.tradeResponseToggle}
          />       
        }        
      </div>
    );
  }
}

class Card extends React.Component { 
  render() {
    const cardIconStyle = {
      color: this.props.iconColor, 
      fontSize: '20px', 
      marginTop: '5px'
    };
    return (
      <React.Fragment>
        <div className={this.props.icon} style={cardIconStyle}></div>
        <p>{this.props.cardText}</p>
      </React.Fragment>
    );
  }
}

export class Deck extends React.Component {
  render() {
    const cardStyle = {
      backgroundColor: this.props.backgroundColor,
      color: '#ffffff',
      fontSize: '12px',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    };
    return (
      <div className={this.props.className} style={{display: this.props.display}}>
        <h2 className='label'>{this.props.title}</h2>
        <div className='deck' style={this.props.showCard ? cardStyle : null}>
          {this.props.showCard ?
            <Card 
              cardText={this.props.cardText}
              icon={this.props.icon}
              iconColor={this.props.iconColor}
            />
          : null}          
        </div>
      </div>
    );
  }
}

class Center extends React.Component {
  render() {
    return (
      <div className='center'>
        <Deck 
          showCard={this.props.showCommunityChestCard}
          cardText={this.props.cardText}
          backgroundColor='#a44026'
          iconColor='#d2eaf5'
          icon='drawing fa fa-cube'
          className='community-chest-deck'
          title='Community Chest'
        />
        {!this.props.showSetup && !this.props.showPropertyStats && !this.props.showAIPopup?
          <DashBoard 
            handleDiceRoll={this.props.handleDiceRoll}
            dice={this.props.dice}
            alert={this.props.alert}
            handleEndTurn={this.props.handleEndTurn}
            turn={this.props.turn}
            player={this.props.player}
            handleShowDeed={this.props.handleShowDeed}
            showDeed={this.props.showDeed}
            handleHideDeed={this.props.handleHideDeed}
            showLandedPanel={this.props.showLandedPanel}
            landed={this.props.landed}
            isTurnEnded={this.props.isTurnEnded}
            alertContainer={this.props.alertContainer}
            square={this.props.square}
            handleManage={this.props.handleManage}
            showPopup={this.props.showPopup}
            showBuy={this.props.showBuy}
            handleBuy={this.props.handleBuy}
            propertyChecked={this.props.propertyChecked}
            handlePropertyCheckedChange={this.props.handlePropertyCheckedChange}
            showOptionButton={this.props.showOptionButton}
            handleMortgage={this.props.handleMortgage}
            handleUnMortgage={this.props.handleUnMortgage}
            showUnMortgageButton={this.props.showUnMortgageButton}
            showTradePanel={this.props.showTradePanel}
            handleShowTradePanel={this.props.handleShowTradePanel}
            handleHideTradePanel={this.props.handleHideTradePanel}
            handleTradeOpponentID={this.props.handleTradeOpponentID}
            tradeOpponentID={this.props.tradeOpponentID}
            tradeOwnPropertyChecked={this.props.tradeOwnPropertyChecked}
            tradeOpponentPropertyChecked={this.props.tradeOpponentPropertyChecked}
            handleTradeOwnPropertyCheckedChange={this.props.handleTradeOwnPropertyCheckedChange}
            handleTradeOpponentPropertyCheckedChange={this.props.handleTradeOpponentPropertyCheckedChange}
            tradeOwnAmount={this.props.tradeOwnAmount}
            tradeOpponentAmount={this.props.tradeOpponentAmount}
            handleTradeAmountChange={this.props.handleTradeAmountChange}
            popup={this.props.popup}
            handleOfferContent={this.props.handleOfferContent}
            hideTradePlayerSelect={this.props.hideTradePlayerSelect}
            showTradeResponseButton={this.props.showTradeResponseButton}
            handleRejectTrade={this.props.handleRejectTrade}
            handleAcceptTrade={this.props.handleAcceptTrade}
            handleModifyTrade={this.props.handleModifyTrade}
            tradeResponseToggle={this.props.tradeResponseToggle}
            showBuyHouseButton={this.props.showBuyHouseButton}
            handleBuyHouse={this.props.handleBuyHouse}
            handleSellHouse={this.props.handleSellHouse}
            handleAuction={this.props.handleAuction}
            handleResign={this.props.handleResign}
            houseSum={this.props.houseSum}
            hotelSum={this.props.hotelSum}
          />
        : null}
        <h1 className='title'>Monopoly</h1>
        <Deck 
          showCard={this.props.showChanceCard}
          cardText={this.props.cardText}
          backgroundColor='#fa811d'
          iconColor='#f50c2b'
          icon='drawing fa fa-question'
          className='chance-deck'
          title='Chance'
        />
      </div>
    );
  }
}

class PlayerMark extends React.Component {
  render() {
    return (
      <div className='c-anchor'>
        {!this.props.showSetup ?
          this.props.player.map((player, index) => {
            if (player.position === this.props.id && !player.inJail) { 
              const playerMarkStyle = { 
                      color: player.color, 
                      animation: player.id === this.props.turn ? 'myanimation 2s infinite' : null
              };            
              return <i key={player.id} className={player.img} style={playerMarkStyle} />;
            } else {
            return null;
            }           
          })
        : null}
      </div>
    );
  }
}

class CornerGo extends React.Component {
  render() {
    return (
      <div className='space corner go'>
        <div className='container'>
          <div className='instructions'>Collect $200.00 salary as you pass</div>
          <div className='go-word'>go</div>
        </div>
        <PlayerMark
          showSetup={this.props.showSetup} 
          player={this.props.player}
          turn={this.props.turn}
          id={this.props.id}
        />
      </div>
    );
  }
}

class SpaceProperty extends React.Component {
  //(square.owner !== '') ? this.props.player[square.ownerID].color : null
  render() {
    const square = this.props.square;
    /*let ownerColor = null;
    if (square.owner !== '') {
      console.log('s-owner: '+square.owner);
      console.log('s-ownerId: '+square.ownerID);
      ownerColor = this.props.player[square.ownerID].color;
    } else {
      ownerColor = null;
    }*/
    return (
      <div className={square.propertyClass}>
        <div className='container' onMouseEnter={(e) => this.props.handleShowDeed(e.pageX, (e.pageY - this.props.adjustedPageY), square.id)} onMouseLeave={this.props.handleHideDeed}>
          <div className={square.colorBarClass} ></div>
          <div className='name' style={{color: (square.owner !== '') ? this.props.player[square.ownerID].color : null}}>{square.name}</div>
          <div className='price'>Price {square.priceText}</div>                      
          <PlayerMark
            showSetup={this.props.showSetup} 
            player={this.props.player}
            turn={this.props.turn}
            id={square.id}
          />                     
        </div>                    
      </div>
    );
  }
}

class SpaceChance extends React.Component {
  render() {
    const square = this.props.square;
    return (
      <div className={square.propertyClass}>
        <div className='container'>
          <div className='name'>{square.name}</div>
          <i className='drawing fa fa-question' />
          <PlayerMark
            showSetup={this.props.showSetup} 
            player={this.props.player}
            turn={this.props.turn}
            id={square.id}
          />
        </div>                    
      </div>
    );
  }
}

class SpaceRailroad extends React.Component {
  render() {
    const square = this.props.square;
    return (
      <div className={square.propertyClass}>
        <div className='container' onMouseEnter={(e) => this.props.handleShowDeed(e.pageX, (e.pageY - this.props.adjustedPageY), square.id)} onMouseLeave={this.props.handleHideDeed}>
          <div className='name' style={{color: (square.owner !== '') ? this.props.player[square.ownerID].color : null}}>{square.name}</div>
          <i className='drawing fa fa-subway' />
          <div className='price'>Price {square.priceText}</div>
          <PlayerMark
            showSetup={this.props.showSetup} 
            player={this.props.player}
            turn={this.props.turn}
            id={square.id}
          />
        </div>
      </div>
    );
  }
}

class SpaceTax extends React.Component {
  render() {
    const square = this.props.square;
    return (
      <div className={square.propertyClass}>
        <div className='container'>
          <div className='name'>{square.name}</div>
          <i className='drawing fa fa-money-check-alt' />
          <div className='instructions'>Pay 10% or {square.priceText}</div>
          <PlayerMark
            showSetup={this.props.showSetup} 
            player={this.props.player}
            turn={this.props.turn}
            id={square.id}
          />                    
        </div>
      </div>
    );
  }
}

class SpaceCommunityChest extends React.Component {
  render() {
    const square = this.props.square;
    return (
      <div className={square.propertyClass}>
        <div className='container'>
          <div className='name'>{square.name}</div>
          <i className='drawing fa fa-cube' />
          <div className='instructions'>{square.priceText}</div>
          <PlayerMark
            showSetup={this.props.showSetup} 
            player={this.props.player}
            turn={this.props.turn}
            id={square.id}
          />
        </div>                    
      </div>
    );
  }
}

class SpaceUtility extends React.Component {
  render() {
    const square = this.props.square;
    return (
      <div className={square.propertyClass}>
        <div className='container' onMouseEnter={(e) => this.props.handleShowDeed(e.pageX, (e.pageY - this.props.adjustedPageY), square.id)} onMouseLeave={this.props.handleHideDeed}>
          <div className='name' style={{color: (square.owner !== '') ? this.props.player[square.ownerID].color : null}}>{square.name}</div>
          <i className='drawing fa fa-lightbulb' />
          <div className='price'>Price {square.priceText}</div>
          <PlayerMark
            showSetup={this.props.showSetup} 
            player={this.props.player}
            turn={this.props.turn}
            id={square.id}
          />
        </div>                
      </div>
    );
  }
}

class BottomRow extends React.Component {
  render() {
    return (
        <div className='row horizontal-row bottom-row' >
          {this.props.square.filter((item, index) => (index < 10)).reverse().map((square, index) => {
            switch (square.propertyClass) {
              case 'space property':
                return (
                  <SpaceProperty
                    key={square.id}
                    square={square}
                    handleShowDeed={this.props.handleShowDeed}
                    handleHideDeed={this.props.handleHideDeed}
                    player={this.props.player}
                    turn={this.props.turn}
                    adjustedPageY={250}
                  />
                );
              case 'space chance':
                return (
                  <SpaceChance
                    key={square.id}
                    square={square}
                    handleShowDeed={this.props.handleShowDeed}
                    handleHideDeed={this.props.handleHideDeed}
                    player={this.props.player}
                    turn={this.props.turn}
                  />
                );
              case 'space railroad':
                return (
                  <SpaceRailroad
                    key={square.id}
                    square={square}
                    handleShowDeed={this.props.handleShowDeed}
                    handleHideDeed={this.props.handleHideDeed}
                    player={this.props.player}
                    turn={this.props.turn}
                    adjustedPageY={250}
                  />
                );
              case 'space fee income-tax':
                return (
                  <SpaceTax
                    key={square.id}
                    square={square}
                    handleShowDeed={this.props.handleShowDeed}
                    handleHideDeed={this.props.handleHideDeed}
                    player={this.props.player}
                    turn={this.props.turn}
                  />
                );
              case 'space community-chest':
                return (
                  <SpaceCommunityChest
                    key={square.id}
                    square={square}
                    handleShowDeed={this.props.handleShowDeed}
                    handleHideDeed={this.props.handleHideDeed}
                    player={this.props.player}
                    turn={this.props.turn}
                  />  
                );
              default:
                return null;
            }
          })}
        </div>
    );
  }
}

class PlayerJailMarker extends React.Component {
  render() {
    const jailMarkerStyle = {
      display: 'flex', 
      flexDirection: 'column', 
      fontSize: '14px'
    };
    return (
      <div className='j-anchor' style={jailMarkerStyle}>
        {this.props.player.map((player, index) => {
          if (player.inJail) {
            return (
              <i key={index} className={player.img} style={{ color: player.color, animation: player.id === this.props.turn ? 'myanimation 2s infinite' : null}} />
            );
          } else {
            return null;
          }           
        })}
      </div>
    );
  }
}

class Jail extends React.Component {
  render() {
    const player = this.props.player;
    const turn = this.props.turn;
    const windowStyle = {
      borderColor: player[turn].inJail ? player[turn].color : null
    };
    return (
      <div className='drawing'>
        <div className='container'>
          <div className='name'>In</div>
          <div className='window' style={windowStyle}>
              <div className='bar'></div>
              <div className='bar'></div>
              <div className='bar'></div>
              <i className='person fa fa-frown'></i>
              <PlayerJailMarker
                player={this.props.player}
                turn={this.props.turn}
              />
          </div>
          <div className='name'>Jail</div>                
        </div>
      </div>
    );
  }
}

class CornerJail extends React.Component {
  render() {
    return (
      <div className='space corner jail' >
        <div className='just'>Just Visiting</div>
        <Jail
          player={this.props.player}
          turn={this.props.turn}
        />
        <div className='visiting'>
          <PlayerMark
            showSetup={this.props.showSetup} 
            player={this.props.player}
            turn={this.props.turn}
            id={this.props.id}
          />
        </div>        
      </div>
    );
  }
}

class LeftRow extends React.Component {
  render() {
    return (
      <div className='row vertical-row left-row'>
        {this.props.square.filter((item, index) => (index > 10 && index < 20) ).reverse().map((square, index) => {
          switch (square.propertyClass) {
            case 'space property':
              return (
                <SpaceProperty
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                  adjustedPageY={150}
                />
              );
            case 'space utility electric-company':
              return (
                <SpaceUtility
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                  adjustedPageY={150}
                />
              );
            case 'space railroad':
              return (
                <SpaceRailroad
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                  adjustedPageY={150}
                />
              );           
            case 'space community-chest':
              return (
                <SpaceCommunityChest
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                />  
              );
            default:
              return null;
          }
        })}
      </div>
    );
  }
}

class CornerParking extends React.Component {
  render() {
    return (
      <div className='space corner free-parking'>
        <div className='container' >
          <div className='name'>Free</div>
          <i className='drawing fa fa-car'></i>
          <div className='name'>Parking</div>
          <PlayerMark
            showSetup={this.props.showSetup} 
            player={this.props.player}
            turn={this.props.turn}
            id={this.props.id}
          />
        </div>
      </div>
    );
  }
}

class TopRow extends React.Component {
  render() {
    return (
      <div className='row horizontal-row top-row'>
        {this.props.square.filter((item, index) => ( index > 20 && index < 30) ).map((square, index) => {
          switch (square.propertyClass) {
            case 'space property':
              return (
                <SpaceProperty
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                  adjustedPageY={0}
                />
              );
            case 'space chance':
              return (
                <SpaceChance
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                />
              );
            case 'space railroad':
              return (
                <SpaceRailroad
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                  adjustedPageY={0}
                />
              );
            case 'space utility waterworks':
              return (
                <SpaceUtility
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                  adjustedPageY={0}
                />
              );
            case 'space community-chest':
              return (
                <SpaceCommunityChest
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                />  
              );
            default:
              return null;
          }
        })}
      </div>
    );
  }
}

class CornerGoToJail extends React.Component {
  render() {
    return (
      <div className='space corner go-to-jail'>
        <div className='container'>
          <div className='name'>Go To</div>
          <i className='drawing fa fa-gavel'></i>
          <div className='name'>Jail</div>
          <PlayerMark
            showSetup={this.props.showSetup} 
            player={this.props.player}
            turn={this.props.turn}
            id={this.props.id}
          />
        </div>       
      </div>
    );
  }
}

class RightRow extends React.Component {
  render() {
    return (
      <div className='row vertical-row right-row'>
        {this.props.square.filter((item, index) => (index > 30 && index < 40) ).map((square, index) => {
          switch (square.propertyClass) {
            case 'space property':
              return (
                <SpaceProperty
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                  adjustedPageY={150}
                />
              );
            case 'space chance':
              return (
                <SpaceChance
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                />
              );
            case 'space railroad':
              return (
                <SpaceRailroad
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                  adjustedPageY={150}
                />
              );
            case 'space fee luxury-tax':
              return (
                <SpaceTax
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                />
              );
            case 'space community-chest':
              return (
                <SpaceCommunityChest
                  key={square.id}
                  square={square}
                  handleShowDeed={this.props.handleShowDeed}
                  handleHideDeed={this.props.handleHideDeed}
                  player={this.props.player}
                  turn={this.props.turn}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    );
  }
}

export default class Board extends React.Component {
  render() {
    return (
      <div className='table'>
        <div className='board' >
          <Center 
            handleDiceRoll={this.props.handleDiceRoll}
            dice={this.props.dice}
            alert={this.props.alert}
            handleEndTurn={this.props.handleEndTurn}
            turn={this.props.turn}
            player={this.props.player}
            handleShowDeed={this.props.handleShowDeed}
            showDeed={this.props.showDeed}
            handleHideDeed={this.props.handleHideDeed}
            showLandedPanel={this.props.showLandedPanel}
            landed={this.props.landed}
            isTurnEnded={this.props.isTurnEnded}
            alertContainer={this.props.alertContainer}
            square={this.props.square}
            showSetup={this.props.showSetup}
            showCommunityChestCard={this.props.showCommunityChestCard}
            showChanceCard={this.props.showChanceCard}
            cardText={this.props.cardText}
            handleManage={this.props.handleManage}
            showPopup={this.props.showPopup}
            showBuy={this.props.showBuy}
            handleBuy={this.props.handleBuy}
            propertyChecked={this.props.propertyChecked}
            handlePropertyCheckedChange={this.props.handlePropertyCheckedChange}
            showOptionButton={this.props.showOptionButton}
            handleMortgage={this.props.handleMortgage}
            handleUnMortgage={this.props.handleUnMortgage}
            showUnMortgageButton={this.props.showUnMortgageButton}
            showTradePanel={this.props.showTradePanel}
            handleShowTradePanel={this.props.handleShowTradePanel}
            handleHideTradePanel={this.props.handleHideTradePanel}
            handleTradeOpponentID={this.props.handleTradeOpponentID}
            tradeOpponentID={this.props.tradeOpponentID}
            tradeOwnPropertyChecked={this.props.tradeOwnPropertyChecked}
            tradeOpponentPropertyChecked={this.props.tradeOpponentPropertyChecked}
            handleTradeOwnPropertyCheckedChange={this.props.handleTradeOwnPropertyCheckedChange}
            handleTradeOpponentPropertyCheckedChange={this.props.handleTradeOpponentPropertyCheckedChange}
            tradeOwnAmount={this.props.tradeOwnAmount}
            tradeOpponentAmount={this.props.tradeOpponentAmount}
            handleTradeAmountChange={this.props.handleTradeAmountChange}
            popup={this.props.popup}
            handleOfferContent={this.props.handleOfferContent}
            hideTradePlayerSelect={this.props.hideTradePlayerSelect}
            showTradeResponseButton={this.props.showTradeResponseButton}
            handleRejectTrade={this.props.handleRejectTrade}
            handleAcceptTrade={this.props.handleAcceptTrade}
            showPropertyStats={this.props.showPropertyStats}
            handleModifyTrade={this.props.handleModifyTrade}
            tradeResponseToggle={this.props.tradeResponseToggle}
            showBuyHouseButton={this.props.showBuyHouseButton}
            handleBuyHouse={this.props.handleBuyHouse}
            handleSellHouse={this.props.handleSellHouse}
            handleAuction={this.props.handleAuction}
            handleResign={this.props.handleResign}
            houseSum={this.props.houseSum}
            hotelSum={this.props.hotelSum}
            showAIPopup={this.props.showAIPopup}
          />
          <CornerGo 
            id={0}
            turn={this.props.turn}
            player={this.props.player}
            square={this.props.square}
            showSetup={this.props.showSetup}
          />
          <BottomRow 
            turn={this.props.turn}
            player={this.props.player}
            square={this.props.square}
            handleShowDeed={this.props.handleShowDeed}
            handleHideDeed={this.props.handleHideDeed}
          />
          <CornerJail 
            id={10}
            turn={this.props.turn}
            player={this.props.player}
            square={this.props.square}
          />
          <LeftRow 
            turn={this.props.turn}
            player={this.props.player}
            square={this.props.square}
            handleShowDeed={this.props.handleShowDeed}
            handleHideDeed={this.props.handleHideDeed}
          />
          <CornerParking 
            id={20}
            turn={this.props.turn}
            player={this.props.player}
            square={this.props.square}
          />
          <TopRow 
            turn={this.props.turn}
            player={this.props.player}
            square={this.props.square}
            handleShowDeed={this.props.handleShowDeed}
            handleHideDeed={this.props.handleHideDeed}
          />
          <CornerGoToJail 
            id={30}
            turn={this.props.turn}
            player={this.props.player}
            square={this.props.square}
          />
          <RightRow 
            turn={this.props.turn}
            player={this.props.player}
            square={this.props.square}
            handleShowDeed={this.props.handleShowDeed}
            handleHideDeed={this.props.handleHideDeed}
          />
        </div>
      </div>
    );
  }
}