import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [currencyInfo, setCurrencyInfo] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Fetch available currencies
    axios.get('https://api.exchangerate-api.com/v4/latest/USD')
      .then(response => {
        setCurrencies(Object.keys(response.data.rates));
        fetchCurrencyInfo(Object.keys(response.data.rates));
      })
      .catch(err => setError('Failed to fetch currencies.'));
  }, []);

  useEffect(() => {
    // Fetch conversion rate
    if (baseCurrency && targetCurrency) {
      axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
        .then(response => {
          const rate = response.data.rates[targetCurrency];
          setConvertedAmount((amount * rate).toFixed(2));
        })
        .catch(err => setError('Failed to fetch conversion rate.'));
    }
  }, [baseCurrency, targetCurrency, amount]);

  const fetchCurrencyInfo = (currencies) => {
    // Placeholder function: replace with actual API call if available
    const sampleInfo = {
      USD: {
        symbol: '$',
        country: 'United States',
        indicators: 'Strong economy, world reserve currency',
        description: 'The United States Dollar is the official currency of the United States and its territories. It is widely used as a global reserve currency.',
        exchangeRate: '1 USD = 1 USD',
      },
      INR: {
        symbol: '₹',
        country: 'India',
        indicators: 'Emerging economy, significant growth potential',
        description: 'The Indian Rupee is the official currency of India. It is a crucial currency in South Asia and has a growing presence in global markets.',
        exchangeRate: '1 INR = 0.012 USD',
      },
      EUR: {
        symbol: '€',
        country: 'Eurozone',
        indicators: 'Strong economic bloc, major reserve currency',
        description: 'The Euro is the official currency of the Eurozone, which consists of 19 of the 27 European Union member states.',
        exchangeRate: '1 EUR = 1.10 USD',
      },
      JPY: {
        symbol: '¥',
        country: 'Japan',
        indicators: 'Major global economy, high export activity',
        description: 'The Japanese Yen is the official currency of Japan and is widely used in global trade and finance.',
        exchangeRate: '1 JPY = 0.007 USD',
      },
      // Add more currencies as needed
    };
    setCurrencyInfo(sampleInfo);
  };

  const handleThemeToggle = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <div className="top-bar">
        <h2>Currency Converter</h2>
        <button onClick={handleThemeToggle}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="content-box">
        {error && <p className="error">{error}</p>}
        <form>
          <label>
            Amount:
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              min="0"
            />
          </label>
          <label>
            Base Currency:
            <select value={baseCurrency} onChange={e => setBaseCurrency(e.target.value)}>
              {currencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency} ({currencyInfo[currency]?.symbol || ''})
                </option>
              ))}
            </select>
          </label>
          <label>
            Target Currency:
            <select value={targetCurrency} onChange={e => setTargetCurrency(e.target.value)}>
              {currencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency} ({currencyInfo[currency]?.symbol || ''})
                </option>
              ))}
            </select>
          </label>
        </form>
        {convertedAmount !== null && (
          <div className="result">
            <h2>Converted Amount:</h2>
            <p>{amount} {currencyInfo[baseCurrency]?.symbol || baseCurrency} ({currencyInfo[baseCurrency]?.country}) = {convertedAmount} {currencyInfo[targetCurrency]?.symbol || targetCurrency} ({currencyInfo[targetCurrency]?.country})</p>
            <div className="currency-details">
              <h3>Currency Details</h3>
              <p><strong>{baseCurrency}:</strong> {currencyInfo[baseCurrency]?.description || 'No description available'}</p>
              <p><strong>Current Rate:</strong> {currencyInfo[baseCurrency]?.exchangeRate || 'N/A'}</p>
              <p><strong>{targetCurrency}:</strong> {currencyInfo[targetCurrency]?.description || 'No description available'}</p>
              <p><strong>Current Rate:</strong> {currencyInfo[targetCurrency]?.exchangeRate || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
      <footer>
        <p>Currency Converter © 2024</p>
      </footer>
    </div>
  );
}

export default App;
