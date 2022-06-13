const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []










const dataPanel = document.querySelector('#data-panel')
//監聽data panel,點擊就會彈出Modal
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)  
    //新增監聽 “刪除”收藏的按鈕
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

//加入收藏的監聽內函式
function removeFromFavorite(id) {
  //toBoolean條件判斷：！＋0或空字串 = false
  if (!movies || !movies.length) return 
  //findIndex用來找出，被點擊叉叉的電影在第幾個元素
  const movieIndex = movies.findIndex((movie) => movie.id === id) 
  if (movieIndex  === -1) return

  movies.splice(movieIndex, 1) //用.splice移除陣列，刪除該筆電影
  //移除後的陣列再存回local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies)) 
  //更新頁面
  renderMovieList(movies)
 
}




//寫入電影清單的HTML
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    //title, image
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

//創造渲染彈出Modal的函式，並透過axios抓取在電影HTML加入DATASET的id
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

renderMovieList(movies)

