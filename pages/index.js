let currentStackIndex = 0;
let darkTheme = false;
const page = document.querySelector('.page');
const footer = document.querySelector('.footer');
const header = document.querySelector('.header');
const copyright = document.querySelector('.footer__copyright');
const paragraphs = ()=>document.querySelectorAll('.section-paragraph');
const headerLinks = ()=>document.querySelectorAll('.header__link');
const bicyclesLinks = ()=>document.querySelectorAll('.bicycles__link');
const bicyclesCardsContainers = ()=>document.querySelectorAll('.bicycles__cards');
const trainingLinks = document.querySelectorAll('.trainings__link');
const btnsTypes = ()=>document.querySelectorAll('.types__btn');
const introLine = document.querySelector('.intro__line');
const job = document.querySelector('.quote__job');
const formInput = document.querySelector('.form-description__input-email');
const formBtn = document.querySelector('.form-description__btn');
const form = document.querySelector('.form-description');
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const stackTemplate = document.querySelector('#stack').content;
const stack = document.querySelector('.slider');
const switcherTemplate = document.querySelector('#switcher').content;
const switchers = ()=>document.querySelectorAll('.switcher');
const burger = document.querySelector('.header__burger-btn');
const footerBottom = document.querySelector('.footer__bottom');
const mobilePopup = document.querySelector('.mobile-popup');
const menuPopupLinks = ()=>document.querySelectorAll('.mobile-popup__link');
const bicyclesSelectors = ()=>document.querySelectorAll('.bicycles__selector');
const bicyclesSelectorsItems = ()=>document.querySelectorAll('.bicycles__select-item');
const gear = document.querySelector('.footer__gear');
let currentCoordsX = null;
let startSlider = false;

function fillTypesSection(sectionType, curType){
  sectionType.querySelector('.types__title').textContent = curType.title;
  sectionType.querySelector('.types__pic_position_left').style.backgroundImage = `url(${curType.back1Url})`;
  sectionType.querySelector('.types__pic_position_right').style.backgroundImage = `url(${curType.back2Url})`;
  sectionType.querySelector('.types__pic-type').style.backgroundImage = `url(${curType.typePic})`;
  const leftBtn = sectionType.querySelector('.types__btn_position_left');
  leftBtn.addEventListener('click', moveSlideLeft);
  if(darkTheme){
    leftBtn.classList.add('types__btn_theme_dark');
  }
  const rightBtn = sectionType.querySelector('.types__btn_position_right');
  rightBtn.addEventListener('click', moveSlideRight);
  if(darkTheme){
    rightBtn.classList.add('types__btn_theme_dark');
  }
  const paragraph = sectionType.querySelector('.types__paragraph');
  paragraph.textContent = curType.paragraph;
  if(darkTheme){
    paragraph.classList.add('section-paragraph_theme_dark');
  }
}

function setIndicator(parent, index) {
  const curBicycles = parent.closest('.bicycles');
  const indicators = curBicycles.querySelectorAll('.bicycles__slide-indicator-element');
  const curActive = curBicycles.querySelector('.bicycles__slide-indicator-element_active');
  if(curActive!==null){
    curActive.classList.toggle('bicycles__slide-indicator-element_active');
  }
  indicators[index].classList.toggle('bicycles__slide-indicator-element_active');
}

function moveBikesToIndex(childArr, newIndex){
  Array.from(childArr).forEach(element => {
    element.style.transform = `translateX(calc((100% + 18px) * -${newIndex}))`;
  });
}

function startMovingBikes(curPosX, elem){
  startSlider = false;
  const childArr = elem.parentNode.children;
  const curIndex = Array.from(childArr).indexOf(elem);
  if(curPosX - currentCoordsX < 0){
    if(curIndex == childArr.length-1){
      return;
    }
    vector = -1;
  }else{
    if(curIndex == 0){
      return;
    }
    vector = 1;
  }
  setIndicator(elem.parentNode, curIndex - vector);
  moveBikesToIndex(childArr, curIndex - vector);
}

function moveBikeSlider(ev, elem){
  if (startSlider && window.innerWidth<=600){
    if(ev.pointerType=='mouse'){
      if(Math.abs(ev.clientX - currentCoordsX)>30){
        startMovingBikes(ev.clientX, elem);
      }
    }else{
      startMovingBikes(ev.clientX, elem);
    }
  }
}

function addListenersForSlider(el){
  el.addEventListener('pointerdown', (event) => {
    startSlider = true;
    currentCoordsX = event.clientX;
    el.setPointerCapture(event.pointerId);
  });
  el.addEventListener('pointerup', ()=>{startSlider = false;});
  el.addEventListener('pointercancel', ()=>{startSlider = false;});
  el.addEventListener('pointerleave', ()=>{startSlider = false;});
  el.ondragstart = () => false;
  el.addEventListener('pointermove', (ev)=>moveBikeSlider(ev, el));
}

function createCard(data){
  const cardContent = stackTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardContent.querySelector('.card__image');
  cardImage.src = data.url;
  cardImage.alt = 'Велосипед модели ' + data.name;
  const link = cardContent.querySelector('.card__link');
  link.href = data.link;
  cardContent.querySelector('.card__name').textContent = data.name;
  addListenersForSlider(cardContent);
  return cardContent;
}

function fillBicyclesSection(sectionBicycles, curBicycles){
  const bicyclesCardsContainer = sectionBicycles.querySelector('.bicycles__cards');
  const bicyclesLinks = sectionBicycles.querySelectorAll('.bicycles__link');
  const selectorLinks = sectionBicycles.querySelectorAll('.bicycles__select-item');
  const indicatorLinks = sectionBicycles.querySelectorAll('.bicycles__slide-indicator-element');
  const selector = sectionBicycles.querySelector('.bicycles__selector');
  for (let index = 0; index < bicyclesLinks.length; index++) {
    const element = bicyclesLinks[index];
    if(index===stack.childElementCount){
      element.classList.add('bicycles__link_active');
    }else{
      element.classList.remove('bicycles__link_active');
    }
    element.addEventListener('click',() => moveStackToIndex(index));
  }
  for (let index = 0; index < selectorLinks.length; index++) {
    const element = selectorLinks[index];
    if(index===stack.childElementCount){
      element.setAttribute('selected','');
    }else{
      element.removeAttribute('selected');
    }
    element.setAttribute('value',`${index}`);
  }
  selector.addEventListener('change',(ev) => {
    const curIndex = currentStackIndex;
    moveStackToIndex(ev.target.value);
    ev.target.value = `${curIndex}`;
  });
  curBicycles.forEach(element => {
    bicyclesCardsContainer.append(createCard(element, bicyclesCardsContainer));
  });
  for (let index = 0; index < indicatorLinks.length; index++) {
    const element = indicatorLinks[index];
    element.addEventListener('click', ()=>{
      moveBikesToIndex(bicyclesCardsContainer.children, index);
      setIndicator(sectionBicycles, index);
    });
  }
  setIndicator(sectionBicycles, 0);
}

function createSlide(arrElement){
  const sliderContent = stackTemplate.querySelector('.slider__content').cloneNode(true);
  const sectionTypes = sliderContent.querySelector('.types');
  const sectionBicycles = sliderContent.querySelector('.bicycles');
  fillTypesSection(sectionTypes, arrElement.types);
  fillBicyclesSection(sectionBicycles, arrElement.bicycles);
  if(darkTheme){
    sliderContent.classList.add('slider__content_theme_dark');
  }
  return sliderContent;
}

function moveStackToIndex(index){
  if (index<currentStackIndex) {
    moveSlideLeft(null,index);
  } else if(index>currentStackIndex){
    moveSlideRight(null,index);
  }
}

function setIndexSectionSlider(newIndex){
  currentStackIndex = newIndex<0?stack.childNodes.length-1:(newIndex>stack.childNodes.length-1?0:newIndex);
}

function moveSlideRight(ev, index=-1){
  const curEl = stack.childNodes[currentStackIndex];
  curEl.style.zIndex = '2';
  curEl.classList.add('slider__content_move_left');
  setIndexSectionSlider(!(index+1)?++currentStackIndex:index);
  const nextEl = stack.childNodes[currentStackIndex];
  nextEl.style.zIndex = '1';
  setTimeout(()=>{
    curEl.style.zIndex = '0';
    curEl.classList.remove('slider__content_move_left');
    }, 500);
}

function moveSlideLeft(ev, index=-1){
  const curEl = stack.childNodes[currentStackIndex];
  curEl.style.zIndex = '2';
  curEl.classList.add('slider__content_move_right');
  setIndexSectionSlider(!(index+1)?--currentStackIndex:index);
  const nextEl = stack.childNodes[currentStackIndex];
  nextEl.style.zIndex = '1';
  setTimeout(()=>{
    curEl.style.zIndex = '0';
    curEl.classList.remove('slider__content_move_right');
    }, 500);
}

function subscribe(ev){
  if(ev.target===form && validateEmail(formInput.value)){
    formInput.value = "Круто!";
  }
}

function setVisibleFormButton(status=false){
  if(status){
    formBtn.classList.add('form-description__btn_visible');
  }else{
    formBtn.classList.remove('form-description__btn_visible');
  }
}

function toggleParagraphsTheme(){
  paragraphs().forEach(element => {
    element.classList.toggle('section-paragraph_theme_dark');
  });
}

function toggleTrainingsLinksTheme(){
  trainingLinks.forEach(element => {
    element.classList.toggle('trainings__link_theme_dark');
  });
}

function toggleBicyclesLinksTheme(){
  bicyclesLinks().forEach(element => {
    element.classList.toggle('bicycles__link_theme_dark');
  });
}

function togglePopupLinksTheme(){
  menuPopupLinks().forEach(element => {
    element.classList.toggle('mobile-popup__link_theme_dark');
  });
}

function toggleTypesBtnTheme(){
  btnsTypes().forEach(element => {
    element.classList.toggle('types__btn_theme_dark');
  });
}

function toggleStackTheme(){
  stack.childNodes.forEach(element => {
    element.classList.toggle('slider__content_theme_dark');
  });
}

function toggleBicyclesSelectorsTheme(){
  bicyclesSelectors().forEach(element => {
    element.classList.toggle('bicycles__selector_theme_dark');
  });
}

function toggleBicyclesSelectorsItemsTheme(){
  bicyclesSelectorsItems().forEach(element => {
    element.classList.toggle('bicycles__select-item_theme_dark');
  });
}

function toggleSwitchersTheme(){
  switchers().forEach(element => {
    toggleSwitcherTheme(element);
  });
}

function toggleSwitcherTheme(element){
  const picSun = element.querySelector('.switcher__icon-sun');
  const picMoon = element.querySelector('.switcher__icon-moon');
  const buttonChangeTheme = element.querySelector('.switcher__btn');
  picSun.classList.toggle('switcher__icon-sun_theme_dark');
  picMoon.classList.toggle('switcher__icon-moon_theme_dark');
  buttonChangeTheme.classList.toggle('switcher__btn_theme_dark');
}

function toggleTheme(){
  darkTheme=!darkTheme;
  page.classList.toggle('page_theme_dark');
  toggleParagraphsTheme();
  togglePopupLinksTheme();
  toggleTypesBtnTheme();
  toggleBicyclesLinksTheme();
  toggleTrainingsLinksTheme();
  footer.classList.toggle('footer_theme_dark');
  header.classList.toggle('header_theme_dark');
  copyright.classList.toggle('footer__copyright_theme_dark');
  introLine.classList.toggle('intro__line_theme_dark');
  job.classList.toggle('quote__job_theme_dark');
  formInput.classList.toggle('form-description__input-email_theme_dark');
  formBtn.classList.toggle('form-description__btn_theme_dark');
  toggleStackTheme();
  mobilePopup.classList.toggle('mobile-popup_theme_dark');
  burger.classList.toggle('header__burger-btn_theme_dark');
  gear.classList.toggle('footer__gear_theme_dark');
  toggleBicyclesSelectorsTheme();
  toggleBicyclesSelectorsItemsTheme();
  toggleSwitchersTheme();
}

function initStack(){
  initialSection.forEach(element => {
    stack.append(createSlide(element));
  });
  stack.childNodes[0].style.zIndex = '2';
}

function toggleMenu(){
  mobilePopup.classList.toggle('mobile-popup_opened');
  burger.classList.toggle('header__burger-btn_close');
}

function addSwitcher(element, switcherClass='') {
  const switcher = switcherTemplate.querySelector('.switcher').cloneNode(true);
  const buttonChangeTheme = switcher.querySelector('.switcher__btn');
  if(switcherClass){
    switcher.classList.add(switcherClass);
  }
  buttonChangeTheme.addEventListener('click', ()=>{
    toggleTheme();
  });
  element.append(switcher);
}

function initPopupMenu() {
  menuPopupLinks().forEach(element => {
    element.addEventListener('click',toggleMenu);
  });
}

function resetSliders(){
  if(window.innerWidth<601){
    return
  }
  bicyclesCardsContainers().forEach(element => {
    moveBikesToIndex(element.children, 0);
    setIndicator(element.closest('.bicycles'), 0);
  });
}

function init(){
  formInput.addEventListener('focus', ()=>setVisibleFormButton(true));
  formInput.addEventListener('blur', ()=>setVisibleFormButton(false));
  form.addEventListener('click', (ev)=>subscribe(ev));
  addSwitcher(footerBottom,'switcher_position_footer');
  addSwitcher(mobilePopup, 'switcher_position_header');
  initStack();
  initPopupMenu();
  burger.addEventListener('click',toggleMenu);
  window.addEventListener('resize', resetSliders);
}

init();
