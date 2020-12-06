class Generator_Main extends Generator {
  constructor(x, y, w, h, hp, col) {
    super(createVector(x, y), w, h, hp, col);
    this.turret = new Turret(x, y);
  }

  start() {
    this.render();
    this.generate();

    this.turret.start();
  }

  render() {
    push();
    imageMode(CENTER);
    image(assets.sprites.generators.generator, this.pos.x, this.pos.y, this.w, this.h);
    //fill(this.col);
    //rect(this.pos.x, this.pos.y, this.w, this.h, 15);
    pop();

    push();
    rectMode(CORNER);
    noFill();
    stroke(255);
    strokeWeight(1);
    rect(this.pos.x - this.hp_max_w / 2, this.pos.y - this.rad * 2, this.hp_max_w, this.hp_h);
    noStroke();
    fill(0, 200, 0);
    rect(this.pos.x - this.hp_max_w / 2, this.pos.y - this.rad * 2, this.hp_w, this.hp_h);

    fill(255);
    textSize(24 * r.x);
    text(this.hp, this.pos.x, this.pos.y - this.rad * 2 + this.hp_h / 2);
    pop();
  }
}

function Turret(x, y) {
  this.pos = createVector(x, y);

  this.r = r;
  this.freq = 30;
  this.damage = 5;
  this.projectiles = [];
  this.target = null;
  
  this.range = width * 0.6;
  this.angle = 0;
  this.off = createVector();
  this.projectile_speed = 10 * r.x;
  this.col = color(200, 200, 0);
  
  this.w = 100 * r.x;
  this.h = this.w;
  this.rad = this.w/2;

  this.start = function() {
    this.render();
    this.update();
  }

  this.render = function() {
    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);
    rotate(this.angle+PI/2);
    image(assets.sprites.turret, 0, 0, this.w, this.h);
    pop();
  }

  this.update = function() {
    if (this.target && this.target.alive == false) {
      this.target = null;
    }
    
    if (this.target) {
      this.angle = atan2(this.target.pos.y - this.pos.y, this.target.pos.x - this.pos.x);
      if (frameCount % this.freq == 0) {
        let px = this.pos.x + cos(this.angle) * this.rad;
        let py = this.pos.y + sin(this.angle) * this.rad;
        this.projectiles.push(new Projectile(px, py, this.angle, this.projectile_speed, this.r, this.col));

      }
    }
    
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      this.projectiles[i].start();

      if (this.projectiles[i].pos.x < 0 || this.projectiles[i].pos.x > env.dimension.x || this.projectiles[i].pos.y < 0 || this.projectiles[i].pos.y > env.dimension.y) {
        this.projectiles.splice(i, 1);
      }

      for (let j = env.entities.length - 1; j >= 5; j--) {
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

  this.selectTarget = function(obj) {
    if (this.target == null && obj.behaviour > 0.5) {
      let d = dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
      if (d < this.range) {
        this.target = obj;
      }
    }
  }
}