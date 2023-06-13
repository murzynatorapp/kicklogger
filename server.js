import express from "express";
import fs from "fs";
import path from "path";
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('web/index.html'));
});

app.get('/search', (req, res) => {
  const searchWord = req.query.word.toLowerCase();
  const filePath = 'adamcy-log.txt'; // Ścieżka do pliku tekstowego

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Błąd serwera');
      return;
    }

    const lines = data.split('\n');
    const matchingLines = lines.filter(line => {
        const words = line.toLowerCase().split(' ');
        return words.includes(searchWord);
    });
    const html = matchingLines.map(line => `<div style="color:#ffcc00;">${line}</div>`).reverse().join('');
    res.send(html);
  });
});

app.listen(3000, () => {
  console.log('Serwer działa na porcie 3000');
});