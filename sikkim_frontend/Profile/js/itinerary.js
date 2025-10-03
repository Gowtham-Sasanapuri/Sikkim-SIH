document.addEventListener('DOMContentLoaded', () => {
    let user_json = JSON.parse(localStorage.getItem("user"))
    let user_name = user_json.username
    let header = document.getElementById("header")
    let trip_complete_btn = document.getElementById("itinerary_completion")
    const grid = document.getElementById('itinerary-grid');

    trip_complete_btn.addEventListener("click",() => {

        let opi = confirm("Have you completed your journey in Sikkim?")
        if(!opi){
            return console.log("returned")
        }
        // console.log("continue")
        fetch("http://127.0.0.1:8000/trip_completion/",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({user_name})
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.success){
                alert(data.msg)
                window.location.reload()
            }
        })
    })

    fetch('http://127.0.0.1:8000/get_itinerary_for_user/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_name })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if(data.data.length === 0){
                header.style.display = "none"
                let info = document.createElement("h1")
                info.textContent = "Yor are not assigned to any of the Tour Guide in our application"
                grid.appendChild(info)
            }else{
                header.textContent = `Itinerary by Guide "${data.guide_name}"`
            }
            
            
            data.data.forEach(trip => {
                // Create card container
                if (trip.trip_status === 0) {
                    trip_complete_btn.style.display = "flex"
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.style.border = "1px solid #ccc";
                    card.style.padding = "15px";
                    card.style.margin = "10px";
                    card.style.borderRadius = "8px";
                    // card.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                    card.style.width = "200px";

                    // Populate card content
                    card.innerHTML = `
                <h2>Day ${trip.day}</h2>
                <p><strong>Time:</strong> ${trip.time.slice(0, 5)}</p>
                <p><strong>Details:</strong> ${trip.trip_details}</p>
            `;
                    // Create buttons container
                    const btnContainer = document.createElement('div');
                    btnContainer.style.display = "flex";
                    // btnContainer.style.justifyContent = "space-between";
                    btnContainer.style.marginTop = "10px";
                    // Create Completed button
                    const completedBtn = document.createElement('button');
                    if (trip.time_status === 1) {
                        completedBtn.textContent = "Trip Completed";
                        let img = document.createElement("img")
                        img.src = "icons/successful.png"
                        img.width = 20;
                        img.height = 20;
                        btnContainer.appendChild(img)

                    } else {
                        completedBtn.textContent = "Complete Trip";
                    }

                    completedBtn.style.backgroundColor = "#0444aaff";
                    completedBtn.style.color = "#fff";
                    completedBtn.style.border = "none";
                    completedBtn.style.padding = "5px 10px";
                    completedBtn.style.borderRadius = "5px";
                    completedBtn.style.cursor = "pointer";
                    // Append buttons to container
                    btnContainer.appendChild(completedBtn);
                    // Append button container to card
                    card.appendChild(btnContainer);
                    // Append card to grid
                    grid.appendChild(card);
                    let trip_id = trip.id
                    completedBtn.addEventListener("click", () => {
                        fetch("http://127.0.0.1:8000/update_itinerary/", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ trip_id })
                        }).then(response => response.json())
                            .then(data => {
                                console.log(data)
                                if (data.success) {
                                    completedBtn.textContent = "Completed"
                                    let img = document.createElement("img")
                                    img.src = "../icons/successful.png"
                                    btnContainer.appendChild(img)
                                }
                            })
                    })

                    trip_complete_btn
                }
            });

        });
});