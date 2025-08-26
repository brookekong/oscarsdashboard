document.addEventListener("DOMContentLoaded", function () {
    document.body.style.fontFamily = "National 2, sans-serif";
});

let distributors = {};

// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", async () => {
    await fetchData(); // Load JSON data
    setupSidebar();    // Populate sidebar after fetching data
    updateDashboard("Universal Pictures"); // Default chart loaded
});

// Fetch data from JSON file
async function fetchData() {
    try {
        const response = await fetch("data.json");
        distributors = await response.json();
        setupSidebar(); // Populate sidebar after data is loaded
    } catch (error) {
        console.error("Error loading distributor data:", error);
    }
}

function setupSidebar() {
    const sidebarList = document.querySelector(".sidebar ul");
    sidebarList.innerHTML = ''; // Clear existing content

    if (!distributors || Object.keys(distributors).length === 0) {
        console.warn("No distributors data available.");
        return;
    }

    Object.keys(distributors).forEach(studioName => {
        const listItem = document.createElement("li");

        const icon = document.createElement("i");
        icon.classList.add("fa", "fa-film"); // Use a film icon from FontAwesome
        icon.style.marginRight = "6px"; // Space between icon and text


        // Append the icon and text
        listItem.appendChild(icon);
        listItem.appendChild(document.createTextNode(studioName));
        
        sidebarList.appendChild(listItem);

        // Highlight "Universal Pictures" as default
        if (studioName === "Universal Pictures") {
            listItem.classList.add("active");
        }

        // Add event listener for each studio
        listItem.addEventListener("click", () => {
            document.querySelector(".sidebar .active")?.classList.remove("active");
            listItem.classList.add("active");
            updateDashboard(studioName);
        });
    });
}



// Update dashboard with selected studio data
function updateDashboard(studioName) {
    const data = distributors[studioName];
    if (!data) return;

    document.getElementById("totalFilms").textContent = data.totalFilms || "N/A";
    document.getElementById("womenBTS").textContent = data.womenBTS || "N/A";
    document.getElementById("underrepresentedBTS").textContent = data.underrepresentedBTS || "N/A";
    document.getElementById("inclusionScore").textContent = data.inclusionScore || "N/A";

    // Ensure genderLineChart data exists before updating chart
    if (data.genderLineChart) {
        updateGenderLineChart(studioName, data);
    } else {
        console.warn(`No genderLineChart data available for ${studioName}`);
    }
}

let overtimeChart;

function updateGenderLineChart(studioName, data) {
    if (!data.overtimeChart) {
        console.error(`No overtimeChart data available for ${studioName}`);
        return;
    }

    const ctx = document.getElementById("overtimeChart").getContext("2d");
    
    if (overtimeChart) {
        overtimeChart.destroy(); // Destroy previous instance to avoid duplication
    }

    overtimeChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
            datasets: [
                {
                    label: "White",
                    data: data.overtimeChart.white,
                    borderColor: "#990000",
                    backgroundColor: "rgba(153, 0, 0, 0.1)",
                    fill: true,
                },
                {
                    label: "Underrepresented",
                    data: data.overtimeChart.underrepresented,
                    borderColor: "#FFCC00",
                    backgroundColor: "rgba(255, 204, 0, 0.1)",
                    fill: true,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                
                legend: {
                    labels: {
                        font: {
                            family: "National 2",
                            size: 12
                        }
                    }
                }
            },
            scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
            }
        }
    });    
}

function updateDashboard(studioName) {
    const data = distributors[studioName];
    if (!data) return;

    document.getElementById("totalFilms").textContent = data.totalFilms || "N/A";
    document.getElementById("womenBTS").textContent = data.womenBTS || "N/A";
    document.getElementById("underrepresentedBTS").textContent = data.underrepresentedBTS || "N/A";
    document.getElementById("inclusionScore").textContent = data.inclusionScore || "N/A";

    if (data.overtimeChart) {
        updateGenderLineChart(studioName, data);
    }

    if (data.genderLineChart) {
        updateGenderChart(studioName, data);
        updateGenderBarChart(studioName, data); // <--- make sure you call this
    }

    if (data.racialChart) {
        updateRacialPieChart(studioName, data); // <--- and this
    }
}

let genderChart;

function updateGenderChart(studioName, data) {
    if (!data.genderLineChart) {
        console.error(`No genderLineChart data available for ${studioName}`);
        return;
    }

    const ctx = document.getElementById("genderChart").getContext("2d");

    if (genderChart) {
        genderChart.destroy(); // Destroy previous instance to avoid duplication
    }

    genderChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
            datasets: [
                {
                    label: "Men BTS",
                    data: data.genderLineChart.menBTS,
                    backgroundColor: "#990000", // Dark Red for Men
                    borderColor: "#990000",
                    borderWidth: 1
                },
                {
                    label: "Women BTS",
                    data: data.genderLineChart.womenBTS,
                    backgroundColor: "#FFCC00", // Yellow for Women
                    borderColor: "#FFCC00",
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // Ensures proper resizing
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: "National 2",
                            size: 12  // Adjust legend font size for smaller screens
                        }
                    }
                }
            },
            scales: {
                x: { 
                    beginAtZero: true, 
                },
                y: { 
                    beginAtZero: true, 
                }
            }
        }
    });
}



function updateDashboard(studioName) {
    const data = distributors[studioName];
    if (!data) return;

    document.getElementById("totalFilms").textContent = data.totalFilms || "N/A";
    document.getElementById("womenBTS").textContent = data.womenBTS || "N/A";
    document.getElementById("underrepresentedBTS").textContent = data.underrepresentedBTS || "N/A";
    document.getElementById("inclusionScore").textContent = data.inclusionScore || "N/A";

    if (data.overtimeChart) {
        updateGenderLineChart(studioName, data);
    } else {
        console.warn(`No overtimeChart data available for ${studioName}`);
    }

    if (data.genderLineChart) {
        updateGenderChart(studioName, data);
    } else {
        console.warn(`No genderLineChart data available for ${studioName}`);
    }
}



let racialPieChart;

function updateRacialPieChart(studioName, data) {
    if (!data.racialChart) {
        console.error(`No racialChart data available for ${studioName}`);
        return;
    }

    const ctx = document.getElementById("racialPieChart").getContext("2d");

    if (racialPieChart) {
        racialPieChart.destroy(); // Destroy previous chart instance
    }

    racialPieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["White", "Underrepresented"],
            datasets: [
                {
                    data: data.racialChart,
                    backgroundColor: ["#990000", "#FFCC00"], // Red & Yellow
                    borderColor: "#FFFFFF",
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: "National 2",
                            size: 12
                        }
                    }
                }
            }
        }
    });
}




let genderBarChart;

function updateGenderBarChart(studioName, data) {
    if (!data.genderChart) {
        console.error(`No genderChart data available for ${studioName}`);
        return;
    }

    const ctx = document.getElementById("genderBarChart").getContext("2d");

    if (genderBarChart) {
        genderBarChart.destroy(); // Destroy previous chart instance
    }

    genderBarChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
            datasets: [
                {
                    label: "Gender Inclusion Score",
                    data: data.genderChart,
                    backgroundColor: "#990000", 
                    borderColor: "#990000",
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // Ensures proper resizing
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: "National 2",
                            size: 12
                        }
                    }
                }
            },
            scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
            }
        }
    });
}




function updateDashboard(studioName) {
    const data = distributors[studioName];
    if (!data) return;

    document.getElementById("totalFilms").textContent = data.totalFilms || "N/A";
    document.getElementById("womenBTS").textContent = data.womenBTS || "N/A";
    document.getElementById("underrepresentedBTS").textContent = data.underrepresentedBTS || "N/A";
    document.getElementById("inclusionScore").textContent = data.inclusionScore || "N/A";

    if (data.overtimeChart) updateGenderLineChart(studioName, data);
    if (data.genderLineChart) updateGenderChart(studioName, data);
    if (data.racialChart) updateRacialPieChart(studioName, data);
    if (data.genderChart) updateGenderBarChart(studioName, data);
}

document.addEventListener("DOMContentLoaded", function () {
    function adjustLayout() {
        let screenWidth = window.innerWidth;
        let elements = document.querySelectorAll(".responsive-element");
        
        elements.forEach(element => {
            if (screenWidth < 768) {
                element.style.fontSize = "14px";
                element.style.padding = "10px";
            } else {
                element.style.fontSize = "18px";
                element.style.padding = "20px";
            }
        });
    }
    
    window.addEventListener("resize", adjustLayout);
    adjustLayout(); // Ensure layout adjusts on load
});




document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const secondSidebar = document.getElementById("second-sidebar");
    const distributorList = document.getElementById("distributor-list");

    // Toggle sidebar visibility
    menuToggle.addEventListener("click", function () {
        secondSidebar.classList.toggle("open");
    });

    // Function to populate the sidebar with distributors
    function populateDistributors() {
        distributorList.innerHTML = ""; // Clear previous content

        if (!distributors || Object.keys(distributors).length === 0) {
            console.warn("No distributors data available.");
            return;
        }

        Object.keys(distributors).forEach(studioName => {
            const button = document.createElement("button");
            button.textContent = studioName;
            button.addEventListener("click", () => {
                updateDashboard(studioName);
                secondSidebar.classList.remove("open"); // Close sidebar after selection
            });
            distributorList.appendChild(button);
        });
    }

    // Fetch distributors and populate sidebar
    async function fetchData() {
        try {
            const response = await fetch("data.json");
            distributors = await response.json();
            populateDistributors();
        } catch (error) {
            console.error("Error loading distributor data:", error);
        }
    }

    fetchData();
});



// Get all info-buttons
const infoBtns = document.querySelectorAll('.info-btn');

// Add event listeners to each button
infoBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Find the associated popup
        const popup = this.nextElementSibling;

        // Toggle visibility of the popup
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    });
});



// Function to fetch data from data.json and create the chart
fetch('data.json')
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        createWomenBTSChart(data); // Call the function to create the chart with the fetched data
    })
    .catch(error => console.error('Error fetching the data:', error));

// Function to create the "Women BTS" chart
function createWomenBTSChart(data) {
    const labels = [];
    const womenBTSValues = [];

    // Extract distributor names and womenBTS values
    for (const distributor in data) {
        if (data[distributor].womenBTS) {
            labels.push(distributor);
            womenBTSValues.push(data[distributor].womenBTS);
        }
    }

    const ctx = document.getElementById("womenBTSChart").getContext("2d");

    const womenBTSChart = new Chart(ctx, {
        type: "bar", // Bar chart
        data: {
            labels: labels, // Distributor names
            datasets: [
                {
                    label: "Women BTS",
                    data: womenBTSValues,
                    backgroundColor: "#990000"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hide legend
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Distributors"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Number of Women in BTS Roles"
                    },
                    beginAtZero: true
                }
            }
        }
    });
}






// Function to fetch data from data.json and create the chart
fetch('data.json')
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        createUnderrepresentedBTSChart(data); // Call the function to create the chart with the fetched data
    })
    .catch(error => console.error('Error fetching the data:', error));

// Function to create the "Underrepresented BTS" chart
function createUnderrepresentedBTSChart(data) {
    const labels = [];
    const underrepresentedBTSValues = [];

    // Extract distributor names and underrepresentedBTS values
    for (const distributor in data) {
        if (data[distributor].underrepresentedBTS) {
            labels.push(distributor);
            underrepresentedBTSValues.push(data[distributor].underrepresentedBTS);
        }
    }

    const ctx = document.getElementById("underrepresentedBTSChart").getContext("2d");

    const underrepresentedBTSChart = new Chart(ctx, {
        type: "bar", // Bar chart
        data: {
            labels: labels, // Distributor names
            datasets: [
                {
                    label: "Underrepresented BTS",
                    data: underrepresentedBTSValues,
                    backgroundColor: "#990000"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hide legend
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Distributors"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Number of Underrepresented in BTS Roles"
                    },
                    beginAtZero: true
                }
            }
        }
    });
}





fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Convert object to entries to map over distributor name and values
    const entries = Object.entries(data);

    const distributors = entries.map(([name, _]) => name);
    const totalFilmsData = entries.map(([_, values]) => values.totalFilms);

    const chartData = {
      labels: distributors,
      datasets: [{
        label: 'Total Films',
        data: totalFilmsData,
        backgroundColor: '#FFCC00'
      }]
    };

    const config = {
      type: 'bar',
      data: chartData,
      options: {
        indexAxis: 'y', // horizontal bars
        elements: {
          bar: {
          }
        },
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Total Films by Distributor'
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    };

    const ctx = document.getElementById('totalFilmsChart').getContext('2d');
    new Chart(ctx, config);
  })
  .catch(error => console.error('Error loading or parsing data:', error));



  


  