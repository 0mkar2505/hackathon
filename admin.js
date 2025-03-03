document.getElementById("adminLoginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    const response = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.token) {
        localStorage.setItem("adminToken", result.token);
        alert("Login successful!");
        fetchDonations();
    } else {
        alert("Invalid login credentials");
    }
});

async function fetchDonations() {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        alert("You must log in first!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/admin/donations", {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ✅ Send authentication token
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const donations = await response.json();
        console.log("Fetched Donations:", donations);

        const donationTable = document.getElementById("donationTable");
        donationTable.innerHTML = ""; // Clear previous data

        if (donations.length === 0) {
            donationTable.innerHTML = "<tr><td colspan='5'>No donations found.</td></tr>";
            return;
        }

        donations.forEach(donation => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${donation.name}</td>
                <td>${donation.email}</td>
                <td>₹${donation.amount}</td>
                <td>${new Date(donation.date).toLocaleString()}</td>
                <td><button onclick="deleteDonation(${donation.id})">Delete</button></td>
            `;
            donationTable.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching donations:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("adminToken");
    if (token) {
        fetchDonations();
    }
});


async function deleteDonation(id) {
    const confirmDelete = confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
        alert("You must log in first!");
        return;
    }


    const response = await fetch(`http://localhost:5000/admin/donations/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Add auth token
        }
    });

    const result = await response.json();
    alert(result.message);
    fetchDonations();
}
