const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const cors = require("cors"); // Importer le package cors
const app = express();
const port = 5000;

// Activer CORS pour toutes les origines (ou spécifier une origine spécifique)
app.use(cors()); // Cela permet à ton frontend d'accéder à l'API sans problème de CORS

// Middleware pour parser le JSON
app.use(bodyParser.json());

app.post("/api/eleves", (req, res) => {
    const { nom, prenom } = req.body;

    if (!nom || !prenom) {
        return res.status(400).json({ error: "Nom et prénom sont requis" });
    }

    // Génération de l'email
    const email = `${prenom.toLowerCase()}.${nom.toLowerCase()}@efrei.net`;

    // Création de l'élève avec un ID unique et un email
    const newEleve = { id: uuidv4(), email, ...req.body };

    fs.readFile("./data/eleves.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture du fichier" });
        }

        const eleves = JSON.parse(data);
        eleves.push(newEleve);

        fs.writeFile("./data/eleves.json", JSON.stringify(eleves, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Erreur d'écriture dans le fichier" });
            }
            res.status(200).json({ message: "Élève ajouté avec succès !", eleve: newEleve });
        });
    });
});

  
  app.get('/api/eleves', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'eleves.json'); // Chemin correct vers le fichier
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de la lecture du fichier JSON' });
      }
  
      try {
        const eleves = JSON.parse(data);
        res.json(eleves);
      } catch (error) {
        res.status(500).json({ message: 'Erreur lors du parsing du fichier JSON' });
      }
    });
  });

  app.delete("/api/eleves/:id", (req, res) => {
    const { id } = req.params;
    const filePath = path.join(__dirname, "data", "eleves.json");
  
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Erreur de lecture du fichier" });
      }
  
      let eleves = JSON.parse(data);
      const elevesFiltre = eleves.filter((eleve) => eleve.id !== id);
  
      if (eleves.length === elevesFiltre.length) {
        return res.status(404).json({ error: "Élève non trouvé" });
      }
  
      fs.writeFile(filePath, JSON.stringify(elevesFiltre, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur d'écriture dans le fichier" });
        }
        res.status(200).json({ message: "Élève supprimé avec succès !" });
      });
    });
  });
  


// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend lancé sur http://localhost:${port}`);
});
