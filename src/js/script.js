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
  /*var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru,
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });*/

  console.log('MAP!!!!!!!!!!!!!!');
}


/*const flip = (function() {
  const logon = document.getElementById('logon');
  const flipContainer = document.getElementsByClassName('main-wrapper__flip-container')[0];
  const back = document.getElementById('back');
  const flippedClass = 'main-wrapper__flip-container--fliped';

  function _init () {
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
})();*/

const bgPosition = (function () {
  const bgElement = document.getElementsByClassName('about-me')[0];
  const positionElement = document.getElementsByClassName('mail-form')[0];

  function _init() {
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

// flip.init();
window.addEventListener('load', bgPosition.init);

