let prevBtn;
let nexBtn;
let ourWork;
let galleryTrack;

let data = [];

let currentIndex = 0;
let autoPlayInterval;

//add inifinity carousel later
const handleClick1 = () => {moveSlide(currentIndex + 1);
  clearInterval(autoPlayInterval);
  startAutoPlay();
}
const handleClick2 = () => {moveSlide(currentIndex - 1);
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

const handleClick3 = () => {moveSlide(currentIndex);
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

export function initOurWork(){
  fetch("data/gallery.json")
    .then(res=>res.json())
    .then(json=>{
      data = json.slice(0,6);
      startFn();
    })
    .catch(err=>console.log("Error loading json:"+err));
}

const startAutoPlay = ()=>{
    autoPlayInterval = setInterval(()=>{
      moveSlide(currentIndex+1);
    },3000);
  }

const startFn = () => {
  currentIndex = 0;
  ourWork = document.getElementById("ourWork");
  galleryTrack = ourWork.querySelector(".galleryTrack");
  prevBtn = ourWork.querySelector("#preBtn");
  nexBtn = ourWork.querySelector("#nexBtn");

  

  const initData = ()=>{
    data.forEach(element=>{
      const li=document.createElement("li");
      li.classList.add("car-slide");
      li.innerHTML=`<img src=${element.src} alt=${element.alt}>`;
      galleryTrack.appendChild(li);
    });

    startAutoPlay();
  }

  prevBtn.addEventListener('click',handleClick2);
  nexBtn.addEventListener('click',handleClick1);
  window.addEventListener('resize',handleClick3);

  initData();
}

const getSlideWidth = ()=>{
  const slide = galleryTrack.querySelector(".car-slide");
  return slide?.getBoundingClientRect().width || 0;
}

const maxIndex = ()=>{
  const slideWidth = getSlideWidth();
  if(!slideWidth) return 0;
  const containerWidth = galleryTrack.parentElement.getBoundingClientRect().width;
  const visibleSlides = Math.floor(containerWidth/slideWidth);

  return Math.max(0,data.length-visibleSlides);
}

const moveSlide = (index)=>{
  const maxIdx=maxIndex();
  const slideWidth=getSlideWidth();

  if(index>maxIdx)
    currentIndex=0;
  else if(index<0)
    currentIndex=maxIdx;
  else
    currentIndex=index;

  galleryTrack.style.transform=`translateX(-${slideWidth*currentIndex}px)`;
}

export const destroyOurWork = ()=>{
  prevBtn?.removeEventListener('click',handleClick2);
  nexBtn?.removeEventListener('click',handleClick1);
  window.removeEventListener('resize',handleClick3);

  clearInterval(autoPlayInterval);

  galleryTrack?.replaceChildren();
  prevBtn = null;
  nexBtn = null;
  galleryTrack = null;
  ourWork = null;
}