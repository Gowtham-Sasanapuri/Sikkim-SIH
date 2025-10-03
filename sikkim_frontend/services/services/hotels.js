const hotels_container = document.getElementById("hotelscontainer");
const searchBarHotels = document.getElementById("search_bar");

let hotelsData = [];

fetch("hotels_data.json")
  .then(res => res.json())
  .then(hotels => {
    hotelsData = hotels;
    displayHotels(hotelsData);
  })
  .catch(err => alert(err));

function displayHotels(hotels) {
  hotels_container.innerHTML = ""; 

  hotels.forEach(hotel => {
    const hotel_card = document.createElement("div");
    hotel_card.classList.add("hotels_info");
    hotel_card.innerHTML = `
      <div class="hotel_image_card">
        <img class="hotel_image" src="${hotel.image}" alt="${hotel.name}">
      </div>
      <div class="hotel_details">
        <h2>${hotel.name}</h2>
        <p><i class="fa-solid fa-location-dot"></i> ${hotel.location}</p>
        <p id="hotel_des">${hotel.description}</p>
        <div class="rating"><i class="fa-solid fa-star"></i> ${hotel.rating}</div>
      </div>
    `;
    hotels_container.append(hotel_card);
  });
}

searchBarHotels.addEventListener("input", e => {
  const searchText = e.target.value.toLowerCase();
  const filtered = hotelsData.filter(hotel =>
    hotel.location.toLowerCase().includes(searchText)
  );
  displayHotels(filtered);
});
