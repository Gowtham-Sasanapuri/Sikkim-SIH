window.addEventListener("DOMContentLoaded", () => {
    const chatbox = document.querySelector('.chat');
    const inputField = document.getElementById("user_input"); 
    const send = document.getElementById("send_input");
    const mic_button = document.getElementById('mic');
    const langSelect = document.getElementById('lang');
    let home = document.querySelector("#headers .monastery")

    home.onclick = () => {
        window.location.href = "../Home Page/Home Page.html"
    }

    let selectedLanguage = 'en-IN';
    langSelect.value = selectedLanguage; 

    langSelect.addEventListener('change', (e) => {
        selectedLanguage = e.target.value;
        langSelect.value = selectedLanguage;
    });

    function getCurrentLanguage() {
        return selectedLanguage;
    }

    let is_speech = false;

    chatbox.innerHTML += `<div class="bot">
Hi! 👋 Welcome to the Sikkim Tourism Chatbot.  
I can help you learn about Sikkim’s monasteries, tourist spots, hotels, food, and travel tips.  
How can I help you today?
</div>`;

    function scrollToBottom() {
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function stripHtml(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }

    send.onclick = async function() {
        speechSynthesis.cancel();
        let input = inputField.value.trim(); 
        if (!input) return;

        chatbox.insertAdjacentHTML("beforeend",`<div class="user">${input}</div>`);
        const lastUserMsg = chatbox.lastElementChild;
    lastUserMsg.scrollIntoView({ behavior: "smooth", block: "end" });
        inputField.value = "";
        scrollToBottom();

        try {
            const res = await fetch("http://127.0.0.1:8000/chat/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ message: input, language: getCurrentLanguage() })
            });

            const data = await res.json();
            chatbox.insertAdjacentHTML("beforeend", `<div class="bot">${marked.parse(data.reply)}</div>`);
            const lastBotMsg = chatbox.lastElementChild;
        lastBotMsg.scrollIntoView({ behavior: "smooth", block: "end" });
            scrollToBottom();

            if (is_speech) {
                speechSynthesis.cancel();
                let speaker = new SpeechSynthesisUtterance(stripHtml(marked.parse(data.reply)));
                speaker.lang = getCurrentLanguage();
                speechSynthesis.speak(speaker);
                is_speech = false;
            }
        } catch (err) {
            console.error("Error:", err);
        }
    }


    inputField.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault(); 
            send.click();     
        }
    });

    mic_button.onclick = () => {
        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = getCurrentLanguage();

        recognition.onresult = (event) => {
            let speech_text = event.results[0][0].transcript;
            inputField.value = speech_text;
            is_speech = true;
            send.click();
        };
        recognition.start();
    };
});
