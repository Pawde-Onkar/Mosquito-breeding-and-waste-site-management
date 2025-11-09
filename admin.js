import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_YaGTyQbCkRbdLlKBiyw8lHyxPTa9G9o",
  authDomain: "eco-clean-7bd6d.firebaseapp.com",
  projectId: "eco-clean-7bd6d",
  storageBucket: "eco-clean-7bd6d.appspot.com",
  messagingSenderId: "31293808247",
  appId: "1:31293808247:web:3eb83b37ff745007b2b072",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🌿 Load Reports
async function loadReports() {
  const container = document.getElementById("reportCards");
  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "reports"));
  let totalReports = 0, inProgress = 0, resolved = 0, pending = 0;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    totalReports++;
    if (data.status === "In Progress") inProgress++;
    else if (data.status === "Resolved") resolved++;
    else pending++;

    const card = document.createElement("div");
    card.classList.add("report-card");

    const image = data.images && data.images[0] ? data.images[0] : "https://via.placeholder.com/80";
    const statusOptions = ["Pending", "In Progress", "Resolved"]
      .map((s) => `<option value="${s}" ${data.status === s ? "selected" : ""}>${s}</option>`).join("");

    const teamOptions = ["Team Alpha", "Team Beta", "Team Gamma"]
      .map((t) => `<option value="${t}" ${data.assignedTeam === t ? "selected" : ""}>${t}</option>`).join("");

    card.innerHTML = `
      <img src="${image}" alt="Report">
      <div class="report-info">
        <h3>${data.category || "Unknown"}</h3>
        <p><strong>By:</strong> ${data.name || "Anonymous"}</p>
        <p><strong>Location:</strong> ${data.location || "-"}</p>
        <div class="report-actions">
          <select class="status" data-id="${docSnap.id}">${statusOptions}</select>
          <select class="team" data-id="${docSnap.id}">${teamOptions}</select>
          <button class="saveBtn" data-id="${docSnap.id}">💾</button>
          <button class="viewBtn" data-id="${docSnap.id}">👁</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  document.getElementById("totalReports").textContent = totalReports;
  document.getElementById("inProgress").textContent = inProgress;
  document.getElementById("resolved").textContent = resolved;

  renderCharts(pending, inProgress, resolved);
  attachListeners();
}

// 📊 Chart.js (Pie + Bar)
let pieChart, barChart;
function renderCharts(pending, inProgress, resolved) {
  const ctx1 = document.getElementById("pieChart");
  const ctx2 = document.getElementById("barChart");

  const labels = ["Pending", "In Progress", "Resolved"];
  const data = [pending, inProgress, resolved];
  const colors = ["#ffb300", "#0288d1", "#2e7d32"];

  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

  pieChart = new Chart(ctx1, {
    type: "pie",
    data: { labels, datasets: [{ data, backgroundColor: colors }] },
    options: { plugins: { legend: { position: "bottom" } } },
  });

  barChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Reports", data, backgroundColor: colors }],
    },
    options: {
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { display: false } },
    },
  });
}

// ⚙️ Actions
function attachListeners() {
  document.querySelectorAll(".saveBtn").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const status = document.querySelector(`.status[data-id="${id}"]`).value;
      const assignedTeam = document.querySelector(`.team[data-id="${id}"]`).value;
      await updateDoc(doc(db, "reports", id), { status, assignedTeam });
      alert("✅ Report updated!");
    })
  );

  document.querySelectorAll(".viewBtn").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const snapshot = await getDocs(collection(db, "reports"));
      const docSnap = snapshot.docs.find((d) => d.id === id);
      if (docSnap) showModal(docSnap.data());
    })
  );
}

// 🪟 Modal
function showModal(data) {
  const modal = document.getElementById("detailsModal");
  modal.style.display = "flex";
  document.getElementById("modalTitle").textContent = data.category || "Report Details";
  document.getElementById("modalName").textContent = data.name || "Anonymous";
  document.getElementById("modalEmail").textContent = data.email || "-";
  document.getElementById("modalCategory").textContent = data.category || "-";
  document.getElementById("modalLocation").textContent = data.location || "-";
  document.getElementById("modalDescription").textContent = data.description || "-";
  document.getElementById("modalDate").textContent = data.createdAt?.toDate?.().toLocaleString() || "-";
  const imgBox = document.getElementById("modalImages");
  imgBox.innerHTML = "";
  if (data.images?.length) {
    data.images.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      imgBox.appendChild(img);
    });
  } else imgBox.innerHTML = "<p>No images available.</p>";
}

document.getElementById("closeModal").onclick = () => {
  document.getElementById("detailsModal").style.display = "none";
};
document.getElementById("detailsModal").addEventListener("click", (e) => {
  if (e.target.id === "detailsModal") e.target.style.display = "none";
});

document.addEventListener("DOMContentLoaded", loadReports);
