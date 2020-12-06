class Environment {
  constructor(r, sheet) {
    this.dimension = createVector(2880 * r.x, 3240 * r.y);
    this.spawn_sheet = sheet;

    this.ui = new UI(r);
    this.spawner = new Spawner(this.spawn_sheet);

    this.death_timer = 0;


    this.generator_main = new Generator_Main(this.dimension.x / 2, this.dimension.y / 2, 125 * r.x, 125 * r.y, 2500, color(150));
    this.generator_red = new Generator_Team(this.dimension.x / 2, this.dimension.y - 40 * r.y, 80 * r.x, 80 * r.y, 200, "red");
    this.generator_blue = new Generator_Team(this.dimension.x / 2, 40 * r.y, 80 * r.x, 80 * r.y, 200, "blue");
    
    this.player = new Player(this.generator_red.pos.x, this.generator_red.pos.y - this.generator_red.h, r, color(255, 150, 0), 100, 0.08);
    this.opponent = new Opponent(this.generator_blue.pos.x, this.generator_blue.pos.y + this.generator_blue.h, r, color(0, 227, 255), 100, 0.12);

    this.entities = [this.player, this.opponent, this.generator_main, this.generator_red, this.generator_blue];
    this.border_alpha = 0;

    this.cam_offset = createVector();
    this.shake_timer = 0;
    this.max_shake_timer = 10;
    this.shake_mag = 0;

    this.overtime = 0;
    this.max_overtime = 1800;
    this.ot_alpha = 0;
    this.ot_warning = false;
    this.ot_warning_freq = 90;

    this.cam = createVector();
  }

  start() {
    if (ending.ended == false && this.overtime == 0) {
      if (assets.soundfx.music.isPlaying() == false) {
        assets.soundfx.music.play();
      }
    } else {
      assets.soundfx.music.stop();
    }

    if (ending.ended) {
      this.death_timer++;
    }

    if (ending.ended == false) {
      this.cam.x = canvas.w / 2 - this.player.pos.x + this.cam_offset.x;
      this.cam.y = canvas.h / 2 - this.player.pos.y + this.cam_offset.y;
    } else {
      resolution = lerp(resolution, 0.8, 0.05);
      if(ending.win_timeout && ending.win_self) {
        ending.win_self = false;
      }
      
      if (ending.lose_generator || ending.lose_timeout || ending.win_self) {
        this.cam.x = lerp(this.cam.x, canvas.w / 2 - this.generator_main.pos.x, 0.05);
        this.cam.y = lerp(this.cam.y, canvas.h / 2 - this.generator_main.pos.y, 0.05);
      } else if(ending.win_timeout){
        this.cam.x = lerp(this.cam.x, canvas.w / 2 - this.generator_blue.pos.x, 0.05);
        this.cam.y = lerp(this.cam.y, canvas.h / 2 - this.generator_blue.pos.y, 0.05);
      } else if(ending.lose_killed) {
        this.cam.x = lerp(this.cam.x, canvas.w / 2 - this.generator_red.pos.x, 0.05);
        this.cam.y = lerp(this.cam.y, canvas.h / 2 - this.generator_red.pos.y, 0.05);
      }
    }


    push();
    scale(resolution);
    translate(this.cam.x, this.cam.y);

    rectMode(CENTER);
    fill(50, 0, 0, this.border_alpha);
    rect(this.dimension.x / 2, this.dimension.y / 2, this.dimension.x * 2, this.dimension.y * 2);
    this.border_alpha = map(dist(this.player.pos.x, this.player.pos.y, this.dimension.x / 2, this.dimension.y / 2), this.dimension.x * 0.45, this.dimension.x * 0.50, 0, 255);

    rectMode(CORNER);
    imageMode(CORNER);
    image(assets.bg, 0, 0, this.dimension.x, this.dimension.y);
    imageMode(CENTER);
    noStroke();


    this.cameraShake();
    this.spawner.start();

    this.player.start();
    this.opponent.start();

    if (this.overtime > 0) {
      if (this.player.alive) {
        this.opponent.target = this.player;
      } else {
        this.opponent.target = this.generator_red;
      }
    }

    this.generator_main.start();
    this.generator_red.start();
    this.generator_blue.start();

    // lose_generator
    if (this.generator_main.erased()) {
      ending.ended = true;
      ending.lose_generator = true;
    }

    // win_self
    if (this.spawner.wave == 4 && this.spawner.wave_timer >= this.spawner.wave_max_timer - 5 && this.generator_blue.alive == false) {
      ending.ended = true;
      ending.win_self = true;
    }

    if (this.spawner.wave == 4 && this.spawner.down) {
      if (this.generator_red.alive && this.generator_blue.alive) {
        if (this.ot_warning) {
          this.ot_alpha = 100;
        } else {
          this.ot_alpha = 0;
        }

        if (this.overtime < this.max_overtime) {
          this.overtime++;
        } else {
          // lose_overtime
          ending.ended = true;
          ending.lose_timeout = true;
        }

        if (frameCount % this.ot_warning_freq == 0) {
          this.ot_warning = !this.ot_warning;
        }
      } else {
        if (this.generator_red.alive == false) {
          // lose_killed
          ending.ended = true;
          ending.lose_killed = true;
        } else if (this.generator_blue.alive == false) {
          // win_timeout
          ending.ended = true;
          ending.win_timeout = true;
          
        }
      }
    }




    if (this.generator_main.death_timer == 100) {
      Instantiate("generator_main_destroyed", this.generator_main.pos.x, this.generator_main.pos.y);
      assets.soundfx.generator_explosion.play();
    }
    
    if (ending.lose_killed && this.death_timer == 100) {
      Instantiate("generator_main_destroyed", this.generator_red.pos.x, this.generator_red.pos.y);
      assets.soundfx.generator_explosion.play();
    }
    
    if (ending.win_timeout && this.death_timer == 100) {
      Instantiate("generator_blue_destroyed", this.generator_blue.pos.x, this.generator_blue.pos.y);
      assets.soundfx.generator_explosion.play();
    }
    
    

    if (this.opponent.erased()) {
      assets.soundfx.killed.play();
      Instantiate("opponent_killed", this.opponent.pos.x, this.opponent.pos.y);
    }

    if (this.player.erased()) {
      assets.soundfx.killed.play();
      Instantiate("player_killed", this.player.pos.x, this.player.pos.y);
    }

    this.player.repel(this.opponent);
    for (let i = this.entities.length - 1; i >= 0; i--) {
      this.player.repel(this.entities[i]);
      this.opponent.repel(this.entities[i]);
    }

    for (let i = this.entities.length - 1; i >= 5; i--) {
      this.entities[i].start();
      this.entities[i].repel(this.player);
      this.entities[i].repel(this.generator_main);
      this.entities[i].repel(this.opponent);

      if (this.overtime == 0) {
        this.opponent.selectTarget(this.entities[i]);
      }

      this.generator_main.turret.selectTarget(this.entities[i]);

      if (this.entities[i].erased()) {
        assets.soundfx.killed.play();
        Instantiate("enemy_killed", this.entities[i].pos.x, this.entities[i].pos.y);
      }

      if (this.entities[i].alive == false && this.entities[i].projectiles.length <= 0) {
        this.entities.splice(i, 1);
      }

      for (let j = this.entities.length - 1; j >= 5; j--) {
        if (this.entities[i]) {
          this.entities[i].repel(this.entities[j]);
        }
      }

      if (this.spawner.down) {
        this.entities.splice(i, 1);
        this.opponent.target = null;
        this.generator_main.turret.target = null;
      }
    }

    ParticleHandler();

    pop();

    this.ui.start();

    push();
    rectMode(CORNER);
    noStroke();
    fill(100, this.player.killed_filter_alpha);
    rect(0, 0, width, height);

    textSize(80 * r.x);
    fill(255, 0, 0, this.player.killed_filter_alpha);
    text("Ship Destroyed", width / 2, height * 0.35);
    textSize(40 * r.x);
    fill(255, this.player.killed_filter_alpha);
    text("Respawning in", width / 2, height * 0.50);
    textSize(66 * r.x);
    fill(255, map(this.player.killed_filter_alpha, 0, 180, 0, 255));
    text(nfc(this.player.respawn_time - this.player.respawn_timer / 60, 1), width / 2, height * 0.55);
    pop();

    push();
    rectMode(CORNER);
    noStroke();
    fill(231, 76, 60, this.ot_alpha);
    rect(0, 0, width, height);

    if (this.spawner.wave == 4 && this.spawner.down && ending.ended == false) {
      fill(231, 76, 60);
      textSize(50 * r.x);
      text("GENERATOR OVERHEATING", width / 2, height * 0.1);
      text("DESTROY OPPONENT SPAWNER", width / 2, height * 0.15);
      text(nfc(this.max_overtime / 60 - this.overtime / 60, 1), width / 2, height * 0.2);
    }

    pop();
  }

  shake(mag) {
    this.shake_timer = this.max_shake_timer;
    this.shake_mag = mag;
  }

  cameraShake() {
    if (this.shake_timer > 0) {
      this.shake_timer--;
      this.cam_offset = createVector(random(-this.shake_mag, this.shake_mag), random(-this.shake_mag, this.shake_mag));
    }
  }
}