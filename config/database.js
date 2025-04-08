const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    const dbURI = 'mongodb://127.0.0.1:27017/MinorPostBook';;
    await mongoose.connect(dbURI);
    console.log('Connected to the database successfully!');
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1); 
  }
};

module.exports = connectToDatabase;

