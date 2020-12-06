class Fighter extends Rigidbody {
  constructor(x, y, r, col, hp, f) {
    super(createVector(x, y), r, col, hp, f);

    this.projectiles = [];
    this.freq = 60;
    this.projectile_speed = 12 * this.r.x;
    this.rad = 30 * r.x;
    this.damage = 10;

    this.fire_timer = 0;
    this.off = createVector();

    this.behaviour = random(1);
  
    this.prize = int(random(4, 8));
  }

  start() {
    this.update();
    if (this.alive) {
      this.physics();
      this.render();
      this.AI();
    }
    
    if(this.alive == false) {
      this.death_timer++;
    }
  }

  AI() {
    if (frameCount % this.freq == 0) {
      let px = this.pos.x + cos(this.angle) * this.rad;
      let py = this.pos.y + sin(this.angle) * this.rad;
      this.projectiles.push(new Projectile(px, py, this.angle, this.projectile_speed, this.r, this.col));

      this.fire_timer = this.freq;
    }

    this.fire_timer--;
    
    

    if (this.behaviour <= 0.5) {
      let d = dist(this.pos.x, this.pos.y, env.player.pos.x + this.off.x, env.player.pos.y + this.off.y);
      let projectile_travel_time = d / this.projectile_speed;

      this.off.x = (this.fire_timer + projectile_travel_time) * env.player.vel.x;
      this.off.y = (this.fire_timer + projectile_travel_time) * env.player.vel.y;

      this.angle = atan2(env.player.pos.y + this.off.y - this.pos.y, env.player.pos.x + this.off.x - this.pos.x);

      this.move(createVector(env.player.pos.x + this.off.x, env.player.pos.y + this.off.y), this.def_force);
      
      if(env.player.alive == false) {
        this.behaviour = 1;
      }
    } else {
      this.angle = atan2(env.generator_main.pos.y - this.pos.y, env.generator_main.pos.x - this.pos.x);
      this.move(env.generator_main.pos, this.def_force);
    }

  }


  update() {

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      this.projectiles[i].start();

      if (this.projectiles[i].pos.x < 0 || this.projectiles[i].pos.x > env.dimension.x || this.projectiles[i].pos.y < 0 || this.projectiles[i].pos.y > env.dimension.y) {
        this.projectiles.splice(i, 1);
      }

      for (let j = 0; j < 5; j++) {
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
    image(assets.sprites.enemies.fighter, 0, 0, this.rad * 2.5, this.rad * 2.5);
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


class Sumo extends Rigidbody {
  constructor(x, y, r, col, hp, f) {
    super(createVector(x, y), r, col, hp, f);

    this.projectiles = [];
    this.freq = 50;
    this.projectile_speed = 9 * this.r.x;
    this.rad = 45 * r.x;
    this.damage = 20;

    this.off = createVector();
    this.fire_timer = 0;
    
    this.behaviour = random(1);
    this.prize = int(random(6, 12));
  }

  start() {
    this.update();
    if (this.alive) {
      this.physics();
      this.render();
      this.AI();
    }
    
    if(this.alive == false) {
      this.death_timer++;
    }
  }

  AI() {
    if (frameCount % this.freq == 0) {
      let px = this.pos.x + cos(this.angle) * this.rad;
      let py = this.pos.y + sin(this.angle) * this.rad;
      this.projectiles.push(new Projectile(px, py, this.angle, this.projectile_speed, this.r, this.col));

      this.fire_timer = this.freq;
    }

    this.fire_timer--;


    if (this.behaviour <= 0.5) {
      let d = dist(this.pos.x, this.pos.y, env.player.pos.x + this.off.x, env.player.pos.y + this.off.y);
      let projectile_travel_time = d / this.projectile_speed;

      this.off.x = (this.fire_timer + projectile_travel_time) * env.player.vel.x;
      this.off.y = (this.fire_timer + projectile_travel_time) * env.player.vel.y;

      this.angle = atan2(env.player.pos.y + this.off.y - this.pos.y, env.player.pos.x + this.off.x - this.pos.x);

      this.move(createVector(env.player.pos.x + this.off.x, env.player.pos.y + this.off.y), this.def_force);
      
      if(env.player.alive == false) {
        this.behaviour = 1;
      }
    } else {
      this.angle = atan2(env.generator_main.pos.y - this.pos.y, env.generator_main.pos.x - this.pos.x);
      this.move(env.generator_main.pos, this.def_force);
    }
  }


  update() {

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      this.projectiles[i].start();

      if (this.projectiles[i].pos.x < 0 || this.projectiles[i].pos.x > env.dimension.x || this.projectiles[i].pos.y < 0 || this.projectiles[i].pos.y > env.dimension.y) {
        this.projectiles.splice(i, 1);
      }

      for (let j = 0; j < 5; j++) {
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
    image(assets.sprites.enemies.sumo, 0, 0, this.rad * 2.5, this.rad * 2.5);
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



class Jet extends Rigidbody {
  constructor(x, y, r, col, hp, f) {
    super(createVector(x, y), r, col, hp, f);

    this.projectiles = [];
    this.freq = 20;
    this.projectile_speed = 15 * this.r.x;
    this.rad = 25 * r.x;
    this.damage = 3;
    this.prize = int(random(1, 4));
  }

  start() {
    this.update();
    if (this.alive) {
      this.physics();
      this.render();
      this.AI();
    }
    
    if(this.alive == false) {
      this.death_timer++;
    }
  }

  AI() {
    if (frameCount % this.freq == 0) {
      let px = this.pos.x + cos(this.angle) * this.rad;
      let py = this.pos.y + sin(this.angle) * this.rad;
      this.projectiles.push(new Projectile(px, py, this.angle, this.projectile_speed, this.r, this.col));
    }

    this.angle = atan2(env.player.pos.y - this.pos.y, env.player.pos.x - this.pos.x);
    this.move(env.player.pos, this.def_force);
  }

  update() {

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      this.projectiles[i].start();

      if (this.projectiles[i].pos.x < 0 || this.projectiles[i].pos.x > env.dimension.x || this.projectiles[i].pos.y < 0 || this.projectiles[i].pos.y > env.dimension.y) {
        this.projectiles.splice(i, 1);
      }

      for (let j = 0; j < 5; j++) {
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
    image(assets.sprites.enemies.jet, 0, 0, this.rad * 2.5, this.rad * 2.5);
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