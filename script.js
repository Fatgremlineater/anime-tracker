const animeForm = document.getElementById('animeForm');
const animeList = document.getElementById('animeList');
const titleInput = document.getElementById('animeTitle');
const suggestionsBox = document.getElementById('suggestions');
const clearAllBtn = document.getElementById('clearAllBtn');

// Anime titles with image links
const animeTitles = [
    { title: "Naruto", image: "images/naruto.jpg" },
    { title: "Attack on Titan", image: "images/attackontitan.jpg" },
    { title: "One Piece", image: "images/onepiece.jpg" },
    { title: "My Hero Academia", image: "images/mha.jpg" },
    { title: "Demon Slayer", image: "images/demonslayer.jpg" },
    { title: "Death Note", image: "images/deathnote.jpg" }
  ];
  
  
// Load saved anime list from localStorage
let animeArray = JSON.parse(localStorage.getItem('animeList')) || [];
renderList();

// Handle form submission
animeForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const status = document.getElementById('animeStatus').value;

  const isDuplicate = animeArray.some(anime => anime.title.toLowerCase() === title.toLowerCase());
  if (isDuplicate) {
    alert("This anime is already on your list.");
    return;
  }

  const matchedAnime = animeTitles.find(item => item.title.toLowerCase() === title.toLowerCase());
  const image = matchedAnime ? matchedAnime.image : "https://via.placeholder.com/80x120?text=No+Image";
  const anime = { title, status, image };

  animeArray.push(anime);
  saveList();
  renderList();
  animeForm.reset();
  suggestionsBox.innerHTML = '';
});

// Save to localStorage
function saveList() {
  localStorage.setItem('animeList', JSON.stringify(animeArray));
}

// Render the anime list
function renderList() {
  animeList.innerHTML = '';

  animeArray.forEach((anime, index) => {
    const card = document.createElement('div');
    card.classList.add('anime-card');
    card.innerHTML = `
      <img src="${anime.image}" alt="${anime.title}" style="width: 80px; height: 120px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
      <div style="flex: 1;">
        <h3>${anime.title}</h3>
        <select class="status-select" data-index="${index}">
          <option value="Watching" ${anime.status === "Watching" ? "selected" : ""}>Watching</option>
          <option value="Completed" ${anime.status === "Completed" ? "selected" : ""}>Completed</option>
          <option value="Plan to Watch" ${anime.status === "Plan to Watch" ? "selected" : ""}>Plan to Watch</option>
        </select>
        <button class="delete-btn" data-index="${index}">❌ Delete</button>
      </div>
    `;

    animeList.appendChild(card);
  });

  // Delete buttons
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function () {
      const index = this.getAttribute('data-index');
      animeArray.splice(index, 1);
      saveList();
      renderList();
    });
  });

  // Status dropdowns
  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', function () {
      const index = this.getAttribute('data-index');
      animeArray[index].status = this.value;
      saveList();
    });
  });
}

// Clear all button
clearAllBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear your entire anime list?")) {
    animeArray = [];
    saveList();
    renderList();
  }
});

// Auto-suggestions
titleInput.addEventListener('input', () => {
  const query = titleInput.value.toLowerCase();
  suggestionsBox.innerHTML = '';

  if (query.length === 0) return;

  const filtered = animeTitles.filter(anime =>
    anime.title.toLowerCase().includes(query)
  );

  filtered.slice(0, 5).forEach(anime => {
    const suggestion = document.createElement('div');
    suggestion.textContent = anime.title;
    suggestion.addEventListener('click', () => {
      titleInput.value = anime.title;
      suggestionsBox.innerHTML = '';
    });
    suggestionsBox.appendChild(suggestion);
  });
});

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!suggestionsBox.contains(e.target) && e.target !== titleInput) {
    suggestionsBox.innerHTML = '';
  }
});
