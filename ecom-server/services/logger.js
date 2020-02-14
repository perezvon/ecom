module.exports = () => (err, req, res, next) => {
  console.error(err.stack);
  console.log(`${new Date()}: Something real bad happening here ${err}`);
  res.status(500).send("Error oh the terror");
};
