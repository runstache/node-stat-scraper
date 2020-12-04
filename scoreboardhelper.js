const client = require('axios');

async function loadScoreData(weekNumber, callback) {
  const { data } = await client.get('https://www.espn.com/nfl/scoreboard/_/year/2020/seasontype/2/week/' + weekNumber);


  const { JSDOM, VirtualConsole } = require('jsdom');
  const virtualConsole = new VirtualConsole();

  const dom = new JSDOM(data, {
    virtualConsole,
    runScripts: "dangerously"
  });

  dom.window.onload = () => {
    var scoredata = dom.window.espn.scoreboardData;
    var events = scoredata.events;
    var i;
    var games = [];
    for (i = 0; i < events.length; i++) {
      var item = events[i];

      var competition = item.competitions[0];
      var competitors = competition.competitors;
      var game = {};

      game.id = item.id;
      var j;
      for (j = 0; j < competitors.length; j++) {
        var competitor = competitors[j];
        var competitorTeam = competitor.team;
        var team = {};
        team.score = competitor.score;
        team.name = competitorTeam.displayName;
        team.code = competitorTeam.abbreviation;
        team.image = getFileName(competitorTeam.logo);

        if (competitor.homeAway == 'home') {
          game.homeTeam = team;
        } else {
          game.visitorTeam = team;
        }
        game.weekNumber = weekNumber;
        games.push(game);
      }
    }
    callback(games);
  };
}


function getFileName(url) {

  var strings = url.split('/');
  var length = strings.length;

  var lastItem = strings[length - 1];
  var names = lastItem.split('&');
  return names[0];
}

exports.loadScoreData = loadScoreData;