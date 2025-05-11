// Initiera Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
// Variabel för att lagra API-nyckeln
let OPENAI_API_KEY = "";

// Hämta API-nyckeln från Firebase
function fetchAPIKey() {
    const apiKeyRef = database.ref("SmartPlant/apikeys/openai_key");
    apiKeyRef.once("value", (snapshot) => {
        OPENAI_API_KEY = snapshot.val();
        console.log("API-nyckel laddad:", OPENAI_API_KEY);
    }).catch((error) => {
        console.error("Fel vid hämtning av API-nyckel:", error);
    });
}

// Kör funktionen för att hämta API-nyckeln
fetchAPIKey();

function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function checkStatus() {
    const waterLevelElement = document.getElementById("water-level");
    const soilMoistureElement = document.getElementById("soil-moisture");

    const arduinoIP = "http://192.168.1.100"; // Byt ut med Arduino IP-adress
    const endpoint = `${arduinoIP}/data`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            waterLevelElement.textContent = `Vattennivå: ${data.waterLevel}%`;
            soilMoistureElement.textContent = `Jordfuktighet: ${data.soilMoisture}%`;
        })
        .catch(error => {
            console.error("Fel vid hämtning av data:", error);
            waterLevelElement.textContent = "Kunde inte hämta data.";
            soilMoistureElement.textContent = "Kunde inte hämta data.";
        });
}


async function handleAIQuestion() {
    const question = document.getElementById("ai-question").value.trim();
    const responseBox = document.getElementById("ai-response");

    if (!question) {
        responseBox.textContent = "Skriv in en fråga först.";
        return;
    }

    responseBox.textContent = "AI svarar...";

    if (!OPENAI_API_KEY) {
        responseBox.textContent = "API-nyckeln kunde inte laddas från Firebase.";
        console.error("Ingen API-nyckel hittades.");
        return;
    }
    
    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Du är en expert på växter och växtvård. Svara endast på frågor som handlar om växter och växtskötsel. Om frågan inte handlar om växter, svara med 'Jag kan endast svara på frågor om växter och växtskötsel.'"
            },
            {
                role: "user",
                content: question
            }
        ],
        max_tokens: 400,
        temperature: 0.7
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (response.ok) {
            responseBox.textContent = data.choices[0].message.content.trim();
        } else {
            console.error("Fel vid API-anrop:", data);
            responseBox.textContent = `Fel: ${data.error.message}`;
        }
    } catch (error) {
        console.error("Fel vid anrop till OpenAI API:", error);
        responseBox.textContent = "Ett fel uppstod. Försök igen.";
    }
}






