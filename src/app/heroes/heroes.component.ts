import {Component, OnInit} from '@angular/core';
import {Hero} from "../hero";
import {HeroService} from "../hero.service";
import {MessageService} from "../message.service";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  // hero: Hero = {
  //   id: 1,
  //   name: 'windstorm'
  // }
  //heroes: Hero[] = HEROES;
  heroes: Hero[] = [];
  selectedHero?: Hero;

  constructor(
    private heroService: HeroService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  // onSelect(hero: Hero) {
  //   this.selectedHero = hero;
  //   this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  // }

  getHeroes(): void {
    //this.heroes = this.heroService.getHeroes();

    this.heroService.getHeroes()
      .subscribe(t => this.heroes = t);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }

    this.heroService.addHero({ name } as Hero)
      .subscribe(t => this.heroes.push(t));
    ;
  }

  deleteHero(id: number) {
    this.heroService.deleteHero(id)
      .subscribe( (_: any) => this.heroes = this.heroes.filter(t => t.id != id));
  }
}
