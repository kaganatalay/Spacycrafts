class Opponent extends Rigidbody {
  constructor(x, y, r, col, hp, f) {
    super(createVector(x, y), r, col, hp, f);

    this.projectiles = [];
    this.freq = 20;
    this.projectile_speed = 10 * this.r.x;
    this.rad = 35 * r.x;
    this.damage = 10;

    this.target = null;
    this.range = width * 0.8;

    this.off = createVector();
    this.fire_timer = 0;

    this.respawn_time = 5;
    this.respawn_max_timer = this.respawn_time * 60;
    this.respawn_timer = this.respawn_max_timer;
    this.respawning = true;

    this.prize = 0;
  }

  start() {
    if (this.alive) {
      this.physics();
      this.render();
      this.AI();
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

  selectTarget(obj) {
    if (this.target == null) {
      let d = dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
      if (d < this.range) {
        this.target = obj;
      }
    }
  }

  AI() {

    if (this.target) {
      let d = dist(this.pos.x, this.pos.y, this.target.pos.x + this.off.x, this.target.pos.y + this.off.y);
      let projectile_travel_time = d / this.projectile_speed;

      this.off.x = (this.fire_timer + projectile_travel_time) * this.target.vel.x;
      this.off.y = (this.fire_timer + projectile_travel_time) * this.target.vel.y;

      this.angle = atan2(this.target.pos.y + this.off.y - this.pos.y, this.target.pos.x + this.off.x - this.pos.x);

      this.move(this.target.pos, this.def_force);

      if (frameCount % this.freq == 0) {
        let px = this.pos.x + cos(this.angle) * this.rad;
        let py = this.pos.y + sin(this.angle) * this.rad;
        this.projectiles.push(new Projectile(px, py, this.angle, this.projectile_speed, this.r, this.col));

        this.fire_timer = this.freq;
      }

      this.fire_timer--;
    }

  }

  update() {
    if (this.alive == false && this.respawning == false) {
      if (this.respawn_timer < this.respawn_max_timer) {
        this.respawn_timer++;
      } else {
        if (env.generator_blue.alive == true) {
          this.pos.x = env.generator_blue.pos.x;
          this.pos.y = env.generator_blue.pos.y + env.generator_blue.h;
          this.hp = this.max_hp;
          this.alive = true;
          this.death_timer = 0;
          this.respawning = true;
        }
      }
    }

    if (this.target && this.target.alive == false) {
      this.target = null;
    }

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
              this.projectiles.splice(i, 1);
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
    image(assets.sprites.opponent, 0, 0, this.rad * 2.5, this.rad * 2.5);
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