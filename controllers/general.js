

exports.getHome = (req, res) => {
  res.render("general/home", {
    layout: false,
  });
};

exports.getRooms = (req, res) => {
    res.render("general/rooms", {
      layout: false,
    });
  };



