class Generator_Team extends Generator {
  constructor(x, y, w, h, hp, col) {
    super(createVector(x, y), w, h, hp, col);
  }
  
  start() {
    this.render();
    this.generate();
  }
  
  render() {
    push();
    imageMode(CENTER);
    if(this.col == "red") {
      image(assets.sprites.generators.red, this.pos.x, this.pos.y, this.w, this.w);
    } else if(this.col == "blue") {
      image(assets.sprites.generators.blue, this.pos.x, this.pos.y, this.w, this.w);
    }
    
    pop();
    
    push();
    rectMode(CORNER);
    noFill();
    stroke(255);
    strokeWeight(1);
    rect(this.pos.x - this.hp_max_w/2, this.pos.y - this.rad*2, this.hp_max_w, this.hp_h);
    noStroke();
    fill(0, 200, 0);
    rect(this.pos.x - this.hp_max_w/2, this.pos.y - this.rad*2, this.hp_w, this.hp_h);
    
    fill(255);
    textSize(24 * r.x);
    text(this.hp, this.pos.x, this.pos.y - this.rad * 2 + this.hp_h / 2);
    pop();
    
    
  }
  
  
}