const express = require('express');
const redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

app.use(bodyParser.json());

// Connect to Redis
const client = redis.createClient({
  url: 'redis://@127.0.0.1:6379'  // Default Redis connection
});

client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log("🛠 Received Token:", token);

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }
    console.log("🔓 Decoded Token:", decoded); // Check if role is included
    req.user = decoded;
    next();
  });
};

// Middleware to check for admin role
const isAdmin = (req, res, next) => {
  console.log("🔍 Checking Admin Role:", req.user.role); // Debugging output
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// 🛠️ Signup Endpoint
app.post("/signup", async (req, res) => {
  try {
    const { email, password, role, confirmationCode } = req.body;
    console.log("🛠 Signup Request - Email:", email, "Role:", role); // Debugging output

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "Missing required fields!" });
    }

    if (role === "admin" && confirmationCode !== "AdminPass") {
      return res.status(400).json({ success: false, message: "Invalid confirmation code for admin role" });
    }

    const existingUser = await client.hGetAll(`user:${email}`);
    if (existingUser.password) {
      return res.status(400).json({ success: false, message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Hashed Password:", hashedPassword);

    const userRole = role || "viewer";
    await client.hSet(`user:${email}`, "password", hashedPassword);
    await client.hSet(`user:${email}`, "role", userRole);
    // 🔍 Verify saved data
    const savedUser = await client.hGetAll(`user:${email}`);
    console.log("✅ Saved User in Redis:", savedUser);

    res.json({ success: true, message: "Signup successful!" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔐 Login Endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Login Request - Email:", email);

    const user = await client.hGetAll(`user:${email}`);
    console.log("🛠 User from Redis:", user);

    if (!user.password) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    console.log("🔑 Role Retrieved from Redis:", user.role); // Check if role is undefined

    if (!user.role) {
      return res.status(500).json({ success: false, message: "User role is missing!" });
    }

    const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token, user: { email, role: user.role } });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get('/residents/view', async (req, res) => {
  try {
    const keys = await client.keys("resident:*");

    if (keys.length === 0) {
      return res.json([]);
    }

    const residents = await Promise.all(keys.map(async (key) => {
      const residentData = await client.hGetAll(key);
      return { id: key.replace('resident:', ''), name: residentData.name, age: residentData.age , gender: residentData.gender, employmentStatus:residentData.employmentStatus, civilStatus:residentData.civilStatus, address:residentData.address, contact:residentData.contact, householdNumber:residentData.householdNumber};
    }));

    res.json(residents);
  } catch (error) {
    console.error('Error fetching residents:', error);
    res.status(500).json({ message: 'Failed to fetch residents' });
  }
});

// CRUD operations for residents
app.post("/residents", verifyToken, isAdmin, async (req, res) => {
  const { resident_id, name, age, gender, employmentStatus, civilStatus, address, contact, householdNumber } = req.body;

  // Validate required fields
  if (!resident_id || !name || !age || !gender || !employmentStatus || !civilStatus || !address || !contact || !householdNumber) {
    return res.status(400).json({ message: "⚠️ All fields are required" });
  }

  try {
    const residentData = { 
      name, 
      age, 
      gender, 
      employmentStatus, 
      civilStatus, 
      address, 
      contact, 
      householdNumber 
    };

    // Save resident data in Redis hash
    await client.hSet(`resident:${resident_id}`, "name", residentData.name);
    await client.hSet(`resident:${resident_id}`, "age", residentData.age);
    await client.hSet(`resident:${resident_id}`, "gender", residentData.gender);
    await client.hSet(`resident:${resident_id}`, "employmentStatus", residentData.employmentStatus);
    await client.hSet(`resident:${resident_id}`, "civilStatus", residentData.civilStatus);
    await client.hSet(`resident:${resident_id}`, "address", residentData.address);
    await client.hSet(`resident:${resident_id}`, "contact", residentData.contact);
    await client.hSet(`resident:${resident_id}`, "householdNumber", residentData.householdNumber);

    res.status(201).json({ message: "✅ Resident saved successfully" });
  } catch (error) {
    console.error("❌ Error saving resident:", error);
    res.status(500).json({ message: "❌ Failed to save resident" });
  }
});

// Read (R)
app.get('/residents/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const resident = await client.hGetAll(`resident:${id}`);
  if (Object.keys(resident).length === 0) {
    return res.status(404).json({ message: 'resident not found' });
  }
  res.json(resident);
});




// Read all residents
app.get('/residents', verifyToken, async (req, res) => {
  try {
    const keys = await client.keys("resident:*");
    const residents = await Promise.all(keys.map(async (key) => {
      const residentData = await client.hGetAll(key);
      return { id: key.replace('resident:', ''), ...residentData }; // Ensure ID is extracted properly
    }));
    res.json(residents);
  } catch (error) {
    console.error('Error fetching residents:', error);
    res.status(500).json({ message: 'Failed to fetch residents' });
  }
});

// Update (U)
app.put('/residents/:id', verifyToken, isAdmin, async (req, res) => {
  const id = req.params.id;
  const { name, age, gender, employmentStatus, civilStatus, address, contact, householdNumber } = req.body;

  if (!name && !age && !gender && !employmentStatus && !civilStatus && !address && !contact && !householdNumber) {
    return res.status(400).json({ message: 'At least one field is required to update' });
  }

  try {
    const existingResident = await client.hGetAll(`resident:${id}`);
    if (Object.keys(existingResident).length === 0) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    // Update resident data in Redis
    if (name) await client.hSet(`resident:${id}`, 'name', name);
    if (age) await client.hSet(`resident:${id}`, 'age', age);
    if (gender) await client.hSet(`resident:${id}`, 'gender', gender);
    if (employmentStatus) await client.hSet(`resident:${id}`, 'employmentStatus', employmentStatus);
    if (civilStatus) await client.hSet(`resident:${id}`, 'civilStatus', civilStatus);
    if (address) await client.hSet(`resident:${id}`, 'address', address);
    if (contact) await client.hSet(`resident:${id}`, 'contact', contact);
    if (householdNumber) await client.hSet(`resident:${id}`, 'householdNumber', householdNumber);

    res.status(200).json({ message: 'Resident updated successfully' });
  } catch (error) {
    console.error('Error updating Resident:', error);
    res.status(500).json({ message: 'Failed to update Resident' });
  }
});

// Delete (D)
app.delete('/residents/:id', verifyToken, isAdmin, async (req, res) => {
  const id = req.params.id;
  await client.del(`resident:${id}`);
  res.status(200).json({ message: 'Resident deleted successfully' });
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/residents/upload', verifyToken, isAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const results = [];

  // Read and parse the CSV file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      console.log('Parsed row:', data); // Log parsed data for debugging
      results.push(data);
    })
    .on('end', async () => {
      try {
        let skippedRecords = 0;
        let addedRecords = 0;

        // Validate and save each resident record to Redis
        for (const resident of results) {
          const { id, name, age, gender, employmentStatus, civilStatus, address, contact, householdNumber } = resident;

          // Validate required fields
          if (!id || !name || !age || !gender || !employmentStatus || !civilStatus || !address || !contact || !householdNumber) {
            console.warn(`Skipping invalid resident record: ${JSON.stringify(resident)}`);
            skippedRecords++;
            continue;
          }

          // Check if resident with the same ID already exists
          const existingResident = await client.hGetAll(`resident:${id}`);
          if (Object.keys(existingResident).length > 0) {
            console.warn(`Skipping duplicate resident record with ID: ${id}`);
            skippedRecords++;
            continue;
          }

          // Save resident data in Redis hash
          await client.hSet(`resident:${id}`, 'name', name);
          await client.hSet(`resident:${id}`, 'age', age);
          await client.hSet(`resident:${id}`, 'gender', gender);
          await client.hSet(`resident:${id}`, 'employmentStatus', employmentStatus);
          await client.hSet(`resident:${id}`, 'civilStatus', civilStatus);
          await client.hSet(`resident:${id}`, 'address', address);
          await client.hSet(`resident:${id}`, 'contact', contact);
          await client.hSet(`resident:${id}`, 'householdNumber', householdNumber);

          addedRecords++;
        }

        // Delete the uploaded file after processing
        fs.unlinkSync(req.file.path);

        res.status(201).json({ 
          message: 'CSV data imported successfully',
          addedRecords: addedRecords,
          skippedRecords: skippedRecords,
        });
      } catch (error) {
        console.error('Error importing CSV data:', error);
        res.status(500).json({ message: 'Failed to import CSV data' });
      }
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});