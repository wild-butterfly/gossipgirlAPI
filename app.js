require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database");
});

app.get("/members", (req, res) => {
  db.query("SELECT * FROM member", (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results);
  });
});

app.get("/members/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM member WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("Member not found");
      return;
    }
    res.json(results[0]);
  });
});

app.post("/members", (req, res) => {
  const { name, last_name, email } = req.body;

  if (!name || !last_name || !email) {
    return res.status(400).json({
      error: "All fields (name, last_name, email) are required",
    });
  }

  db.query(
    "INSERT INTO member (name, last_name, email) VALUES (?, ?, ?)",
    [name, last_name, email],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Error inserting data");
        return;
      }
      res.status(201).json({
        message: "Member successfully added.",
        id: result.insertId,
        name,
        last_name,
        email,
      });
    }
  );
});

app.put("/members/:id", (req, res) => {
  const { id } = req.params;
  const { name, last_name, email } = req.body;
  db.query(
    "UPDATE member SET name = ?, last_name = ?, email = ? WHERE id = ?",
    [name, last_name, email, id],
    (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        res.status(500).send("Error updating data");
        return;
      }
      res.status(200).json({ message: "Member successfully edited." });
    }
  );
});

app.patch("/members/:id", (req, res) => {
  const { id } = req.params;
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(req.body)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }
  values.push(id);

  const sql = `UPDATE member SET ${fields.join(", ")} WHERE id = ?`;
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      res.status(500).send("Error updating data");
      return;
    }
    res.status(200).json({ message: "Member successfully edited." });
  });
});

app.delete("/members/:id", (req, res) => {
  const { id } = req.params;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      res.status(500).send("Error starting transaction");
      return;
    }

    db.query("DELETE FROM member WHERE id = ?", [id], (err, result) => {
      if (err) {
        console.error("Error deleting data:", err);
        db.rollback(() => {
          res.status(500).send("Error deleting data");
        });
        return;
      }

      db.query(
        "UPDATE member SET id = id - 1 WHERE id > ?",
        [id],
        (err, result) => {
          if (err) {
            console.error("Error updating IDs:", err);
            db.rollback(() => {
              res.status(500).send("Error updating IDs");
            });
            return;
          }

          db.query("SELECT MAX(id) AS max_id FROM member", (err, result) => {
            if (err) {
              console.error("Error getting max ID:", err);
              db.rollback(() => {
                res.status(500).send("Error getting max ID");
              });
              return;
            }

            const maxId = result[0].max_id || 0;
            db.query(
              `ALTER TABLE member AUTO_INCREMENT = ${maxId + 1}`,
              (err, result) => {
                if (err) {
                  console.error("Error resetting AUTO_INCREMENT value:", err);
                  db.rollback(() => {
                    res
                      .status(500)
                      .send("Error resetting AUTO_INCREMENT value");
                  });
                  return;
                }

                db.commit((err) => {
                  if (err) {
                    console.error("Error committing transaction:", err);
                    db.rollback(() => {
                      res.status(500).send("Error committing transaction");
                    });
                    return;
                  }
                  res.status(200).json({
                    message: "Member successfully deleted.",
                  });
                });
              }
            );
          });
        }
      );
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
