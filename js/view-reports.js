import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "./firebase.js";

const reportsContainer = document.getElementById("reportsContainer");
const filterCategory = document.getElementById("filterCategory");

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageNumbers = document.getElementById("pageNumbers");

let reports = [];
let currentPage = 1;
const reportsPerPage = 5;

// 🔹 Fetch reports from Firestore
async function loadReports() {
  reportsContainer.innerHTML = "<p>Loading reports...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "reports"));
    reports = [];
    querySnapshot.forEach(doc => reports.push({ id: doc.id, ...doc.data() }));
    renderPage();
  } catch (error) {
    console.error("Error loading reports:", error);
    reportsContainer.innerHTML = "<p>⚠️ Failed to load reports. Check console for details.</p>";
  }
}

// 🔹 Render a page of reports
function renderPage() {
  reportsContainer.innerHTML = "";

  const selectedCategory = filterCategory.value;
  const filtered = selectedCategory === "all"
    ? reports
    : reports.filter(r => r.category === selectedCategory);

  const totalPages = Math.ceil(filtered.length / reportsPerPage);
  if (currentPage > totalPages) currentPage = totalPages || 1;

  const start = (currentPage - 1) * reportsPerPage;
  const end = start + reportsPerPage;
  const currentReports = filtered.slice(start, end);

  if (currentReports.length === 0) {
    reportsContainer.innerHTML = "<p>No reports found.</p>";
    return;
  }

  currentReports.forEach(report => {
    const status = report.status || "Pending";
    const severity = report.severity || "Low";

    // ✅ Format timestamp
    let formattedDate = "";
    if (report.createdAt) {
      try {
        const date = report.createdAt.toDate
          ? report.createdAt.toDate()
          : new Date(report.createdAt.seconds * 1000);
        formattedDate = date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      } catch {
        formattedDate = String(report.createdAt);
      }
    }

    // 🔹 Create report card
    const card = document.createElement("div");
    card.className = "report-card";
    card.innerHTML = `
      <img src="${report.images && report.images[0] ? report.images[0] : 'https://via.placeholder.com/70'}" alt="Report">
      <div class="report-info">
        <h3>${report.category?.charAt(0).toUpperCase() + report.category?.slice(1) || "Report"}
          <span class="category-badge">${report.category || "N/A"}</span>
        </h3>
        <p>${report.description || "No description"}</p>
        <p><strong>${report.address || "No address"}</strong></p>
        <div>
          <span class="status-badge status-${status.replace(/\s/g, '')}">${status}</span>
          <span class="severity-badge severity-${severity}">${severity}</span>
        </div>
        <small>${formattedDate}</small>
      </div>
    `;

    // 🔹 When clicked → save data to localStorage + go to details page
    card.addEventListener("click", () => {
      const selectedReport = {
        title: `${report.category?.charAt(0).toUpperCase() + report.category?.slice(1)} Issue`,
        description: report.description || "No description",
        image: report.images && report.images[0] ? report.images[0] : "https://via.placeholder.com/300",
        category: report.category || "N/A",
        severity: report.severity || "Low",
        address: report.address || "No address",
        date: formattedDate.split(",")[0],
        time: formattedDate.split(",")[1] || "",
        status: report.status || "Pending",
      };

      localStorage.setItem("selectedReport", JSON.stringify(selectedReport));
      window.location.href = "report_details.html";
    });

    reportsContainer.appendChild(card);
  });

  renderPagination(totalPages);
}

// 🔹 Pagination
function renderPagination(totalPages) {
  pageNumbers.textContent = `Page ${currentPage} of ${totalPages || 1}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

prevPageBtn.onclick = () => { currentPage--; renderPage(); };
nextPageBtn.onclick = () => { currentPage++; renderPage(); };
filterCategory.onchange = () => { currentPage = 1; renderPage(); };

// 🔹 Start loading reports
loadReports();
