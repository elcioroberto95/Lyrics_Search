const form = document.querySelector('#form');
const searchInput = document.querySelector('#search');
const songsContainer = document.querySelector('#songs-container');
const prevAndNextContainer = document.querySelector('#prev-and-next-container');

const ApiUrl = `https://api.lyrics.ovh`;
const getMoreSongs = async (url) => {
  const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await response.json();
  insertSongsIntoPage(data);
};

const insertSongsIntoPage = (songsInfo) => {
  songsContainer.innerHTML = songsInfo.data
    .map(
      (song) =>
        `<li class="song"><span class="song-artist"><strong> ${song.artist.name}</strong> - ${song.title}<span>
          <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
        </li>`,
    )
    .join('');
  if (songsInfo.prev || songsInfo.next) {
    prevAndNextContainer.innerHTML = `
    ${
      songsInfo.prev
        ? `<button class="btn" onClick="getMoreSongs('${songsInfo.prev}')">Anteriores </button>`
        : ''
    }
    ${
      songsInfo.next
        ? `<button class="btn" onClick="getMoreSongs('${songsInfo.next}')">Próximas </button>`
        : ''
    }
    `;
    return;
  }
  prevAndNextContainer = '';
};
const fetchSongs = async (term) => {
  const response = await fetch(`${ApiUrl}/suggest/${term}`);
  const data = await response.json();
  insertSongsIntoPage(data);
};
// fetch(`${ApiUrl}/suggest/${term}`).then(response => response.json()).then(data => console.log(data))}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    songsContainer.innerHTML = `<li class="warning-message">Por Favor,digite um termo válido.</li>`;
    return;
  }
  fetchSongs(searchTerm);
});

const fetchLyrics = async (artist, songTitle) => {
  const response = await fetch(`${ApiUrl}/v1/${artist}/${songTitle}`);
  const data = await response.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
  songsContainer.innerHTML = `
<li class="lyrics-container">
<h2><strong>${songTitle}</strong> - ${artist}</h2>
<p class="lyrics">${lyrics}</p>

</li>


`;
};

songsContainer.addEventListener('click', (event) => {
  const clickedElement = event.target;

  if (clickedElement.tagName === 'BUTTON') {
    const artist = clickedElement.getAttribute('data-artist');
    const songTitle = clickedElement.getAttribute('data-song-title');
    prevAndNextContainer.innerHTML = '';
    fetchLyrics(artist, songTitle);
  }
});
