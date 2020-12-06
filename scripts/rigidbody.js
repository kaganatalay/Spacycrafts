class Rigidbody {
  constructor(pos, r, col, hp, f) {
    this.pos = pos;
    this.vel = createVector();
    this.acc = createVector();
    this.r = r;
    this.col = col;
    this.angle = 0;
    this.def_force = f * r.x;
    this.friction = 0.985;
    this.hp = hp;
    this.max_hp = hp;
    
    this.hp_w = 0;
    this.hp_max_w = 60 * r.x;
    this.hp_h = 8 * r.y;
    
    this.hp_bar_timer = 200;
    this.hp_bar_max_timer = 200;
    this.bar_alpha = 0;
    
    this.alive = true;
    this.death_timer = 0;
  }
  
  erased() {
    return this.death_timer == 1;
  }
  
  physics() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.vel.mult(this.friction);
    
    this.hp = constrain(this.hp, 0, this.max_hp);
    this.hp_w = map(this.hp, 0, this.max_hp, 0, this.hp_max_w);
    
    this.pos.x = constrain(this.pos.x, 0, env.dimension.x);
    this.pos.y = constrain(this.pos.y, 0, env.dimension.y);
    
    if(this.hp <= 0) {
      this.alive = false;
    } else {
      this.alive = true;
    }
    
    if(this.hp_bar_timer < this.hp_bar_max_timer) {
      this.hp_bar_timer++;
    }
    
    if(this.hp_bar_timer > this.hp_bar_max_timer/2) {
      this.bar_alpha = map(this.hp_bar_timer, this.hp_bar_max_timer/2, this.hp_bar_max_timer, 255, 0);
    } else {
      this.bar_alpha = 255;
    }
  }
  
  gotHit(damage) {
    this.hp -= damage;
    this.hp_bar_timer = 0;
  }
  
  killed(damage) {
    return this.hp - damage <= 0;
  }
  
  move(pos, f) {
    let dest = createVector(pos.x, pos.y);
    dest.sub(this.pos);
    dest.setMag(f);
    this.applyForce(dest.x, dest.y);
  }
   
  repel(other) {
    if(other != this && other.alive == true) {
       let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if(d < other.rad + this.rad * 2) {
          this.move(other.pos, -this.def_force * 3);
        }
    }
  }
  
  
  applyForce(fx, fy) {
    let f = createVector(fx, fy);
    this.acc.add(f);
  }
}
