import React, { Component } from 'react';
import RAM_API_URL from '../constants/ram_api'

class EpisodeGenerator extends Component{

	constructor() {
		super();
		this.state = {
			episodes: [],
			page: 1,
	        totalPages: 1,
	        searchTerm: '',
	        searching: false,
	        searched: false
		}
	}

	firstEpisodeRef = React.createRef();

	//calls the renderLoader function when a user makes an input
    handleSearchInput = renderLoader(searchTerm => this.setState({ page: 1, searchTerm, searching: true }, this.fetchEpisodes));

    //fetches episode information from the API URL 
    fetchEpisodes = () => {
        fetch(`${RAM_API_URL}/episode/?page=${this.state.page}&name=${this.state.searchTerm}`)
            .then(res => res.json())
            .then(data => this.setState({
                totalPages: data.info.pages,
                episodes: data.results,
                searching: false,
                searched: true
            }))
            .then(() => this.firstEpisodeRef.current.focus())
            .catch(() => this.setState({
                page: 1,
                totalPages: 1,
                episodes: [],
                searching: false,
                searched: true
            }));
    }

    //sets the state for next or previous page change
    changePage = e => {
        Array.from(e.target.classList).includes('page-btn-next') ?
            this.setState(prevState => ({ page: prevState.page + 1 }), this.fetchEpisodes) :
            this.setState(prevState => ({ page: prevState.page - 1 }), this.fetchEpisodes);
    }

	render() {

		const {searching, searched, episodes, totalPages, page} = this.state;

		return (
			<section className='wrapper'>
				<SearchInput handleSearchInput={ e => this.handleSearchInput(e.target.value.replace(" ", "+")) } />
                { searching ? <div className="search-loader" /> : null }
                { searched && !searching ? <SearchOutput episodes={ episodes } firstEpisodeRef={ this.firstEpisodeRef } /> : null }
                { totalPages > 1 && !searching ? <PageNavigation page={ page } totalPages={ totalPages } changePage={ this.changePage } /> : null }
			</section>
		);
	}
}

//allows user to search for episodes through a search bar 
function SearchInput({ handleSearchInput }) {
    return (
        <div className="search">
            <label htmlFor="search-input" className="search-input-label">Episode Search:</label>
            <input type="text" id="search-input" className="search-input" placeholder="Enter an episode name" spellCheck="false" onChange={ handleSearchInput } />
        </div>
    );
}

//controls whether or not a result was found through the user's episode inquiry
function SearchOutput({ episodes, firstEpisodeRef }) {
    return (
        <div className="search-output">
            {
                episodes.length > 0 ?
                    episodes.map((episode, index) => <Episode episode={ episode } key={ episode.id } index={ index } firstEpisodeRef={ firstEpisodeRef } />) :
                    <p className="no-results">No Results Found</p>
            }
        </div>
    );
}

//displays the searched episode's information in its own container
function Episode({ episode, firstEpisodeRef, index }) {
    return (
        <details className="searched-term-details" >
            <summary className="searched-term-summary" ref={ index === 0 ? firstEpisodeRef : null }>{ episode.name }</summary>
            <div className="searched-term-container">
                <div className="searched-term-info">

                    <details className="searched-term-info-item" open>
                        <summary className="searched-term-info-item-summary">Name</summary>
                        <p className="searched-term-info-item-data">{ episode.name }</p>
                    </details>

                    <details className="searched-term-info-item" open>
                        <summary className="searched-term-info-item-summary">Air Date</summary>
                        <p className="searched-term-info-item-data">{ episode.air_date }</p>
                    </details>

                    <details className="searched-term-info-item" open>
                        <summary className="searched-term-info-item-summary">Episode</summary>
                        <p className="searched-term-info-item-data">{ episode.episode }</p>
                    </details>

                </div>
            </div>
        </details>
    );
}

//allows user to change through different pages of the searched episode
function PageNavigation({ page, totalPages, changePage }) {
    return (
        <div className="page-navigation">
            { page > 1 ? <button className="page-btn page-btn-prev" onClick={ changePage }>Prev Page</button> : null }
            { page < totalPages ? <button className="page-btn page-btn-next" onClick={ changePage }>Next Page</button> : null }
        </div>
    );
}

//allows the searched episode to have a loading time while rendering
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

export default EpisodeGenerator;