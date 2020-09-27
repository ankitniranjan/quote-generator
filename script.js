const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader')

let errorCount = 0;
const errorLimit = 10;

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

// Get Quote From  API
async function getQuote() {
  showLoadingSpinner();
  // We need to use a Proxy URL to make our API call in order to avoid
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();

    // Check if Author field is blank and replace it with 'Unknown'
    if (data.quoteAuthor === '') {
      authorText.innerText = 'Unknown';
    } else {
      authorText.innerText = data.quoteAuthor;
    }

    // Dynamically reduce font size for long quotes
    if (data.quoteText.length > 80) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }
    quoteText.innerText = data.quoteText;

    removeLoadingSpinner();
  } catch (error){
    errorCount += 1;
    if (errorCount <= errorLimit) {
      getQuote()
    } else {
      removeLoadingSpinner();
      quoteText.innerText = "OOps... Sorry. There was an error. Please try again later.";
      quoteAuthor.innerText = '';
    }

    console.log('whoops, no quote', error);
  }
}

// Tweet Quote
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;

  const twitterUrl = 'https://twitter.com/intent/tweet?text=' + quote + ' - ' + author;

  window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// Load
getQuote();