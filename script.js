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


const OPENAI_API_KEY = "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";  

async function handleAIQuestion() {
    const question = document.getElementById("ai-question").value.trim();
    const responseBox = document.getElementById("ai-response");

    if (!question) {
        responseBox.textContent = "Skriv in en fråga först.";
        return;
    }

    responseBox.textContent = "AI svarar...";

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






