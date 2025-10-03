document.addEventListener('DOMContentLoaded', () => {
let user_json = JSON.parse(localStorage.getItem("user"))
    let user_name = user_json.username
    const grid = document.getElementById('incomplete-grid');
    
    fetch('http://127.0.0.1:8000/get_itinerary_for_user/',{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body:JSON.stringify({user_name})
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            data.data.forEach(trip => {
                if(trip.time_status === 0){
                    // trip_complete_btn.style.display = "flex"
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
                <h1>Day ${trip.day}</h1>
                <p><strong>Time:</strong> ${trip.time.slice(0, 5)}</p>
                <p><strong>Details:</strong> ${trip.trip_details}</p>       
            `;
            grid.appendChild(card);
                }
            })
            
        });
});