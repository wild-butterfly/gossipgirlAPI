// ---------------------------------------------
//  Gossip Girl API - Clean & Working Version
// ---------------------------------------------

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (index.html, style.css, gglogo.png)
app.use(express.static(path.join(__dirname)));

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ---------------------------------------------
//  MySQL Database Connection
// ---------------------------------------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",   // kendi şifreni yaz
  database: "my_database",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection error:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// ---------------------------------------------
//  CREATE MEMBER  (POST)
// ---------------------------------------------
app.post("/members", (req, res) => {
  const { name, last_name, email } = req.body;

  if (!name || !last_name || !email) {
    return res.status(400).json({
      error: "All fields (name, last_name, email) are required",
    });
  }

  db.query(
    "INSERT INTO members (name, last_name, email) VALUES (?, ?, ?)",
    [name, last_name, email],
    (err, result) => {
      if (err) {
        console.error("❌ Insert error:", err);
        return res
          .status(500)
          .json({ error: "Database insert error", details: err });
      }

      res.json({
        message: "Member added successfully!",
        id: result.insertId,
      });
    }
  );
});

// ---------------------------------------------
//  GET ALL MEMBERS (GET)
// ---------------------------------------------
app.get("/members", (req, res) => {
  db.query("SELECT * FROM members", (err, results) => {
    if (err) {
      console.error("❌ Fetch error:", err);
      return res.status(500).json({ error: "Database fetch error" });
    }

    res.json(results);
  });
});

// ---------------------------------------------
//  UPDATE MEMBER (PUT)
// ---------------------------------------------
app.put("/members/:id", (req, res) => {
  const { id } = req.params;
  const { name, last_name, email } = req.body;

  db.query(
    "UPDATE members SET name=?, last_name=?, email=? WHERE id=?",
    [name, last_name, email, id],
    (err) => {
      if (err) {
        console.error("❌ Update error:", err);
        return res.status(500).json({ error: "Database update error" });
      }

      res.json({ message: "Member updated successfully!" });
    }
  );
});

// ---------------------------------------------
//  DELETE MEMBER (DELETE)
// ---------------------------------------------
app.delete("/members/:id", (req, res) => {
  const deletedId = parseInt(req.params.id);

  // 1. Kaydı Sil
  db.query("DELETE FROM members WHERE id = ?", [deletedId], (err, result) => {
    if (err) return res.status(500).json({ error: "Delete error" });

    // 2. Silinen ID'den büyük olan tüm ID'leri 1 azalt
    db.query(
      "UPDATE members SET id = id - 1 WHERE id > ? ORDER BY id ASC",
      [deletedId],
      (err) => {
        if (err) return res.status(500).json({ error: "Reorder error" });

        // 3. Auto increment değerini en son ID’ye göre yeniden ayarla
        db.query(
          "SELECT MAX(id) AS maxId FROM members",
          (err, rows) => {
            if (err) return res.status(500).json({ error: "Auto increment read error" });

            const newAutoInc = rows[0].maxId + 1;

            db.query(
              `ALTER TABLE members AUTO_INCREMENT = ${newAutoInc}`,
              (err) => {
                if (err)
                  return res.status(500).json({ error: "Auto increment update error" });

                res.json({
                  message: "Member deleted and IDs reordered!",
                });
              }
            );
          }
        );
      }
    );
  });
});


// ---------------------------------------------
//  START SERVER
// ---------------------------------------------
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
