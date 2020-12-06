class Spawner {
  constructor(sheet) {
    this.sheet = sheet;
    this.temp = sheet;
    this.wave = 0;

    this.wave_time = 60;
    this.down_time = 30;
    this.down = false;

    this.wave_max_timer = this.wave_time * 60;
    this.wave_timer = 0;

    this.down_max_timer = this.down_time * 60;
    this.down_timer = this.down_max_timer;
  }

  start() {
    if (this.down == false) {
      if (this.wave_timer < this.wave_max_timer) {

        if (this.temp[this.wave]) {
          for (let i = 0; i < this.temp[this.wave].length; i++) {
            if (this.wave_timer >= this.temp[this.wave][i].t*60) {
              for (let j = 0; j < this.temp[this.wave][i].x.length; j++) {
                let type = this.temp[this.wave][i].x[j];
                let a = random(360);
                let spawn_point = createVector(env.dimension.x / 2 + cos(a) * env.dimension.y * 0.8, env.dimension.y / 2 + sin(a) * env.dimension.y * 0.8);
                let obj = null;
                if (type == "s") {
                  obj = new Sumo(spawn_point.x, spawn_point.y, r, color(255, 0, 0), 200, 0.06);
                } else if (type == "f") {
                  obj = new Fighter(spawn_point.x, spawn_point.y, r, color(255, 0, 0), 100, 0.08);
                } else if (type == "j") {
                  obj = new Jet(spawn_point.x, spawn_point.y, r, color(255, 0, 0), 50, 0.1);
                }

                env.entities.push(obj);
              }

              this.temp[this.wave].splice(i, 1);
            }
          }
        }
        
        this.wave_timer++;
        
      } else {
        this.down_timer = 0;
        this.down = true;
      }
    } else {
      if (this.down_timer < this.down_max_timer) {
        this.down_timer++;
      } else {
        this.wave_timer = 0;
        this.wave++;
        env.player.hp = env.player.max_hp;
        env.opponent.hp = env.opponent.max_hp;
        this.down = false;
      }
    }

  }
}