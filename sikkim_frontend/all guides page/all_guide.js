let guide_list = []
let cardsContainer = document.getElementById("cards");
let from_date_input = document.getElementById("from_date");
let to_date_input = document.getElementById("to_date");
let dates = document.getElementById("dates");
let Book_now_btn = document.getElementById("Book_now_btn")

function book_guide(G_username){
    console.log(G_username)
    let from_date = from_date_input.value.split("T")[0];
    let to_date = to_date_input.value.split("T")[0];
    let user = JSON.parse(localStorage.getItem("user"))
    let username = user.username
    console.log(username)
    fetch("http://127.0.0.1:8000/book_guide/",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            username,
            "guide" : G_username,
            from_date,
            to_date,
        })
    }).then(response => response.json())
    .then(data => {
        console.log(data,">>>>>>>")
        from_date_input.value = ""
        to_date_input.value = ""
        dates.style.display = "none" 
        if(data.success === true){
            alert(data.msg)
        }else if(data.success === false){
            alert(data.msg)
        }
        window.location.href = ""
    }).catch(err => console.error(err));
}

fetch("http://127.0.0.1:8000/guide_list/",{
    method : "GET",
}).then(response => response.json())
.then(data => {
    console.log(data);

    data.guide_li.forEach(guide => {
        // Create card div
        let card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="img">
                <img src="${guide.Guide_Image ? "http://127.0.0.1:8000" + guide.Guide_Image : './icons/default.png'}" alt="${guide.Guide_FullName}">
            </div>
            <div class="details">
                <div class="name_rating">
                    <p class="name">${guide.Guide_FullName}</p>
                    <p class="rating">4.5 <img src="./icons/star.png" alt=""></p>
                </div>
                <p>Phone Number : <span>${guide.Guide_Number}</span></p>
                <p>Experience : <span>${guide.Guide_experience}</span></p>
                <p>Gender : <span>${guide.Guide_Gender}</span></p>
                <p>Languages : <span>${guide.Guide_Languages_know}</span></p>
                <div class="btn">
                    <button>Book Guide</button>
                </div>
            </div>
        `;

        // Append card to container
        cardsContainer.appendChild(card);
        let G_username = guide.Guide_Username
        let book_guide_btn = card.querySelector(".details .btn button")
        book_guide_btn.addEventListener("click",() => {
            dates.style.display = "flex";
            
            Book_now_btn.addEventListener("click" ,() => {
                book_guide(G_username)
            })
                })
        let user = JSON.parse(localStorage.getItem("user"))
        let username = user.username
        fetch("http://127.0.0.1:8000/get_status/",{
            method :"POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                username,
                "guide" : G_username
            })
        }).then(response => response.json())
        .then(data => {
            console.log(data)
            if(data.status === 0){
                book_guide_btn.textContent = "Request Pending..."
                book_guide_btn.disabled = true;
                book_guide_btn.style.pointerEvents = "none";  
            }else{
                console.log(data.msg,data.status)
            }
            
        })
    });
})
.catch(err => console.error(err));