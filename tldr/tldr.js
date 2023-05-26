const form = document.querySelector('form');
const searchInput = document.querySelector('.search');
const reviewList = document.querySelector('#review-list');
const gamename = document.querySelector('#game-name');
const slider = document.querySelector('input[type="range"]');


const reviewTemplate = document.querySelector('#review-template').content;

form.addEventListener('submit', async event => {
  event.preventDefault();

  const gameName = searchInput.value.trim();

  const response = await fetch(`https://store.steampowered.com/api/storesearch/?term=${gameName}&cc=us&l=en&exact_match=1&developer=&publisher=&feature=&platform=&category=&p=0&genre=&start=0&count=1&tags=&price=&filter=`);
  const json = await response.json();
  
  const gameId = json.items[0].id;

  const response2 = await fetch(`https://store.steampowered.com/appreviews/${gameId}?json=1&day_range=${slider.value}`);
  const json2 = await response2.json();
  const reviews = json2.reviews;

  const randomReviews = getRandomElements(reviews, 6);

  gamename.textContent = json.items[0].name;

  reviewList.innerHTML = '';
  for (const review of randomReviews) {
    const reviewEl = reviewTemplate.cloneNode(true);
    reviewEl.querySelector('.review-author').textContent = review.author.steamid;
    reviewEl.querySelector('.review-date').textContent = new Date(review.timestamp_created * 1000).toLocaleDateString();
    reviewEl.querySelector('.review-text').textContent = review.review;
    reviewEl.querySelector('.review-players').textContent = `${review.votes_up + review.votes_funny} players rated this review.`;
    reviewEl.querySelector('.review-helpful').textContent = `${review.votes_up} found this review helpful.`;
    reviewEl.querySelector('.review-score').textContent = `${review.weighted_vote_score} - helpfulness score.`;
    reviewList.appendChild(reviewEl);
  }  
});

slider.addEventListener('input', () => {
    const sliderValue = slider.value;
    const sliderOutput = document.querySelector('.slider-output');
    sliderOutput.textContent = sliderValue;
  });
  
function getRandomElements(array, numElements) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numElements);
}
