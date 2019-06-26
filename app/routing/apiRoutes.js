var friends = require("../data/friends");

module.exports = function(app) {

  app.get("/api/friends", function(req, res) {
    res.json(friends);
  });

  app.post("/api/friends", function(req, res) {

    var bff = {
      name: "",
      photo: "",
      friendDiff: Infinity
    };

    var userData = req.body;
    var userScore = userData.scores;

    var totalDiff;

    for (var i = 0; i < friends.length; i++) {
      var currentFriend = friends[i];
      totalDiff = 0;

      console.log(currentFriend.name);

      for (var j = 0; j < currentFriend.scores.length; j++) {
        var currentFriendScore = currentFriend.scores[j];
        var currentUserScore = userScore[j];

        totalDiff = Math.abs(parseInt(currentUserScore) - parseInt(currentFriendScore));
      }

      if (totalDiff <= bff.friendDiff) {
        bff.name = currentFriend.name;
        bff.photo = currentFriend.photo;
        bff.friendDiff = totalDiff;
      }
    }

    friends.push(userData);
    res.json(bff);
  });
};
