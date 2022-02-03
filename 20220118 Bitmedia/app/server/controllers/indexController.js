module.exports.getStartPage = (req, res) => {
  res.status(200).sendFile(process.env.PATH_TO_SERVER + 'static/pages/index.html');
};