document.addEventListener("DOMContentLoaded", () => {

  let count = 1;

  let content = document.getElementById("content");
  let btn = document.getElementById("btn");
  let save_btn = document.getElementById("Save")
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userId = urlParams.get('user_id');
  let guide = JSON.parse(localStorage.getItem("user"))
  let guide_username = guide.username
  console.log("User ID:", userId, guide_username);

  function add_trip() {
    let wrapper = document.createElement("div");
    wrapper.className = "Day_itinerary";
    wrapper.innerHTML = `
    <h1 class="day">Day ${count} :</h1>
    <div class="day_tour">
      <div class="time_details"><input type="time" class="time"><input class="trip" type="text"><button class="delete_trip">Delete Trip</button></div>
      <button class="add_event">Add another</button>
    </div>
    <button class = "delete_day">Delete Day</button>`;

    count++;

    content.appendChild(wrapper);

    let add_btn = wrapper.querySelector(".add_event");

    add_btn.addEventListener("click", () => {
      let div = document.createElement("div");
      div.className = "time_details";
      div.innerHTML = `<input type="time" class="time"><input class="trip" type="text"><button class="delete_trip">Delete Trip</button>`;
      add_btn.insertAdjacentElement("beforebegin", div);
      div.querySelector(".delete_trip").addEventListener("click", () => {
        div.remove();
      });
    });
    wrapper.querySelector(".delete_trip").addEventListener("click", (e) => {
      e.target.closest(".time_details").remove();
    });

    // Attach delete event for the whole day
    wrapper.querySelector(".delete_day").addEventListener("click", () => {
      count--;
      wrapper.remove();
      const allDays = document.querySelectorAll("#content .Day_itinerary");
      allDays.forEach((dayDiv, index) => {
        const header = dayDiv.querySelector(".day");
        header.textContent = `Day ${index + 1} :`;
      });
    });
  }

  save_btn.addEventListener("click", () => {
    let trip_details = []
    let obj
    let Day_itinerary = document.querySelectorAll("#content .Day_itinerary")
    if (Day_itinerary.length === 0) {
      alert("Create Itinerary")
    } else {
      let hasEmptyField = false;
      Day_itinerary.forEach((ele, ind) => {
        let dayHeader = ele.querySelector(".day")
        let day = dayHeader ? dayHeader.textContent.trim() : ""
        let day_tour = ele.querySelectorAll(".day_tour div")
        day_tour.forEach((element) => {
          let timeVal = element.querySelector(".time").value.trim();
          let tripVal = element.querySelector(".trip").value.trim();

          if (!timeVal || !tripVal) {
            hasEmptyField = true; // Mark if any field is empty
          }

          obj = {
            "Day": day,
            "time": element.querySelector(".time").value,
            "trip": element.querySelector(".trip").value
          }
          trip_details.push(obj)
        })
      })
      if (hasEmptyField) {
        alert("All time and trip fields must be filled out!");
        return; // Stop submission if any field is empty
      }
      console.log(trip_details);
      fetch("http://127.0.0.1:8000/store_itinerary/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          "trip": trip_details,
          guide_name: guide_username
        })
      }).then(responser => responser.json())
        .then(data => {
          console.log(data)
          if(data.success){
            alert(data.message)
            window.location.reload()
          }else{
            alert("technical issue try again after some time")
          }
        })
    }
  })

  btn.addEventListener("click", () => add_trip());
});
