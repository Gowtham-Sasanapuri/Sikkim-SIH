
const userId = +localStorage.getItem("view_user_id");
let guide = JSON.parse(localStorage.getItem("user"))
let guide_name = guide.username
const bodyDiv = document.getElementById("body");

console.log(guide_name, userId);


fetch(`http://127.0.0.1:8000/find_itinerary_for_${userId}/`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ guide_name })
}).then(response => response.json())
    .then(data => {
        console.log(data);

        if (data.success) {
            bodyDiv.innerHTML = ""; // clear old content

            data.data.forEach(item => {
                const dayDiv = document.createElement("div");
                dayDiv.classList.add("day");

                // Format time (03:44:00 → 03:44)
                const timeFormatted = item.time ? item.time.slice(0, 5) : "";

                dayDiv.innerHTML = `
                    <p>Day ${item.day}</p>
                    <p>time : ${timeFormatted}</p>
                    <p>trip : ${item.trip_details}</p>
                `;

                bodyDiv.appendChild(dayDiv);
            });
        } else {
            alert(data.msg || "No itinerary found");
        }
    })
    .catch(error => {
        console.error("Error fetching itinerary:", error);
    });

