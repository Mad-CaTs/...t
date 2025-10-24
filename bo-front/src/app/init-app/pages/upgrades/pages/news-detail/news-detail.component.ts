import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, catchError, finalize, map, of } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import UpgradesComponent from '../../upgrades.component';
import { VideoComponent } from '@init-app/components/video/video.component';
import { LanguajesService } from '@init-app/services';
import { IResponseData } from '@shared/interfaces/api-request';
import { NewApiService } from '@shared/services/news/new-api.service';
import {
  IPEvent,
  IPEventGroup,
  IPOldEvent,
  PIUpgrade,
  PIUpgrades,
} from '@init-app/interfaces';
import { FadComponent } from '../../components/fad/fad.component';
import { EventCardComponent } from '../../../../commons/components/event-card/event-card.component';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [
    CommonModule,
    UpgradesComponent,
    VideoComponent,
    MatIconModule,
    FadComponent,
    EventCardComponent,
  ],
  templateUrl: './news-detail.component.html',
  styleUrls: [],
})
export default class NewsDetailComponent implements OnInit, OnDestroy {
  public data: any | null = null;
  private id: number = 0;
  private subs: Subscription[] = [];
  public eventMooks: IPEventGroup;
  public upgradeMooks: PIUpgrades;

  constructor(
    private language: LanguajesService,
    private newApi: NewApiService,
    private route: ActivatedRoute,
    public location: Location
  ) {
    this.getEvents();
    this.getUpgrades();
  }

  ngOnInit(): void {
    const sub = this.route.params.subscribe((p) => this.watchParam(p));

    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private watchParam(p: Params): void {
    const id = p['type'];

    if (!id) return;

    this.id = Number(id);

    const _onSuccess = map((res: IResponseData<any>) => {
      const data = res.data;
      this.data = data;
    });
    const _onError = catchError((err) => {
      console.log(err);
      return of(undefined);
    });
  /*   const _onFinalize = finalize(() => console.log('Finish Loading'));

    this.newApi
      .FetchOne(id)
      .pipe(_onSuccess, _onError, _onFinalize)
      .subscribe(); */
  }

  /* === Getters === */
  get lang() {
    return this.language.languageSelected.newsDetail;
  }

  get events(): IPOldEvent[] {
    let events: IPOldEvent[] = [];

    for (let i = 0; i < this.eventMooks?.oldEvents.length; i++) {
      if (i <= 2) {
        events.push(this.eventMooks?.oldEvents[i]);
      }
    }

    return events;
  }

  get detail(): PIUpgrade | null {
    let upgrade = this.upgradeMooks?.upgrades.find(
      (item) => item.id == this.id
    );

    if (upgrade == undefined) {
      upgrade = this.upgradeMooks?.upgradeCurrent;
    }

    return upgrade;
  }

  getEvents() {
    import(`../../../../../../assets/mooks/events.json`).then((file) => {
      this.eventMooks = file.default as IPEventGroup;
    });
  }

  getUpgrades() {
    import(`../../../../../../assets/mooks/upgrades.json`).then((file) => {
      this.upgradeMooks = file.default;
    });
  }
}
