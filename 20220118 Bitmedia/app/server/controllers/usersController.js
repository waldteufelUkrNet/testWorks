const Sequelize = require('sequelize'),
      User      = require('../db/models/user.js');

module.exports.getUsers = async (req, res) => {
  const ascedPage    = req.body.page,
        usersPerPage = req.body.amount;

  const limit  = usersPerPage,
        offset = ascedPage*limit - limit;

  const data = await User.findAll({offset, limit, raw: true});

  for (let i = 0; i < data.length; i++) {
    const associatedData = await getClicksAndViews(data[i].id);
    data[i].total_clicks = associatedData.clicks;
    data[i].total_views = associatedData.views;
  }

  const totalUsersAmount = await User.count();
  data.push({ length: totalUsersAmount });

  res.status(200).send( JSON.stringify(data) );
};

module.exports.getUserData = async (req, res) => {
  const userID    = req.body.userID,
        startDate = req.body.startDate,
        endDate   = req.body.endDate;

  const user = await User.findByPk(userID);
  const data = await user.getUserstatistics({where: {
    date: {
      [Sequelize.Op.between]: [startDate, endDate]
    }
  }, raw: true});

  data.forEach( item => {
    delete item.id;
    delete item.user_id;
  });

  let responseObj = {
    username: user.first_name + ' ' + user.last_name,
    startDate,
    endDate,
    data
  };

  res.status(200).json(responseObj);

};

async function getClicksAndViews(userID) {
  const user   = await User.findByPk(userID),
        subArr = await user.getUserstatistics({raw:true});

  const clicks = subArr.reduce( (sum, current) => {
    return sum + current.clicks;
  }, 0);
  const views = subArr.reduce( (sum, current) => {
    return sum + current.page_views;
  }, 0);

  return {clicks, views};
}