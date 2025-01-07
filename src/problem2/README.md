# Problem #2:

- This is my attempt at problem #2 using vanilla javascript. I used shoelace for the UI components and tailwind for the styling.
- I used axios to fetch the data from the API.
- I assumed the date key "price" is the price of the USDT. ex: LUNA = 0.409 USDT (price: 0.409)
- I could add React(CDN) to this project, but I think it's overkill for this simple project and trying to make it as simple as possible with vanilla JS.
- Base on the API response and comparing with the token repo, I found that some currencies are not available in the token repo => you would see some 404 error on the browser console.
- I did research on some apps (Binance, Merc), they display the rate in 5~6 decimal places, so I rounded the rate to 5 decimal places as well, not just random rounding.

# How to use:

- Select the currency you want to send.
- Select the currency you want to receive.
- Enter the amount you want to send.
- Click the CONFIRM SWAP button.

# How to run: 

- `cd src/problem2`
- `npm i`
- `npm run dev` (A window will open in your browser)
- Or access via `localhost:3000`
- Hope you like it!