class UI {
  constructor(r) {
    this.active = false;

    this.w = width * 0.8;
    this.h = height * 0.8;

    this.pos = createVector(width / 2, height / 2);
    this.a = createVector(width / 2 - this.w / 2, height / 2 - this.h / 2);

    this.segments = [];
    this.segments.push(new Segment((this.a.x + 170 * r.x) * 1, this.a.y + 250 * r.y, 175 * r.x, 175 * r.y, () => {
      env.player.def_force += 0.02 * r.x;
    }, "Increases speed and makes you feel like the fastest thing in the universe", assets.sprites.upgrades.speed));
    this.segments.push(new Segment((this.a.x + 170 * r.x) * 2, this.a.y + 250 * r.y, 175 * r.x, 175 * r.y, () => {
      env.player.freq -= 3;
    }, "Decreases time between each shot making your spaceship go ratatata", assets.sprites.upgrades.reload));
    this.segments.push(new Segment((this.a.x + 170 * r.x) * 3, this.a.y + 250 * r.y, 175 * r.x, 175 * r.y, () => {
      env.player.max_hp += 15;
    }, "Improves your shield and makes your ship more resistant to enemy projectiles", assets.sprites.upgrades.maxhp));

    this.segments.push(new Segment((this.a.x + 170 * r.x) * 1, this.a.y + 675 * r.y, 175 * r.x, 175 * r.y, () => {
      env.generator_main.turret.freq -= 5;
      env.generator_main.turret.damage += 4;
    }, "Increases the damage and reload speed of the generator turret", assets.sprites.upgrades.turret));
    
    this.bar_w = 0;
    this.bar_max_w = 400 * r.x;
    this.bar_h = 50 * r.y;
  }

  start() {
    if(env.spawner.wave <= 3 && env.spawner.down) {
      this.active = true;
    } else {
      this.active = false;
    }
    
    push();
    rectMode(CORNER);
    textAlign(CENTER, CENTER);
    fill(map(env.generator_main.hp, 0, env.generator_main.max_hp, 255, 0), map(env.generator_main.hp, 0, env.generator_main.max_hp, 0, 255), 0);
    rect(50 * r.x, 50 * r.y, this.bar_w, this.bar_h);
    
    noFill();
    strokeWeight(2 * r.y);
    stroke(220);
    rect(50 * r.x, 50 * r.y, this.bar_max_w, this.bar_h);
    
    noStroke();
    fill(255);
    textSize(32 * r.x);
    text(env.generator_main.hp + " / " + env.generator_main.max_hp, 50 * r.x + this.bar_max_w / 2, 50 * r.y + this.bar_h / 2);
    pop();
    
    this.bar_w = map(env.generator_main.hp, 0, env.generator_main.max_hp, 0, this.bar_max_w);

    if (this.active) {
      push();
      rectMode(CENTER);
      noStroke();
      textAlign(LEFT, CENTER);
      
      fill(100, 200);
      rect(this.pos.x, this.pos.y, this.w, this.h, 20);

      fill(255);
      textSize(40 * r.x);
      text("Ship Upgrades", this.pos.x + 80 * r.x, this.a.y + 60 * r.y, this.w, 40 * r.y);
      text("Generator Upgrades", this.pos.x + 80 * r.x, this.a.y + 500 * r.y, this.w, 40 * r.y);

      strokeWeight(2);
      stroke(255);
      line(this.a.x + this.w - 300 * r.x, this.a.y, this.a.x + this.w - 300 * r.x, this.a.y + this.h);
      line(this.a.x + this.w - 300 * r.x, this.a.y + this.h / 3, this.a.x + this.w, this.a.y + this.h / 3);
      
      noStroke();
      textAlign(CENTER, CENTER);
      fill(255);
      textSize(40 * r.x);
      text("Press Space to Skip Downtime", width/2, height*0.85);
      pop();

      for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].start();
        if (this.segments[i].mouse_on()) {
          push();
          fill(255);
          rectMode(CORNER);
          textSize(24 * r.x);
          textAlign(LEFT, TOP);
          text(this.segments[i].tooltip, this.a.x + this.w - 280 * r.x, this.a.y + this.h / 3 + 20 * r.y, this.w - (this.a.x + this.w - 400 * r.x), this.h / 2);

          fill(0, 255, 0);
          textSize(32 * r.x);
          text("Level: " + this.segments[i].level, this.a.x + this.w - 280 * r.x, this.a.y + 100 * r.y);

          if (this.segments[i].level != "Max Level") {
            if (this.segments[i].cost > env.player.money) {
              fill(200, 0, 0);
            } else {
              fill(0, 255, 0);
            }
            text("Cost: " + this.segments[i].cost + " Points", this.a.x + this.w - 280 * r.x, this.a.y + 160 * r.y);
          }

          pop();
        }
      }
    }



  }
}


function Segment(x, y, w, h, fn, tooltip, img) {
  this.pos = createVector(x, y);
  this.w = w;
  this.h = h;
  this.fn = fn;
  this.tooltip = tooltip;
  this.cost = 10;

  this.level_ind_h = 0;
  this.desired_level_ind_h = 0;
  this.level_ind_h_change = this.h/3;
  
  this.level = 0;
  this.max_level = 3;
  this.i = 0;
  
  this.img = img;


  this.start = function() {
    this.render();
  }

  this.render = function() {
    push();
    rectMode(CENTER);
    imageMode(CENTER);
    if(this.mouse_on()) {
      stroke(255, 150, 0);
      strokeWeight(6 * r.x);
    } else {
      stroke(255);
      strokeWeight(2 * r.x);
    }
    
    noFill();
    rect(this.pos.x, this.pos.y, this.w, this.h);
    image(this.img[this.i], this.pos.x, this.pos.y, this.w, this.w);
    
    translate(this.pos.x + this.w/2, this.pos.y + this.h/2);
    rectMode(CORNER);
    noStroke();
    fill(0, 255, 0);
    rotate(PI);
    rect(0, 0, 20*r.x, this.level_ind_h);
    pop();
    
    this.level_ind_h = lerp(this.level_ind_h, this.desired_level_ind_h, 0.1);
    if(this.level == this.max_level) {
      this.level = "Max Level"
      this.cost = 0;
    }
  }

  this.mouse_on = function() {
    return (mouseX >= this.pos.x - this.w / 2 && mouseX <= this.pos.x + this.w / 2 && mouseY >= this.pos.y - this.h / 2 && mouseY <= this.pos.y + this.h / 2);
  }

  this.purchase = function() {
    if (this.level < this.max_level) {
      if (env.player.money >= this.cost) {
        env.player.money -= this.cost;
        if (!this.c) {
          this.level++;
          this.i++;
          this.cost += 10;
          this.desired_level_ind_h += this.level_ind_h_change;
        }
        this.fn();
      }
    }
  }
}