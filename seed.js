require("dotenv").config();
const mongoose = require("mongoose");
const Gameboard = require("./models/gameboard");

mongoose.connect(`${process.env.MONGODB_URI}`);

const goGames = [
  {
    name: "Munchkin",
    description:
      "Go down in the dungeon. Kill everything you meet. Backstab your friends and steal their stuff. Grab the treasure and run. Admit it. You love it. Munchkin is the mega-hit card game about dungeon adventure . . . with none of that stupid roleplaying stuff. You and your friends compete to kill monsters and grab magic items. And what magic items! Don the Horny Helmet and the Boots of Butt-Kicking. Wield the Staff of Napalm . . . or maybe the Chainsaw of Bloody Dismemberment. Start by slaughtering the Potted Plant and the Drooling Slime, and work your way up to the Plutonium Dragon . . . And it's illustrated (now in full color!) by John Kovalic! Fast-playing and silly, Munchkin can reduce any roleplaying group to hysteria. And, while they're laughing, you can steal their stuff.",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559255092866-51fY4GdN2jL.jpg",
    numbermax: 6,
    numbermin: 2,
    time: "60min - 72min"
  },
  {
    name: "BANG!",
    description:
      "When a man with a pistol meets a man with a Winchester, you might say that the one with the pistol is a dead man, unless his pistol is a Volcanic, In the wild west, the Outlaws hunt the Sheriff, the Sheriff hunts the Outlaws, and the Renegade plots in secret, ready to join one side or the other. Before long, bullets start to fly, Which gunmen are Deputies, ready to sacrifice themselves for the Sheriff? And which are the merciless Outlaws, looking to gun him down?",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559254843431-51VlLwibKZL.jpg",
    numbermax: 7,
    numbermin: 4,
    time: "20min - 40min"
  },
  {
    name: "Coup",
    description:
      " In the not too distant future, the government is run for profit by a new 'royal class' of multi-national CEOs. Their greed and absolute control of the economy has reduced all but a privileged few to lives of poverty and desperation. Out of the oppressed masses rose The Resistance, an underground organization focused on overthrowing these powerful rulers. The valiant efforts of The Resistance have created discord, intrigue and weakness in the political courts of the novena royal, bringing the government to brink of collapse. But for you, a powerful government official, this is your opportunity to manipulate, bribe and bluff your way into absolute power. ",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559254971843-51cnlYAh-6L.jpg",
    numbermax: 6,
    numbermin: 2,
    time: "15min - 30min"
  },
  {
    name: "Zombicide",
    description:
      "Zombicide is a collaborative game for 1 to 6 players, for 13 years old and up. A game lasts for 20 minutes (beginner board) to 3 hours (expert board). Each player controls from one (for 6 players) to four (solo game) survivors, human beings in a zombie-infested town. In fact, survivors hastily change to hunters to smash zombies through and through. However, the team must constantly keep the balance between survival and slaughter: as the zombicide's going on, the Danger level is going up and infected are growing in numbers. Any misstep can turn to disaster. Zombicide is a fun and easy game with cool minis in an archetypical, popular and comics-inspired environment. Ambiance is constantly kept between beat'em up and survival horror as characters keep on turning from preys to predators. Humor and gloom happily marry in a zombie-fest. Find weapons, kill zombies. The more zombies you kill, the more skilled you get, the more skilled you get, the more zombies appear. The only way out is Zombicide! Play 10 scenarios on different maps made from the included modular map tiles, or create your own.",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559257770811-61y9z6djGYL.jpg",
    numbermax: 6,
    numbermin: 1,
    time: "20min - 180min"
  },
  {
    name: "Dixit",
    description:
      " Winner of the 2010 Spiel des Jahres German Board Game of the Year Award. Each player at his turn plays the storyteller. He is given a single picture, while the other players get a hand of six pictures. The storyteller says a sentence or a word connected to his picture, then each player chooses one of his pictures to bet upon. All pictures are showed face up, and every player have to bet upon what picture was the storyteller's. ",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559258092947-61SvciVJLlL.jpg",
    numbermax: 6,
    numbermin: 3,
    time: "30min - 42min"
  },
  {
    name: "The Resistance",
    description:
      "The Resistance is a very intense game of secret identities deductiona and deception for 5-10 players.",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559254432300-51X5r1nBOnL.jpg",
    numbermax: 10,
    numbermin: 5,
    time: "30min - 45min"
  },
  {
    name: "Eldritch Horror",
    description:
      "Across the globe, ancient evil is stirring. Now, you and your trusted circle of colleagues must travel around the world, working against all odds to hold back the approaching horror. Foul monsters, brutal encounters, and obscure mysteries will take you to your limit and beyond. All the while, you and your fellow investigators must unravel the otherworldy mysteries scattered around the globe in order to push back the gathering mayhem that threatens to overwhelm humanity. The end draws near! Do you have the courage to prevent global destruction? Eldritch Horror is a cooperative game of terror and adventure in which one to eight players take the roles of globetrotting investigators working to solve mysteries, gather clues, and protect the world from an Ancient One - an elder being intent on destroying our world. Each Ancient One comes with its own unique decks of Mystery and Research cards, which draw you deeper into the lore surrounding each loathsome creature. Discover the true name of Azathoth or battle Cthulhu on the high seas. With twelve unique investigators, two hundred-fifty tokens, and over three hundred cards, Eldritch Horror presents an epic, world-spanning adventure with each and every game.",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559254957620-61KqujHT2B4L.jpg",
    numbermax: 8,
    numbermin: 1,
    time: "120min - 240min"
  },
  {
    name: "Saboteur",
    description:
      "You and your fellow dwarves are digging for gold in a maze of mining tunnels. But, beware! Some of the miners are saboteurs trying to foil your efforts and steal all your hard-earned gold! Now you must overcome cave-ins, broken lanterns, and busted pick-axes to find the mother lode!",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559253385911-51SYQdt0ZPL.jpg",
    numbermax: 10,
    numbermin: 3,
    time: "30min - 45min"
  },
  {
    name: "Catan",
    description:
      " The women and men of your expedition build the first two settlements. Fortunately, the land is rich in natural resources. You build roads and new settlements that eventually become cities. Will you succeed in gaining supremacy on Catan? Barter trade dominates the scene. Some resources you have in abundance, other resources are scarce. Ore for wool, brick for lumber - you trade according to what is needed for your current building projects. Proceed strategically! If you found your settlements in the right places and skillfully trade your resources, then the odds will be in your favor. But your opponents are smart too. To begin the game, we build the game board using hexagonal terrain tiles. Catan is born - a beautiful island with mountains, pastures, hills, fields, and forests, surrounded by the sea. Each of us places two small houses on spaces where three terrain hexes meet. They are our starting settlements. And so it begins. I roll two dice. An “11”! Each terrain hex is marked with a die roll number. Each player who owns a settlement adjacent to a terrain hex marked with the number rolled receives a resource produced by this hex. Hills produce brick, forests produce lumber, mountains produce ore, fields produce grain, and pastures produce wool. We use these resources to expand across Catan: we build roads and new settlements, or we upgrade our existing settlements to cities. For example, a road costs 1 brick and 1 lumber. If we do not have the necessary resources, we can acquire them by trading with our opponents. Each settlement is worth 1 victory point and each city is worth 2 victory points. If you expand cleverly, you may be the first player to reach 10 victory points and thus win the game! ",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559258096678-51Eiofu9mqL.jpg",
    numbermax: 4,
    numbermin: 3,
    time: "45min - 90min"
  },
  {
    name: "King of Tokyo",
    description:
      "This new edition of the best-seller boasts new artwork, clearer rules, and revamped card abilities. Monsters have a new look, and the coveted space penguin character takes his place in Tokyo! King of Tokyo is a game for 2 to 6 players where you play as Mutant monsters, rampaging robots, or even abominable aliens battling in a fun, chaotic atmosphere.  Roll dice and choose your strategy: will you attack your enemies? Heal your wounds? improve your monster? Stomp your path to victory.",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559257600208-61doPBeJTjL.jpg",
    numbermax: 6,
    numbermin: 2,
    time: "30min - 36min"
  },
  {
    name: "Pandemic",
    description:
      "After five years of Pandemic, hundreds of thousands of players have contracted the virus! To celebrate this milestone, Pandemic has been completely re-designed. With new artwork by Chris Quilliams (Clash of Cultures, Merchants & Marauders), Pandemic will now have a more modern look, inside and outside the box. With two new characters (the Contingency Planner and the Quarantine Specialist) face the game in ways you never thought possible as brand-new, virulent challenges await you!",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559254186140-51iNoyxoamL.jpg",
    numbermax: 4,
    numbermin: 2,
    time: "45min - 60min"
  },
  {
    name: "Battlestar Galactica",
    description:
      "Battlestar Galactica: The Board Game is an exciting game of mistrust, intrigue, and the struggle for survival. Based on the epic and widely-acclaimed Sci Fi Channel series, Battlestar Galactica: The Board Game puts players in the role of one of ten of their favorite characters from the show. Each playable character has their own abilities and weaknesses, and must all work together in order for humanity to have any hope of survival. However, one or more players in every game secretly side with the Cylons. Players must attempt to expose the traitor while fuel shortages, food contaminations, and political unrest threatens to tear the fleet apart. After the Cylon attack on the Colonies, the battered remnants of the human race are on the run, constantly searching for the next signpost on the road to Earth. They face the threat of Cylon attack from without, and treachery and crisis from within. Humanity must work together if they are to have any hope of survival...but how can they, when any of them may, in fact, be a Cylon agent? Battlestar Galactica: The Board Game is a semi-cooperative game for 3-6 players ages 10 and up that can be played in 2-3 hours.",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559258003590-613F9Ue01nL.jpg",
    numbermax: 6,
    numbermin: 3,
    time: "120min - 300min"
  },
  {
    name: "Arkham Horror",
    description:
      "The town of Arkham, Massachusetts is in a panic. Horrific and bizarre events have begun to occur with increasing frequency -- all seeming to point towards some cataclysmic event in the near future that may spell disaster for everyone. Only one small band of investigators can save Arkham from the Great Old Ones and destruction! Arkham Horror was originally published by Chaosium, Inc. almost two decades ago. This new, updated edition features stunning new artwork and graphical design as well as revised and expanded rules! No fan of the Cthulhu Mythos will want to miss this opportunity to acquire this classic Call of Cthulhu boardgame!",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559254926767-61X8MN6SuwL.jpg",
    numbermax: 8,
    numbermin: 1,
    time: "120min - 180min"
  },
  {
    name: "Mansions of Madness: 2nd Edition",
    description:
      " The monster figures in Mansions of Madness Second Edition are set on the same bases as the Arkham Horror Premium Figures and those featured in the first edition of Mansions of Madness. These bases allow you to slide information tokens underneath them, so you have quick and easy access to the monsters' traits and abilities. Because of the consistency between editions, you can seamlessly incorporate your first edition and painted minis into your new game, expanding the possibilities of your game and further immersing you in the bone-chilling happenings that have befallen Arkham's residents. In the Mansions of Madness Second Edition companion app, you will have the option to incorporate some or all of your old components. Whether you have the first edition and its expansions or just one of the products, you can still incorporate it into your game. Each product you add to your collection will allow you to play as that game's investigators, introduce the possibility for those monsters to spawn, include a few new people to encounter, and widen the pool of maps the app could generate for your chosen scenario. If you decide to play without certain expansions or add more to your collection, you can always go back and change your collection within the app, thereby altering the possible combinations of monsters, maps, and investigators. ",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559254973792-51Z2Bp88KhgL.jpg",
    numbermax: 5,
    numbermin: 1,
    time: "120min - 180min"
  },
  {
    name: "A Game of Thrones",
    description:
      "Based on the best-selling novel series A Song of Ice and Fire by George R. R. Martin, A Game of Thrones: The Board Game Second Edition lets 3-6 players take control of the great houses of Westeros in an epic struggle to claim the Iron Throne. The updated second edition brings a host of enhancements to your A Game of Thrones experience. It incorporates elements from previous expansions, including ports, garrisons, Wildling cards, and Siege engines, while introducing welcome new innovations. Convenient player screens will hide your underhanded dealings from prying eyes, while new Tides of Battle cards convey the uncertainty of war. This, along with updated graphics and a clarified ruleset, means the time has never been better to claim the Iron Throne.",
    image_url:
      "https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559253937201-61TIielKgKL.jpg",
    numbermax: 6,
    numbermin: 3,
    time: "120min - 240min"
  }
];

Gameboard.create(goGames, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${goGames.length} Games`);
  mongoose.connection.close();
});
