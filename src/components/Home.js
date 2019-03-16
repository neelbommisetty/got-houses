import React, { Component } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import HouseCard from './HouseCard';

const cache = {}; // resource url to response;

export default class Home extends Component {
  state = {
    houses: [],
    page: 1,
    lastPage: false
  }

  getCharacterOrHouse(url) {
    if (!url) {
      return;
    }
    if (cache[url]) {
      return new Promise((resolve) => resolve(cache[url]));
    }
    return fetch(url).then(res => res.json()).then(res => {
      cache[url] = res;
    });
  }

  fetchHouses = () => {
    const { page } = this.state;
    NProgress.start();
    return fetch(`https://www.anapioficeandfire.com/api/houses?pageSize=10&page=${page}`)
      .then(res => res.json())
      .then(async res => {
        if (res.length < 10) {
          this.setState({
            lastPage: true,
          });
        } else {
          this.setState({
            lastPage: false,
          });
        }
        NProgress.inc();
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
        NProgress.done();
      })
  }

  componentDidMount() {
    this.fetchHouses();
  }

  fetchPreviousPage = () => {
    this.setState({
      page: this.state.page - 1,
    });
    this.fetchHouses();
  }
  fetchNextPage = () => {
    this.setState({
      page: this.state.page + 1,
    });
    this.fetchHouses();
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
          <nav className="pagination" role="navigation" aria-label="pagination">
            <button disabled={this.state.page === 1} className="pagination-previous" onClick={this.fetchPreviousPage}>Previous</button>
            <button disabled={this.state.lastPage} className="pagination-next" onClick={this.fetchNextPage}>Next page</button>
            </nav>
        </div>
      </div>
    )
  }
}
