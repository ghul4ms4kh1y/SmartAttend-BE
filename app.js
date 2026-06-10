const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;
const { markAbsent } = require('./utils/scheduler');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/departments', require('./routes/departments.routes'));
app.use('/users', require('./routes/users.routes'));
app.use('/attendances', require('./routes/attendances.routes'));
app.use('/leaves', require('./routes/leaves.routes'));
app.use('/uploads', express.static('uploads'));

// Global error handler — harus paling bawah
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message });
});

sequelize.authenticate()
  .then( async () => {
    console.log('Database terhubung ');
    await markAbsent();
    app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
  })
  .catch(err => console.error('Gagal koneksi database:', err.message));
