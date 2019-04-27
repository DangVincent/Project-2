import React, { Component } from 'react';
import RAM_API_URL from '../constants/ram_api'

class LocationGenerator extends Component{

	constructor() {
		super();
		this.state = {
			locations: [],
			page: 1,
	        totalPages: 1,
	        searchTerm: '',
	        searching: false,
	        searched: false
		}
	}

	firstLocationRef = React.createRef();

	//calls the renderLoader function when a user makes an input
    handleSearchInput = renderLoader(searchTerm => this.setState({ page: 1, searchTerm, searching: true }, this.fetchLocations));

    //fetches location information from the API URL 
    fetchLocations = () => {
        fetch(`${RAM_API_URL}/location/?page=${this.state.page}&name=${this.state.searchTerm}`)
            .then(res => res.json())
            .then(data => this.setState({
                totalPages: data.info.pages,
                locations: data.results,
                searching: false,
                searched: true
            }))
            .then(() => this.firstLocationRef.current.focus())
            .catch(() => this.setState({
                page: 1,
                totalPages: 1,
                locations: [],
                searching: false,
                searched: true
            }));
    }

    //sets the state for next or previous page change
    changePage = e => {
        Array.from(e.target.classList).includes('page-btn-next') ?
            this.setState(prevState => ({ page: prevState.page + 1 }), this.fetchLocations) :
            this.setState(prevState => ({ page: prevState.page - 1 }), this.fetchLocations);
    }

	render() {

		const {searching, searched, locations, totalPages, page} = this.state;

		return (
			<section className='wrapper'>
				<SearchInput handleSearchInput={ e => this.handleSearchInput(e.target.value.replace(" ", "+")) } />
                { searching ? <div className="search-loader" /> : null }
                { searched && !searching ? <SearchOutput locations={ locations } firstLocationRef={ this.firstLocationRef } /> : null }
                { totalPages > 1 && !searching ? <PageNavigation page={ page } totalPages={ totalPages } changePage={ this.changePage } /> : null }
			</section>
		);
	}
}

//allows user to search for locations through a search bar 
function SearchInput({ handleSearchInput }) {
    return (
        <div className="search">
            <label htmlFor="search-input" className="search-input-label">Location Search:</label>
            <input type="text" id="search-input" className="search-input" placeholder="Enter a location name" spellCheck="false" onChange={ handleSearchInput } />
        </div>
    );
}

//controls whether or not a result was found through the user's location inquiry
function SearchOutput({ locations, firstLocationRef }) {
    return (
        <div className="search-output">
            {
                locations.length > 0 ?
                    locations.map((location, index) => <Location location={ location } key={ location.id } index={ index } firstLocationRef={ firstLocationRef } />) :
                    <p className="no-results">No Results Found</p>
            }
        </div>
    );
}

//displays the searched location's information in its own container
function Location({ location, firstLocationRef, index }) {
    return (
        <details className="searched-term-details" >
            <summary className="searched-term-summary" ref={ index === 0 ? firstLocationRef : null }>{ location.name }</summary>
            <div className="searched-term-container">
                <div className="searched-term-info">

                    <details className="searched-term-info-item" open>
                        <summary className="searched-term-info-item-summary">Name</summary>
                        <p className="searched-term-info-item-data">{ location.name }</p>
                    </details>

                    <details className="searched-term-info-item" open>
                        <summary className="searched-term-info-item-summary">Type</summary>
                        <p className="searched-term-info-item-data">{ location.type }</p>
                    </details>

                    <details className="searched-term-info-item" open>
                        <summary className="searched-term-info-item-summary">Gender</summary>
                        <p className="searched-term-info-item-data">{ location.dimension }</p>
                    </details>

                </div>
            </div>
        </details>
    );
}

//allows user to change through different pages of the searched location
function PageNavigation({ page, totalPages, changePage }) {
    return (
        <div className="page-navigation">
            { page > 1 ? <button className="page-btn page-btn-prev" onClick={ changePage }>Prev Page</button> : null }
            { page < totalPages ? <button className="page-btn page-btn-next" onClick={ changePage }>Next Page</button> : null }
        </div>
    );
}

//allows the searched location to have a loading time while rendering
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

export default LocationGenerator;