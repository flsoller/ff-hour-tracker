import app from './app';

// Define server port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`),
);
