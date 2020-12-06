let env, menu, r;

let status = {
  start: false,
  tutorial: false,
  credits: false
};

let ending = {
  ended: false,
  win_self: false,
  win_timeout: false,
  lose_killed: false,
  lose_generator: false,
  lose_timeout: false
}

let assets = {
  font: 0,
  bg: 0,
  tutorial: 0,

  soundfx: {
    hit: 0,
    killed: 0,
    projectile: 0,
    music: 0,
    generator_explosion: 0
  },

  sprites: {
    upgrades: {
      maxhp: [],
      reload: [],
      speed: [],
      turret: []
    },

    enemies: {
      fighter: 0,
      jet: 0,
      sumo: 0
    },

    generators: {
      generator: 0,
      red: 0,
      blue: 0
    },

    turret: 0,
    player: 0,
    opponent: 0
  }
}

let canvas = {
  w: 0,
  h: 0
}
let resolution = 0.3;

function preload() {
  assets.font = loadFont("assets/font.ttf");
  assets.bg = loadImage("assets/bg.png");
  assets.tutorial = createVideo("assets/tutorial.mp4");

  assets.soundfx.hit = loadSound("assets/soundfx/hit.wav");
  assets.soundfx.projectile = loadSound("assets/soundfx/projectile.wav");
  assets.soundfx.killed = loadSound("assets/soundfx/killed.wav");
  assets.soundfx.music = loadSound("assets/soundfx/music.mp3");
  assets.soundfx.generator_explosion = loadSound("assets/soundfx/generator_explosion.wav");

  assets.sprites.enemies.fighter = loadImage("assets/sprites/enemies/fighter.png");
  assets.sprites.enemies.jet = loadImage("assets/sprites/enemies/jet.png");
  assets.sprites.enemies.sumo = loadImage("assets/sprites/enemies/sumo.png");
  assets.sprites.generators.generator = loadImage("assets/sprites/generators/generator.png");
  assets.sprites.generators.red = loadImage("assets/sprites/generators/red.png");
  assets.sprites.generators.blue = loadImage("assets/sprites/generators/blue.png");
  assets.sprites.player = loadImage("assets/sprites/player.png");
  assets.sprites.opponent = loadImage("assets/sprites/opponent.png");
  assets.sprites.turret = loadImage("assets/sprites/turret.png");


  assets.sprites.upgrades.maxhp.push(loadImage("assets/sprites/upgrades/maxhp/0.png"));
  assets.sprites.upgrades.maxhp.push(loadImage("assets/sprites/upgrades/maxhp/1.png"));
  assets.sprites.upgrades.maxhp.push(loadImage("assets/sprites/upgrades/maxhp/2.png"));
  assets.sprites.upgrades.maxhp.push(loadImage("assets/sprites/upgrades/maxhp/3.png"));

  assets.sprites.upgrades.reload.push(loadImage("assets/sprites/upgrades/reload/0.png"));
  assets.sprites.upgrades.reload.push(loadImage("assets/sprites/upgrades/reload/1.png"));
  assets.sprites.upgrades.reload.push(loadImage("assets/sprites/upgrades/reload/2.png"));
  assets.sprites.upgrades.reload.push(loadImage("assets/sprites/upgrades/reload/3.png"));

  assets.sprites.upgrades.speed.push(loadImage("assets/sprites/upgrades/speed/0.png"));
  assets.sprites.upgrades.speed.push(loadImage("assets/sprites/upgrades/speed/1.png"));
  assets.sprites.upgrades.speed.push(loadImage("assets/sprites/upgrades/speed/2.png"));
  assets.sprites.upgrades.speed.push(loadImage("assets/sprites/upgrades/speed/3.png"));

  assets.sprites.upgrades.turret.push(loadImage("assets/sprites/upgrades/turret/0.png"));
  assets.sprites.upgrades.turret.push(loadImage("assets/sprites/upgrades/turret/1.png"));
  assets.sprites.upgrades.turret.push(loadImage("assets/sprites/upgrades/turret/2.png"));
  assets.sprites.upgrades.turret.push(loadImage("assets/sprites/upgrades/turret/3.png"));
}

function setup() {
  c = createCanvas(displayWidth, displayHeight);
  c.position(0, 0);

  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont(assets.font);
  textSize(30);
  imageMode(CENTER);
  noStroke();

  cursor(CROSS);

  r = createVector(width / 1920, height / 1080);
  env = new Environment(r, sheet);
  menu = new Menu();

  canvas.w = width / resolution;
  canvas.h = height / resolution;

  assets.soundfx.hit.setVolume(0.05);
  assets.soundfx.projectile.setVolume(0.05);
  assets.soundfx.killed.setVolume(0.05);
  assets.soundfx.music.setVolume(0.1);
  assets.soundfx.generator_explosion.setVolume(0.1);

  DefineParticle("enemy_killed", "assets/particle/enemy_killed.json");
  DefineParticle("opponent_killed", "assets/particle/opponent_killed.json");
  DefineParticle("player_killed", "assets/particle/player_killed.json");
  DefineParticle("hit", "assets/particle/hit.json");
  DefineParticle("generator_main_destroyed", "assets/particle/generator_main_destroyed.json");
  DefineParticle("generator_blue_destroyed", "assets/particle/generator_blue_destroyed.json");

  assets.tutorial.hide();
}

function draw() {
  background(0);

  if (status.start) {
    if (env.death_timer < 400) {
      env.start();
    } else {
      push();
      rectMode(CORNER);
      noStroke();
      fill(220);
      rect(0, 0, width, height);

      rectMode(CENTER);
      textAlign(CENTER, CENTER);

      if (ending.win_timeout) {
        textSize(90 * r.x);
        fill(46, 204, 113);
        text("-  YOU WON  -", width / 2, height * 0.3);

        fill(0);
        textSize(40 * r.x);
        text("Well played! You successfuly defended the generator and destroyed your opponent's spawner. You truly are a gamer", width / 2, height * 0.6, width / 2, height / 2);
      } else if (ending.win_self) {
        textSize(90 * r.x);
        fill(46, 204, 113);
        text("-  YOU WON  -", width / 2, height * 0.3);

        fill(0);
        textSize(40 * r.x);
        text("Well played! You successfuly destroyed your opponent's spawner and defended the generator by yourself. You truly are a gamer", width / 2, height * 0.6, width / 2, height / 2);
      } else if (ending.lose_killed) {
        textSize(90 * r.x);
        fill(231, 76, 60);
        text("-  YOU LOST  -", width / 2, height * 0.3);

        fill(0);
        textSize(40 * r.x);
        text("So close! You defended the generator successfuly but failed to protect your spawner afterwards. Better luck next time!", width / 2, height * 0.6, width / 2, height / 2);
      } else if (ending.lose_generator) {
        textSize(90 * r.x);
        fill(231, 76, 60);
        text("-  YOU LOST  -", width / 2, height * 0.3);

        fill(0);
        textSize(40 * r.x);
        text("You and your opponent failed to defend the generator from the enemies. Your spawners stopped working. Better luck next time!", width / 2, height * 0.6, width / 2, height / 2);
      } else if (ending.lose_timeout) {
        textSize(90 * r.x);
        fill(231, 76, 60);
        text("-  YOU LOST  -", width / 2, height * 0.3);

        fill(0);
        textSize(40 * r.x);
        text("Close! You and your opponent defended the generator successfuly but you failed to destroy your opponent's spawner causing the generator to overheat and explode. Better luck next time!", width / 2, height * 0.6, width / 2, height / 2);
      }
      pop();
    }

    canvas.w = width / resolution;
    canvas.h = height / resolution;

    if (ending.ended == false) {
      push();
      fill(255);
      textSize(32 * r.x);
      text(env.player.money + " Points", width * 0.9, height * 0.05);
      text("Wave " + (env.spawner.wave + 1) + " / 5", width * 0.9, height * 0.10);
      pop();
    }
  } else if (status.tutorial) {
    push();
    imageMode(CORNER);
    image(assets.tutorial, 0, 0, width, height);
    pop();
  } else {
    menu.start();
  }

}

function keyPressed() {
  if (keyCode === 121) {
    let fs = fullscreen();
    fullscreen(!fs);
  }

  for (let i = 0; i < env.player.controls.length; i++) {
    if (key == env.player.controls[i]) {
      env.player.movement[i] = true;
    }
  }

  if (key == " ") {
    if (env.spawner.wave != 4) {
      if (env.spawner.down) {
        env.spawner.down_timer = env.spawner.down_max_timer;
      }
    }
  }
}

function mousePressed() {
  if (status.start) {
    if (env.ui.active) {
      if (mouseButton == LEFT) {
        for (let i = 0; i < env.ui.segments.length; i++) {
          let s = env.ui.segments[i];
          if (s.mouse_on()) {
            s.purchase();
          }
        }
      }
    }
  } else {
    for (let i = 0; i < menu.buttons.length; i++) {
      let b = menu.buttons[i];
      if (b.hovered() && status.tutorial == false) {
        b.func();
        b.active = !b.active;
      }
    }
  }

}

function keyReleased() {
  for (let i = 0; i < env.player.controls.length; i++) {
    if (key == env.player.controls[i]) {
      env.player.movement[i] = false;
    }
  }
}