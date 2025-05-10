function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
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






