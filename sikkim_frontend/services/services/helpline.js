const number_container=document.getElementById('numbers_container');
fetch("helpline_numbers.json")
.then(res=>res.json())
.then(numbers=>{
    numbers.forEach(number=>{
        const number_card=document.createElement('div');
        number_card.classList.add('helpline_numbers')
        number_card.innerHTML=`
        <div class="helpline_image">
        <img class="designated_person" src="${number.image}" alt="${number.name}">
        </div>
        <div class="helpline_details">
        <h2>${number.Designation}</h2>
        <h3>${number.Name}</h3>
        <p><i class="fa-solid fa-location-dot"></i> ${number.District}</P>
        <p id="contact_number"><i class="fa-solid fa-phone"></i> ${number.Contact}</P>
        </div>
        `;
        number_container.append(number_card);

    })
})
.catch(err=>{
    alert(err)
})