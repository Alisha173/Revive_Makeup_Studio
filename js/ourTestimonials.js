let autoplay;
let curIndex;
let maxindex;
export const initOurTestimonials=()=>{
  fetch("data/testimonials.json")
  .then(res=>res.json())
  .then(d=>d.filter(da=>da.image!==null && Array.isArray(da.image) && da.image.length > 0).slice(0, 5))
  .then(data=>loadOurTestimonials(data))
  .catch(err=>console.log("Error:"+err))
}
const quoteIcon = `
  <svg
    class="testimonial-quote-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
    <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
  </svg>
`;

function loadOurTestimonials(data){
  curIndex=0;
  const testTrack=document.querySelector(".testTrack");
  const slideDots=document.querySelector(".slide-dots");
  
  if (!testTrack) return;

  testTrack.innerHTML = "";
  maxindex=data.length-1;
  data.forEach((item,idx) => {
    const li=document.createElement("li");
    const dot=document.createElement("div");
    dot.className=`dot ${idx===0?"active":""}`;
    li.className=`OTslide ${idx===0?"active":""}`;
    const charLimit = 200;
      
      let displayedText = item.text;

      if (displayedText.length > charLimit) {
        
        displayedText = displayedText.substring(0, charLimit);
        displayedText = displayedText.substring(0, displayedText.lastIndexOf(" ")) + "...";
      }
    li.innerHTML=`
        <div class="testimonial-image-container">
          <img 
            src="${item.image[0]}" 
            alt="${item.name}" 
            class="testimonial-image"
          />
        </div>
        <div class="testimonial-text">
          ${quoteIcon}
          <blockquote>
            "${displayedText}"
          </blockquote>
          <footer>
            <div class="client-name">${item.name}</div>
            <div class="client-meta">
              <span class="meta-item">${item.subtitle}</span>
              <span class="meta-item">${item.location}</span>
              <span class="meta-item">${item.date}</span>
            </div>
          </footer>
        </div>
      `;
      testTrack.appendChild(li);

      slideDots.appendChild(dot);
  });
  if(autoplay)
    clearInterval(autoplay);
  startAutoplay();
  const testPreBtn=document.querySelector("#testPreBtn");
  const testNexBtn=document.querySelector("#testNexBtn");
  testPreBtn.addEventListener("click",handleclick2);
  testNexBtn.addEventListener("click",handleclick1);
}
function startAutoplay(){
  autoplay=setInterval(()=>{
    moveSlide(curIndex+1);
  },5000);
}
function moveSlide(index){
  if(index>maxindex)
    curIndex=0;
  else if(index<0)
    curIndex=maxindex;
  else
    curIndex=index;

  const slides=document.querySelectorAll(".OTslide");
  const dots=document.querySelectorAll(".slide-dots .dot")
  if(slides.length===0)return;
 slides.forEach((slide,idx)=>{
  slide.classList.remove("active");
  dots[idx].classList.remove("active");
});

  dots[curIndex].classList.add("active");
  slides[curIndex].classList.add("active");
}
function handleclick1(){
  clearInterval(autoplay);
  moveSlide(curIndex+1);
  startAutoplay();
}
function handleclick2(){
  clearInterval(autoplay);
  moveSlide(curIndex-1);
  startAutoplay();
}
export function destroyOurTestimonials(){
  const testPreBtn=document.querySelector("#testPreBtn");
  const testNexBtn=document.querySelector("#testNexBtn");
  testPreBtn.removeEventListener("click",handleclick2);
  testNexBtn.removeEventListener("click",handleclick1);
  clearInterval(autoplay);
  autoplay=null;
}