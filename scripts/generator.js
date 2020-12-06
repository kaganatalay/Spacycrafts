class Generator {
  constructor(pos, w, h, hp, col) {
    this.pos = pos;
    this.vel = createVector();
    this.w = w;
    this.h = h;
    this.hp = hp;
    this.col = col;
    this.rad = w / 2;

    this.max_hp = hp;
    this.hp_w = 0;
    this.hp_max_w = 100 * r.x;
    this.hp_h = 25 * r.y;
    
    this.alive = true;
    this.death_timer = 0;
  }
  
  gotHit(damage) {
    this.hp -= damage;
  }
  
  killed(damage) {
    return null;
  }

  generate() {
    this.hp = constrain(this.hp, 0, this.max_hp);
    this.hp_w = map(this.hp, 0, this.max_hp, 0, this.hp_max_w);
    
    if(this.hp <= 0) {
      this.alive = false;
    } else {
      this.alive = true;
    }
    
    if(this.alive == false) {
      this.death_timer++;
    } 
  }
  
  erased() {
    return this.death_timer == 1;
  }

}