// DOM elements
const swapButton = document.getElementById('swapButton');
const sendSelect = document.getElementById('sendCurrency');
const sendInput = document.getElementById('amount-send-input');
const receiveSelect = document.getElementById('receiveCurrency');
const sendIcon = document.getElementById('sendIcon');
const receiveIcon = document.getElementById('receiveIcon');
const rateSection = document.getElementById('rate');
const rateSendIcon = document.getElementById('rateSendIcon');
const rateReceiveIcon = document.getElementById('rateReceiveIcon');
let priceData = [];
// readonly
const apiUrl = 'https://interview.switcheo.com/prices.json';
const baseIconUrl = 'https://raw.githubusercontent.com/Switcheo/token-icons/302e89e1460bfa1fd47de49fb0baf9ddc74fc190/tokens'; // +[icon_uppercase].svg;
const createTokenIcon = (token) => {
  return `${baseIconUrl}/${token}.svg`;
}
const extractTokenIconValue = (url) => {
  const urlParts = url.split('/');
  const token = urlParts[urlParts.length - 1].split('.')[0];
  return token;
}

const roundToNDecimalPlaces = (value, n = 5) => {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}
// states
let currentSendIcon = '';
let currentReceiveIcon = '';

function updateFormState() {
  swapButton.disabled = !sendSelect.value || !receiveSelect.value || !sendInput.value;
  if (!sendInput.value) {
    sendInput.classList.add('border-red-500');
    console.log('invalid');
  } else {
    sendInput.classList.remove('border-red-500');
    console.log('valid');
  }
  currentSendIcon = createTokenIcon(sendSelect.value);
  document.getElementById('sendIcon').src = currentSendIcon;
  currentReceiveIcon = createTokenIcon(receiveSelect.value);
  document.getElementById('receiveIcon').src = currentReceiveIcon;
  rateSendIcon.src = currentSendIcon;
  rateReceiveIcon.src = currentReceiveIcon;

  if (!swapButton.disabled) {
    rateSection.classList.remove('invisible');
    // TODO: calculate the rate
    const rateValue = document.getElementById('rateValue');
    rateValue.textContent = '0.00';
    const currentSendToken = extractTokenIconValue(currentSendIcon);
    const currentReceiveToken = extractTokenIconValue(currentReceiveIcon);
    const currentSendPrice = priceData.find(item => item.currency === currentSendToken).price;
    const currentReceivePrice = priceData.find(item => item.currency === currentReceiveToken).price;
    const rate = currentSendPrice / currentReceivePrice;
    rateValue.textContent = roundToNDecimalPlaces(rate);
    // update amount to receive
    const amountToReceive = sendInput.value * rate;
    // round to 4 decimal places
    document.getElementById('amount-receive-input').value = roundToNDecimalPlaces(amountToReceive);
  } else {
    rateSection.classList.add('invisible');
  }
}
sendSelect.addEventListener('sl-change', updateFormState);
receiveSelect.addEventListener('sl-change', updateFormState);
sendInput.addEventListener('sl-input', updateFormState);

function updatePriceData(data) {
  const uniqueCurrencies = [];
  const seenCurrencies = new Set();

  data.forEach(item => {
    if (!seenCurrencies.has(item.currency)) {
      uniqueCurrencies.push(item);
      seenCurrencies.add(item.currency);
    }
  });
  priceData = structuredClone(uniqueCurrencies);
}

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Function to populate a select element
    updatePriceData(data);
    function populateSelect(selectElement, isSender = true) {
      if (isSender) {
        selectElement.innerHTML = `<sl-icon id="sendIcon" src="${currentSendIcon}" slot="prefix"></sl-icon><sl-option value="">Select</sl-option>`;
      } else {
        selectElement.innerHTML = `<sl-icon id="receiveIcon" src="${currentReceiveIcon}" slot="prefix"></sl-icon><sl-option value="">Select</sl-option>`;
      }
      priceData.forEach(item => {
        const option = document.createElement('sl-option');
        option.value = item.currency;
        option.textContent = item.currency;
        selectElement.appendChild(option);
      });
    }
    // NOTE: I assume the date key "price" is the price of the USDT to the currency. ex: LUNA = 0.409 USDT (price: 0.409)
    populateSelect(sendSelect, true);
    populateSelect(receiveSelect, false);
    updateFormState();
  })
  .catch(error => {
    console.error('Fetch error:', error);
    alert('Error loading data');
    sendSelect.innerHTML = '<sl-option value="">Error loading data</sl-option>';
    receiveSelect.innerHTML = '<sl-option value="">Error loading data</sl-option>';
    swapButton.disabled = true; //Disable button on error
  });
