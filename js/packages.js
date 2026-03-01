let packagesData = [];

export default async function loadPackages() {

    const packagesContainer = document.getElementById("packagesContainer");
    const pkgFilterButtons = document.querySelectorAll(".pkg-filter-btn");
    
    if(!packagesContainer || !pkgFilterButtons.length){
        console.warn("Packages DOM not found");
        return;
    }

    try{
        const res = await fetch ("data/packages.json");

        if(!res.ok){
            throw new Error("Failed to load packages data");
        }

        packagesData = await res.json();
        renderPackages(packagesContainer,packagesData);
        initPkgFilters(pkgFilterButtons,packagesContainer);
        //see if intersection function is needed
    } catch (err){
        console.error(err);
        packagesList.innerHTML = '<p>Packages unavailable at the moment</p>';
    }

}

//see if intersection function is needed

function renderPackages(packagesList,data){
    packagesList.innerHTML
}