// index.js (New File)
const app = require('./server'); // server.js ko import kiya
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});