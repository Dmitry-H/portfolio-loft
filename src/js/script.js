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

const flip = (function () {
    const logon = document.getElementById('logon');
    const flipContainer = document.getElementsByClassName('main-wrapper__flip-container')[0];
    const back = document.getElementById('back');
    const flippedClass = 'main-wrapper__flip-container--fliped';

    function _init() {
        if (!logon || !back) return;

        logon.addEventListener('click', _showLogon);
        back.addEventListener('click', _hideLogon);
    }

    function _showLogon(e) {
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

const bgAnimation = (function () {
    const bgContainer = document.getElementsByClassName('main-wrapper')[0];
    const animationDelay = 50;
    let currentPosition = 0;

    function _init() {
        if (!bgContainer) return;
        if (_isMobile()) return;
        setInterval(_moveBg, animationDelay);
    }

    function _moveBg() {
        bgContainer.style.backgroundPositionX = `-${++currentPosition}px`;
    }

    function _isMobile() {
        return window.matchMedia('(max-width: 768px)').matches;
    }

    return {
        init: _init
    };
})();

const fullscreenMenu = (function () {
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

const sidebar = (function () {
    const sidebar = document.getElementsByClassName("main-container__swipe-sidebar")[0];
    const mainSidebar = document.getElementsByClassName("blog__contents-wrapper")[0];
    let mainSidebarFirstPosition;
    const contents = document.getElementsByClassName("swipe-sidebar__contents")[0];
    const appendix = document.getElementsByClassName("swipe-sidebar__appendix")[0];
    const content = document.getElementsByClassName("main-container__content-wrapper")[0];

    let contentsHeight;
    let sidebarWidth;
    let startCoordinate = null;
    let headerHeight;

    const articles = document.getElementsByClassName("blog__article");
    const articlesList = document.getElementsByClassName("blog__article-name");
    const swipeArticlesList = document.getElementsByClassName("swipe-sidebar__article-name");
    const articlesPosition = _getArticlesCoords();
    let currentArticle = 0;

    function _init() {
        if (!sidebar || !mainSidebar) return;

        mainSidebarFirstPosition = mainSidebar.offsetTop;
        sidebarWidth = sidebar.offsetWidth;
        headerHeight = document.getElementsByClassName("page-header")[0].offsetHeight;
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

const preloader = (function () {
    const overlay = document.getElementsByClassName("preloader")[0];
    const spinner = document.getElementsByClassName("prloader__image")[0];
    const lastAnimate = document.getElementsByClassName("dot-3")[0];
    const progress = document.getElementsByClassName("prloader__percent")[0];

    const images = document.images;
    const imagesCount = images.length;

    let imagesLoaded = 0;

    function _init() {
        if (!overlay) return;
        // overlay.classList.add("preloader--done");

        lastAnimate.addEventListener("animationend", _animationEnd);
        spinner.classList.add("prloader__image--animate");
        _initProgress();
        window.addEventListener("load", _close);
    }

    function _animationEnd() {
        spinner.classList.remove("prloader__image--animate");
        setTimeout(_animationStart, 1000);
    }

    function _animationStart() {
        spinner.classList.add("prloader__image--animate");
    }

    function _initProgress() {
        for (let i = 0; i < imagesCount; i++) {
            let imageCopy = new Image;
            imageCopy.onload = _imageLoaded;
            imageCopy.onerror = _imageLoaded;
            imageCopy.src = images[i].src;
        }
    }

    function _imageLoaded() {
        imagesLoaded++;
        progress.innerHTML = Math.round((100 / imagesCount) * imagesLoaded) + "%";
    }

    function _close() {
        setTimeout(function() {
            overlay.classList.add("preloader--done");
        }, 1000);
    }

    return {
        init: _init
    };
})();

const slider = (function() {
    const slider = $(".works-slider");
    const next = $(".works-slider__navigation-slide--next");
    const prev = $(".works-slider__navigation-slide--prev");
    const prevSlides = prev.find(".works-slider__item");
    const nextSlides = next.find(".works-slider__item");

    const animationDuration = 300;
    const activeClass = "works-slider__item--active";

    let currentSlide = 0;
    let slidesCount;
    let stop = false;

    function _init() {
        if (!slider) return;
        slidesCount = prevSlides.length;

        next.on("click touchstart", _nextSlide);
        prev.on("click touchstart", _prevSlide);

        prevSlides.eq(_getPrevSlideNum(currentSlide)).addClass(activeClass);
        nextSlides.eq(_getNextSlideNum(currentSlide)).addClass(activeClass);
        prevSlides.eq(_getPrevSlideNum(currentSlide)).siblings(".works-slider__item").css("top", "100%");
        nextSlides.eq(_getNextSlideNum(currentSlide)).siblings(".works-slider__item").css("top", "-100%");
    }

    function _nextSlide(e) {
        e.preventDefault();
        if (!stop) {
            stop = true;
            _moveSlide("next", "next");
            _moveSlide("prev", "next");
            currentSlide = _getNextSlideNum(currentSlide);
            _changeSlide();
        }
    }

    function _prevSlide(e) {
        e.preventDefault();
        if (!stop) {
            stop = true;
            _moveSlide("next", "prev");
            _moveSlide("prev", "prev");
            currentSlide = _getPrevSlideNum(currentSlide);
            _changeSlide();
        }
    }

    function _changeSlide() {
        const bigSlide = $(".works-slider__image--big");
        const reqSlide = nextSlides.eq(currentSlide);
        const link = $(".site-link");

        const newName = reqSlide.data("name");
        const newTeck = reqSlide.data("teck");
        const newLink = reqSlide.data("link");
        const newSrc = reqSlide.find(".works-slider__image--small").attr("src");

        const nameField = document.querySelector("#project-name");
        const techField =  document.querySelector(".works-slider__technologies");

        console.log();

        link.attr("href", newLink);

        bigSlide.animate({"opacity" : "0"}, animationDuration / 2, function () {
            bigSlide.attr("src", newSrc);
            bigSlide.animate({"opacity" : "1"}, animationDuration / 2);
        });

        _wordAnimation(nameField, newName);
        _wordAnimation(techField, newTeck);
    }

    function _wordAnimation(container, text) {
        let string = text.trim();
        let stringArray = string.split('');
        let word = '';
        let animationState = $.Deferred();
        let Slider = this;

        Array.from(stringArray).map((letter) => {
            let letterHtml = '';

            if(letter != ' ') {
                letterHtml = '<span class="works-slider__letter">' + letter + '</span>';
            } else {
                letterHtml = '<span class="works-slider__letter--space">' + letter + '</span>';
            }

            word += letterHtml;
        });

        container.innerHTML = word;

        let letter = container.querySelectorAll('.works-slider__letter'),
            count = 0,
            timer,
            duration = 600 / stringArray.length;

        function showLetters () {
            let currentLetter = $(letter).eq(count);

            currentLetter.addClass('works-slider__letter--show');

            if (count == stringArray.length) {
                animationState.resolve();
                clearTimeout(timer);
                count = 0;
            } else {
                count++;
                timer = setTimeout(showLetters, duration);
            }
        }

        showLetters();

        animationState.done(function() {
            Slider.process = false;
        });
    }

    function _moveSlide(container, direction) {
        let nextFunction;
        let originPos;
        let movePos;
        let slides;

        if (container === "next" && direction === "next") {
            nextFunction = _getNextSlideNum;
            originPos = "-100%";
            movePos = "100%";
            slides = nextSlides;
        }
        else if (container === "prev" && direction === "next") {
            nextFunction = _getNextSlideNum;
            originPos = "100%";
            movePos = "-100%";
            slides = prevSlides;
        }
        else if (container === "next" && direction === "prev") {
            nextFunction = _getPrevSlideNum;
            originPos = "-100%";
            movePos = "100%";
            slides = nextSlides;
        }
        else if (container === "prev" && direction === "prev") {
            nextFunction = _getPrevSlideNum;
            originPos = "100%";
            movePos = "-100%";
            slides = prevSlides;
        }

        const active = slides.filter("." + activeClass);
        const currentSlideIndex = slides.index(active);
        const reqItem = slides.eq(nextFunction(currentSlideIndex));

        active.animate({"top": movePos}, animationDuration);
        reqItem.animate({"top": "0"}, animationDuration, function () {

            active.css("top", originPos);
            stop = false;
        });

        active.removeClass(activeClass);
        reqItem.addClass(activeClass);
    }

    function _getNextSlideNum(origin) {
        return origin + 1 >= slidesCount ? 0 : origin + 1;
    }

    function _getPrevSlideNum(origin) {
        return origin - 1 < 0 ? slidesCount - 1 : origin - 1;
    }

    return {
        init: _init
    };
})();

const skillsRate = (function(){
    const skills = document.getElementsByClassName("skills__item");
    const skillsBlock = document.getElementsByClassName("skills")[0];

    let skillsPosition;


    function _init() {
        if (!skills || !skillsBlock) return;

        skillsPosition = skillsBlock.offsetTop;

        window.addEventListener("scroll", _checkPosition)
    }

    function _checkPosition() {
        const windowScroll = window.pageYOffset;

        if (windowScroll >= skillsPosition) {
            _showSkills()
        }
    }

    function _showSkills() {
        for (let i = 0; i < skills.length; i++) {
            const rate = skills[i].getAttribute("data-percent");
            const newClassName = "circle-" + rate;
            const skillLevel = skills[i].getElementsByClassName("skills__image-level")[0];

            skillLevel.classList.remove("circle-0");
            skillLevel.classList.add(newClassName);
            skillLevel.style.opacity = rate / 100;
        }
    }

    return {
        init: _init
    };
})();

const adminForms = (function () {
    const skillsForm = document.getElementById("skills-form");
    const worksForm = document.getElementById("works-form");
    const blogForm = document.getElementById("blog-form");
    const messageWindow = document.getElementsByClassName("message-window")[0];
    const closeButton = document.getElementsByClassName("message-window__close-button")[0];

    function _init() {
        if (skillsForm) {
            skillsForm.addEventListener("submit", _processSkillsForm);
        }
        if (blogForm) {
            blogForm.addEventListener("submit", _processBlogForm);
        }
        if (worksForm) {
            worksForm.addEventListener("submit", _processWorksForm);
        }


        closeButton.addEventListener("click", _hideMessage);
    }

    function _processSkillsForm(e) {
        e.preventDefault();
        const fields = document.getElementsByClassName("skills__input");

        if (!_emptyCheck(fields) || !_percentCheck(fields)) {
            _showMessage("Все поля должны быть заполнены числами от 0 до 100, кратными 5");
        }
        else {
            _sendForm(_getSkills(), skillsForm.action, skillsForm.method, null);
        }
    }
    
    function _processBlogForm(e) {
        e.preventDefault();

        const fields = document.getElementsByClassName("blog__input");

        if (!_emptyCheck(fields)) {
            _showMessage("Все поля должны быть заполнены");
        }
        else {
            _sendForm(_getBlogPost(), blogForm.action, blogForm.method, fields);
        }
    }

    function _processWorksForm(e) {
        e.preventDefault();

        const fields = document.getElementsByClassName("works__input");

        if (!_emptyCheck(fields)) {
            _showMessage("Все поля должны быть заполнены");
        }
        else {
            _sendFile(fields);
        }
    }

    function _sendForm(data, url, method, fields) {
        let result;
        console.log("send");
        result = $.ajax({
            url: url,
            type: method,
            data: data,
            contentType: "application/json",
            dataType: "json"
        });

        result.done(msg => {
            if (msg["status"] === "ok") {
                _showMessage("Данные были успешно отправлены");
                if (fields) {
                    _cleanFields(fields);
                }
            }
            else {
                _showMessage("Произошла ошибка");
            }
        });

        result.fail(msg => {
            _showMessage("Произошла ошибка");
        });
    }

    function _sendFile(fields) {
        const fileField = document.getElementById("image");
        const nameField = document.getElementById("name");
        const technologiesField = document.getElementById("technologies");
        const linkField = document.getElementById("link");
        const file = fileField.files[0];
        let result;

        let data = new FormData();
        data.append("uploadFile", file);
        data.append("name", nameField.value);
        data.append("technologies", technologiesField.value);
        data.append("link", linkField.value);

        result = $.ajax({
            url: "loadimg",
            data: data,
            contentType: false,
            processData: false,
            type: "post"
        });

        result.done(msg => {
            if (msg["status"] === "ok") {
                _showMessage("Данные были успешно отправлены");
                _cleanFields(fields);
                /*fileField.value = "";
                nameField.value = "";
                technologiesField.value = "";
                linkField.value = "";*/
            }
            else {
                _showMessage("Произошла ошибка");
            }
        });

        result.fail(msg => {
            console.log("ne ok");
        });
    }

    function _cleanFields(fields) {
        for (let i = 0; i < fields.length; i++) {
            fields[i].value = "";
        }
    }

    function _getSkills() {
        const categories = document.getElementsByClassName("skills__category");
        let result = [];

        for (let i = 0; i < categories.length; i++) {
            const categoryName = categories[i].getElementsByClassName("skills__category-title")[0].innerHTML;
            const itemsValue = categories[i].getElementsByClassName("skills__input");
            const itemsNames = categories[i].getElementsByClassName("skills__name");
            result.push({});
            result[i].categoryName = categoryName;
            result[i].skillItems = [];

            for (let j = 0; j < itemsValue.length; j++) {
                result[i].skillItems.push({
                    name: itemsNames[j].innerHTML,
                    percent: itemsValue[j].value
                });
            }
        }

        return JSON.stringify(result);
    }

    function _getBlogPost() {
        let result = {};

        const name = document.getElementById("name").value;
        const date = document.getElementById("date").value;
        let post = document.getElementById("content").value;


        post = post.replace(/[\s{2,}]+/g, '');
        post = post.replace(/"/g,"'");

        result.name = name;
        result.date = date;
        result.post = post;

        return JSON.stringify(result);
    }

    function _emptyCheck(data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].value === "") {
                return false;
            }
        }
        return true;
    }

    function _percentCheck(data) {
        for (let i = 0; i < data.length; i++) {
            let tmp = parseInt(data[i].value);
            if ((tmp % 5 !== 0) || tmp < 0 || tmp > 100) {
                return false;
            }
        }
        return true;
    }

    function _showMessage(message) {

        const messageField = document.getElementsByClassName("message-window__message")[0];

        messageField.innerHTML = message;
        messageWindow.classList.add("message-window--visible");
    }

    function _hideMessage(e) {
        e.preventDefault();
        messageWindow.classList.remove("message-window--visible");
    }

    return {
        init: _init
    };
})();


flip.init();
fullscreenMenu.init();
preloader.init();

window.addEventListener('load', bgPosition.init);
window.addEventListener('load', bgAnimation.init);
window.addEventListener('load', sidebar.init);
window.addEventListener('load', slider.init);
window.addEventListener('load', skillsRate.init);
window.addEventListener('load', adminForms.init);

