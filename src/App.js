import React, { Component } from 'react';
import './App.scss';
import Header from './components/Header';
import Main from './components/Main';
import CharacterGenerator from './components/CharacterGenerator';
import LocationGenerator from './components/LocationGenerator';
import EpisodeGenerator from './components/EpisodeGenerator';
import Footer from './components/Footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Main />
        <section className='wrapper'>
          <CharacterGenerator />
        </section>
        <section>
          <LocationGenerator />
        </section>
        <section>
          <EpisodeGenerator />
        </section>
        <Footer />
      </div>
    );
  }
}

export default App;
