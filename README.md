# Canvas ZK App

This canvas is a ZK App built with snarkyJS designed to test interactivity with the Berkeley QA Net.  

Deployed at [canvas-zk-app.vercel.app](https://canvas-zk-app.vercel.app/)

Backend repo at [github.com/qcomps/canvas-data-api](https://github.com/qcomps/canvas-data-api)

## Development

This frontend is run on Vite with the Svelte framework (not SvelteKit).  To run a server locally, run `npm run dev`, and it's deployed to vercel as configured in `vercel.json`.

Note that this repo is a WIP - it expects a backend server to be running, and ultimately to be connected to a redis instance.  I haven't stubbed out these calls anywhere so it's not quite ready for other devs to start running locally.

Required values in the `.env`:
- `VITE_MINA_PRIVATE_KEY` | base 58 private key of the deployed canvas contract
- `VITE_SERVER_URL` | url for backend server

TODO:
- Configure options for local mina vs qa net mina
- Configure dummy backend so the app can work in dev environment
- ...

## What does the App do?

![canvas.jpg](https://raw.githubusercontent.com/qcomps/canvas-zk-app/f90be1389ab76f2adae2e64c7817ac587d118ff0/docs/canvas.jpg)

The canvas is a shared mina contract state represented visually.  It is a 32x32 matrix of boolean values representing whether a pixel should be colored or not.  The matrix is hashed and committed to the blockchain on request which allows everyone to confirm that the canvas they load when they access the webpage is the same canvas that has been committed to the Mina chain.

For now, there are no permissions or proofs required to update the state.  You could update the state of the contract without knowing the state right now, which means that you don't even need the website.  In the future, I'd like to add additional features to the app which require different proofs/signatures, and makes it so that knowing the state of the canvas is actually important for updating its state.

Even without any "useful" features, the canvas stands as an example of how to read and write data to the mina blockchain from a web app, and of how to deploy such an app so that it is accessible to the world.

## TODO / Ideas to build off of

- Buy and sell permissions to edit tiles
- More color options / more complex model of a tile than just on/off
- User-paid transaction fees
- Public vision of squares, private ownership records
- Gamification, make the canvas operate like a Go board, or make it like a map with borders that can shift under certain criteria
- ...
