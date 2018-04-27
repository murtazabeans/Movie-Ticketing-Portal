import React, { Component } from 'react';
import axios from 'axios';
import Index from './Index';
import Header from './Header';
import Footer from './Footer';
import { envURL, reactURL } from '../config/environment';
class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
        multiplexList: [],
        movieList:[],
        processedmultiplexList:[],
        movieList: [],
        showTimingList: [],
        selectedDate:new Date().getTime(),
    }
  }

  getMovieFromId(id){
    this.state.movieList.forEach(element => {
        if(element._id==id)
        return element;
    });
}

  loadMultiplex() {
    let findAllMovieAPI = envURL + 'findAllMovie';
    axios.get(findAllMovieAPI)
        .then(res => {
            if (res.data.successMsg != '') {
                console.log('Fetching all movies');
                console.log(res.data.data);
                this.setState({
                    movieList: res.data.data ? res.data.data : []
                })
            } else {
                console.error('Error Fetching all movie');
            }
        })
        .catch(err => {
            console.error(err);
        });
        this.processDataAsSelectedDate();

    

}
  componentWillMount(){
    this.loadMultiplex();
  }

  processDataAsSelectedDate(){
    let updateMultiplexList = [];
    let findAllMultiplexAPI = envURL + 'findAllMultiplex';
                    axios.get(findAllMultiplexAPI)
                        .then(res => {
                            if (res.data.successMsg != '') {
                                console.log('Fetching all multiplex');
                                console.log(res.data.data);

                                var multiplexes = res.data.data.length>0?res.data.data:[];
                                    multiplexes.forEach(item => {
                                        var groups = {};
                                        for (var i = 0; i < item.show_timings.length; i++) {
                                                var groupName = item.show_timings[i].movie._id;
                                                if (!groups[groupName]) {
                                                groups[groupName] = [];
                                            }
                                            let selectedDate = new Date(this.state.selectedDate);
                                            let showDate = new Date(item.show_timings[i].sort_field);                                          
                                            if(selectedDate.getDate()==showDate.getDate()
                                            && selectedDate.getDay()==showDate.getDay()
                                            && selectedDate.getYear()==showDate.getYear()){
                                                groups[groupName].push(item.show_timings[i]);
                                            }    
                                    }
                                    let myArray=[];
                                    for (var groupName in groups) {
                                    let sortedShows = groups[groupName];
                                    sortedShows.sort(function(a, b){
                                        return a.sort_field == b.sort_field ? 0 : +(a.sort_field > b.sort_field) || -1;
                                      });
                                      myArray.push({movie_id: groupName, shows:sortedShows});
                                    }
                                    var multiplex = item;
                                    multiplex.show_timings=myArray;
                                    updateMultiplexList.push(multiplex);                                            

                            });
                            this.setState({
                                processedmultiplexList:updateMultiplexList
                            })     
                            } else {
                                console.error('Error Fetching all multiplex');
                            }
                        })
                        .catch(err => {
                            console.error(err);
                        });
                           
  }
  
  componentDidMount(){
    document.getElementById("scroll-date-picker__list").style.left = "0px";
  }

  handleRightClick(){
    if(parseInt(document.getElementById("scroll-date-picker__list").style.left) != -861){
      let new_pixel = parseInt(document.getElementById("scroll-date-picker__list").style.left) - 861;
      document.getElementById("scroll-date-picker__list").style.left = new_pixel + "px";
      var right_element = document.getElementById("date-right");
      var left_element = document.getElementById("date-left");
      left_element.classList.remove("flipper--hide");
      new_pixel == -861 ? right_element.classList.add("flipper--hide") : right_element.classList.remove("flipper--hide");
    }
  }

  handleLeftClick(){
    if(parseInt(document.getElementById("scroll-date-picker__list").style.left) != 0){
      let new_pixel = parseInt(document.getElementById("scroll-date-picker__list").style.left) + 861
      document.getElementById("scroll-date-picker__list").style.left = new_pixel + "px";
      var right_element = document.getElementById("date-right");
      var left_element = document.getElementById("date-left");
      right_element.classList.remove("flipper--hide");
      new_pixel == 0 ? left_element.classList.add("flipper--hide") : left_element.classList.remove("flipper--hide");
    }
  }

  handleDateClick(e){
      e.preventDefault();
    var oldElement = document.getElementsByClassName('date-picker__date date-picker__date--selected');
    oldElement[0].classList.remove("date-picker__date--selected");
    e.target.closest("li").classList.add("date-picker__date--selected");
       this.setState({
           selectedDate:parseInt(e.target.closest("li").id) 
       }, () =>{
        this.processDataAsSelectedDate()
       } )
  }

  renderDateCorousal(){
        let today = new Date();
        let days = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        let month = ['Jan','Fab','Mar','Apr','May','Jun','Jul','Aug','Sep','Aug','Nov','Dec']
        let weekday=['Mon','Tue','Wed','Thur','Fri','Sat','Sun']
        let otherNodes = days.map((item) => {
            let otherDay = new Date;
            otherDay.setDate(today.getDate() + item); 
            return (
                <li class="date-picker__date" id={otherDay.getTime()} onClick={this.handleDateClick.bind(this)}>
                    <a href="?date=2018-04-19" class="date-picker__link">
                        <span class="date-picker__date-weekday">{weekday[otherDay.getDay()]}</span>
                        <span class="date-picker__date-month">{month[otherDay.getMonth()]}</span>
                        <span class="date-picker__date-day">{otherDay.getDate()}</span>
                    </a>
                </li>      
            )
        });
    return (
        <ul id="scroll-date-picker__list" class="carousel-items" >
        <li class="date-picker__date date-picker__date--selected" id={today.getTime()} onClick={this.handleDateClick.bind(this)}>
        <a href="?date=2018-04-18" class="date-picker__link">
        <span class="date-picker__date-weekday">Today</span>
        <span class="date-picker__date-month">{month[today.getMonth()]}</span>
        <span class="date-picker__date-day">{today.getDate()}</span>
        </a>
    </li>
        {otherNodes}
    </ul> );
  }


  render() {
    return (
    <div>
      <Header />
      <div id="page" role="main">
        <div class="tsp">
            <section class="subnav">
              <div class="row">
                  <div class="width-100">
                    <h1 class="subnav__title heading-style-1 heading-size-xl timing-header">
                        Movie times + Tickets
                        <span class="subnav__title--accent">
                        near You
                        <span class="js-subnav__user-location"></span>
                        </span>
                    </h1>
                    <ul class="subnav__link-list">
                        <li class="subnav__link-item">
                          <a class="subnav__link subnav__link--active" href="/95101_movietimes">
                          All theaters
                          </a>
                        </li>
                        <li class="subnav__link-item">
                          <a class="subnav__link" href="/95101_movietimes?ticketedonly=true">
                          Fandango Ticketing Theaters
                          </a>
                        </li>
                        <li class="subnav__link-item">
                          <a class="subnav__link" href="/95101_movietimes?mytheaters=true">
                          My theaters
                          </a>
                        </li>
                    </ul>
                  </div>
              </div>
            </section>
            <section class="row">
              <div class="width-75 tablet-width-100">
                  <div class="date-picker__wrap">
                    <section class="date-picker carousel js-movie-calendar carousel-style-strip" data-jcarousel="true">
                    {this.renderDateCorousal()}
      <button id = "date-left" class="icon style-none left js-calendar-flipper-left flipper--hide" data-jcarouselcontrol="true" onClick = {this.handleLeftClick.bind(this)}>Previous</button>
      <button id = "date-right" class="icon style-none right js-calendar-flipper-right" data-jcarouselcontrol="true" onClick={this.handleRightClick.bind(this)}>Next</button>
   </section>
</div>
                  <div class="worry-free-cta__wrap">
                    <a href="#" class="cta worry-free-cta js-worry-free-cta">
                    <img src="https://images.fandango.com/fandango-www/screenplay/assets/images/desktop/global/wft-badge.be9fca955da.png" alt="Worry Free Ticketing" />
                    <span class="worry-free-cta__text">Refunds and Exchanges Now Available</span>
                    </a>
                  </div>
                  <div class="js-worry-free-modal worry-free-modal offer-dialog dialog hide-on-mobile style-lightbox animate-fade-in animate-speed-slow">
                    <div class="width-60 tablet-width-60 dialog-content animate-slide-down animate-speed-normal font-sans-serif-cond">
                        <button class="style-none close-modal"><span class="close-x icon-close">X</span></button>
                        <div class="worry-free-modal__content">
                          <div class="worry-free-modal__headline-wrapper">
                              <div class="worry-free-modal__headline"><span class="worry-free-modal__headline-text">Refunds &amp; Exchanges</span></div>
                          </div>
                          <h3 class="worry-free-modal__sub-title heading-size-s heading-style-2">Need a refund or exchange?  It's easy with our worry-free tickets.</h3>
                          <p class="worry-free-modal__text">Here's what's included with every worry-free ticket purchase:</p>
                          <ul class="worry-free-modal__list">
                              <li class="worry-free-modal__list-item">Peace of mind of a guaranteed ticket.</li>
                              <li class="worry-free-modal__list-item">We know life happens. You may exchange or request a refund for your entire order, less the convenience fee, through Fandango up until the posted showtime. You'll have to complete your refund and exchange before the posted showtime indicated
                                on your ticket.
                              </li>
                              <li class="worry-free-modal__list-item">We'll refund your credit card or we can credit your Fandango account to use for another movie. Your choice.</li>
                          </ul>
                        </div>
                        <div class="worry-free-modal__footer">
                          <p class="worry-free-modal__footer-text">Have more questions? Read our <a href="https://www.fandango.com/help">FAQs</a> or reach out to our <a href="https://fandango.custhelp.com/app/new_ask">customer service team</a>.</p>
                        </div>
                    </div>
                  </div>
                  <div class="js-spotlight-ad"></div>
                  <label class="nearby-theaters__label">Nearby Theaters: </label>
                  <select class="mb-5 nearby-theaters__select js-nearby-theaters">
                    <option value="#" disabled>Select Theater</option>
                    {
                                    this.state.processedmultiplexList.map(function (multiplex) {
                                        return <option key={multiplex._id}
                                            value={multiplex._id}>{multiplex.name}</option>;
                                    })
                                }
                     
                  </select>
                  <div class="fd-showtimes js-theaterShowtimes-loading">

                    {this.renderMultiplexShowTimings()}
                    <div class="hide fd-showtimes__error-msg js-fd-showtimes__error-msg"></div>
                  </div>
                  <section class="more-theaters-links">
                    <a href="#" class="dark more-theaters-links__link">Movie Times by Cities</a>
                    <a href="#" class="dark more-theaters-links__link">Movie Times by States</a>
                    <a href="#" class="dark more-theaters-links__link">Movie Times by Zip Codes</a>
                    <a href="#" class="dark more-theaters-links__link">Movie Times by Theaters</a>
                  </section>
              </div>
              <div class="width-25 tablet-width-100">
                  <div class="ad-unit--sidebar">
                    <img class = "advertise" src={require('../assets/static_images/img12.png')} alt="Los Angeles"  />  
                  </div>
                  <div class="ad-unit--sidebar">
                    <div class="ad" data-unit="smallboxad" data-responsive="true" data-media="desktop,tablet">
                    </div>
                  </div>
                  <div class="ad-unit--sidebar">
                    <div class="ad" data-unit="boxadtwo" data-responsive="true" data-media="desktop,tablet">
                    </div>
                  </div>
              </div>
              <div class="js-flyout fd-amenity-flyout">
                  <span class="js-flyout__close fd-amenity-flyout__close">X</span>
                  <div class="js-flyout__title fd-amenity-flyout__title"></div>
                  <div class="js-flyout__desc fd-amenity-flyout__desc"></div>
              </div>
              <section class="favoriteFlyout js-heartsAndStars-flyout">
                  <div class="favoriteFlyout__message js-heartsAndStars-flyout-message"></div>
              </section>
            </section>
        </div>
      </div>
      <Footer />
    </div>  
    )
  }

renderMultiplexShowTimings(){
    let multiplexNodes = this.state.processedmultiplexList.map((multiplex, index) => {
        let moviesNodes = multiplex.show_timings.map((movie_shows, index) => {
            let timeNodes;
            let movie ={};
            var imageSource=''; 
            timeNodes = movie_shows.shows.map((show, index) => {
                movie =show.movie;
                imageSource = require('../images/' + movie.movie_logo)? require('../images/' + movie.movie_logo):''
                return(
                    <li class="fd-movie__btn-list-item" >
                      <a class="btn showtime-btn showtime-btn--available"
                      id={show._id+','+multiplex._id} onClick={this.onShowTimeClick.bind(this)} >{new Date(show.sort_field).getHours()+':'+new Date(show.sort_field).getMinutes()}</a>
                    </li>
                    )
            });
            if(movie_shows.shows.length>0){
                return(
                    <li class="fd-movie">
                    <div class="fd-movie__poster">
                        <a href="#">
    
                        <img src={imageSource} 
                        style={{width: 134, height: 186, position: 'absolute', top: this.props.top, left: this.props.left}} alt={movie.title} />
                        </a>
                    </div>
                    <div class="fd-movie__details">
                        <h3 class="fd-movie__title font-sans-serif font-lg font-300 uppercase">
                          <a class="dark" href="#">{movie.title}</a>
                          {/* <button class="icon icon-follow-gray fd-movie__follow-icon js-heartsAndStars-heart" data-type="Movie" data-id="211110" data-name="AMEERPET 2 AMERICA" data-is-favorite="false">
                          </button> */}
                        </h3>
                        {/* <div class="fd-star-rating__container">
                          <div class="js-fd-star-rating fd-star-rating " data-star-rating="4">
                              <a class="fd-star-rating__star icon icon-star-rating-small js-heartsAndStars-star" data-action="rate" data-id="211110" data-isnew="true" data-show-caption="true" data-value="5" title="Loved It">
                              </a>
                              <a class="fd-star-rating__star icon icon-star-rating-small js-heartsAndStars-star" data-action="rate" data-id="211110" data-isnew="true" data-show-caption="true" data-value="4" title="Really Liked It">
                              </a>
                              <a class="fd-star-rating__star icon icon-star-rating-small js-heartsAndStars-star" data-action="rate" data-id="211110" data-isnew="true" data-show-caption="true" data-value="3" title="Liked It">
                              </a>
                              <a class="fd-star-rating__star icon icon-star-rating-small js-heartsAndStars-star" data-action="rate" data-id="211110" data-isnew="true" data-show-caption="true" data-value="2" title="Disliked It">
                              </a>
                              <a class="fd-star-rating__star icon icon-star-rating-small js-heartsAndStars-star" data-action="rate" data-id="211110" data-isnew="true" data-show-caption="true" data-value="1" title="Hated It">
                              </a>
                          </div>
                        </div> */}
                        <p class="fd-movie__rating-runtime">
                          2 hr  <br />
                          Drama
                        </p>
                    </div>
                    <ul class="fd-movie__showtimes">
                        <li class="fd-movie__showtimes-variant">
                          <h3 class="fd-movie__showtimes__tick-headline font-serif">
                              <span class="icon icon-ticket"></span>
                              Select a movie time to buy Standard Showtimes
                          </h3>
                          <ul class="fd-movie__amentiy-list">
                              <li class="fd-movie__amenity-icon-wrap">
                                <a href="#" class=" fd-movie__amenity-icon js-amenity" data-amenity-desc="This film is presented in Telugu." data-amenity-name="Telugu">Telugu</a>
                              </li>
                          </ul>
                          <ol class="fd-movie__btn-list">
              
            {timeNodes}</ol>
                        </li>
                    </ul>           </li>             )
            }else{
                return (<div></div>);
            }

        });
    
        return (
            <ul>
            <li class="fd-theater" data-theater-id="AAFRF">
              <div class="fd-theater__header">
                  <div class="fd-theater__promoted-amenity-wrap">
                    <span class="icon icon-amenity-print-at-home-tickets fd-theater__promoted-amenity js-amenity" data-amenity-name="Print at Home Tickets" data-amenity-desc="Print your tickets, go directly to the ticket taker and skip the box office line at many theaters.">Print at Home Tickets
                    </span>
                    <span class="icon icon-amenity-mobile-tickets fd-theater__promoted-amenity js-amenity" data-amenity-name="Mobile Tickets" data-amenity-desc="Send your ticket to your mobile device, go directly to the ticket taker and skip the box office line at many theaters.">Mobile Tickets
                    </span>
                  </div>
                  <div class="fd-theater__name-wrap">
                    <h3 class="fd-theater__name font-sans-serif font-lg font-300 uppercase">
                        <a class="light" href="/towne-3-cinemas-AAFRF/theater-page">{multiplex.name}</a>
                        <button class="icon icon-follow-white fd-theater__follow-icon js-heartsAndStars-heart" data-type="Theater" data-id="AAFRF" data-name="Towne 3 Cinemas" data-is-favorite="false">
                        </button>
                    </h3>
                  </div>
                  <div class="fd-theater__address-wrap">
                    <span>{multiplex.address},</span>
                    <span>
                    {multiplex.city},
                    {multiplex.state},
                    {multiplex.zipcode}
                    </span>
                  </div>
                  {/* <div class="fd-theater__links">
                    <a href="//www.fandango.com/maps/DrivingDirections.aspx?tid=AAFRF" target="_blank" rel="nofollow" class="font-sans-serif-cond font-sm">MAP</a>
                    <a class="fd-theater__amenities js-amenity font-sans-serif-cond font-sm" href="#" data-amenity-name="Theater Amenities" data-amenity-desc="<ul class=&quot;fd-theater__amenities-list&quot;><li>Print at Home Tickets</li><li>Mobile Tickets</li></ul>">AMENITIES</a>
                  </div> */}
              </div>
              <ul>
{moviesNodes}
   </ul>
              {/* <div class="fd-theater__future-dates">
                  <h3 class="fd-theater__future-dates-text heading-size-s font-serif">More movies available on future dates.</h3>
                  <a href="/towne-3-cinemas-AAFRF/theater-page" class="btn">See Coming Attractions</a>
              </div> */}
            </li>
          </ul>        )
    });
    return (
        <div>
        {multiplexNodes}
        </div>
        );
    
    }
                   
    onShowTimeClick(e){
        e.preventDefault();
        //alert(e.target.id)
        var arr = e.target.id.split(',');
        if(arr.length==2){
            localStorage.setItem('bookShowId',arr[0]);
            localStorage.setItem('bookMultiplexId',arr[1]);
            this.props.history.push('/tickets');    
        }
    }

}


export default Layout;
