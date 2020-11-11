const form = document.getElementById('form');
const searchInpu = document.getElementById('search');
// we don't need searchBtn because we can use form event 'submit';
const result = document.getElementById('result');
const moreRes = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

form.addEventListener('submit', e => {
  e.preventDefault();

  const searchTerm = searchInpu.value.trim();
  if (!searchTerm){
    alert('Please type in a search term...')
  } else {
    searchSongs(searchTerm)
  }

});

// Normal promise method:
// const searchSongs = (term) => {
//   fetch(`${apiURL}/suggest/${term}`)
//     .then(res => res.json())
//     .then(data => console.log(data))
// };

// Async method:
const searchSongs = async term => {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();
  console.log(data);

  showData(data)
};

const showData = data => {
  // Method one:
  // let output = '';
  // data.data.forEach(song => {
    // output += `
    // <li><span><strong>${song.artist.name}</strong> - ${song.title}</span>
    // <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    // </li>
    // `;
    //
    // result.innerHTML = `
    // <ul class="songs">
    //   ${output}
    // </ul>
    // `;
  // })

  // Method two:
  result.innerHTML = `
  <ul class="songs">
    ${data.data.map(song => `
    <li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>
    `).join('')}
  </ul>
  ` ;

  // data.prev & data.next are urls:
  if(data.prev || data.next){
    moreRes.innerHTML = `
      ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
      ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
    `;
  } else moreRes.innerHTML = '';
};

const getMoreSongs = async (url) => {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data)
};

result.addEventListener('click', e => {
  // console.log(e.target.tagName);

  const clickedEl = e.target;

  // tagName always be capitalized: BUTTON, UL, LI...
  if(clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    // console.log(artist);
    const title = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, title)
  }
});

const getLyrics = async (artist, title) => {
  const res = await fetch(`${apiURL}/v1/${artist}/${title}`);
  const data = await res.json();

  const lyrics = await data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  result.innerHTML = `
  <h2>
    <strong>${artist}</strong> - ${title}
  </h2>
  <span>${lyrics}</span>
  `;
  moreRes.innerHTML = ''

};


























