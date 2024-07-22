# Chess Game API

This is a Node.js application that provides a set of API endpoints to interact with a Smart Contract. The main functionality of this application is to allow users to check their BNB balance, get the allowance for a spender account, and set the approval for a spender account to spend a certain amount of LLG tokens on their behalf.

## Prerequisites

- Node.js installed on your system
- A `.env` file with the following variables:
  - `APP_ENV=development`
  - `APP_SEED=A_RANDOM_SEED_PHRASE_OF_YOUR_CHOICE`

## Installation

1. Clone the repository:

https://github.com/DigiCris/LLGChessGame_Cristian_Marchese_7_21_2024.git

2. Install the dependencies:

npm install

## Usage

1. Start the server:

npm run start:server

This will start the server and listen on port 8050.

2. Use the following cURL commands to interact with the API endpoints:

**Get Balance**

curl --location --request GET 'http://localhost:8050/play/GetBalance/Your_address'

**Get Allowance**

curl --location --request GET 'http://localhost:8050/play/GetAllowance/OwnerAccount/SpenderAccount' --header 'Content-Type: application/json'

**Set Approve**

curl --location --request POST 'http://localhost:8050/play/SetApprove' --header 'x-api-key: b5b2be75-9b3f-40ce-97ee-7ef19677a7b0' --header 'Content-Type: application/json' --data-raw '{"spender": "SpenderAccount","value": 1, "password": "I_AM_USERS_PASSWORD"}'

You can also access the endpoints directly in your web browser:

**Balance Of**

http://localhost:8050/play/balanceOf/AddressIWantToCheckBNBAmountOF

## Explanation

- The `I_AM_USERS_PASSWORD` and `A_RANDOM_SEED_PHRASE_OF_YOUR_CHOICE` are used to generate the owner wallet when the approve function is called. This was chosen to avoid storing a private key directly in the backend and to allow each user to use their own private key without the server being able to reconstruct it or a malicious user stealing the password and gaining access to the wallet (Both, user and server need their counterpart).
- The application is a simple and conceptual version, where each user has their own wallet logged in with a personal key.

## Video Explanation

You can watch a video explanation of the code at the following link:
[Video Explanation](https://www.awesomescreenshot.com/video/29757978?key=0a8947eafd54d11361c6cfea13ff3f44)