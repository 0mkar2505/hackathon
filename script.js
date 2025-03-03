const programs = [
    {
        title: "Nourish India Program (Nationwide)",
        description: "Objective: Provide nutritious meals & micronutrient supplements to vulnerable children.",
        impact: [
            "✅ 35% improvement in child growth indicators.",
            "✅ Reduction in anemia by 20% among school-going children."
        ],
        image: "Program/Program (1).png"
    },
    {
        title: "Healthy Mothers, Healthy Future (Maharashtra, Rajasthan, Bihar, UP)",
        description: "Objective: Improve maternal nutrition through fortified food distribution & awareness programs.",
        impact: [
            "✅ 17% increase in healthy birth weights.",
            "✅ 25% reduction in iron-deficiency anemia."
        ],
        image: "Program/Program (2).png"
    },
    {
        title: "Swachh Poshan Abhiyan (Jharkhand, Odisha, MP, Chhattisgarh)",
        description: "Objective: Address malnutrition caused by poor sanitation & water quality.",
        impact: [
            "✅ Installation of 10,000 water purification units in rural areas.",
            "✅ 30% decrease in diarrheal diseases among children under 5."
        ],
        image: "Program/Program (3).png"
    },
    {
        title: "Digital Nutrition Awareness Drive (Urban & Rural Outreach)",
        description: "Objective: Use mobile technology to spread nutrition awareness.",
        impact: [
            "✅ AI-powered chatbot providing customized dietary advice.",
            "✅ 60% of users reported improved diet choices."
        ],
        image: "Program/Program (4).png"
    }
];

let currentProgram = 0;

function updateProgram() {
    const titleElement = document.getElementById("program-title");
    const descElement = document.getElementById("program-description");
    const impactList = document.getElementById("program-impact");
    const imageElement = document.getElementById("program-image");

    if (!titleElement || !descElement || !impactList || !imageElement) return;

    titleElement.textContent = programs[currentProgram].title;
    descElement.textContent = programs[currentProgram].description;
    imageElement.src = programs[currentProgram].image;
    imageElement.alt = programs[currentProgram].title;

    impactList.innerHTML = "";
    programs[currentProgram].impact.forEach(point => {
        let li = document.createElement("li");
        li.textContent = point;
        impactList.appendChild(li);
    });
}

function nextProgram() {
    currentProgram = (currentProgram + 1) % programs.length;
    updateProgram();
}

function prevProgram() {
    currentProgram = (currentProgram - 1 + programs.length) % programs.length;
    updateProgram();
}

document.addEventListener("DOMContentLoaded", updateProgram);

function donateNow() {
    window.location.href = "donate.html"; // Redirect to the donation page
}

document.getElementById("donationForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const donationData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        amount: document.getElementById("amount").value
    };

    try {
        const response = await fetch("http://localhost:5000/donate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donationData)
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Error:", error);
        alert("Donation failed. Please try again.");
    }
});

async function fetchDonations() {
    try {
        const response = await fetch("http://localhost:5000/donations");
        const donations = await response.json();

        const donationList = document.getElementById("donationList");
        donationList.innerHTML = "";

        donations.forEach(donation => {
            const li = document.createElement("li");
            li.textContent = `${donation.name} donated ₹${donation.amount}`;
            donationList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching donations:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchDonations);
