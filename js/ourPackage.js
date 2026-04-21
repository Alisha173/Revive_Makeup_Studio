export async function initOurPackage(){
  try{
    const res=await fetch("data/packages.json");
    if(!res.ok)
      throw new Error("unable to fetch data");
    const data=await res.json();
     const filteredData=data.bridal.packages.slice(1,4);
  loadPackages(filteredData);
  }
  catch(err){
    console.log("error:"+err);
  }

}
const loadPackages=(data)=>{
  const pkgTrack=document.querySelector(".pkgTrack");
  
  data.forEach((item)=>{
    const li=document.createElement("div");
    li.className=`pkgSlide ${item.isPopular?"popular":''}`;
    li.innerHTML=`
    <div class="topPart">
      <div class="textContent">
        <h3>${item.name}</h3>
        <p style="font-size:12px;color:gray;">${item.target}</p>
      </div>
      
      <div ><button class="dropDownBtn"><i class="fa-solid fa-angle-down"></i></button></div>
    </div>
     <div class="priceList"> 
          <p class="offerPrice">${item.offer?item.price:item.originalPrice}</p>
          <p class="actualPrice">${item.offer?item.originalPrice:''}</p>
          <span class="offerBox" style="display:${item.offer?"flex":"none"}">OFFER</span>
        </div>
    <div class="midPart">
      <ul>
        ${item.features.map(feature=>`<li style="font-size:12px;">${feature}</li>`).join("")}
      </ul>
    </div>
    <div class="botPart">
      <a class="bkNow" href="#callback">Book now</a>
    </div>
    `;
    pkgTrack.appendChild(li);
  })
  pkgTrack.addEventListener('click',handleBtn);
}


const handleBtn = (e) => {
  // --- NEW CODE: Check if the user clicked the "Book Now" button ---
  const bookBtn = e.target.closest(".bkNow");
  if (bookBtn) {
    // We need to grab the package name to save it. 
    // It's located in the h3 tag inside the same card.
    const card = bookBtn.closest(".pkgSlide");
    const packageName = card.querySelector("h3").textContent;
    
    // Save it to session storage just like the main packages page does
    sessionStorage.setItem("selectedPackage", packageName);
    return; // Exit the function, letting the standard href="#callback" do its job
  }
  // --- END NEW CODE ---

  // Existing dropdown logic
  const btn = e.target.closest(".dropDownBtn");
  if (!btn) return;
  const card = btn.closest(".pkgSlide");
  const mid = card.querySelector(".midPart");
  
  btn.classList.toggle("active");
  
  if (mid.style.maxHeight && mid.style.maxHeight !== "0px")
    mid.style.maxHeight = "0px";
  else
    mid.style.maxHeight = mid.scrollHeight + "px";
} 
