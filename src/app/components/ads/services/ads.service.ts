import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ads, AdsDeleteDTO, AdsDTO, AdsUpdateDTO } from 'src/app/model/ads';
import { ImageUpload } from 'src/app/model/image';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  url: string = environment.server;

  ads: string = 'ads';
  adsget: string = 'ads/admin/all';

  image: string = 'file/images';

  headers: any;

  constructor(private http: HttpClient) {
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  getAds() {
    return this.http
      .get<Ads[]>(this.url + this.adsget, { headers: this.headers })
      .toPromise();
  }

  getByID(id: string) {
    return this.http
      .get<Ads>(this.url + this.ads + '/' + id, { headers: this.headers })
      .toPromise();
  }

  uploadAdsImage(file: any) {
    return this.http
      .post<ImageUpload>(this.url + this.image, file)
      .toPromise();
  }

  update(ads: AdsDTO, id: string) {
    return this.http
      .patch<Ads>(this.url + this.ads + '/' + id, ads, {
        headers: this.headers,
      })
      .toPromise();
  }

  updateStatus(ads: AdsUpdateDTO, id: string) {
    return this.http
      .patch<Ads>(this.url + this.ads + '/' + id, ads, {
        headers: this.headers,
      })
      .toPromise();
  }

  createAds(ads: AdsDTO) {
    return this.http
      .post<Ads>(this.url + this.ads, ads, { headers: this.headers })
      .toPromise();
  }

  delete(id: string) {
    return this.http
      .delete<AdsDeleteDTO>(this.url + this.ads + '/' + id, {
        headers: this.headers,
      })
      .toPromise();
  }
}
