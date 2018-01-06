/*
function initMap() {
  let zoom;

  if (window.matchMedia('(max-width: 400px)').matches) {
    zoom = 10;
  }
  else if (window.matchMedia('(max-width: 720px)').matches) {
    zoom = 11;
  }
  else {
    zoom = 12;
  }

  // let center = {lat: 59.928616, lng: 30.383887};
  let center = {lat: 59.921981, lng: 30.410323};
  let marks = [
    {lat: 59.896228, lng: 30.424273},
    {lat: 59.971850, lng: 30.309884},
    {lat: 59.893108, lng: 30.316064},
    {lat: 59.917250, lng: 30.494076},
  ];
  let markers = [];
  let icon = 'img/map-marker.svg';
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: zoom,
    center: center,
    gestureHandling: 'none',
  });

  for (let i = 0; i < marks.length; i++) {
    let marker= new google.maps.Marker({
      position: marks[i],
      map: map,
      icon: icon,
    });
    markers.push(marker);
  }
}*/

function initMap() {
  let center = {lat: 51.495800, lng: 45.940374};
  let home = {lat: 51.4960512, lng: 45.9432219};
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: center,
  });
  let marker = new google.maps.Marker({
    position: home,
    map: map,
    icon: 'img/map_marker.svg',
    gestureHandling: 'none'
  });

}

window.initMap = initMap;

const flip = (function() {
  const logon = document.getElementById('logon');
  const flipContainer = document.getElementsByClassName('main-wrapper__flip-container')[0];
  const back = document.getElementById('back');
  const flippedClass = 'main-wrapper__flip-container--fliped';

  function _init () {
    if (!logon || !back) return;

    logon.addEventListener('click', _showLogon);
    back.addEventListener('click', _hideLogon);
  }

  function _showLogon (e) {
    e.preventDefault();
    flipContainer.classList.add(flippedClass);
    logon.style.opacity = 0;
  }

  function _hideLogon(e) {
    e.preventDefault();
    flipContainer.classList.remove(flippedClass);
    logon.style.opacity = 1;
  }

  return {
    init: _init
  };
})();

const bgPosition = (function () {
  const bgElement = document.getElementsByClassName('about-me')[0];
  const positionElement = document.getElementsByClassName('mail-form')[0];

  function _init() {
    if (!bgElement || !positionElement) return;

    window.addEventListener('resize', _setPosition);
    _setPosition();
  }

  function _setPosition() {
    const posX = positionElement.offsetLeft;
    const posY = positionElement.offsetTop;
    positionElement.style.backgroundPosition = `-${posX}px -${posY}px`;
    positionElement.style.backgroundSize = bgElement.offsetWidth + 'px';
  }

  return {
    init: _init,
  };
})();

const bgAnimation = (function() {
  const bgContainer = document.getElementsByClassName('main-wrapper')[0];
  const animationDelay = 50;
  let currentPosition = 0;

  function _init() {
    if (!bgContainer) return;
    if (_isMobile()) return;
    setInterval(_moveBg, animationDelay);
  }

  function _moveBg () {
    bgContainer.style.backgroundPositionX = `-${++currentPosition}px`;
  }

  function _isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  return {
    init: _init
  };
})();

const fullscreenMenu = (function() {
  const overlayClass = "main-container__overlay";
  const menuClass = "fullscreen-menu";

  const openMenuButton = document.getElementsByClassName("humburger-button")[0];
  const closeMenuButton = document.getElementsByClassName("main-container__overlay-close")[0];
  const overlay = document.getElementsByClassName(overlayClass)[0];
  const menu = document.getElementsByClassName(menuClass)[0];

  function _init() {
    if (!openMenuButton) return;
    openMenuButton.addEventListener("click", openMenu);
    closeMenuButton.addEventListener("click", closeMenu);
  }

  function openMenu(e) {
    e.preventDefault();
    overlay.classList.add(overlayClass + "--visible");
    menu.classList.add(menuClass + "--visible");
  }

  function closeMenu(e) {
    e.preventDefault();
    overlay.classList.remove(overlayClass + "--visible");
    menu.classList.remove(menuClass + "--visible");
  }

  return {
    init: _init
  };
})();

const sidebar = (function() {
  const sidebar = document.getElementsByClassName("main-container__swipe-sidebar")[0];
  const mainSidebar = document.getElementsByClassName("blog__contents-wrapper")[0];
  const mainSidebarFirstPosition = mainSidebar.offsetTop;
  const contents = document.getElementsByClassName("swipe-sidebar__contents")[0];
  const appendix =document.getElementsByClassName("swipe-sidebar__appendix")[0];
  const content =document.getElementsByClassName("main-container__content-wrapper")[0];

  let contentsHeight;
  let sidebarWidth = sidebar.offsetWidth;
  let startCoordinate = null;
  const headerHeight = document.getElementsByClassName("page-header")[0].offsetHeight;

  const articles = document.getElementsByClassName("blog__article");
  const articlesList = document.getElementsByClassName("blog__article-name");
  const swipeArticlesList = document.getElementsByClassName("swipe-sidebar__article-name");
  const articlesPosition = _getArticlesCoords();
  let currentArticle = 0;

  function _init() {
    if (!sidebar) return;
    contentsHeight = contents.offsetHeight;

    sidebar.addEventListener("touchstart", _touchSwipeStart);
    window.addEventListener("touchend", _touchSwipeEnd);
    sidebar.addEventListener("mousedown", _mouseSwipeStart);
    window.addEventListener("mouseup", _MouseSwipeEnd);
    window.addEventListener("scroll", _verticalCenter.bind(null, appendix));
    window.addEventListener("scroll", _verticalCenter.bind(null, contents));
    window.addEventListener("scroll", _sidebarCenter.bind(null, mainSidebar));

    _verticalCenter.bind(null, appendix);
    _verticalCenter.bind(null, contents);


    window.addEventListener("scroll", _trackActiveArticle);
    _initScroll(articlesList);
    _initScroll(swipeArticlesList);
  }

  function _mouseSwipeStart(e) {
    e.preventDefault();
    startCoordinate = e.screenX;
  }

  function _MouseSwipeEnd(e) {
    e.preventDefault();
    if (!startCoordinate) return;
    if (e.screenX > startCoordinate) {
      _openMenu();
    }
    else if (e.screenX < startCoordinate) {
      _closeMenu();
    }
    startCoordinate = null;
  }

  function _touchSwipeStart(e) {
    e.preventDefault();
    startCoordinate = e.changedTouches[0].pageX;
  }

  function _touchSwipeEnd(e) {
    e.preventDefault();
    if (!startCoordinate) return;
    if (e.changedTouches[0].pageX > startCoordinate) {
      _openMenu();
    }
    else if (e.changedTouches[0].pageX < startCoordinate) {
      _closeMenu();
    }
    startCoordinate = null;
  }

  function _openMenu() {
    sidebar.style.transform = `translateX(${sidebarWidth}px)`;
    content.style.transform = `translateX(${sidebarWidth}px)`;
  }

  function _closeMenu() {
    sidebar.style.transform = `translateX(0px)`;
    content.style.transform = `translateX(0px)`;
  }

  function _verticalCenter(element, e) {
    let windowHeight = document.body.clientHeight;
    let elementHeight = element.offsetHeight;
    let posY = windowHeight / 2 - elementHeight / 2 + window.pageYOffset;
    element.style.transform = `translateY(${posY}px)`;
  }

  function _sidebarCenter(element, e) {
    if (window.pageYOffset < mainSidebarFirstPosition) return;

    let posY = window.pageYOffset - headerHeight;
    element.style.transform = `translateY(${posY}px)`;
  }

  function _trackActiveArticle() {
    let activeArticle = _getActiveArticle();
    console.log(activeArticle);
    _changeActiveArticle(activeArticle);
  }

  function _changeActiveArticle(index) {
    articlesList[currentArticle].classList.remove("blog__article-name--active");
    articlesList[index].classList.add("blog__article-name--active");
    swipeArticlesList[currentArticle].classList.remove("swipe-sidebar__article-name--active");
    swipeArticlesList[index].classList.add("swipe-sidebar__article-name--active");

    currentArticle = index;
  }

  function _getActiveArticle() {
    const windowScroll = window.pageYOffset;

    for (let i = articlesPosition.length - 1; i >= 0; i--) {
      if (windowScroll > articlesPosition[i]) {
        return i;
      }
    }
    return 0;
  }

  function _getArticlesCoords() {
    let coords = [];
    for (let i = 0; i < articles.length; i++) {
      coords.push(articles[i].offsetTop);
    }
    return coords;
  }

  function _initScroll(list) {
    for (let i = 0; i < list.length; i++) {
      list[i].addEventListener("click", e => {
        e.preventDefault();
        articles[i].scrollIntoView();
        setTimeout(() => {
          _changeActiveArticle(i);
        }, 100)

      });
    }
  }

  return {
    init: _init
  };
})();

flip.init();
fullscreenMenu.init();

window.addEventListener('load', bgPosition.init);
window.addEventListener('load', bgAnimation.init);
window.addEventListener('load', sidebar.init);

