class Player extends Rigidbody {
  constructor(x, y, r, col, hp, f) {
    super(createVector(x, y), r, col, hp, f);

    this.controls = ["w", "a", "s", "d"];
    this.movement = [false, false, false, false];
    this.projectiles = [];
    this.freq = 25;
    this.projectile_speed = 10 * this.r.x;
    this.rad = 35 * r.x;
    this.damage = 10;

    this.respawn_time = 7.5;
    this.respawn_max_timer = this.respawn_time * 60;
    this.respawn_timer = this.respawn_max_timer;
    this.respawning = true;

    this.money = 0;

    this.killed_zoom = 0.8;
    this.killed_filter_alpha = 0;
  }

  gotHit(damage) {
    this.hp -= damage;
    this.hp_bar_timer = 0;
    env.shake(2);
    assets.soundfx.hit.play();
  }

  start() {
    if (this.alive) {
      this.physics();
      this.render();
      this.control();
      this.shoot();
    } else {
      if (this.respawning) {
        this.respawn_timer = 0;
        this.respawning = false;
      }
    }

    this.update();

    if (this.alive == false) {
      this.death_timer++;
    }
  }

  shoot() {
    if (frameCount % this.freq == 0 && mouseIsPressed && (env.spawner.down == false || env.overtime > 0)) {
      let px = this.pos.x + cos(this.angle) * this.rad;
      let py = this.pos.y + sin(this.angle) * this.rad;
      this.projectiles.push(new Projectile(px, py, this.angle, this.projectile_speed, this.r, this.col));
      env.shake(1.3);
      assets.soundfx.projectile.play();
    }

  }

  control() {
    if (env.spawner.down == false || env.overtime > 0) {
      if (this.movement[1]) {
        this.applyForce(-this.def_force, 0);
      }

      if (this.movement[3]) {
        this.applyForce(this.def_force, 0);
      }


      if (this.movement[2]) {
        this.applyForce(0, this.def_force);
      }

      if (this.movement[0]) {
        this.applyForce(0, -this.def_force);
      }
    }
  }

  update() {
    if (this.alive == false && this.respawning == false) {
      if (this.respawn_timer < this.respawn_max_timer) {
        this.respawn_timer++;
      } else {
        if (env.generator_red.alive == true) {
          this.pos.x = env.generator_red.pos.x;
          this.pos.y = env.generator_red.pos.y - env.generator_red.h;
          this.hp = this.max_hp;
          this.alive = true;
          this.death_timer = 0;
          this.respawning = true;
        }
      }
    }

    if (ending.ended == false) {
      if (this.alive == false) {
        resolution = lerp(resolution, this.killed_zoom, 0.05);
        this.killed_filter_alpha = lerp(this.killed_filter_alpha, 180, 0.05);
      } else {
        resolution = lerp(resolution, 1, 0.05);
        this.killed_filter_alpha = lerp(this.killed_filter_alpha, 0, 0.05);
      }
    } else {
      this.killed_filter_alpha = 0;
    }
    this.angle = atan2(mouseY - height / 2, mouseX - width / 2);


    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      this.projectiles[i].start();

      if (this.projectiles[i].pos.x < 0 || this.projectiles[i].pos.x > env.dimension.x || this.projectiles[i].pos.y < 0 || this.projectiles[i].pos.y > env.dimension.y) {
        this.projectiles.splice(i, 1);
      }

      for (let j = env.entities.length - 1; j >= 0; j--) {
        if (this.projectiles[i]) {
          if (env.entities[j] != this) {
            if (this.projectiles[i].collides(env.entities[j]) && env.entities[j].alive == true) {
              env.entities[j].gotHit(this.damage);
              if (env.entities[j].killed(this.damage)) {
                this.money += env.entities[j].prize;
              }

              Instantiate("hit", this.projectiles[i].pos.x, this.projectiles[i].pos.y);
              this.projectiles.splice(i, 1);
              assets.soundfx.hit.play();
            }
          }
        }
      }
    }
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle + PI / 2);
    //fill(this.col);
    //triangle(-this.rad * 0.8, this.rad, 0, -this.rad, this.rad * 0.8, this.rad);
    image(assets.sprites.player, 0, 0, this.rad * 2.5, this.rad * 2.5);
    pop();

    push();
    rectMode(CORNER);
    noFill();
    stroke(255, this.bar_alpha);
    strokeWeight(1);
    rect(this.pos.x - this.hp_max_w / 2, this.pos.y - this.rad * 2, this.hp_max_w, this.hp_h);
    noStroke();
    fill(0, 200, 0, this.bar_alpha);
    rect(this.pos.x - this.hp_max_w / 2, this.pos.y - this.rad * 2, this.hp_w, this.hp_h);
    pop();
  }
}