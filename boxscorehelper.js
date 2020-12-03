const client = require('axios');
const cheerio = require('cheerio');

async function loadBoxScore (gameId) {
  const { data } = await client.get('https://www.espn.com/nfl/boxscore?gameId=' + gameId);
  const boxscoreHtml = getHtml(data, 'article.boxscore-tabs');
  return boxscoreHtml;
  
  //callback(data);
   /*
  const { JSDOM, VirtualConsole } = require('jsdom');
  const virtualConsole = new VirtualConsole();
  
 


  const dom = new JSDOM(data, {
    virtualConsole,
    runScripts: "dangerously"
  });

  dom.window.onload = () => {
    var scoredata = dom.window.espn.scoreboardData;
    callback(scoredata);
  };
  */    
}

//const boxScorePromise = await loadBoxScore('401220312');
/*

loadBoxScore(function(result) {
  var boxscore = getHtml(result, 'article.boxscore-tabs');
  //console.log(boxscore);

  
  const fs = require('fs');
  fs.writeFile('boxscore.html', boxscore, function(err) {
    if (err) {
      console.log(err);
    }
  });
  
 //getPassing(boxscore);
 var passing_stats = getPassingTotals(boxscore);
 var rushing_stats = getRushingTotals(boxscore);
 var receiving_stats = getReceivingTotals(boxscore);
 var fumble_stats = getFumbles(boxscore);
 var defense_stats = getDefenseTotals(boxscore);
 var interception_stats = getInterceptions(boxscore);
 var kick_return_stats = getKickReturns(boxscore);
 var punt_return_stats = getPuntReturns(boxscore);
 var kicking_stats = getKicking(boxscore);
 var punting_stats = getPunting(boxscore);

 console.log(punting_stats);
});
*/

function getHtml(htmlString, selector) {
  const $ = cheerio.load(htmlString);
  return $(selector).html();
}

function getValue(htmlString, selector) {
  const $ = cheerio.load(htmlString, {
    normalizeWhitespace: true,
    xmlMode: true
  });
  var value = $(selector);
  return value.text();
}

async function getPassingTotals(gameId) {

  var boxscore = await loadBoxScore(gameId);

  var passing_total = getHtml(boxscore, '#gamepackage-passing');
  var homePassing = getHtml(passing_total, 'div.gamepackage-home-wrap');
  var homeTotals = getHtml(homePassing, 'tr.highlight');
  var stats = [];

  var home_passing_stats = {};
  home_passing_stats.team = 'home';
  home_passing_stats.attempts = getValue(homeTotals, 'td.c-att');
  home_passing_stats.yards = getValue(homeTotals, 'td.yds');
  home_passing_stats.avg = getValue(homeTotals, 'td.avg');
  home_passing_stats.td = getValue(homeTotals, 'td.td');
  home_passing_stats.interception = getValue(homeTotals, 'td.int');
  home_passing_stats.sacks = getValue(homeTotals, 'td.sacks');
  home_passing_stats.qbr = getValue(homeTotals, 'td.qbr');
  stats.push(home_passing_stats);

  var awayPassing = getHtml(passing_total, 'div.gamepackage-away-wrap');
  var awayTotals = getHtml(awayPassing, 'tr.highlight');

  var away_passing_stats = {};
  away_passing_stats.team = 'away';
  away_passing_stats.attempts = getValue(awayTotals, 'td.c-att');
  away_passing_stats.yards = getValue(awayTotals, 'td.yds');
  away_passing_stats.avg = getValue(awayTotals, 'td.avg');
  away_passing_stats.td = getValue(awayTotals, 'td.td');
  away_passing_stats.interception = getValue(awayTotals, 'td.int');
  away_passing_stats.sacks = getValue(awayTotals, 'td.sacks');
  away_passing_stats.qbr = getValue(awayTotals, 'td.qbr');

  stats.push(away_passing_stats);

  return stats;
}

async function getRushingTotals(gameId) {

  var boxscore = await loadBoxScore(gameId);

  var rushing_total = getHtml(boxscore, '#gamepackage-rushing');
  var home_rushing = getHtml(rushing_total, 'div.gamepackage-home-wrap');

  var stats = [];

  var home_totals = getHtml(home_rushing, 'tr.highlight');
  var home_rushing_stats = {};
  home_rushing_stats.team = 'home';
  home_rushing_stats.carries = getValue(home_totals, 'td.car');
  home_rushing_stats.yards = getValue(home_totals, 'td.yds');
  home_rushing_stats.average = getValue(home_totals,'td.avg');
  home_rushing_stats.td = getValue(home_totals, 'td.td');
  home_rushing_stats.long = getValue(home_totals, 'td.long');
  stats.push(home_rushing_stats);

  var away_rushing = getHtml(rushing_total, 'div.gamepackage-away-wrap');
  var away_totals = getHtml(away_rushing, 'tr.highlight');
  var away_rushing_stats = {};
  away_rushing_stats.team = 'away';
  away_rushing_stats.carries = getValue(away_totals, 'td.car');
  away_rushing_stats.yards = getValue(away_totals, 'td.yds');
  away_rushing_stats.average = getValue(away_totals,'td.avg');
  away_rushing_stats.td = getValue(away_totals, 'td.td');
  away_rushing_stats.long = getValue(away_totals, 'td.long');
  stats.push(away_rushing_stats);
  
  return stats;

}

async function getReceivingTotals(gameId) {
  var boxscore = await loadBoxScore(gameId);
  var receiving_total = getHtml(boxscore, '#gamepackage-receiving');
  var home_receiving = getHtml(receiving_total, 'div.gamepackage-home-wrap');
  var home_receiving_totals = getHtml(home_receiving, 'tr.highlight');
  var stats = [];
  var home_receiving_stats = {};
  home_receiving_stats.team = 'home';
  home_receiving_stats.receptions = getValue(home_receiving_totals, 'td.rec');
  home_receiving_stats.yards = getValue(home_receiving_totals, 'td.yds');
  home_receiving_stats.average = getValue(home_receiving_totals, 'td.avg');
  home_receiving_stats.td = getValue(home_receiving_totals, 'td.td');
  home_receiving_stats.long = getValue(home_receiving_totals, 'td.long');
  home_receiving_stats.targets = getValue(home_receiving_totals, 'td.tgts');
  stats.push(home_receiving_stats);


  
  var away_receiving = getHtml(receiving_total, 'div.gamepackage-away-wrap');
  var away_receiving_totals = getHtml(away_receiving, 'tr.highlight');
  var away_receiving_stats = {};
  away_receiving_stats.team = 'away';
  away_receiving_stats.receptions = getValue(away_receiving_totals, 'td.rec');
  away_receiving_stats.yards = getValue(away_receiving_totals, 'td.yds');
  away_receiving_stats.average = getValue(away_receiving_totals, 'td.avg');
  away_receiving_stats.td = getValue(away_receiving_totals, 'td.td');
  away_receiving_stats.long = getValue(away_receiving_totals, 'td.long');
  away_receiving_stats.targets = getValue(away_receiving_totals, 'td.tgts');
  stats.push(away_receiving_stats);

  return stats;
} 

async function getDefenseTotals(gameId) {

  var boxscore = await loadBoxScore(gameId);

  var defense_total = getHtml(boxscore, '#gamepackage-defensive');
  var home_defense = getHtml(defense_total, 'div.gamepackage-home-wrap');
  var home_defense_totals = getHtml(home_defense, 'tr.highlight');

  var stats = [];

  var home_defense_stats = {};
  home_defense_stats.team = 'home';
  home_defense_stats.total = getValue(home_defense_totals, 'td.tot');
  home_defense_stats.soloTackle = getValue(home_defense_totals, 'td.solo');
  home_defense_stats.sacks = getValue(home_defense_totals, 'td.sacks');
  home_defense_stats.tackleForLoss = getValue(home_defense_totals, 'td.tfl');
  home_defense_stats.passDefended = getValue(home_defense_totals, 'td.pd');
  home_defense_stats.qbHits = getValue(home_defense_totals, 'td.qb')
  home_defense_stats.td = getValue(home_defense_totals, 'td.td');
  stats.push(home_defense_stats);

  
  var away_defense = getHtml(defense_total, 'div.gamepackage-away-wrap');
  var away_defense_totals = getHtml(away_defense, 'tr.highlight');

  var away_defense_stats = {};
  away_defense_stats.team = 'away';
  away_defense_stats.total = getValue(away_defense_totals, 'td.tot');
  away_defense_stats.soloTackle = getValue(away_defense_totals, 'td.solo');
  away_defense_stats.sacks = getValue(away_defense_totals, 'td.sacks');
  away_defense_stats.tackleForLoss = getValue(away_defense_totals, 'td.tfl');
  away_defense_stats.passDefended = getValue(away_defense_totals, 'td.pd');
  away_defense_stats.qbHits = getValue(away_defense_totals, 'td.qb')
  away_defense_stats.td = getValue(away_defense_totals, 'td.td');
  stats.push(away_defense_stats);

  return stats;
}

async function getFumbles(gameId) {

  var boxscore = await loadBoxScore(gameId);

  var fumble_total = getHtml(boxscore, '#gamepackage-fumbles');
  var home_fumbles = getHtml(fumble_total, 'div.gamepackage-home-wrap');
  var home_fumble_total = getHtml(home_fumbles, 'tr.highlight');

  var stats = [];
  var home_fumble_stats = {};

  home_fumble_stats.team = 'home';
  home_fumble_stats.fumble = getValue(home_fumble_total, 'td.fum');
  home_fumble_stats.lost = getValue(home_fumble_total, 'td.lost');
  home_fumble_stats.recovered = getValue(home_fumble_total, 'td.rec');
  stats.push(home_fumble_stats);

  var away_fumble_stats = {};

  var away_fumbles = getHtml(fumble_total, 'div.gamepackage-away-wrap');
  var away_fumble_total = getHtml(away_fumbles, 'tr.highlight');

  away_fumble_stats.team = 'away';
  away_fumble_stats.fumble = getValue(away_fumble_total, 'td.fum');
  away_fumble_stats.lost = getValue(away_fumble_total, 'td.lost');
  away_fumble_stats.recovered = getValue(away_fumble_total, 'td.rec');
  stats.push(away_fumble_stats);

  return stats;
}

async function getInterceptions(gameId) {

  var boxscore = await loadBoxScore(gameId);

  var interception_total = getHtml(boxscore, '#gamepackage-interceptions');

  var home_interceptions = getHtml(interception_total, 'div.gamepackage-home-wrap');
  var home_interceptions_total = getHtml(home_interceptions, 'tr.highlight');

  var stats = [];

  var home_interception_stats = {};
  home_interception_stats.team = 'home';
  home_interception_stats.interception = getValue(home_interceptions_total, 'td.int');
  home_interception_stats.yards = getValue(home_interceptions_total, 'td.yds');
  home_interception_stats.td = getValue(home_interceptions_total, 'td.td');
  stats.push(home_interception_stats);

  
  var away_interceptions = getHtml(interception_total, 'div.gamepackage-away-wrap');
  var away_interceptions_total = getHtml(away_interceptions, 'tr.highlight');
  
  var away_interception_stats = {};
  away_interception_stats.team = 'away';
  away_interception_stats.interception = getValue(away_interceptions_total, 'td.int');
  away_interception_stats.yards = getValue(away_interceptions_total, 'td.yds');
  away_interception_stats.td = getValue(away_interceptions_total, 'td.td');
  stats.push(away_interception_stats);

  return stats;
}

async function getKickReturns(gameId) {

  var boxscore = await loadBoxScore(gameId);

  var kick_returns = getHtml(boxscore, '#gamepackage-kickReturns');
  var home_kick_returns = getHtml(kick_returns, 'div.gamepackage-home-wrap')
  var home_kick_return_total = getHtml(home_kick_returns, 'tr.highlight');

  var stats = [];

  var home_kick_return_stats = {};
  home_kick_return_stats.team = 'home';
  home_kick_return_stats.number = getValue(home_kick_return_total, 'td.no');
  home_kick_return_stats.yards = getValue(home_kick_return_total, 'td.yds');
  home_kick_return_stats.average = getValue(home_kick_return_total, 'td.avg');
  home_kick_return_stats.long = getValue(home_kick_return_total, 'td.long');
  home_kick_return_stats.td = getValue(home_kick_return_total, 'td.td');
  stats.push(home_kick_return_stats);

  
  var away_kick_returns = getHtml(kick_returns, 'div.gamepackage-away-wrap')
  var away_kick_return_total = getHtml(away_kick_returns, 'tr.highlight');
  
  var away_kick_return_stats = {};
  away_kick_return_stats.team = 'away';
  away_kick_return_stats.number = getValue(away_kick_return_total, 'td.no');
  away_kick_return_stats.yards = getValue(away_kick_return_total, 'td.yds');
  away_kick_return_stats.average = getValue(away_kick_return_total, 'td.avg');
  away_kick_return_stats.long = getValue(away_kick_return_total, 'td.long');
  away_kick_return_stats.td = getValue(away_kick_return_total, 'td.td');
  stats.push(away_kick_return_stats);

  return stats;
}

async function getPuntReturns(gameId) {

  var boxscore = await loadBoxScore(gameId);

  var punt_returns = getHtml(boxscore, '#gamepackage-puntReturns');
  var home_punt_returns = getHtml(punt_returns, 'div.gamepackage-home-wrap');
  var home_punt_return_totals = getHtml(home_punt_returns, 'tr.highlight');

  var stats = [];

  var home_punt_return_stats = {};
  home_punt_return_stats.team = 'home';
  home_punt_return_stats.number = getValue(home_punt_return_totals, 'td.no');
  home_punt_return_stats.yards = getValue(home_punt_return_totals, 'td.yds');
  home_punt_return_stats.average = getValue(home_punt_return_totals, 'td.avg');
  home_punt_return_stats.long = getValue(home_punt_return_totals, 'td.long');
  home_punt_return_stats.td = getValue(home_punt_return_totals, 'td.td');
  stats.push(home_punt_return_stats);

  
  var away_punt_returns = getHtml(punt_returns, 'div.gamepackage-away-wrap');
  var away_punt_return_totals = getHtml(away_punt_returns, 'tr.highlight');
  
  var away_punt_return_stats = {};
  away_punt_return_stats.team = 'away';
  away_punt_return_stats.number = getValue(away_punt_return_totals, 'td.no');
  away_punt_return_stats.yards = getValue(away_punt_return_totals, 'td.yds');
  away_punt_return_stats.average = getValue(away_punt_return_totals, 'td.avg');
  away_punt_return_stats.long = getValue(away_punt_return_totals, 'td.long');
  away_punt_return_stats.td = getValue(away_punt_return_totals, 'td.td');
  stats.push(away_punt_return_stats);

  return stats;
}

async function getKicking(gameId) {

  var boxscore = await loadBoxScore(gameId);

  var kicking_stats = getHtml(boxscore, '#gamepackage-kicking');
  var home_kicking = getHtml(kicking_stats, 'div.gamepackage-home-wrap');
  var home_kicking_totals = getHtml(home_kicking, 'tr.highlight');

  var stats = [];
  
  var home_kicking_stats = {};
  home_kicking_stats.team = 'home';
  home_kicking_stats.fieldGoal = getValue(home_kicking_totals, 'td.fg');
  home_kicking_stats.percentage = getValue(home_kicking_totals, 'td.pct');
  home_kicking_stats.long = getValue(home_kicking_totals, 'td.long');
  home_kicking_stats.extraPoint = getValue(home_kicking_totals, 'td.xp');
  home_kicking_stats.points = getValue(home_kicking_totals, 'td.pts');
  stats.push(home_kicking_stats);

  
  var away_kicking = getHtml(kicking_stats, 'div.gamepackage-away-wrap');
  var away_kicking_totals = getHtml(away_kicking, 'tr.highlight');

  var away_kicking_stats = {};
  away_kicking_stats.team = 'away';
  away_kicking_stats.fieldGoal = getValue(away_kicking_totals, 'td.fg');
  away_kicking_stats.percentage = getValue(away_kicking_totals, 'td.pct');
  away_kicking_stats.long = getValue(away_kicking_totals, 'td.long');
  away_kicking_stats.extraPoint = getValue(away_kicking_totals, 'td.xp');
  away_kicking_stats.points = getValue(away_kicking_totals, 'td.pts');
  stats.push(away_kicking_stats);

  return stats;
}

async function getPunting(gameId) {
  var boxscore = await loadBoxScore(gameId);

  var punting_stats = getHtml(boxscore, '#gamepackage-punting');

  var home_punting = getHtml(punting_stats, 'div.gamepackage-home-wrap');
  var home_punting_totals = getHtml(home_punting, 'tr.highlight');

  var stats = [];
  
  var home_punting_stats = {};
  home_punting_stats.team = 'home';
  home_punting_stats.number = getValue(home_punting_totals, 'td.no');
  home_punting_stats.yards = getValue(home_punting_totals, 'td.yds');
  home_punting_stats.average = getValue(home_punting_totals, 'td.avg');
  home_punting_stats.touchback = getValue(home_punting_totals, 'td.tb');
  home_punting_stats.inside20 = getValue(home_punting_totals, 'td.20');
  home_punting_stats.long = getValue(home_punting_totals, 'td.long');
  stats.push(home_punting_stats);

  
  var away_punting = getHtml(punting_stats, 'div.gamepackage-away-wrap');
  var away_punting_totals = getHtml(away_punting, 'tr.highlight');
  var away_punting_stats = {};
  away_punting_stats.team = 'away';
  away_punting_stats.number = getValue(away_punting_totals, 'td.no');
  away_punting_stats.yards = getValue(away_punting_totals, 'td.yds');
  away_punting_stats.average = getValue(away_punting_totals, 'td.avg');
  away_punting_stats.touchback = getValue(away_punting_totals, 'td.tb');
  away_punting_stats.inside20 = getValue(away_punting_totals, 'td.20');
  away_punting_stats.long = getValue(away_punting_totals, 'td.long');
  stats.push(away_punting_stats);

  return stats;
}

exports.loadBoxScore = loadBoxScore;
exports.getPassingTotals = getPassingTotals;
exports.getRushingTotals = getRushingTotals;
exports.getReceivingTotals = getReceivingTotals;
exports.getDefenseTotals = getDefenseTotals;
exports.getFumbles = getFumbles;
exports.getInterceptions = getInterceptions;
exports.getKickReturns = getKickReturns;
exports.getPuntReturns = getPuntReturns;
exports.getKicking = getKicking;
exports.getPunting = getPunting;

