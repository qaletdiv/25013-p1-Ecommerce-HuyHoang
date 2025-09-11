const API_URL = "http://localhost:3000/products";
let tours = [];
async function fetchTours() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    tours = data;
    renderTours(data);
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    document.getElementById("tourList").innerHTML = "<p>Không thể tải dữ liệu tour!</p>";
  }
}

function renderTours(tours) {
  const list = document.getElementById("tourList");
  list.innerHTML = "";

  tours.forEach(tour => {
    const card = document.createElement("div");
    card.className = "tour-card";
    card.innerHTML = `
      <img src="${tour.image}" alt="${tour.name}">
      <div class="tour-info">
        <a href="product.html?id=${tour.id}"</a>
        <h3>${tour.name}</h3>
        <p>Mã tour: ${tour.code}</p>
        <p>Khởi hành: ${tour.departure}</p>
        <p>Ngày khởi hành: ${tour.departureDate}</p>
        <p>Số chỗ còn: ${tour.availableSeats}</p>
        <p class="price">${tour.price} VND</p>
      </div>
    `;
    list.appendChild(card);
  });
}

document.getElementById("searchInput").addEventListener("input", function (e) {
  const keyword = e.target.value.toLowerCase();
  const cards = document.querySelectorAll(".tour-card");

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(keyword) ? "block" : "none";
  });
});

fetchTours();

const sortPrice = document.getElementById("sortPrice")
sortPrice.addEventListener("change", () => {
  console.log(tours);
  switch (sortPrice.value) {
    case "asc":
      tours.sort((a,b) => a.price - b.price)
      renderTours(tours);
      break;

    case "desc":
      tours.sort((a,b) => b.price - a.price)
      renderTours(tours);
      break;

    default:
      console.log("mặc định")
      break;
  }
})