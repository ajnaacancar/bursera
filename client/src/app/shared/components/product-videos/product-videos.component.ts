import { Component, Input, OnInit } from '@angular/core';
import { ShopService } from 'src/app/shop/shop.service';
import { IVideo } from '../../models/video';

@Component({
  selector: 'app-product-videos',
  templateUrl: './product-videos.component.html',
  styleUrls: ['./product-videos.component.scss']
})
export class ProductVideosComponent implements OnInit {
@Input() productId: number;
playlist: IVideo[];
// playlist = [];
currentIndex = 0;
  currentItem: IVideo;
  api;
  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getVideos()
    // this.getPlaylist();
  }
  getVideos(){
    this.shopService.getVideosForProduct(this.productId).subscribe((videos: IVideo[]) => {
      this.playlist = videos;   
      this.playlist.forEach(video => {
        video.videoUrl = "https://localhost:5001/" + video.videoUrl
        
      }); 
      this.currentItem = this.playlist[this.currentIndex]

    }, error =>{
      console.log(error)
    })


    // this.getPlaylist()
  }

  onPlayerReady(api) {
    this.api = api;

    this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
    this.api.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
  }

  nextVideo() {
    this.currentIndex++;

    if (this.currentIndex === this.playlist.length) {
      this.currentIndex = 0;
    }

    this.currentItem = this.playVideo[this.currentIndex];
  }

  playVideo() {
    this.api.play();
  }

  onClickPlaylistItem(item: IVideo, index: number) {
    this.currentIndex = index;
    this.currentItem = item;
  }

}
