import {Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common'; //?? do not use location from lib.dom.d
import {Hero} from "../hero";
import {ActivatedRoute} from "@angular/router";
import {HeroService} from "../hero.service";

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero?: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.getHero()
  }

  getHero():void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(t => this.hero = t);
  }

  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
    }
  }

  goBack():void {
    this.location.back();
  }
}
