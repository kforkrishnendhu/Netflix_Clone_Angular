import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';
import { BannerComponent } from '../../core/components/banner/banner.component';
import { MovieService } from '../../shared/services/movie.service';
import { MovieCarouselComponent } from '../../shared/components/movie-carousel/movie-carousel.component';
import { IVideoContent } from '../../shared/models/video-content.interface';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BannerComponent, MovieCarouselComponent],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  // auth = inject(AuthService);
  // name = JSON.parse(sessionStorage.getItem("loggedInUser")!).name;
  //userProfileImg = JSON.parse(sessionStorage.getItem("loggedInUser")!).picture;
  // email = JSON.parse(sessionStorage.getItem("loggedInUser")!).email;

  constructor(private movieService: MovieService) {}

  // movieService = inject(MovieService);
  userProfileImg='';
  bannerDetail$ = new Observable<any>();
  bannerVideo$ = new Observable<any>();

  movies: IVideoContent[] = [];
  tvShows: IVideoContent[] = [];
  // ratedMovies: IVideoContent[] = [];
  nowPlayingMovies: IVideoContent[] = [];
  popularMovies: IVideoContent[] = [];
  topRatedMovies: IVideoContent[] = [];
  upcomingMovies: IVideoContent[] = [];

  sources = [
    this.movieService.getMovies(),
    this.movieService.getTvShows(),
    // this.movieService.getRatedMovies(),
    this.movieService.getNowPlayingMovies(),
    this.movieService.getUpcomingMovies(),
    this.movieService.getPopularMovies(),
    this.movieService.getTopRated()
  ];                            //Array of observables passing to forkjoin()
  ngOnInit(): void {
    forkJoin(this.sources)
    .pipe(
      map(([movies, tvShows, nowPlaying, upcoming, popular, topRated])=>{
        console.log(movies.results[1]);
        this.bannerDetail$ = this.movieService.getBannerDetail(movies.results[1].id);
        this.bannerVideo$ = this.movieService.getBannerVideo(movies.results[1].id);
        return {movies, tvShows, nowPlaying, upcoming, popular, topRated}
      })
    ).subscribe({next:(res:any)=>{                  //return the response as object
      this.movies = res.movies.results as IVideoContent[];
      this.tvShows = res.tvShows.results as IVideoContent[];
      // this.ratedMovies = res.ratedMovies.results as IVideoContent[];
      this.nowPlayingMovies = res.nowPlaying.results as IVideoContent[];
      this.upcomingMovies = res.upcoming.results as IVideoContent[];
      this.popularMovies = res.popular.results as IVideoContent[];
      this.topRatedMovies = res.topRated.results as IVideoContent[];
      this.getMovieKey();
  },
  error:(err)=>{
    console.log(err);
    
}})
  }

  // subscribe({
  //   next:(res:any)=>{  
  //   this.movies = res.movies.results as IVideoContent[];
  //   this.tvShows = res.tvShows.results as IVideoContent[];
  //   //this.ratedMovies = res.ratedMovies.results as IVideoContent[];
  //   this.nowPlayingMovies = res.nowPlaying.results as IVideoContent[];
  //   this.upcomingMovies = res.upcoming.results as IVideoContent[];
  //   this.popularMovies = res.popular.results as IVideoContent[];
  //   this.topRatedMovies = res.topRated.results as IVideoCont

  getMovieKey() {
    this.movieService.getBannerVideo(this.movies[0].id)
    .subscribe((res: any)=>{
      console.log(res);
    })
  }

  // singOut() {
  //   sessionStorage.removeItem("loggedInUser");
  //   this.auth.signOut();
  // }
}