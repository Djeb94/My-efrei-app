const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors()); 

app.use(bodyParser.json());

const SECRET_KEY = "ma_super_cle_secrete";


const generateIdentifiant = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 15; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const getUsers = () => {
    const data = fs.readFileSync("data/users.json");
    return JSON.parse(data);
  };

app.post("/api/eleves", (req, res) => {
  const { nom, prenom, classe, matiere } = req.body;

  if (!nom || !prenom || !classe) {
    return res.status(400).json({ error: "Nom, prénom et classe sont requis" });
  }

  const id = uuidv4();
  const email = `${prenom.toLowerCase()}.${nom.toLowerCase()}@efrei.net`;
  const identifiant = generateIdentifiant();
  const motDePasse = generatePassword();
  const role = "etudiant";

  const newEleve = { id, nom, prenom, classe, email, matiere };

  fs.readFile("./data/eleves.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erreur de lecture du fichier des élèves" });
    }

    const eleves = JSON.parse(data);
    eleves.push(newEleve);

    fs.writeFile("./data/eleves.json", JSON.stringify(eleves, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Erreur d'écriture dans le fichier des élèves" });
      }

      const newUser = { uuid: id, identifiant, motDePasse, role };

      fs.readFile("./data/users.json", "utf8", (err, userData) => {
        if (err) {
          return res.status(500).json({ error: "Erreur de lecture du fichier des utilisateurs" });
        }

        const users = JSON.parse(userData);
        users.push(newUser);

        fs.writeFile("./data/users.json", JSON.stringify(users, null, 2), (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur d'écriture dans le fichier des utilisateurs" });
          }

          res.status(200).json({
            message: "Élève et utilisateur ajoutés avec succès !",
            eleve: newEleve,
            user: newUser,
          });
        });
      });
    });
  });
});


  
  app.get('/api/eleves', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'eleves.json'); 
  
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

  app.get("/api/eleve/:id", (req, res) => {
    const id = req.params.id;
    const elevesPath = path.join(__dirname, "data/eleves.json");
  
    fs.readFile(elevesPath, "utf8", (err, data) => {
      if (err) {
        console.error("Erreur de lecture :", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
  
      const eleves = JSON.parse(data);
      const eleve = eleves.find(e => e.id === id);
  
      if (!eleve) {
        return res.status(404).json({ error: "Élève non trouvé" });
      }
  
      res.json(eleve);
    });
  });
  

  app.delete("/api/eleves/:id", (req, res) => {
    const { id } = req.params;
    const elevesPath = path.join(__dirname, "data", "eleves.json");
    const usersPath = path.join(__dirname, "data", "users.json");

    fs.readFile(elevesPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture du fichier des élèves" });
        }

        let eleves = JSON.parse(data);
        const elevesFiltre = eleves.filter((eleve) => eleve.id !== id);

        if (eleves.length === elevesFiltre.length) {
            return res.status(404).json({ error: "Élève non trouvé" });
        }

        fs.writeFile(elevesPath, JSON.stringify(elevesFiltre, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Erreur d'écriture dans le fichier des élèves" });
            }

            fs.readFile(usersPath, "utf8", (err, userData) => {
                if (err) {
                    return res.status(500).json({ error: "Erreur de lecture du fichier des utilisateurs" });
                }

                let users = JSON.parse(userData);
                const usersFiltre = users.filter((user) => user.uuid !== id); 

                fs.writeFile(usersPath, JSON.stringify(usersFiltre, null, 2), (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Erreur d'écriture dans le fichier des utilisateurs" });
                    }

                    res.status(200).json({ message: "Élève et utilisateur supprimés avec succès !" });
                });
            });
        });
    });
});

app.post("/api/profs", (req, res) => {
  const { nom, prenom, matiere } = req.body;

  if (!nom || !prenom || !matiere) {
    return res.status(400).json({ error: "Nom, prénom et matière sont requis" });
  }

  const id = uuidv4();
  const email = `${prenom.toLowerCase()}.${nom.toLowerCase()}@efrei.net`;
  const identifiant = generateIdentifiant();
  const motDePasse = generatePassword();
  const role = "prof";

  const newProf = { id, nom, prenom, matiere, email };

  fs.readFile("./data/profs.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erreur de lecture du fichier des professeurs" });
    }

    const profs = JSON.parse(data);
    profs.push(newProf);

    fs.writeFile("./data/profs.json", JSON.stringify(profs, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Erreur d'écriture dans le fichier des professeurs" });
      }

      const newUser = { uuid: id, identifiant, motDePasse, role };

      fs.readFile("./data/users.json", "utf8", (err, userData) => {
        if (err) {
          return res.status(500).json({ error: "Erreur de lecture du fichier des utilisateurs" });
        }

        const users = JSON.parse(userData);
        users.push(newUser);

        fs.writeFile("./data/users.json", JSON.stringify(users, null, 2), (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur d'écriture dans le fichier des utilisateurs" });
          }

          res.status(200).json({
            message: "Professeur et utilisateur ajoutés avec succès !",
            prof: newProf,
            user: newUser,
          });
        });
      });
    });
  });
});
app.get("/api/profs", (req, res) => {
  const filePath = path.join(__dirname, "data", "profs.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erreur de lecture du fichier des professeurs" });
    }

    try {
      const profs = JSON.parse(data);
      res.json(profs);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du parsing du fichier JSON" });
    }
  });
});
app.delete("/api/profs/:id", (req, res) => {
  const { id } = req.params;
  const profsPath = path.join(__dirname, "data", "profs.json");
  const usersPath = path.join(__dirname, "data", "users.json");

  fs.readFile(profsPath, "utf8", (err, data) => {
      if (err) {
          return res.status(500).json({ error: "Erreur de lecture du fichier des élèves" });
      }

      let profs = JSON.parse(data);
      const profsFiltre = profs.filter((prof) => prof.id !== id);

      if (profs.length === profsFiltre.length) {
          return res.status(404).json({ error: "Élève non trouvé" });
      }

      fs.writeFile(profsPath, JSON.stringify(profsFiltre, null, 2), (err) => {
          if (err) {
              return res.status(500).json({ error: "Erreur d'écriture dans le fichier des élèves" });
          }

          fs.readFile(usersPath, "utf8", (err, userData) => {
              if (err) {
                  return res.status(500).json({ error: "Erreur de lecture du fichier des utilisateurs" });
              }

              let users = JSON.parse(userData);
              const usersFiltre = users.filter((user) => user.uuid !== id); 
              fs.writeFile(usersPath, JSON.stringify(usersFiltre, null, 2), (err) => {
                  if (err) {
                      return res.status(500).json({ error: "Erreur d'écriture dans le fichier des utilisateurs" });
                  }

                  res.status(200).json({ message: "Élève et utilisateur supprimés avec succès !" });
              });
          });
      });
  });
});

app.get("/api/prof/:id", (req, res) => {
  const id = req.params.id; 
  const profsPath = path.join(__dirname, "data/profs.json");


  fs.readFile(profsPath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    const profs = JSON.parse(data);
    const prof = profs.find(p => p.id === id);

    if (!prof) {
      return res.status(404).json({ error: "Professeur non trouvé" });
    }

    res.json(prof);
  });
});

app.post("/api/cours", (req, res) => {
  const { matiere, heures } = req.body;

  if (!matiere || typeof heures !== "number" || heures <= 0) {
    return res.status(400).json({ error: "Matière et nombre d'heures valides requis" });
  }

  const id = uuidv4();
  const nouveauCours = { id, matiere, heures };

  const coursPath = path.join(__dirname, "data", "cours.json");

  fs.readFile(coursPath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      return res.status(500).json({ error: "Erreur de lecture du fichier des cours" });
    }

    const cours = data ? JSON.parse(data) : [];
    cours.push(nouveauCours);

    fs.writeFile(coursPath, JSON.stringify(cours, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Erreur d'écriture dans le fichier des cours" });
      }

      res.status(200).json({ message: "Cours ajouté avec succès", cours: nouveauCours });
    });
  });
});
app.get("/api/cours", (req, res) => {
  const filePath = path.join(__dirname, "data", "cours.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      return res.status(500).json({ error: "Erreur de lecture du fichier des cours" });
    }

    try {
      const cours = data ? JSON.parse(data) : [];
      res.json(cours);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du parsing du fichier JSON" });
    }
  });
});

app.delete("/api/cours/:id", (req, res) => {
  const { id } = req.params;
  const coursPath = path.join(__dirname, "data", "cours.json");

  fs.readFile(coursPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erreur de lecture du fichier des cours" });
    }

    let cours = JSON.parse(data);
    const coursFiltre = cours.filter((cours) => cours.id !== id);

    if (cours.length === coursFiltre.length) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }

    fs.writeFile(coursPath, JSON.stringify(coursFiltre, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Erreur d'écriture dans le fichier des cours" });
      }

      res.status(200).json({ message: "Cours supprimé avec succès !" });
    });
  });
});

app.post("/api/notes", (req, res) => {
  const { nom, prenom, matiere, note, coef } = req.body;
  const elevesPath = path.join(__dirname, "data", "eleves.json");

  fs.readFile(elevesPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur de lecture du fichier élèves" });

    let eleves = JSON.parse(data);

    const index = eleves.findIndex(
      (e) => e.nom.toLowerCase() === nom.toLowerCase() && e.prenom.toLowerCase() === prenom.toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({ error: "Élève non trouvé" });
    }

    if (!eleves[index].note) {
      eleves[index].note = [];
    }

    eleves[index].note.push({
      matiere,
      note,
      coef,
    });

    fs.writeFile(elevesPath, JSON.stringify(eleves, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erreur d'écriture dans le fichier" });

      res.status(200).json({ message: "Note ajoutée avec succès" });
    });
  });
});

app.post("/api/login", (req, res) => {
    const { identifiant, motdepasse } = req.body;
    const users = getUsers();
  
    const user = users.find(
      (u) => u.identifiant === identifiant && u.motDePasse === motdepasse
    );
  
    if (!user) {
      return res.status(401).json({ error: "Identifiant ou mot de passe incorrect" });
    }
  
    const token = jwt.sign(
      { uuid: user.uuid, identifiant: user.identifiant, role: user.role },
      SECRET_KEY,
      { expiresIn: "2h" }
    );
  
    res.json({ token });
});

app.listen(port, () => {
  console.log(`Serveur backend lancé sur http://localhost:${port}`);
});
