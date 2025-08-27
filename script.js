async function searchGames() {
  const query = document.getElementById('searchInput').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = 'Buscando...';

  // Busca jogos pelo nome
  const response = await fetch(
    `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`
  );
  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const items = xmlDoc.getElementsByTagName("item");

  if (items.length === 0) {
    resultsDiv.innerHTML = 'Nenhum jogo encontrado.';
    return;
  }

  resultsDiv.innerHTML = '';

  // Para cada jogo, busca detalhes para pegar imagem
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const name = item.getElementsByTagName("name")[0].getAttribute("value");
    const yearPubElem = item.getElementsByTagName("yearpublished")[0];
    const year = yearPubElem ? yearPubElem.getAttribute("value") : "Ano desconhecido";
    const id = item.getAttribute("id");

    // Busca detalhes do jogo para pegar imagem
    let imageUrl = null;
    try {
      const detailResponse = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`);
      const detailText = await detailResponse.text();
      const detailDoc = parser.parseFromString(detailText, "text/xml");
      const imageElem = detailDoc.getElementsByTagName("image")[0];
      imageUrl = imageElem ? imageElem.textContent : null;
    } catch (err) {
      imageUrl = null;
    }

    // Cria card do jogo
    const gameDiv = document.createElement('div');
    gameDiv.className = 'game';
    gameDiv.innerHTML = `
      ${imageUrl ? `<img src="${imageUrl}" alt="${name}">` : `<div style="height:110px"></div>`}
      <h4>${name}</h4>
      <p>${year}</p>
      <a href="https://boardgamegeek.com/boardgame/${id}" target="_blank">Ver no BGG</a>
    `;
    resultsDiv.appendChild(gameDiv);
  }
}