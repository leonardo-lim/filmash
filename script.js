// Selectors
const pageLoading = document.querySelector('#page-loading');
const fetchLoading = document.querySelector('#fetch-loading');
const searchBox = document.querySelector('#search-box');
const searchButton = document.querySelector('#search-btn');
const searchResult = document.querySelector('#search-result');
const searchResultDesc = document.querySelector('#search-result #desc');
const searchResultMovie = document.querySelector('#search-result #movie');
const homepage = document.querySelector('#homepage');
const seeButton = document.querySelector('#see-btn');
const content = document.querySelector('#content');
const topRatedMovie = document.querySelector('#content #movie');
const topRatedTvShow = document.querySelector('#content #tv-show');
const modal = document.querySelector('#modal');
const copyright = document.querySelector('#copyright');
const upButton = document.querySelector('#up-btn');

// Variables
const apiKey = 'c12f2370';
let isDown = false;
let startX, scrollLeft;

// Event Listeners
window.addEventListener('load', () => {
    setTimeout(() => {
        let height = window.innerHeight;
        pageLoading.style.transform = `translateY(-${height}px)`;
    }, 1000);

    setTimeout(() => {
        pageLoading.style.display = 'none';
    }, 2000);
});

searchButton.addEventListener('click', () => {
    let movie = searchBox.value;
    if (movie.length) getMovieData(movie);
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (searchBox === document.activeElement) {
            let movie = searchBox.value;
            if (movie.length) getMovieData(movie);
        }
    } else if (e.key === '/') {
        searchBox.focus();
    }
});

seeButton.addEventListener('click', () => {
    let height = window.innerHeight;
    window.scrollTo(0, height);
});

upButton.addEventListener('click', () => {
    window.scrollTo(0, 0);
});

topRatedMovie.addEventListener('mousedown', movieStart);
topRatedMovie.addEventListener('touchstart', movieStart);
topRatedMovie.addEventListener('mousemove', movieMove);
topRatedMovie.addEventListener('touchmove', movieMove);
topRatedMovie.addEventListener('mouseleave', movieEnd);
topRatedMovie.addEventListener('mouseup', movieEnd);
topRatedMovie.addEventListener('touchend', movieEnd);
topRatedTvShow.addEventListener('mousedown', tvShowStart);
topRatedTvShow.addEventListener('touchstart', tvShowStart);
topRatedTvShow.addEventListener('mousemove', tvShowMove);
topRatedTvShow.addEventListener('touchmove', tvShowMove);
topRatedTvShow.addEventListener('mouseleave', tvShowEnd);
topRatedTvShow.addEventListener('mouseup', tvShowEnd);
topRatedTvShow.addEventListener('touchend', tvShowEnd);

// Function
function movieStart(e) {
    isDown = true;
    topRatedMovie.classList.add('active');
    startX = e.pageX || e.touches[0].pageX - topRatedMovie.offsetLeft;
    scrollLeft = topRatedMovie.scrollLeft;
    topRatedMovie.style.cursor = 'grabbing';
}

function tvShowStart(e) {
    isDown = true;
    topRatedTvShow.classList.add('active');
    startX = e.pageX || e.touches[0].pageX - topRatedTvShow.offsetLeft;
    scrollLeft = topRatedTvShow.scrollLeft;
    topRatedTvShow.style.cursor = 'grabbing';
}

function movieMove(e) {
    if (isDown) {
        e.preventDefault();
        let x = e.pageX || e.touches[0].pageX - topRatedMovie.offsetLeft;
        let dist = x - startX;
        topRatedMovie.scrollLeft = scrollLeft - dist;
        topRatedMovie.style.cursor = 'grabbing';
    } else {
        topRatedMovie.style.cursor = 'grab';
    }
}

function tvShowMove(e) {
    if (isDown) {
        e.preventDefault();
        let x = e.pageX || e.touches[0].pageX - topRatedTvShow.offsetLeft;
        let dist = x - startX;
        topRatedTvShow.scrollLeft = scrollLeft - dist;
        topRatedTvShow.style.cursor = 'grabbing';
    } else {
        topRatedTvShow.style.cursor = 'grab';
    }
}

function movieEnd() {
    isDown = false;
    topRatedMovie.classList.remove('active');
    topRatedMovie.style.cursor = 'default';
}

function tvShowEnd() {
    isDown = false;
    topRatedTvShow.classList.remove('active');
    topRatedTvShow.style.cursor = 'default';
}

function minToHour(runtime) {
    let minute = 0, hour = 0;

    for (let i = 0; i < runtime.length; i++) {
        if (runtime[i] >= '0' && runtime[i] <= '9') {
            minute *= 10;
            minute += parseInt(runtime[i]);
        } else {
            break;
        }
    }

    while (minute >= 60) {
        minute -= 60;
        hour++;
    }

    return [hour, minute];
}

function getTopRated() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => showTopRated(data));
}

function showTopRated(data) {
    const {Actors, Awards, BoxOffice, Country, Director, Genre, Language, Plot, Poster, Rated, Released, Runtime, Title, Writer, Year, imdbRating} = data;

    for (let i = 0; i < 8; i++) {
        topRatedMovie.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <span class="rated">${data[i].Rated}</span>
                    <div class="poster">
                        <img src="${data[i].Poster}" alt="${data[i].Title}">
                    </div>
                    <h3 class="title">${data[i].Title}</h3>
                    <hr>
                    <div class="info">
                        <span class="year"><i class="fa fa-calendar"></i> ${data[i].Year}</span>
                        <span class="rating"><i class="fa fa-star"></i> ${data[i].imdbRating}</span>
                    </div>
                    <button type="button" class="detail-btn">See Details</button>
                </div>
            </div>
        `;
    }

    for (let i = 8; i < 16; i++) {
        topRatedTvShow.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <span class="rated">${data[i].Rated}</span>
                    <div class="poster">
                        <img src="${data[i].Poster}" alt="${data[i].Title}">
                    </div>
                    <h3 class="title">${data[i].Title}</h3>
                    <hr>
                    <div class="info">
                        <span class="year"><i class="fa fa-calendar"></i> ${data[i].Year}</span>
                        <span class="rating"><i class="fa fa-star"></i> ${data[i].imdbRating}</span>
                    </div>
                    <button type="button" class="detail-btn">See Details</button>
                </div>
            </div>
        `;
    }

    const detailButton = document.querySelectorAll('.detail-btn');

    for (let i = 0; i < data.length; i++) {
        detailButton[i].addEventListener('click', () => {
            let time = minToHour(data[i].Runtime);

            modal.style.display = 'flex';
            modal.innerHTML = `
                <button type="button" class="close-btn" id="close-btn" title="Close"><i class="fa fa-times"></i></button>
                <div class="left">
                    <div class="poster">
                        <img src="${data[i].Poster}" alt="${data[i].Title}'s poster">
                    </div>
                </div>
                <div class="right">
                    <h1>${data[i].Title}</h1>
                    <p>${data[i].Plot}</p>
                    <hr>
                    <h3><i class="fa fa-user-tie" title="Director"></i> ${data[i].Director}</h3>
                    <h3><i class="fa fa-user" title="Actors"></i> ${data[i].Actors}</h3>
                    <h3><i class="fa fa-pen-alt" title="Writer"></i> ${data[i].Writer}</h3>
                    <h3><i class="fa fa-medal" title="Awards"></i> ${data[i].Awards}</h3>
                    <h3><i class="fa fa-money-bill" title="BoxOffice"></i> ${data[i].BoxOffice}</h3>
                    <h3><i class="fa fa-globe" title="Country"></i> ${data[i].Country}</h3>
                    <h3><i class="fa fa-language" title="Language"></i> ${data[i].Language}</h3>
                    <h3><i class="fa fa-film" title="Genre"></i> ${data[i].Genre}</h3>
                    <h3><i class="fa fa-circle" title="Rated"></i> ${data[i].Rated}</h3>
                    <h3><i class="fa fa-calendar" title="Released"></i> ${data[i].Released}</h3>
                    <h3><i class="fa fa-clock" title="Runtime"></i> ${time[0]}h ${time[1]}m</h3>
                    <h3><i class="fa fa-star" title="Rating"></i> ${data[i].imdbRating}</h3>
                </div>
            `;

            const closeButton = document.querySelector('#close-btn');

            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        });
    }
}

function getMovieData(movie) {
    fetchLoading.style.display = 'block';

    fetch(`https://omdbapi.com/?apikey=${apiKey}&s=${movie}`)
        .then(response => response.json())
        .then(data => {
            fetchLoading.style.display = 'none';

            if (data.Response === 'True') {
                showMovieData(data.Search);
            } else {
                throw new Error(data.Error);
            }
        })   
        .catch(error => showError(error.message));
}

function showMovieData(data) {
    const {Poster, Title, Year} = data;

    searchResult.style.display = 'block';

    if (data.length > 1) {
        searchResultDesc.innerHTML = `
            <button type="button" class="back-btn" id="back-btn" title="Back"><i class="fa fa-arrow-left"></i></button>
            <div class="left">
                <img src="img/search-result.png" alt="Search Result">
            </div>
            <div class="right">
                <h1>Showing ${data.length}</h1>
                <h1>results for</h1>
                <h1>${searchBox.value}</h1>
            </div>
        `;
    } else {
        searchResultDesc.innerHTML = `
            <button type="button" class="back-btn" id="back-btn" title="Back"><i class="fa fa-arrow-left"></i></button>
            <div class="left">
                <img src="img/search-result.png" alt="Search Result">
            </div>
            <div class="right">
                <h1>Showing ${data.length}</h1>
                <h1>result for</h1>
                <h1>${searchBox.value}</h1>
            </div>
        `;
    }

    searchBox.blur();
    searchBox.value = '';
    homepage.style.display = 'none';
    content.style.display = 'none';
    searchResultMovie.innerHTML = '';

    for (let d of data) {
        searchResultMovie.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <div class="poster">
                        <img src="${d.Poster}" alt="${d.Title}">
                    </div>
                    <h3 class="title">${d.Title}</h3>
                    <hr>
                    <span class="year"><i class="fa fa-calendar"></i> ${d.Year}</span>
                    <button type="button" class="detail-btn">See Details</button>
                </div>
            </div>
        `;
    }

    const backButton = document.querySelector('#back-btn');
    const detailButton = document.querySelectorAll('.detail-btn');

    backButton.addEventListener('click', () => {
        searchResultDesc.innerHTML = '';
        searchResultMovie.innerHTML = '';
        searchResult.style.display = 'none';
        homepage.style.display = 'flex';
        content.style.display = 'block';
    });

    for (let i = 0; i < data.length; i++) {
        detailButton[i].addEventListener('click', () => {
            getMovieDetail(data[i].imdbID);
        });
    }
}

function getMovieDetail(imdbId) {
    fetchLoading.style.display = 'block';

    fetch(`https://omdbapi.com/?apikey=${apiKey}&i=${imdbId}`)
        .then(response => response.json())
        .then(data => {
            fetchLoading.style.display = 'none';

            if (data.Response === 'True') {
                showMovieDetail(data);
            } else {
                throw new Error(data.Error);
            }
        })
        .catch(error => showError(error.message));
}

function showMovieDetail(data) {
    const {Actors, Awards, BoxOffice, Country, Director, Genre, Language, Plot, Poster, Rated, Released, Runtime, Title, Writer, Year, imdbRating} = data;
    
    let time = minToHour(data.Runtime);
    modal.style.display = 'flex';

    modal.innerHTML = `
        <button type="button" class="close-btn" id="close-btn" title="Close"><i class="fa fa-times"></i></button>
        <div class="left">
            <div class="poster">
                <img src="${data.Poster}" alt="${data.Title}">
            </div>
        </div>
        <div class="right">
            <h1>${data.Title}</h1>
            <p>${data.Plot}</p>
            <hr>
            <h3><i class="fa fa-user-tie" title="Director"></i> ${data.Director}</h3>
            <h3><i class="fa fa-user" title="Actors"></i> ${data.Actors}</h3>
            <h3><i class="fa fa-pen-alt" title="Writer"></i> ${data.Writer}</h3>
            <h3><i class="fa fa-medal" title="Awards"></i> ${data.Awards}</h3>
            <h3><i class="fa fa-money-bill" title="BoxOffice"></i> ${data.BoxOffice}</h3>
            <h3><i class="fa fa-globe" title="Country"></i> ${data.Country}</h3>
            <h3><i class="fa fa-language" title="Language"></i> ${data.Language}</h3>
            <h3><i class="fa fa-film" title="Genre"></i> ${data.Genre}</h3>
            <h3><i class="fa fa-circle" title="Rated"></i> ${data.Rated}</h3>
            <h3><i class="fa fa-calendar" title="Released"></i> ${data.Released}</h3>
            <h3><i class="fa fa-clock" title="Runtime"></i> ${time[0]}h ${time[1]}m</h3>
            <h3><i class="fa fa-star" title="Rating"></i> ${data.imdbRating}</h3>
        </div>
    `;

    const closeButton = document.querySelector('#close-btn');

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

function showError(message) {
    searchBox.blur();
    searchBox.value = '';
    homepage.style.display = 'none';
    content.style.display = 'none';
    searchResult.style.display = 'block';
    searchResultMovie.innerHTML = '';

    searchResultDesc.innerHTML = `
        <button type="button" class="back-btn" id="back-btn" title="Back"><i class="fa fa-arrow-left"></i></button>
        <div class="left">
            <img src="img/search-result.png" alt="Search Result">
        </div>
        <div class="right">
            <h1>${message}</h1>
        </div>
    `;

    const backButton = document.querySelector('#back-btn');

    backButton.addEventListener('click', () => {
        searchResultDesc.innerHTML = '';
        searchResultMovie.innerHTML = '';
        searchResult.style.display = 'none';
        homepage.style.display = 'flex';
        content.style.display = 'block';
    });
}

getTopRated();

copyright.innerHTML = `Copyright &copy; ${new Date().getFullYear()}, Filmash.`;