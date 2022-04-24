import React from 'react';
import './style/app.css';
import Deed from './deed';
import MoneyBar, { PlayerName } from './moneybar';
import Board, { Dice, Hotel, House, Deck}  from './board';
import { diceData, squareData, playerData, chanceCardData, communityChestCardData } from './data';
import Setup, {Button, PlayerIcon, TextInput} from './setup';
import Popup from './popup';
import Stats from './stats';
import { Square, DollarSign } from './helper';


export default class App extends React.Component {
  state = {
    dice: diceData,
    player: playerData,
    square: squareData,
    chanceCard: chanceCardData,
    communityChestCard: communityChestCardData,
    turn: 0,
    allAI: false,
    alert: [],
    landed: '',
    showDeed: false,
    deedLeft: 0,
    deedTop: 0,
    showNormalDeed: false,
    showSpecialDeed: false,
    showMortgagedDeed: false,
    showPropertyStats: false,
    showLandedPanel: false,
    showPopup: false,
    showAIPopup: false,
    isTurnEnded: false,
    showPayJailFineButton: false,
    showSetup: true,
    pcount: 3,
    popupText: '',
    AIPopupText: [],
    showCommunityChestCard: false,
    showChanceCard: false,
    cardText: '',
    showBuy: true,
    propertyChecked: 0,
    tradeOwnPropertyChecked: [],
    tradeOpponentPropertyChecked: [],
    tradeOwnAmount: 0,
    tradeOpponentAmount: 0,
    showOptionButton: false,
    showUnMortgageButton: false,
    deedPos: -1,
    showTradePanel: false,
    tradeOpponentID: -1,
    hideTradePlayerSelect: false,
    showTradeResponseButton: false,
    tradeResponseToggle: true,
    showBuyHouseButton: false,
    bidAmount: 0,
    highestBidAmount: 0,
    highestBidderID: -1,
    bidTurn: 0,
    auctionPlayer: null,
    auctionPlayerCount: 0,
    auctionEnded: false,
    houseSum: 0,
    hotelSum: 0
  }

  alertContainer = React.createRef();

  popup = (text) => {
    let popupText = this.state.popupText;
    popupText = text;
    this.setState({
      popupText: popupText,
      showPopup: true
    });
  }

  AIPopup = (text) => {
    let AIPopupText = this.state.AIPopupText;
    AIPopupText.push(text);
    this.setState({
      AIPopupText: AIPopupText,
      showAIPopup: true
    });
  }

  closePopup = () => {
    this.setState({
      showPopup: false,
      popupText: ''
    });
  }

  addBalance = (amount, cause) => {    
    let player = this.state.player;
    let turn = this.state.turn;
    player[turn].balance += amount;
    this.addAlert(
      <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> received <DollarSign player={player[turn]} />{amount} from {cause}.</div>
    );
    this.setState({
      player: player
    });
  }

  subtractBalance = (amount, cause) => {
    let player = this.state.player;
    let turn = this.state.turn;
    player[turn].balance -= amount;
    this.addAlert(
      <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> lost <DollarSign player={player[turn]} />{amount} from {cause}.</div>

    );
    this.setState({
      player: player
    });
  }

  collectMoneyFromEach = (amount, cause) => {
    let player = this.state.player;
    let turn = this.state.turn;
    let total = 0;
    for (let i = 0; i < this.state.pcount; i++) {
      if (i !== turn) {
        let balance = player[i].balance;
        if (balance < amount) {
          player[turn].balance += balance;
          total += balance;
          player[i].balance = 0;
        } else {
          player[i].balance -= amount;
          player[turn].balance += amount;
          total += amount;
        }
      }      
    }    
    this.addAlert(
      <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> received <DollarSign player={player[turn]} />{total} from {cause}.</div>
    );
    this.setState({
      player: player
    });
  }

  payMoneyToEach = (amount, cause) => {
    let player = this.state.player;
    let turn = this.state.turn;
    let total = 0;
    for (let i = 0; i < this.state.pcount; i++) {
      if (i !== turn) {
        player[i].balance += amount;
        total += amount;
        player[turn].balance -= amount;
      }
    }
    this.addAlert(
      <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> lost <DollarSign player={player[turn]} />{total} from {cause}.</div>
    );
    this.setState({
      player: player
    });
  }

  advance = (destination) => {
    let player = this.state.player;
    let turn = this.state.turn;
    if (player[turn].position < destination) {
      this.updatePosition(destination - player[turn].position);
    } else {
      this.updatePosition(destination + 40 - player[turn].position);
    }
  }

  getCommunityChestJailCard = () => {
    let square = this.state.square;
    let player = this.state.player;
    let turn = this.state.turn;
    if (!player[turn].communityChestJailCard) {
      player[turn].communityChestJailCard = true;
      player[turn].properties.push(square[40]);
      square[40].ownerID = turn;
      square[40].owner = player[turn].name;
    }
    this.setState({
      player: player,
      square: square
    });
  }

  getChanceJailCard = () => {
    let square = this.state.square;
    let player = this.state.player;
    let turn = this.state.turn;
    if (!player[turn].chanceJailCard) {
      player[turn].chanceJailCard = true;
      player[turn].properties.push(square[41]);
      square[41].ownerID = turn;
      square[41].owner = player[turn].name;
    }
    this.setState({
      player: player,
      square: square
    });
  }

  streetRepair = (houseRepairPrice, hotelRepairPrice) => {
    let player = this.state.player;
    let turn = this.state.turn;
    let totalCost = 0;
    player[turn].properties.forEach((element) => {
      if (element.houseCount > 0) {
        totalCost += element.houseCount * houseRepairPrice;
      }
      if (element.hotelCount > 0) {
        totalCost += element.hotelCount * hotelRepairPrice;
      }
    });
    player[turn].balance -= totalCost;
    this.addAlert(
      <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> lost <DollarSign player={player[turn]} />{totalCost} for street repair.</div>
    );
    this.setState({
      player: player
    });
  }

  advanceToNearestUtility = () => {
    let player = this.state.player;
    let turn = this.state.turn;
    switch (player[turn].position) {
      case 7:
        this.advance(12);
        break;
      case 22:
        this.advance(28);
        break;
      case 36:
        this.advance(12);
        break;
      default:
        break;
    }
  }

  advanceToNearestRailroad = () => {
    let player = this.state.player;
    let turn = this.state.turn;
    switch (player[turn].position) {
      case 7:
        this.advance(15);
        break;
      case 22:
        this.advance(25);
        break;
      case 36:
        this.advance(5);
        break;
      default:
        break;
    }
  }

  advanceToRandomSpace = () => {
    let randomPosition = Math.floor(Math.random() * 40);
    this.advance(randomPosition);
  }

  payIncomeTax = () => {
    let player = this.state.player;
    let turn = this.state.turn;
    let tax = Math.floor(player[turn].balance * 0.1);
    player[turn].balance -= tax;
    this.addAlert(
      <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> paid 10% cash (<DollarSign player={player[turn]} />{tax}) for landing on imcome tax.</div>
    );
    this.setState({
      player: player
    });
  }

  payLuxuryTax = () => {
    let player = this.state.player;
    let turn = this.state.turn;
    player[turn].balance -= 150;
    this.addAlert(
      <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> paid <DollarSign player={player[turn]} />150 for landing on luxury tax.</div>
    );
    this.setState({
      player: player
    });
  }

  handlePlayerCountChange = (event) => {
    this.setState({
      pcount: event.target.value
    });
  }

  handleStartButton = () => {
    window.scrollTo(0, document.body.scrollHeight);
    let player = this.state.player;
    let turn = this.state.turn;
    let allAI = this.state.allAI;
    player = player.slice(0, this.state.pcount);
    allAI = player.every(element => {
      return element.controlledBy === 'ai'
    })
    let showSetup = this.state.showSetup;
    let playerColor = [];
    player.forEach(element => {
      playerColor.push(element.color);
    });
    showSetup = false;
    if (playerColor.length !== new Set(playerColor).size) {
      showSetup = true;
      this.popup(
        <div>
          <div className='drawing fa fa-exclamation-circle' style={{color: '#f50c2b', fontSize: '50px'}}></div>
          <div style={{fontWeight: 'bold', fontSize: '16px', color: '#f50c2b'}}>Info</div>
          <div><p>You choose duplicate colors for different players, please pick again.</p></div>
          <div>
            <Button
              value='OK'
              onClick={this.closePopup}
              id='menuButton'
            />
          </div>
        </div>
      );
    } else{
      this.addAlert(
        <div>It's <PlayerIcon player={player[0]} /> <PlayerName player={player[0]} />'s turn.</div>
      );
    }  
    this.setState({
      showSetup: showSetup,
      player: player,
      allAI: allAI,
    }, () => {
      if (player[turn].controlledBy === 'ai') this.handleDiceRoll();
    });
  }

  handleNameChange = (index, name) => {
    let player = this.state.player;
    this.setState({ 
      player: player
    });
  }

  handleColorChange = (id, color) => {
    let player = this.state.player;
    player[id].color = color;
    this.setState({ 
      player: player
    });
  }

  handlePropertyCheckedChange = (id, checked) => {
    let propertyChecked = this.state.propertyChecked;
    let square = this.state.square;
    let showOptionButton = this.state.showOptionButton;
    let showBuyHouseButton = this.state.showBuyHouseButton;
    if (checked) {
      propertyChecked = id;
      showOptionButton = true;
      if (id < 40) {
        square.filter((data, index) => (data.group === square[propertyChecked].group && data.id !== propertyChecked)).forEach((element) => {
          if (element.ownerID === square[propertyChecked].ownerID && element.houseCount >= square[propertyChecked].houseCount && square[propertyChecked].hotelCount === 0) {
            showBuyHouseButton = true;
          } else {
            showBuyHouseButton = false;
          }
        });
      }
    } else {
      propertyChecked = 0;
      showOptionButton = false;
    }
    
    this.setState({
      propertyChecked: propertyChecked,
      showOptionButton: showOptionButton,
      square: square,
      showBuyHouseButton: showBuyHouseButton
    });
  }

  handleBuyHouse = (propertyChecked) => {
    let square = this.state.square;
    let player = this.state.player;
    let turn = this.state.turn;
    let showBuyHouseButton = this.state.showBuyHouseButton;
    let houseSum = this.state.houseSum;
    let hotelSum = this.state.hotelSum;    
    if (square[propertyChecked].houseCount < 4) {
      if (houseSum >= 32) {
        this.popup(
          <div>
              <div className='drawing fa fa-exclamation-circle' style={{color: '#f50c2b', fontSize: '50px'}}></div>
              <div style={{fontWeight: 'bold', fontSize: '16px', color: '#f50c2b'}}>Info</div>
              <div><p><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} />, all 32 houses are owned. You must wait until one becomes available.</p></div>
              <div>
                <Button
                  value='OK'
                  onClick={this.closePopup}
                  id='menuButton'
                />
              </div>
            </div>
        );
      } else {
        square[propertyChecked].houseCount += 1;
        player[turn].balance -= square[propertyChecked].housePrice;
        houseSum += 1;
        this.addAlert(
          <div>
            <PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> built a <House /> on
            <Square 
              square={square} 
              position={propertyChecked}
              onMouseEnter={this.handleShowDeed}
              onMouseLeave={this.handleHideDeed} 
            /> 
            for <DollarSign player={player[turn]} />{square[propertyChecked].housePrice}.
          </div>
        );
      }      
    } else {
      if (hotelSum >= 12) {
        this.popup(
          <div>
              <div className='drawing fa fa-exclamation-circle' style={{color: '#f50c2b', fontSize: '50px'}}></div>
              <div style={{fontWeight: 'bold', fontSize: '16px', color: '#f50c2b'}}>Info</div>
              <div><p><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} />, all 12 hotels are owned. You must wait until one becomes available.</p></div>
              <div>
                <Button
                  value='OK'
                  onClick={this.closePopup}
                  id='menuButton'
                />
              </div>
            </div>
        );
      } else {
        square[propertyChecked].hotelCount += 1;
        player[turn].balance -= square[propertyChecked].housePrice;
        hotelSum += 1;
        houseSum -= 4;
        this.addAlert(
          <div>
            <PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> built a <Hotel /> on
            <Square 
              square={square} 
              position={propertyChecked}
              onMouseEnter={this.handleShowDeed}
              onMouseLeave={this.handleHideDeed} 
            /> 
            for <DollarSign player={player[turn]} />{square[propertyChecked].housePrice}.
          </div>
        );
      }     
    }
    square.filter((data, index) => (data.group === square[propertyChecked].group && data.id !== propertyChecked)).every(element => {
      if (element.group > 2 && element.ownerID === square[propertyChecked].ownerID && element.houseCount >= square[propertyChecked].houseCount && square[propertyChecked].hotelCount === 0) {
        showBuyHouseButton = true;
        return true;
      } else {
        showBuyHouseButton = false;
        return false;
      }
    });
    this.setState({
      square: square,
      player: player,
      showBuyHouseButton: showBuyHouseButton,
      houseSum: houseSum,
      hotelSum: hotelSum
    });
  }

  handleSellHouse = (propertyChecked) => {
    let square = this.state.square;
    let player = this.state.player;
    let turn = this.state.turn;
    let houseSum = this.state.houseSum;
    let hotelSum = this.state.hotelSum;
    let showBuyHouseButton = this.state.showBuyHouseButton;
    showBuyHouseButton = true;
    if (square[propertyChecked].hotelCount > 0) {
      square[propertyChecked].hotelCount -= 1;
      player[turn].balance += square[propertyChecked].housePrice / 2; 
      hotelSum -= 1; 
      this.addAlert(
        <div>
          <PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> sold a <Hotel /> on
          <Square 
            square={square} 
            position={propertyChecked}
            onMouseEnter={this.handleShowDeed}
            onMouseLeave={this.handleHideDeed} 
          /> 
          for <DollarSign player={player[turn]} />{square[propertyChecked].housePrice / 2}.
        </div>
      );
    } else {
      square[propertyChecked].houseCount -= 1;
      player[turn].balance += square[propertyChecked].housePrice / 2;
      houseSum -= 1;
      this.addAlert(
        <div>
          <PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> sold a <House /> on
          <Square 
            square={square} 
            position={propertyChecked}
            onMouseEnter={this.handleShowDeed}
            onMouseLeave={this.handleHideDeed} 
          /> 
          for <DollarSign player={player[turn]} />{square[propertyChecked].housePrice / 2}.
        </div>
      );
    }
    this.setState({
      square: square,
      player: player,
      showBuyHouseButton: showBuyHouseButton,
      houseSum: houseSum,
      hotelSum: hotelSum
    });
  }

  handleTradeOwnPropertyCheckedChange = (id, checked) => {
    let tradeOwnPropertyChecked = this.state.tradeOwnPropertyChecked;
    if (checked) {
      tradeOwnPropertyChecked.push(id);
    }
    this.setState({
      tradeOwnPropertyChecked: tradeOwnPropertyChecked
    });
  }

  handleTradeOpponentPropertyCheckedChange = (id, checked) => {
    let tradeOpponentPropertyChecked = this.state.tradeOpponentPropertyChecked;
    if (checked) {
      tradeOpponentPropertyChecked.push(id);
    }
    this.setState({
      tradeOpponentPropertyChecked: tradeOpponentPropertyChecked
    });
  }

  handleTradeAmountChange = (id, value) => {
    let tradeOwnAmount = this.state.tradeOwnAmount;
    let tradeOpponentAmount = this.state.tradeOpponentAmount;
    let regex = /^[0-9\b]+$/;
    if (id === 0 && (value === '' || regex.test(value))) {
      tradeOwnAmount = value;
    } else if (id === 1 && (value === '' || regex.test(value))) {
      tradeOpponentAmount = value;
    }
    this.setState({
      tradeOwnAmount: tradeOwnAmount,
      tradeOpponentAmount: tradeOpponentAmount
    });
  }

  handleOfferContent = () => {
    let player = this.state.player;
    let turn = this.state.turn;
    let tradeOpponentID = this.state.tradeOpponentID;
    let tradeOwnPropertyChecked = this.state.tradeOwnPropertyChecked;
    let tradeOpponentPropertyChecked = this.state.tradeOpponentPropertyChecked;
    let tradeOwnAmount = this.state.tradeOwnAmount;
    let tradeOpponentAmount = this.state.tradeOpponentAmount;
    let square = this.state.square;
    let tradeResponseToggle = this.state.tradeResponseToggle;    
    tradeResponseToggle = !tradeResponseToggle;
    this.setState({
      hideTradePlayerSelect: true,
      showPopup: false,
      showTradeResponseButton: true,
      tradeResponseToggle: tradeResponseToggle
    }, () => {
      if (player[turn].controlledBy === 'ai') {
        if (!tradeResponseToggle) {
          this.addAlert(
            <div>
              <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> offered a trade to <PlayerIcon player={player[tradeOpponentID]} /> <PlayerName player={player[tradeOpponentID]} />.</div>
              <div>
                {player[turn].properties.map((property, index) => {
                  if (tradeOwnPropertyChecked.includes(property.id)) {
                    return (
                      <Square
                        key={property.id} 
                        square={square} 
                        position={property.id}
                        onMouseEnter={this.handleShowDeed}
                        onMouseLeave={this.handleHideDeed} 
                      />
                    );                
                  } else {
                    return null;
                  }              
                })}
                {tradeOwnAmount > 0 ? 
                  <span>
                    &nbsp; + &nbsp;
                    <DollarSign player={player[turn]} />
                    {tradeOwnAmount}
                  </span> 
                : null}
                <i className='fa fa-exchange-alt' style={{marginLeft: '10px', marginRight: '10px'}} />
                {player[tradeOpponentID].properties.map((property, index) => {
                  if (tradeOpponentPropertyChecked.includes(property.id)) {
                    return (
                      <Square
                        key={property.id} 
                        square={square} 
                        position={property.id}
                        onMouseEnter={this.handleShowDeed}
                        onMouseLeave={this.handleHideDeed} 
                      />
                    );                
                  } else {
                    return null;
                  }              
                })}
                {tradeOpponentAmount > 0 ? 
                  <span>
                    &nbsp; + &nbsp;
                    <DollarSign player={player[tradeOpponentID]} />
                    {tradeOpponentAmount}
                  </span> 
                : null}
              </div>
            </div> 
          );
        } else {
          this.addAlert(
            <div>
              <div><PlayerIcon player={player[tradeOpponentID]} /> <PlayerName player={player[tradeOpponentID]} /> counter offered a trade to <PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} />.</div>
              <div>
                {player[tradeOpponentID].properties.map((property, index) => {
                  if (tradeOpponentPropertyChecked.includes(property.id)) {
                    return (
                      <Square
                        key={property.id} 
                        square={square} 
                        position={property.id}
                        onMouseEnter={this.handleShowDeed}
                        onMouseLeave={this.handleHideDeed} 
                      />
                    );                
                  } else {
                    return null;
                  }              
                })}
                {tradeOpponentAmount > 0 ? 
                  <span>
                    &nbsp; + &nbsp;
                    <DollarSign player={player[tradeOpponentID]} />
                    {tradeOpponentAmount}
                  </span> 
                : null}
                <i className='fa fa-exchange-alt' style={{marginLeft: '10px', marginRight: '10px'}} />
                {player[turn].properties.map((property, index) => {
                  if (tradeOwnPropertyChecked.includes(property.id)) {
                    return (
                      <Square 
                        square={square} 
                        position={property.id}
                        onMouseEnter={this.handleShowDeed}
                        onMouseLeave={this.handleHideDeed} 
                      />
                    );                
                  } else {
                    return null;
                  }              
                })}
                {tradeOwnAmount > 0 ? 
                  <span>
                    &nbsp; + &nbsp;
                    <DollarSign player={player[turn]} />
                    {tradeOwnAmount}
                  </span> 
                : null}
              </div>
            </div>            
          );
        }
      }
      if (player[tradeOpponentID].controlledBy === 'ai') {
        let sameGroup = [];
        let acceptTrade = false;
        player[tradeOpponentID].properties.forEach((property, index) => {
          sameGroup.push(property.group);
        });
        tradeOwnPropertyChecked.forEach((id, index) => {
          if (tradeOwnPropertyChecked.length === tradeOpponentPropertyChecked.length && (tradeOpponentAmount - tradeOwnAmount < player[tradeOpponentID].balance / 4) && sameGroup.includes(square[id].group)) acceptTrade = true;
        });
        acceptTrade ? this.handleAcceptTrade() : this.handleRejectTrade();
      }
    });
  }

  handleRejectTrade = () => {
    let player = this.state.player;
    let turn = this.state.turn;
    let tradeOpponentID = this.state.tradeOpponentID;
    this.addAlert(
      <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} />'s trade offer was rejected by <PlayerIcon player={player[tradeOpponentID]} /> <PlayerName player={player[tradeOpponentID]} />.</div>
    );
    this.addLanded(
      <div>Your trade offer was rejected by <PlayerIcon player={player[tradeOpponentID]} /> <PlayerName player={player[tradeOpponentID]} />.</div>
    );
    this.handleHideTradePanel();
    this.setState({
      showLandedPanel: true,
      showTradeResponseButton: false,
      tradeOwnAmount: 0,
      tradeOpponentAmount: 0,
      tradeResponseToggle: true,
      tradeOwnPropertyChecked: [],
      tradeOpponentPropertyChecked: [],
      tradeOpponentID: -1
    });
  }

  handleAcceptTrade = () => {
    let player = this.state.player;
    let turn = this.state.turn;
    let square = this.state.square;
    let tradeOpponentID = this.state.tradeOpponentID;
    let tradeOpponentAmount = this.state.tradeOpponentAmount;
    let tradeOwnAmount = this.state.tradeOwnAmount;
    let tradeOpponentPropertyChecked = this.state.tradeOpponentPropertyChecked;
    let tradeOwnPropertyChecked = this.state.tradeOwnPropertyChecked;
    tradeOwnPropertyChecked.forEach((id) => {
      square[id].owner = player[tradeOpponentID].name;
      square[id].ownerID = tradeOpponentID;
      let index = player[turn].properties.indexOf(square[id]);
      player[turn].properties.splice(index, 1);
      if(id < 40 || (id === 40 && !player[tradeOpponentID].communityChestJailCard) || (id === 41 && !player[tradeOpponentID].chanceJailCard)) player[tradeOpponentID].properties.push(square[id]);
      if (id === 40) {
        player[turn].communityChestJailCard = false;
        player[tradeOpponentID].communityChestJailCard = true;
      } else if (id === 41) {
        player[turn].chanceJailCard = false;
        player[tradeOpponentID].chanceJailCard = true;
      }         
    });
    tradeOpponentPropertyChecked.forEach((id) => {      
      square[id].owner = player[turn].name;
      square[id].ownerID = turn;
      let index = player[tradeOpponentID].properties.indexOf(square[id]);
      player[tradeOpponentID].properties.splice(index, 1);
      if(id < 40 || (id === 40 && !player[turn].communityChestJailCard) || (id === 41 && !player[turn].chanceJailCard)) player[turn].properties.push(square[id]);
      if (id === 40) {
        player[turn].communityChestJailCard = true;
        player[tradeOpponentID].communityChestJailCard = false;
      } else if (id === 41) {
        player[turn].chanceJailCard = true;
        player[tradeOpponentID].chanceJailCard = false;
      }       
    });
    player[turn].balance += (tradeOpponentAmount - tradeOwnAmount);
    player[tradeOpponentID].balance += (tradeOwnAmount - tradeOpponentAmount);
    this.addAlert(
      <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} />'s trade offer was accepted by <PlayerIcon player={player[tradeOpponentID]} /> <PlayerName player={player[tradeOpponentID]} />.</div>
    );
    this.addLanded(
      <div>Your trade offer was accepted by <PlayerIcon player={player[tradeOpponentID]} /> <PlayerName player={player[tradeOpponentID]} />.</div>
    );
    this.handleHideTradePanel();
    this.setState({
      player: player,
      turn: turn,
      square: square,
      showLandedPanel: true,
      showTradeResponseButton: false,
      tradeResponseToggle: true,
      tradeOwnAmount: 0,
      tradeOpponentAmount: 0,
      tradeOwnPropertyChecked: [],
      tradeOpponentPropertyChecked: [],
      tradeOpponentID: -1
    });
  }

  handleModifyTrade = () => {
    this.setState({
      showTradeResponseButton: false
    });
  }

  handleMortgage = (propertyChecked) => {
    let square = this.state.square;
    let player = this.state.player;
    let turn = this.state.turn;
    square[propertyChecked].isMortgaged = true;
    let mortgagePrice = square[propertyChecked].price * 0.5;
    player[turn].balance += mortgagePrice;
    this.addAlert(
      <div>
        <PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> mortgaged
        <Square 
          square={square} 
          position={propertyChecked}
          onMouseEnter={this.handleShowDeed}
          onMouseLeave={this.handleHideDeed} 
        /> 
        for <DollarSign player={player[turn]} />{mortgagePrice}.
      </div>
    );
    this.setState({
      showUnMortgageButton: true,
      square: square,
      player: player
    });
  }

  handleUnMortgage = () => {
    let propertyChecked = this.state.propertyChecked;
    let square = this.state.square;
    let player = this.state.player;
    let turn = this.state.turn;
    square[propertyChecked].isMortgaged = false;
    let unMortgagePrice = square[propertyChecked].price * 0.6;
    player[turn].balance -= unMortgagePrice;
    this.addAlert(
      <div>
        <PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> unmortgaged 
        <Square 
          square={square} 
          position={propertyChecked}
          onMouseEnter={this.handleShowDeed}
          onMouseLeave={this.handleHideDeed} 
        /> 
        for <DollarSign player={player[turn]} />{unMortgagePrice}.
      </div>
    );
    this.setState({
      showUnMortgageButton: false,
      square: square,
      player: player
    });
  }

  handleControlChange = (id, controlledBy) => {
    let player = this.state.player;
    player[id].controlledBy = controlledBy;
    this.setState({ 
      player: player
    });
  }

  playCommunityChestCard = () => {
    let player = this.state.player;
    let turn = this.state.turn;
    let cardText = this.state.cardText;
    let index = Math.floor(Math.random() * 16);
    //let index = 8;
    cardText = this.state.communityChestCard[index];
    if (player[turn].controlledBy === 'ai') {
      this.addAlert(
          <Deck 
            showCard={true}
            cardText={cardText}
            backgroundColor='#a44026'
            iconColor='#d2eaf5'
            icon='drawing fa fa-cube'
            display='inline-block'
          />
      );
    } else {
      this.popup(
        <div>
          <div className='drawing fa fa-cube' style={{color: 'grey', fontSize: '50px'}}></div>
          <div style={{fontWeight: 'bold', fontSize: '16px', color: 'grey'}}>Community Chest</div>
          <div><p>{cardText}</p></div>
          <div>
            <Button
              value='OK'
              onClick={this.closePopup}
              id='menuButton'
            />
          </div>
        </div>
      );
    }
    switch (index) {
      case 0:
        this.getCommunityChestJailCard();
        break;
      case 1:
        this.addBalance(10, 'Community Chest');
        break;
      case 2:
        this.addBalance(50, 'Community Chest');
        break;
      case 3:
        this.addBalance(100, 'Community Chest');
        break;
      case 4:
        this.addBalance(20, 'Community Chest');
        break;
      case 5:
        this.addBalance(100, 'Community Chest');
        break;
      case 6:
        this.addBalance(100, 'Community Chest');
        break;
      case 7:
        this.addBalance(25, 'Community Chest');
        break;
      case 8:
        this.subtractBalance(100, 'Community Chest');
        break;
      case 9:
        this.addBalance(200, 'Community Chest');
        break;
      case 10:
        this.subtractBalance(50, 'Community Chest');
        break;
      case 11:
        this.subtractBalance(50, 'Community Chest');
        break;
      case 12:
        this.collectMoneyFromEach(10, 'Community Chest');
        break;
      case 13:
        this.advance(0);
        break;
      case 14:
        this.streetRepair(40, 115);
        break;
      case 15:
        this.handleGoToJail();
        break;
      default:
        break;
    }
    this.setState({
      cardText: cardText,
      showCommunityChestCard: true
    }, () => {
      if (player[turn].controlledBy === 'ai') this.AIBankcruptcyCheck();
    });
  }

  playChanceCard = () => {
    let player = this.state.player;
    let turn = this.state.turn;
    let cardText = this.state.cardText;
    let index = Math.floor(Math.random() * 16);
    cardText = this.state.chanceCard[index];
    if (player[turn].controlledBy === 'ai') {
      this.addAlert(
          <Deck 
            showCard={true}
            cardText={cardText}
            backgroundColor='#fa811d'
            iconColor='#f50c2b'
            icon='drawing fa fa-question'
            display='inline-block'
          />
      );
    } else {
      this.popup(
        <div>
          <div className='drawing fa fa-question' style={{color: '#f50c2b', fontSize: '50px'}}></div>
          <div style={{fontWeight: 'bold', fontSize: '16px', color: '#f50c2b'}}>Chance</div>
          <div><p>{cardText}</p></div>
          <div>
            <Button
              value='OK'
              onClick={this.closePopup}
              id='menuButton'
            />
          </div>
        </div>
      );
    }
    switch (index) {
      case 0:
        this.getChanceJailCard();
        break;
      case 1:
        this.streetRepair(25, 100);
        break;
      case 2:
        this.subtractBalance(15, 'Chance');
        break;
      case 3:
        this.payMoneyToEach(50, 'Chance');
        break;
      case 4:
        this.updatePosition(-3);
        break;
      case 5:
        this.advanceToNearestUtility();
        break;
      case 6:
        this.addBalance(50, 'Chance');
        break;
      case 7:
        this.advanceToNearestRailroad();
        break;
      case 8:
        this.subtractBalance(15, 'Chance');
        break;
      case 9:
        this.advance(5);
        break;
      case 10:
        this.advance(39);
        break;
      case 11:
        this.advance(24);
        break;
      case 12:
        this.addBalance(150, 'Chance');
        break;
      case 13:
        this.advanceToRandomSpace();
        break;
      case 14:
        this.advance(11);
        break;
      case 15:
        this.handleGoToJail();
        break;
      default:
        break;
    }
    this.setState({
      cardText: cardText,
      showChanceCard: true,
    }, () => {
      if (player[turn].controlledBy === 'ai') this.AIBankcruptcyCheck();  
    });
  }

  updatePosition = (diceSum) => {
    let player = this.state.player;
    let turn = this.state.turn;
    let square = this.state.square;
    let houseSum = this.state.houseSum;
    let hotelSum = this.state.hotelSum;
    let tradeOwnPropertyChecked = this.state.tradeOwnPropertyChecked;
    let tradeOwnAmount = this.state.tradeOwnAmount;
    let tradeOpponentID = this.state.tradeOpponentID;
    let tradeOpponentPropertyChecked = this.state.tradeOpponentPropertyChecked;
    player[turn].position += diceSum;
    if (player[turn].position > 39) {
      player[turn].position -= 40;
      player[turn].balance += 200;
      this.addAlert(
        <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> collected <DollarSign player={player[turn]} />200 salary for passing go.</div>
      );
    }
    this.addAlert(
      <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> landed on 
        <Square 
          square={square} 
          position={player[turn].position}
          onMouseEnter={this.handleShowDeed}
          onMouseLeave={this.handleHideDeed} 
        />
        .
      </div>
    );
    if (square[player[turn].position].ownerID !== turn && square[player[turn].position].isMortgaged) {
      this.addAlert(
        <div>
          <Square 
            square={square} 
            position={player[turn].position}
            onMouseEnter={this.handleShowDeed}
            onMouseLeave={this.handleHideDeed} 
          />
          is mortgaged, no need to pay rent.
        </div>
      );
    }
    if (player[turn].position !== 10 && player[turn].position !== 20 && player[turn].position !== 30) {
      this.addLanded(
          <div>
            You landed on
            <Square 
              square={square} 
              position={player[turn].position}
              onMouseEnter={this.handleShowDeed}
              onMouseLeave={this.handleHideDeed} 
            /> 
            .
            {square[player[turn].position].price !== 0 && square[player[turn].position].owner === '' ?  
              <Button
                id='optionButton' 
                value={'Buy ' + square[player[turn].position].priceText}
                onClick={this.handleConfirmBuy}
              />
            : null }  
            {square[player[turn].position].isMortgaged ? 
              <span> It's mortgaged, no need to pay rent.</span>
            : null} 
          </div>            
      );
    } else {
      this.addLanded(
        <div>
          You landed on 
          <Square 
            square={square} 
            position={player[turn].position}
            onMouseEnter={this.handleShowDeed}
            onMouseLeave={this.handleHideDeed} 
          />
          .
        </div>
      );
    }
    if (player[turn].position > 15 && player[turn].position < 35) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
    switch (player[turn].position) {
      case 2: case 17: case 33:
        this.playCommunityChestCard();
        return;
      case 7: case 22: case 36:
        this.playChanceCard();
        return;
      case 4:
        this.payIncomeTax();
        break;
      case 30:
        if (player[turn].controlledBy === 'ai') {
          this.handleGoToJail()
        } else {
          this.popup(
            <div>
              <div className='person fa fa-frown' style={{color: '#fa811d', fontSize: '50px'}}></div>
              <div style={{fontWeight: 'bold', fontSize: '16px', color: '#fa811d'}}>Info</div>
              <div><p><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} />, you go to jail. Go directly to Jail. Do not pass GO. Do not collect <DollarSign player={player[turn]} />200.</p></div>
              <div>
                <Button
                  value='Go to Jail'
                  onClick={this.handleGoToJail}
                  id='menuButton'
                />
              </div>
            </div>
          );
        }
        break;
      case 38:
        this.payLuxuryTax();
        break;
      default:
        break;
    }
    if (square[player[turn].position].ownerID !== turn && square[player[turn].position].owner !== '' && !square[player[turn].position].isMortgaged) { 
      if (player[turn].position === 12 || player[turn].position === 28) {
        if (square[12].ownerID === square[28].ownerID) {
          square[player[turn].position].baseRent = diceSum * 10;
        } else {
          square[player[turn].position].baseRent = diceSum * 4;
        }
      }
      if (player[turn].position === 5 || player[turn].position === 15 || player[turn].position === 25 || player[turn].position === 35) {
        let railroadOwnedCount = 0;
        let railroadIDGroup = [5, 15, 25, 35];
        railroadIDGroup.forEach(id => {
          if (square[id].ownerID === square[player[turn].position].ownerID) railroadOwnedCount += 1;
        });
        switch (railroadOwnedCount) {
          case 2:
            square[player[turn].position].baseRent = 50;
            break;
          case 3:
            square[player[turn].position].baseRent = 100;
            break;
          case 4:
            square[player[turn].position].baseRent = 200;
            break;
          default:
            square[player[turn].position].baseRent = 25;
            break;
        }
      }
      let colorGroup = [];
      for (let i = 3; i < 11; i++) {
        colorGroup.push(square.filter((data, index) => data.group === i));
      };
      colorGroup.forEach((group) => {
        if (group.every(val => val.ownerID === group[0].ownerID && val.ownerID !== -1)) {
          group.forEach(element => {
              element.doubleRent = element.houseCount === 0 ? true : false;            
          });
        } else {
          group.forEach(element => element.doubleRent = false);
        }
      });
      let acturalRent = 0
      if (square[player[turn].position].hotelCount > 0) {
        acturalRent = square[player[turn].position].rent5;
      } else {
        switch (square[player[turn].position].houseCount) {
          case 4:
            acturalRent = square[player[turn].position].rent4;
            break;
          case 3:
            acturalRent = square[player[turn].position].rent3;
            break;
          case 2: 
            acturalRent = square[player[turn].position].rent2;
            break;
          case 1: 
            acturalRent = square[player[turn].position].rent1;
            break;
          case 0:
            acturalRent = square[player[turn].position].doubleRent ? square[player[turn].position].baseRent * 2 : square[player[turn].position].baseRent;
            break;
          default:
            break;
        }
      }
      this.addAlert(
        <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> paid <DollarSign player={player[turn]} />{acturalRent} rent to <PlayerIcon player={player[square[player[turn].position].ownerID]} /> <PlayerName player={player[square[player[turn].position].ownerID]} />.</div>
      );
      this.addLanded(
        <div><PlayerIcon player={player[square[player[turn].position].ownerID]} /> <PlayerName player={player[square[player[turn].position].ownerID]} /> collected <DollarSign player={player[turn]} />{acturalRent} rent.</div>
      );
      player[turn].balance -= acturalRent;
      player[square[player[turn].position].ownerID].balance += acturalRent;
    }
    this.setState({
      player: player,
      showLandedPanel: true,
      showBuy: true
    }, () => {
      if (player[turn].controlledBy === 'ai') {
        if (square[player[turn].position].price !== 0 && square[player[turn].position].owner === '') {
          let result = player[turn].balance - square[player[turn].position].price * 2;
          if (result > 0) {
            this.handleConfirmBuy();
          } else {
            this.handleAuction();
          }          
        }
        let availProperty = square[player[turn].position];
        let propertyInSameGroupCount = 0;
        let totalPropertyCountInSameGroup = 0;
        let propertyToTradeID = -1;
        let ownProperties = player[turn].properties.filter((data, index) => (data.group !== availProperty.group && !data.doubleRent && data.houseCount === 0 && data.hotelCount === 0));
        const AIOfferTradeCheckfirst = () => {
          square.filter((data, index) => (data.group > 0 && availProperty.ownerID === turn && data.group === availProperty.group)).forEach(element => {
            totalPropertyCountInSameGroup += 1;
            if (element.ownerID === availProperty.ownerID) {
              propertyInSameGroupCount += 1;
            } else {
              propertyToTradeID = element.id;
              tradeOpponentID = element.ownerID;
            }
          });
          return (propertyInSameGroupCount === totalPropertyCountInSameGroup - 1 && tradeOpponentID !== -1 && ownProperties.length > 0) ? true : false;
        }
        const AIOfferTradeCheckDone = () => {
          const result = AIOfferTradeCheckfirst();
          if (result) {
            tradeOpponentPropertyChecked.push(propertyToTradeID);
            tradeOwnAmount = Math.floor(player[turn].balance / 10);
            let index = Math.floor(Math.random() * ownProperties.length);
            tradeOwnPropertyChecked.push(ownProperties[index].id);
            this.setState({
              tradeOwnPropertyChecked: tradeOwnPropertyChecked,
              tradeOpponentPropertyChecked: tradeOpponentPropertyChecked,
              tradeOwnAmount: tradeOwnAmount,
              tradeOpponentID: tradeOpponentID,
            }, () => {
              this.handleOfferContent();
            });
          }
        }
        AIOfferTradeCheckDone();
        if (availProperty.ownerID === turn && availProperty.group > 2 && player[turn].balance > availProperty.housePrice * 2 && houseSum < 32 && hotelSum < 12) {
          const AIBuyHouseCheckfirst = () => {
            return square.filter((data, index) => (data.group === availProperty.group && data.id !== player[turn].position)).every(element => 
              element.ownerID === availProperty.ownerID && element.houseCount >= availProperty.houseCount && availProperty.hotelCount === 0
            );
          }
                 
          const AIBuyHouseCheckDone = () => {
            const result = AIBuyHouseCheckfirst();
            if (result) this.handleBuyHouse(availProperty.id);
          }
          AIBuyHouseCheckDone();
        }
        this.AIBankcruptcyCheck();       
      }
    });
  }

  AIBankcruptcyCheck = () => {
    let player = this.state.player;
    let turn = this.state.turn;
    const maxPriceProperty = (list) => {
      return list.reduce((prev, current) => prev.price > current.price ? prev : current);
    }
    let availPropertiesToMortgage = player[turn].properties.filter(property => property.isMortgaged === false);
    while (availPropertiesToMortgage.length > 0 && player[turn].balance < 0) {
      this.addAlert(
        <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> is in debt now, <DollarSign player={player[turn]} />{player[turn].balance}. Must pay the debt or will be out of the game.</div>
      );
      let maxMortgagePriceID = maxPriceProperty(availPropertiesToMortgage).id;
      this.handleMortgage(maxMortgagePriceID);
      availPropertiesToMortgage = availPropertiesToMortgage.filter(property => property.id !== maxMortgagePriceID);
    }
    let availPropertiesToSell = player[turn].properties.filter(property => property.houseCount !== 0 || property.hotelCount !== 0);
    while (availPropertiesToSell.length > 0 && player[turn].balance < 0) {
      this.addAlert(
        <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> is in debt now, <DollarSign player={player[turn]} />{player[turn].balance}. Must pay the debt or will be out of the game.</div>
      );
      let maxSellPriceID = maxPriceProperty(availPropertiesToSell).id;
      this.handleSellHouse(maxSellPriceID);
      availPropertiesToSell = availPropertiesToSell.filter(property => property.houseCount !== 0 || property.hotelCount !== 0);
    }
    if (player[turn].balance < 0) {
      this.addAlert(
        <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> went bankcrutp. Out of the game.</div>
      );
    }
  }

  handleDiceRoll = () => { 
    const actionCheckFirst = () => {
      return new Promise(resolve => {
        let dice = this.state.dice;
        let player = this.state.player;
        let turn = this.state.turn;
        dice['die0'] = Math.floor(Math.random() * 6 + 1);
        dice['die1'] = Math.floor(Math.random() * 6 + 1);
        //dice['die0'] = 1;
        //dice['die1'] = 1;
        let diceSum = dice['die0'] + dice['die1'];
        dice['areDiceRolled'] = true;
        let isTurnEnded = this.state.isTurnEnded;
        if (dice['die0'] === dice['die1']) {
          player[turn].doubleCount++;
          this.addAlert(
            <div>
              <PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> rolled &nbsp;  
              <Dice 
                dice={dice}
                turn={turn}
                player={player}
                fontSize='20px'
                display='inline-flex'
              />
              &nbsp; - Doubles.
            </div>
          );
        } else {
          this.addAlert(
            <div>
              <PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> rolled &nbsp; 
              <Dice 
                dice={dice}
                turn={turn}
                player={player}
                fontSize='20px'
                display='inline-flex'
              />
              &nbsp;.
            </div>
          );
        }
        if (dice['die0'] === dice['die1'] && !player[turn].inJail) {
          this.addAlert(
            <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> can roll again.</div>
          );
          isTurnEnded = false;
          if (player[turn].doubleCount === 3) {
            isTurnEnded = true;
            this.addAlert(
              <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> rolled doubles three times in a row.</div>
            );
            if (player[turn].controlledBy === 'ai') {
              this.handleGoToJail();
              return;
            } else {
              this.popup(
                <div>
                  <div className='drawing fa fa-skull' style={{color: '#080808', fontSize: '50px'}}></div>
                  <div style={{fontWeight: 'bold', fontSize: '16px', color: '#080808'}}>Jail</div>
                  <div><p><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} />, you rolled doubles three times in a row. Go to jail.</p></div>
                  <div>
                    <Button
                      value='Go to Jail'
                      onClick={this.handleGoToJail}
                      id='menuButton'
                    />
                  </div>
                </div>
              );
            }
          }
        } else {
          player[turn].doubleCount = 0;
          isTurnEnded = true;
        }
        if (player[turn].inJail) {
          player[turn].jailRoll++;
          if (dice['die0'] === dice['die1']) {
            player[turn].inJail = false;
            player[turn].jailRoll = 0;
            this.addAlert(
              <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> rolled double dice. Out of jail.</div>
            );
            this.updatePosition(diceSum); 
          } else {
            this.addAlert(
              <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> did not roll double dice, still in jail.</div>
            );
            if (player[turn].jailRoll === 3) {
              if (player[turn].controlledBy === 'ai') {
                this.addAlert(
                  <div><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} /> roll dice three times in jail now and must pay the <DollarSign player={player[turn]} />50 fine.</div>
                );
                this.handleGetOutOfJail('payJailFine');
                this.handleDiceRoll();
              } else {
                this.popup(
                  <div>
                    <div className='drawing fa fa-exclamation-circle' style={{color: '#f50c2b', fontSize: '50px'}}></div>
                    <div style={{fontWeight: 'bold', fontSize: '16px', color: '#f50c2b'}}>Info</div>
                    <div><p><PlayerIcon player={player[turn]} /> <PlayerName player={player[turn]} />, you roll dice three times in jail now and must pay the <DollarSign player={player[turn]} />50 fine.</p></div>
                    <div>
                      <Button
                        value='Pay the fine'
                        onClick={() => this.handleGetOutOfJail('payJailFine')}
                        id='menuButton'
                      />
                    </div>
                  </div>
                );
              }
            }
          }  
        } else {
          if(player[turn].doubleCount !== 3) this.updatePosition(diceSum);
        }
        this.setState({
          dice: dice,
          player: player,
          isTurnEnded: isTurnEnded
        });
        resolve();
      });
    }
    const actionCheckDone = async () => {
      await actionCheckFirst();
      let player = this.state.player;
      let turn = this.state.turn;
      if (player[turn].controlledBy === 'ai' && player[turn].balance > 0 && player[turn].doubleCount > 0 && player[turn].doubleCount < 3) this.handleDiceRoll();
    }
    actionCheckDone(); 
  }

  handleBidAmountChange = (value) => {
    let bidAmount = this.state.bidAmount;
    let regex = /^[0-9\b]+$/;
    if ((value === '' || regex.test(value))) {
      bidAmount = Number(value);
    } 
    this.setState({
      bidAmount: bidAmount
    });
  }

  handleBidButton = (bidTurn, auctionPlayer, auctionPlayerCount, bidAmount) => {
    let highestBidAmount = this.state.highestBidAmount;
    let highestBidderID = this.state.highestBidderID;
    if (bidAmount > highestBidAmount) {
      highestBidAmount = bidAmount;
      highestBidderID = auctionPlayer[bidTurn].id;
      this.addAlert(
        <div><PlayerIcon player={auctionPlayer[bidTurn]} /> <PlayerName player={auctionPlayer[bidTurn]} />bidded <DollarSign player={auctionPlayer[bidTurn]} />{highestBidAmount}. </div>
      );
      this.setState({
        highestBidAmount : highestBidAmount,
        highestBidderID: highestBidderID
      }, () => this.auction(bidTurn + 1, auctionPlayer, auctionPlayerCount)
      );
    }   
  }

  handlePassButton = (bidTurn, auctionPlayer, auctionPlayerCount) => {
    this.addAlert(
      <div><PlayerIcon player={auctionPlayer[bidTurn]} /> <PlayerName player={auctionPlayer[bidTurn]} /> exited the auction bidding. </div>
    );
    for (let i = bidTurn; i < auctionPlayerCount - 1; i++) {
      auctionPlayer[i] = auctionPlayer[i+1];
    }
    auctionPlayerCount--;
    auctionPlayer = auctionPlayer.splice(0, auctionPlayerCount);
    this.auction(bidTurn, auctionPlayer, auctionPlayerCount);
  }

  auction = (bidTurn, auctionPlayer, auctionPlayerCount) => {
    let square = this.state.square;
    let player = this.state.player;
    let turn = this.state.turn;
    let highestBidderID = this.state.highestBidderID;
    let highestBidAmount = this.state.highestBidAmount;
    if (auctionPlayerCount === 1) {
      square[player[turn].position].owner = auctionPlayer[0].name;
      square[player[turn].position].ownerID = auctionPlayer[0].id;
      player[auctionPlayer[0].id].balance -= highestBidAmount;
      player[auctionPlayer[0].id].properties.push(square[player[turn].position]);
      this.addAlert(
        <div>
          <PlayerIcon player={auctionPlayer[0]} /> <PlayerName player={auctionPlayer[0]} /> won the auction and bought 
          <Square 
            square={square} 
            position={player[turn].position}
            onMouseEnter={this.handleShowDeed}
            onMouseLeave={this.handleHideDeed} 
          /> 
          for <DollarSign player={auctionPlayer[0]} />{highestBidAmount}. 
        </div>
      );
      if (auctionPlayer[0].name === player[turn].name) {
        this.addLanded(
          <div>
            You bought 
            <Square 
              square={square} 
              position={player[turn].position}
              onMouseEnter={this.handleShowDeed}
              onMouseLeave={this.handleHideDeed} 
            /> 
            for <DollarSign player={player[turn]} />{highestBidAmount}. 
          </div>
        );
      } else {
        this.addLanded(
          <div>
            You did not buy 
            <Square 
              square={square} 
              position={player[turn].position}
              onMouseEnter={this.handleShowDeed}
              onMouseLeave={this.handleHideDeed} 
            />
            from the auction. 
          </div>
        );
      }      
      this.closePopup();
    } else {
      if (bidTurn >= auctionPlayerCount) bidTurn -= auctionPlayerCount;
      this.addAlert(
        <div>It's <PlayerIcon player={auctionPlayer[bidTurn]} /> <PlayerName player={auctionPlayer[bidTurn]} />'s turn to bid.</div>
      );     
      this.popup(
        <div>
          <div className='drawing fa fa-gavel' style={{color: '#640303', fontSize: '50px'}}></div>
          <div style={{fontWeight: 'bold', fontSize: '16px', color: '#640303'}}>
            Auction <span>{square[player[turn].position].name}</span>
          </div>
          <div>
            Highest Bid = $
            <span>{highestBidAmount}</span>
            {highestBidderID !== -1 ? 
              <span>
                ,  &nbsp;Highest Bidder: &nbsp;
                <PlayerIcon player={player[highestBidderID]} /> 
                <PlayerName player={player[highestBidderID]} />
              </span>
            : null}          
          </div>
          <div>
            <p>
              <PlayerIcon player={auctionPlayer[bidTurn]} /> 
              <PlayerName player={auctionPlayer[bidTurn]} />, 
              your turn to bid. Must greater than highest bid.
            </p>
          </div>
          <div>
            $ <TextInput 
                onChange={(e) => this.handleBidAmountChange(e.target.value)}
              />
          </div>
          <div>
            <Button
              value='Bid'
              id='optionButton'
              onClick={() => this.handleBidButton(bidTurn, auctionPlayer, auctionPlayerCount, this.state.bidAmount)}
            />
            <Button
              value='Pass'
              id='optionButton'
              onClick={() => this.handlePassButton(bidTurn, auctionPlayer, auctionPlayerCount)}
            />
          </div>
        </div>
      );  
      if (auctionPlayer[bidTurn].controlledBy === 'ai') {
        let bidList = [10, 20, 30, 40, 50];
        let bidRandomIndex = Math.floor(Math.random * 5);
        let bidIncrement = bidList[bidRandomIndex];
        if (highestBidAmount + bidIncrement < auctionPlayer[bidTurn].balance / 4) {
          this.handleBidButton(bidTurn, auctionPlayer, auctionPlayerCount, highestBidAmount + bidIncrement);
        } else {
          this.handlePassButton(bidTurn, auctionPlayer, auctionPlayerCount);
        }
      }   
    }
    this.setState({
      square: square,
      player: player
    });
  }

  handleAuction = () => {
    let turn = this.state.turn;
    let pcount = this.state.pcount;
    let player = this.state.player;
    let auctionPlayer = player.map(obj => ({...obj}));    
    let auctionPlayerCount = pcount;
    let bidTurn = turn + 1;
    if (bidTurn >= auctionPlayerCount) bidTurn -= auctionPlayerCount;
    this.auction(bidTurn, auctionPlayer, auctionPlayerCount);
  }

  handleResign = () => {
    let turn = this.state.turn;
    let player = this.state.player;
    this.popup(
      <div>
        <div className='drawing fa fa-skull' style={{color: '#41994e', fontSize: '50px'}}></div>
        <div style={{fontWeight: 'bold', fontSize: '16px', color: '#41994e'}}>Bankcrutpcy</div>
        <div><p>Sorry, <PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> .You went bankcrutp. Out of the game.</p></div>
        <div>
          <Button
            value='OK'
            onClick={this.handleBankcruptcy}
            id='menuButton'
          />
        </div>
      </div>
    );
  }

  handleEndTurn = (value) => {
    let dice = this.state.dice;
    let turn = this.state.turn;
    let showLandedPanel = this.state.showLandedPanel;
    let player = this.state.player;
    let showAIPopup = this.state.showAIPopup;
    let highestBidAmount = this.state.highestBidAmount;
    let highestBidderID = this.state.highestBidderID;
    highestBidderID = -1;
    highestBidAmount = 0;
    let jailTurn = ['1st', '2nd', '3rd'];
    dice['areDiceRolled'] = false;
    turn -= value;
    turn += 1;
    if (turn >= this.state.pcount) turn -= this.state.pcount;
    if (player[turn].position > 15 && player[turn].position < 35) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
    this.addAlert(
      <div>It's <PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} />'s turn'.</div>
    );
    if (player[turn].inJail) {
        this.addLanded(
          <div>
            You are in jail.
              <div>
                <Button 
                  id='optionButton' 
                  title='Pay $50 fine to get out of jail immediately.' 
                  value='Pay $50 Fine' 
                  onClick={() => this.handleGetOutOfJail('payJailFine')} 
                />
                {player[turn].communityChestJailCard ?
                  <Button 
                    id='optionButton' 
                    title='use the card to get out of jail immediately.' 
                    value='Use CC card'
                    onClick={() => this.handleGetOutOfJail('useCCFreeJailCard')} 
                  />
                : null}  
                {player[turn].chanceJailCard ?
                  <Button 
                    id='optionButton' 
                    title='use the card to get out of jail immediately.' 
                    value='Use Chance card'
                    onClick={() => this.handleGetOutOfJail('useChanceFreeJailCard')} 
                  />
                : null}        
              </div>                     
          </div>
        );
      this.addAlert(
        <div>This is <PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} />'s {jailTurn[[player[turn].jailRoll]]} turn in jail. Roll the dice, you will out of jail if you throw doubles. Or pay <DollarSign player={player[turn]} />50 fine, or use cards to get out.</div>
      );
      showLandedPanel = true;
    } else {
      showLandedPanel = false;
    }
    showAIPopup = player[turn].controlledBy === 'ai' ? true : false;
    this.setState({
      dice: dice,
      turn: turn,
      showLandedPanel: showLandedPanel,
      isTurnEnded: false,
      showCommunityChestCard: false,
      showChanceCard: false,
      showBuy: true,
      propertyChecked: 0,
      showOptionButton: false,
      highestBidAmount: highestBidAmount,
      highestBidderID: highestBidderID,
      AIPopupText: [],
      showPopup: false,
      showAIPopup: showAIPopup
    }, () => {
      if (player[turn].controlledBy === 'ai') {
        if (player[turn].inJail) {
          this.addAlert(
            <div>This is <PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} />'s {jailTurn[[player[turn].jailRoll]]} turn in jail. Roll the dice, you will out of jail if you throw doubles. Or pay <DollarSign player={player[turn]} />50 fine, or use cards to get out.</div>
          );
          let index = Math.floor(Math.random() * 3);
          switch (index) {
            case 0 :
              this.handleGetOutOfJail('payJailFine');
              break;
            case 1 :
              if (player[turn].communityChestJailCard) this.handleGetOutOfJail('useCCFreeJailCard');
              break;
            case 2 :
              if (player[turn].chanceChestJailCard) this.handleGetOutOfJail('useChanceFreeJailCard');
              break;
            default :
              break;
          }
        }
        this.handleDiceRoll();            
      }
    });
  }

  addAlert = (text) => {
    let player = this.state.player;
    let turn = this.state.turn;
    let alert = this.state.alert;
    alert.push(text);
    if (player[turn].controlledBy === 'ai') {
      this.AIPopup(text);
    }
    this.setState({ alert: alert}, () => this.scrollToAlertRef());
  }

  scrollToAlertRef = () => {
    if (this.state.showBuy && !this.state.showSetup && !this.state.showAIPopup) {
      const scroll = this.alertContainer.current.scrollHeight - this.alertContainer.current.clientHeight;
      this.alertContainer.current.scrollTo(0, scroll);
    }  
  }

  addLanded = (text) => {
    let landed = this.state.landed;
    landed = text;
    this.setState({
      landed: landed,
      showLandedPanel: true
    });
  }

  handleShowDeed = (left, top, pos) => {
    let showDeed = this.state.showDeed;
    let showNormalDeed = this.state.showNormalDeed;
    let showMortgagedDeed = this.state.showMortgagedDeed;
    let showSpecialDeed = this.state.showSpecialDeed;
    let square = this.state.square;
    if (square[pos].group > 0) {
      showDeed = true;
      if (square[pos].isMortgaged) {
        showMortgagedDeed = true;
      } else {
        if (square[pos].group > 2) {
          showNormalDeed = true;
        } else {
          showSpecialDeed = true;
        }
      }   
    }
    this.setState({
      showDeed: showDeed,
      deedLeft: left,
      deedTop: top,
      deedPos: pos,
      showNormalDeed: showNormalDeed,
      showSpecialDeed: showSpecialDeed,
      showMortgagedDeed: showMortgagedDeed
    });
  }

  handleHideDeed = () => {
    this.setState({
      showDeed: false,
      showNormalDeed: false,
      showSpecialDeed: false,
      showMortgagedDeed: false,
      deedPos: -1
    });
  }

  handleConfirmBuy = () => {
    let player = this.state.player;
    let turn = this.state.turn;
    let square = this.state.square;
    if (player[turn].balance >= square[player[turn].position].price) {
      player[turn].balance -= square[player[turn].position].price;
      player[turn].properties.push(square[player[turn].position]);
      square[player[turn].position].owner = player[turn].name;
      square[player[turn].position].ownerID = player[turn].id;
      this.addAlert(
        <div>
          <PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> bought 
          <Square 
            square={square} 
            position={player[turn].position}
            onMouseEnter={this.handleShowDeed}
            onMouseLeave={this.handleHideDeed} 
          /> 
          for {square[player[turn].position].priceText}.
        </div>
      );
    } else {
      this.popup(
        <div>
          <div className='drawing fa fa-exclamation-circle' style={{color: '#f50c2b', fontSize: '50px'}}></div>
          <div style={{fontWeight: 'bold', fontSize: '16px', color: '#f50c2b'}}>Info</div>
          <div><p><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} />, the price of {square[player[turn].position].name} is {square[player[turn].position].priceText}, you don't have enough money to buy.</p></div>
          <div>
            <Button
              value='OK'
              onClick={this.closePopup}
              id='menuButton'
            />
          </div>
        </div>
      );
    }    
    this.setState({
      player: player,
      square: square,
      showLandedPanel: false
    });
  }

  handlePropertyStats = () => {
    this.setState({
      showPropertyStats: true
    });
  }

  handleStatsClose = () => {
    this.setState({
      showPropertyStats: false
    });
  }

  handleGoToJail = () => {
    let player = this.state.player;
    let turn = this.state.turn;
    player[turn].inJail = true;
    player[turn].position = 10;
    player[turn].doubleCount = 0;
    this.addAlert(
      <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> was sent directly to jail.</div>
    );
    this.addLanded(
      <div>You are in jail.</div>
    );
    this.setState({
      player: player,
      isTurnEnded: true,
      showPopup: false
    });
  }

  handleGetOutOfJail = (type) => {
    let player = this.state.player;
    let turn = this.state.turn;
    let square = this.state.square;
    let index = -1;
    player[turn].inJail = false;
    player[turn].jailRoll = 0;
    switch (type) {
      case 'payJailFine':
        player[turn].balance -= 50;
        this.addAlert(
          <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> paid the <DollarSign player={player[turn]} />50 fine. Out of jail.</div>
        );
        break;
      case 'useCCFreeJailCard':
        player[turn].communityChestJailCard = false;
        index = player[turn].properties.indexOf(square[40]);
        player[turn].properties.splice(index, 1);
        this.addAlert(
          <div>
            <PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> use the 
            <Square 
              square={square}
              position={40} 
              onMouseEnter={this.handleShowDeed}
              onMouseLeave={this.handleHideDeed}
            />. Out of jail.
          </div>
        );
        break;
      case 'useChanceFreeJailCard':
        player[turn].chanceChestJailCard = false;
        index = player[turn].properties.indexOf(square[41]);
        player[turn].properties.splice(index, 1);
        this.addAlert(
          <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> use the 
          <Square
            square={square} 
            position={41} 
            onMouseEnter={this.handleShowDeed}
            onMouseLeave={this.handleHideDeed}
          />. Out of jail.</div>
        );
        break;
      default:
        break;
    }
    this.closePopup();
    this.setState({
      player: player,
      turn: turn,
      showLandedPanel : false
    });
  }

  handleBankcruptcy = () => {
    console.log('bankcrupt starting');
    let player = this.state.player;
    let turn = this.state.turn;
    let pcount = this.state.pcount;
    let square = this.state.square;
    console.log('turn: ' + turn);
    console.log('playername: ' + player[turn].name);
    console.log('pcount: '+ pcount);

    if (player[turn].controlledBy !== 'ai') {
      this.addAlert(
        <div><PlayerIcon player={player[turn]} />  <PlayerName player={player[turn]} /> went bankcrutp. Out of the game.</div>
      );
    }
    square.forEach(element => {
      if (element.ownerID === turn) {
        element.ownerID = -1;
        element.owner = '';
        element.isMortgaged = false;
      }
    });
    for (let i = turn; i < pcount - 1; i++) {
      player[i] = player[i+1];
      player[i].id = i;
      player[i].properties.forEach(property => {
        property.ownerID = i;
      })
    }
    pcount--;
    player = player.splice(0, pcount);
    if (turn >= pcount) turn -= pcount; 
    console.log('turn: ' + turn);
    console.log('playerid: ' + player[turn].id);
    console.log('pcount: '+ pcount);   
    this.setState({
      square: square,
      player: player,
      turn: turn,
      pcount: pcount      
    }, () => {
      console.log('test0');
      if (pcount === 1) {
        console.log('test1');
        this.addAlert(
          <div>Congratulation, <PlayerIcon player={player[0]} />  <PlayerName player={player[0]} /> won the game.</div>
        );
        this.setState({
          showLandedPanel: false,
        }, () => {
          if (player[turn].controlledBy !== 'ai') {
            this.popup(
              <div>
                <div className='drawing fa fa-trophy' style={{color: '#b02f7c', fontSize: '50px'}}></div>
                <div style={{fontWeight: 'bold', fontSize: '16px', color: '#f50c2b'}}>Info</div>
                <div><p>Congratulation, <PlayerIcon player={player[0]} />  <PlayerName player={player[0]} />. You won the game.</p></div>
                <div>
                  <Button
                    value='Play Again'
                    onClick={this.handleWin}
                    id='menuButton'
                  />
                </div>
              </div>
            );
          }
        });
      } else {
        this.closePopup();
      }   
      if (pcount > 1) this.handleEndTurn(1);
    });
  }

  intervalID = null;

  handleWin = () => {
    //window.location.reload();
    console.log('win');
    clearInterval(this.intervalID);
  }

  handleManage = () => {
    this.setState({
      showBuy: false
    });
  }

  
  handleBuy = () => {
    this.setState({
      showBuy: true
    });
  }

  handleShowTradePanel = () => {
    let turn = this.state.turn;
    let tradeOpponentID = this.state.tradeOpponentID;
    let pcount = this.state.pcount;
    tradeOpponentID = turn + 1;
    if (tradeOpponentID >= pcount) tradeOpponentID -= pcount;
    this.setState({
      showTradePanel: true,
      tradeOpponentID: tradeOpponentID
    });
  }

  handleHideTradePanel = () => {
    this.setState({
      showTradePanel: false,
      hideTradePlayerSelect: false
    });
  }

  handleTradeOpponentID = (id) => {
    let tradeOpponentID = this.state.tradeOpponentID;
    tradeOpponentID = id;
    this.setState({ tradeOpponentID: tradeOpponentID });
  }

  render() {
    const handleClick = () => {
      this.state.pcount === 1 ? this.handleWin() : (this.state.player[this.state.turn].balance < 0 ? this.handleBankcruptcy() : this.handleEndTurn(0));
    }
    const autoTest = () => {
      this.intervalID = setInterval(() => {
        handleClick();
      }, 2000);
    }
    const AIText =  <div>
                      <div className='drawing fa fa-exclamation-circle' style={{color: '#f50c2b', fontSize: '50px'}}></div>
                      <div style={{fontWeight: 'bold', fontSize: '16px', color: '#f50c2b'}}>Info</div>
                      {this.state.AIPopupText.map((text, index) => {
                        return (
                          <div key={index}>{text}</div>
                        );
                      })}
                      <div style={{marginTop: '10px'}}>
                        <Button
                          value={this.state.pcount === 1 ? 'Play Again' : 'OK'}
                          onClick={this.state.allAI ?  autoTest : handleClick}
                          id='menuButton'
                        />
                      </div> 
                    </div>
    return (
      <div className='home'>
        {this.state.showSetup ?
          <Setup
            pcount={this.state.pcount} 
            handlePlayerCountChange={this.handlePlayerCountChange}
            handleStartButton={this.handleStartButton}
            handleNameChange={this.handleNameChange}
            handleColorChange={this.handleColorChange}
            handleControlChange={this.handleControlChange}
            player={this.state.player}
          />
        : null}        
        {this.state.showPopup ? 
          <Popup text={this.state.popupText} />
        : null}
        {this.state.showAIPopup ?
          <Popup text={AIText} />
        : null}
        {this.state.showPropertyStats ?        
          <Stats 
            handleStatsClose={this.handleStatsClose}
            pcount={this.state.pcount}
            player={this.state.player}
            turn={this.state.turn}
            handleShowDeed={this.handleShowDeed}
            handleHideDeed={this.handleHideDeed}
          /> 
        : null}        
        {this.state.showDeed ?  
          <Deed 
            showNormalDeed={this.state.showNormalDeed}
            showMortgagedDeed={this.state.showMortgagedDeed}
            showSpecialDeed={this.state.showSpecialDeed}
            deedLeft={this.state.deedLeft}
            deedTop={this.state.deedTop}
            deedPos={this.state.deedPos}
            square={this.state.square}
            player={this.state.player}
          /> 
        : null}
        {!this.state.showSetup ?
          <MoneyBar 
            turn={this.state.turn}
            handlePropertyStats={this.handlePropertyStats}
            player={this.state.player}
          />
        : null}        
        <Board 
          pcount={this.state.pcount}
          handleDiceRoll={this.handleDiceRoll}
          dice={this.state.dice}
          alert={this.state.alert}
          handleEndTurn={this.handleEndTurn}
          turn={this.state.turn}
          player={this.state.player}
          handleShowDeed={this.handleShowDeed}
          showDeed={this.state.showDeed}
          handleHideDeed={this.handleHideDeed}
          handleConfirmBuy={this.handleConfirmBuy}
          showLandedPanel={this.state.showLandedPanel}
          landed={this.state.landed}
          isTurnEnded={this.state.isTurnEnded}
          alertContainer={this.alertContainer}
          showPayJailFineButton={this.state.showPayJailFineButton}
          handleGetOutOfJail={this.handleGetOutOfJail}
          square={this.state.square}
          showSetup={this.state.showSetup}
          showCommunityChestCard={this.state.showCommunityChestCard}
          showChanceCard={this.state.showChanceCard}
          cardText={this.state.cardText}
          handleManage={this.handleManage}
          showPopup={this.state.showPopup}
          showBuy={this.state.showBuy}
          handleBuy={this.handleBuy}
          propertyChecked={this.state.propertyChecked}
          handlePropertyCheckedChange={this.handlePropertyCheckedChange}
          showOptionButton={this.state.showOptionButton}
          handleMortgage={this.handleMortgage}
          handleUnMortgage={this.handleUnMortgage}
          showUnMortgageButton={this.state.showUnMortgageButton}
          showTradePanel={this.state.showTradePanel}
          handleShowTradePanel={this.handleShowTradePanel}
          handleHideTradePanel={this.handleHideTradePanel}
          handleTradeOpponentID={this.handleTradeOpponentID}
          tradeOpponentID={this.state.tradeOpponentID}
          tradeOwnPropertyChecked={this.state.tradeOwnPropertyChecked}
          tradeOpponentPropertyChecked={this.state.tradeOpponentPropertyChecked}
          handleTradeOwnPropertyCheckedChange={this.handleTradeOwnPropertyCheckedChange}
          handleTradeOpponentPropertyCheckedChange={this.handleTradeOpponentPropertyCheckedChange}
          tradeOwnAmount={this.state.tradeOwnAmount}
          tradeOpponentAmount={this.state.tradeOpponentAmount}
          handleTradeAmountChange={this.handleTradeAmountChange}
          popup={this.popup}
          handleOfferContent={this.handleOfferContent}
          hideTradePlayerSelect={this.state.hideTradePlayerSelect}
          showTradeResponseButton={this.state.showTradeResponseButton}
          handleRejectTrade={this.handleRejectTrade}
          handleAcceptTrade={this.handleAcceptTrade}
          showPropertyStats={this.state.showPropertyStats}
          handleModifyTrade={this.handleModifyTrade}
          tradeResponseToggle={this.state.tradeResponseToggle}
          showBuyHouseButton={this.state.showBuyHouseButton}
          handleBuyHouse={this.handleBuyHouse}
          handleSellHouse={this.handleSellHouse}
          handleAuction={this.handleAuction}
          handleResign={this.handleResign}
          houseSum={this.state.houseSum}
          hotelSum={this.state.hotelSum}
          showAIPopup={this.state.showAIPopup}
        />
      </div>
    );
  }
}