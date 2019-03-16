import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './HouseCard.css';

const regionToClassName = {
  'Dorne': 'dorne',
  'The North': 'north',
  'The Reach': 'reach',
  'The Crownlands': 'crownlands',
  'The Westerlands': 'westerlands',
  'The Vale': 'vale',
  'The Riverlands': 'riverlands',
  'The Stormlands': 'stormlands',
  'Iron Islands': 'ironislands'
}

export default class HouseCard extends Component {
  static propTypes = {
    house: PropTypes.object.isRequired,
  }

  render() {
    const { house } = this.props;
    return (
      <div className="card">
        <div className="card-header">
          <div className={`card-header-title is-centered ${regionToClassName[house.region]}`}>{house.name} {house.diedOut ? `(Died out in ${house.diedOut})` : ''}</div>
        </div>
        <div className="card-content has-text-left">
            <ul>
              <li><b>Founder:</b> {house.founder ? house.founder.name: '-'} </li>
              <li><b>Current Lord:</b> {house.currentLord ? house.currentLord.name: '-'} </li>
              <li><b>Overlord:</b> {house.overlord ? house.overlord.name: '-'} </li>
              <li><b>Heir:</b> {house.heir ? house.heir.name : '-'} </li>
              <li><b>Region:</b> {house.region || '-'}</li>
            <li><b>Coat of Arms:</b> {house.coatOfArms || '-'}</li>
            <li><b>Titles:</b> {house.titles.length ? house.titles.join(',') : '-'}</li>
          </ul>
          </div>
      </div>
    )
  }
}
