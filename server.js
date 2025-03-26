require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const packageRoutes = require('./routes/packageRoutes');
const contactRoutes = require('./routes/contactRoutes')
const blogRoutes = require('./routes/blogRoutes')


const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);



const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


