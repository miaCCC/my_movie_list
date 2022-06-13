const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
const MOVIES_PER_PAGE = 12

//分頁器製作
//先切割每一頁12部電影，用.slice分割
//稍後在分頁器上掛監聽器，告知 getMoviesByPage帶入的page
function getMoviesByPage(page) {
  //新增這裡三元運算子
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  //修改這裡
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

const paginator = document.querySelector('#paginator')

//製作函式renderPaginator()，放到下方axios中帶入電影總數
function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  //製作 template 
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}

//抓取API裡面所有電影資料，放入Movies空陣列
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length) //新增：計算分頁器總頁數
    renderMovieList(getMoviesByPage(1)) 
    //1.渲染哪些 2.哪12個電影 3.第幾頁的
  })
  .catch((err) => console.log(err))

//點擊 Pagination分頁事件監聽器
paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return

  //透過上方rawHTML新增dataset-page 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderMovieList(getMoviesByPage(page))
})


//搜尋功能處理
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
//定義一個filteredMovies空陣列，放進篩選後符合條件的電影資料
let filteredMovies = []

//1.監聽表單提交事件，找value的値
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  console.log('click!')
  event.preventDefault()
  //去掉空白並轉換小寫
  const keyword = searchInput.value.trim().toLowerCase() 
  //若沒輸入東西就送出，會跳出警告訊息
  if (!keyword.length) {
    return alert('請輸入有效字串！')
  } 
  //用陣列.filter，比對原本Movies裡面是否有跟搜尋裡keyWord一樣才產生新陣列
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
    )

  //新增分頁器功能後，掛一個新的分頁器，計算看需要幾頁
  renderPaginator(filteredMovies.length)

  //重新取用函式renderMovieList去渲染比對過後符合的畫面（舊）
  //放入函式getMoviesByPage去分切一次只顯示12部，然後固定在第1頁
  renderMovieList(getMoviesByPage(1))
  //1.渲染電影畫面 2.每一次是哪12部 3.第幾頁的（搜尋固定在第1頁）
})






const dataPanel = document.querySelector('#data-panel')
//監聽data panel,點擊就會彈出Modal
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)  
    //新增監聽 加入收藏的按鈕
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id)) //未加上Number
  }  
})

//加入收藏的監聽內函式
function addToFavorite(id) {
  //第一次為空陣列，後續判斷左邊優先，已表示重複累加陣列，JSON轉換陣列及字串
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id) //find=一樣就加入
  if (list.some((movie) => movie.id === id)) { //some＝布林值條件判斷
    return alert('此電影已經在收藏清單中！') //一樣就return 結束函式
  }
  list.push(movie) //加入陣列
  localStorage.setItem('favoriteMovies',JSON.stringify(list)) //寫入
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
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
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



