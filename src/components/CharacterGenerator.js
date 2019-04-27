import React, { Component } from 'react';
import RAM_API_URL from '../constants/ram_api'

class CharacterGenerator extends Component{

	constructor() {
		super();
		this.state = {
	        characters: [],
			page: 1,
	        totalPages: 1,
	        searchTerm: '',
	        searching: false,
	        searched: false
		}
	}

	firstCharacterRef = React.createRef();

	//calls the renderLoader function when a user makes an input
    handleSearchInput = renderLoader(searchTerm => this.setState({ page: 1, searchTerm, searching: true }, this.fetchCharacters));

    //fetches character information from the API URL 
    fetchCharacters = () => {
        fetch(`${RAM_API_URL}/character/?page=${this.state.page}&name=${this.state.searchTerm}`)
            .then(res => res.json())
            .then(data => this.setState({
                totalPages: data.info.pages,
                characters: data.results,
                searching: false,
                searched: true
            }))
            .then(() => this.firstCharacterRef.current.focus())
            .catch(() => this.setState({
                page: 1,
                totalPages: 1,
                characters: [],
                searching: false,
                searched: true
            }));
    }

    //sets the state for next or previous page change
    changePage = e => {
        Array.from(e.target.classList).includes('page-btn-next') ?
            this.setState(prevState => ({ page: prevState.page + 1 }), this.fetchCharacters) :
            this.setState(prevState => ({ page: prevState.page - 1 }), this.fetchCharacters);
    }

	render() {

		const {searching, searched, characters, totalPages, page} = this.state;

		return (
			<section className='wrapper'>
				<SearchInput handleSearchInput={ e => this.handleSearchInput(e.target.value.replace(" ", "+")) } />
                { searching ? <div className="search-loader" /> : null }
                { searched && !searching ? <SearchOutput characters={ characters } firstCharacterRef={ this.firstCharacterRef } /> : null }
                { totalPages > 1 && !searching ? <PageNavigation page={ page } totalPages={ totalPages } changePage={ this.changePage } /> : null }
			</section>
		);
	}
}

//allows user to search for characters through a search bar 
function SearchInput({ handleSearchInput }) {
    return (
        <div className="search">
            <label htmlFor="search-input" className="search-input-label">Character Search:</label>
            <input type="text" id="search-input" className="search-input" placeholder="Enter a character's name" spellCheck="false" onChange={ handleSearchInput } />
        </div>
    );
}

//controls whether or not a result was found through the user's character inquiry
function SearchOutput({ characters, firstCharacterRef }) {
    return (
        <div className="search-output">
            {
                characters.length > 0 ?
                    characters.map((character, index) => <Character character={ character } key={ character.id } index={ index } firstCharacterRef={ firstCharacterRef } />) :
                    <p className="no-results">No Results Found</p>
            }
        </div>
    );
}

//displays the searched character's information in its own container
function Character({ character, firstCharacterRef, index }) {
    return (
        <details className="searched-term-details" >
            <summary className="searched-term-summary" ref={ index === 0 ? firstCharacterRef : null }>{ character.name }</summary>
            <div className="searched-term-container">
                <div className="searched-term-info">

                    <details className="searched-term-info-item" open>
                        <summary className="searched-term-info-item-summary">Name</summary>
                        <p className="searched-term-info-item-data">{ character.name }</p>
                    </details>

                    <details className="searched-term-info-item" open>
                        <summary className="searched-term-info-item-summary">Species</summary>
                        <p className="searched-term-info-item-data">{ character.species }</p>
                    </details>

                    <details className="searched-term-info-item" open>
                        <summary className="searched-term-info-item-summary">Status</summary>
                        <p className="searched-term-info-item-data">{ character.status }</p>
                    </details>

                    <details className="searched-term-info-item" open>
                        <summary className="searched-term-info-item-summary">Gender</summary>
                        <p className="searched-term-info-item-data">{ character.gender }</p>
                    </details>

                    <details className="searched-term-info-item" open>
                        <summary className="searched-term-info-item-summary">Origin</summary>
                        <p className="searched-term-info-item-data">{ character.origin.name }</p>
                    </details>

                    <details className="searched-term-info-item" open>
                        <summary className="searched-term-info-item-summary">Location</summary>
                        <p className="searched-term-info-item-data">{ character.location.name }</p>
                    </details>

                </div>
                <div className="character-image-container">
                    <img className="character-image" src={ character.image } alt={ character.name } />
                </div>
            </div>
        </details>
    );
}

//allows user to change through different pages of the searched character
function PageNavigation({ page, totalPages, changePage }) {
    return (
        <div className="page-navigation">
            { page > 1 ? <button className="page-btn page-btn-prev" onClick={ changePage }>Prev Page</button> : null }
            { page < totalPages ? <button className="page-btn page-btn-next" onClick={ changePage }>Next Page</button> : null }
        </div>
    );
}

//allows the searched character to have a loading time while rendering
function renderLoader(func, wait = 800) {

    let timeout;

    return function () {

        const context = this,
            args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = null;
            func.apply(context, args);
        }, wait);
    };
}

export default CharacterGenerator;