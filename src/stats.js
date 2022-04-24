import React from "react";
import { PlayerName } from "./moneybar";
import { PlayerIcon } from "./setup";
import { Owned } from './board';

export default class Stats extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div id='statsbackground'></div>
        <div className='statswrap'>
          <div className='stats'>
            <div className='stats-layout'>
              <i className='fa fa-times-circle' id='statsclose' title='Close' onClick={this.props.handleStatsClose} />
              <div id='statstext'>
              <table style={{display: 'inline-table'}}>
                  <tbody >
                    <tr>
                      {this.props.player.map((player, index) => { 
                        return (                        
                          <td className='statscell' key={index} style={{border: '2px solid', borderColor: player.color}}>
                            <div className='statsplayername'>
                              <PlayerIcon player={player} />
                              <PlayerName player={player} />
                            </div>
                            <Owned 
                              player={this.props.player}
                              turn={index}
                              handleShowDeed={this.props.handleShowDeed}
                              handleHideDeed={this.props.handleHideDeed}
                              showCheckBox={false}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>

                </table>
              </div>
              <div id='statsdrag'></div>
            </div>
          </div>
        </div>
      </React.Fragment>      
    );
  }
}


