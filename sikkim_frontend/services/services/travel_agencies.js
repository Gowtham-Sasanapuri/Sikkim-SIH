let container=document.getElementById('agencies_container')
fetch('sikkim_travel_agents_data.json')
.then(res=>res.json())
.then(data=>{
    data.forEach(travel_agency=>{
        const agency_card=document.createElement('div');
        agency_card.classList.add('travel_agencies');
        agency_card.innerHTML=`
        <div class="image_card">
        <img src="${travel_agency.image}" id="image-agency">
        </div>
        <div class="agency_info">
        <h2>${travel_agency.name}</h2>
        <div class="contact_details">
        <p><i class="fa-solid fa-location-dot"></i> ${travel_agency.location}</p>
        <p><i class="fa-solid fa-phone"></i> ${travel_agency.contact}</p>
        <p><i class="fa-solid fa-envelope"></i> ${travel_agency.email}</p>
        </div>
        </div>
        `;
        container.appendChild(agency_card)
    })

})
.catch(err=>{
    console.log(err);
})
