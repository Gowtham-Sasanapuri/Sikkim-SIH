const hospitals_container = document.getElementById("hospitalscontainer");
const searchBar = document.getElementById("search_bar");

let hospitalsData = [];

fetch("hospitals_data.json")
  .then(res => res.json())
  .then(hospitals => {
    hospitalsData = hospitals;
    displayHospitals(hospitalsData);
  })
  .catch(err => alert(err));

function displayHospitals(hospitals) {
  hospitals_container.innerHTML = ""; 

  hospitals.forEach(hospital => {
    const hospitals_card = document.createElement("div");
    hospitals_card.classList.add("hospitals_info");
    hospitals_card.innerHTML = `
      <div class="hospitals_image_card">
        <img class="hospitals_image" src="${hospital.image}" alt="${hospital.name}">
      </div>
      <div class="hospitals_details">
        <h2>${hospital.name}</h2>
        <p><i class="fa-solid fa-location-dot"></i> ${hospital.location}</p>
        <div class="rating"><i class="fa-solid fa-star"></i> ${hospital.rating}</div>
      </div>
    `;
    hospitals_container.append(hospitals_card);
  });
}

searchBar.addEventListener("input", e => {
  const searchText = e.target.value.toLowerCase();
  const filtered = hospitalsData.filter(hospital =>
    hospital.location.toLowerCase().includes(searchText)
  );
  displayHospitals(filtered);
});
