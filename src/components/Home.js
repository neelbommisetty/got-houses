import React, { Component } from 'react'
import HouseCard from './HouseCard';

export default class Home extends Component {
  state = {
    houses : []
  }

  getCharacterOrHouse(url) {
    if (!url) {
      return;
    }
    return fetch(url).then(res => res.json());
  }

  componentDidMount() {
    fetch('https://www.anapioficeandfire.com/api/houses?pageSize=10&hasDiedOut=true')
      .then(res => res.json())
      .then(async res => {
        return Promise.all(res.map(async house => {
          const currentLord = await this.getCharacterOrHouse(house.currentLord);
          const overlord = await this.getCharacterOrHouse(house.overlord);
          const heir = await this.getCharacterOrHouse(house.heir);
          const founder = await this.getCharacterOrHouse(this.founder);
          return {
            ...house,
            currentLord,
            overlord,
            founder,
            heir
          }
        }));
      })
      .then(res => {
        this.setState({
          houses: res,
        });
      })
  }
  render() {
    return (
      <div className="container">
        <header>
          <h1 className="title is-1">
            Houses
          </h1>
        </header>
        <div className="content">
          <div className="columns is-multiline">
          {this.state.houses && this.state.houses.map((house, index) => (
            <div className="column is-half-desktop is-full-mobile"  key={index}>
              <HouseCard house={house}></HouseCard>
            </div>
          ))}
          </div>
        </div>
      </div>
    )
  }
}
