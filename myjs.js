var app = angular.module('app', ['ui.bootstrap']);

app.controller('Controller', ["$scope", "$http", "$timeout", "$q", function($scope, $http, $timeout, $q) {
    var self = this;

    self.getNHL = function(){
        $http.get('//www.reddit.com/r/NHLStreams/search.json?q=Game+Thread%3A&sort=news&restrict_sr=on&t=day&limit=100').success(function(data){
            var date = (new Date());
            date.setHours(0);
            date.setMinutes(0);
            date.setMilliseconds(0);
            self.nhl = data.data.children.filter(function(child){
                return (child.data.created_utc * 1000) > date.getTime() && child.data.title.indexOf('Game Thread') > -1;
            });

            self.nhl.forEach(function(game){
                $http.get('//www.reddit.com/r/NHLStreams/comments/' + game.data.id + '.json?&sort=top&limit=5').success(function(data){
                    game.bestStreams = data[1].data.children.map(function(child){
                        if(child.data.body){
                            var r;
                            var result = URI.withinString(child.data.body, function(url) {
                                r = url.replace('*', '').replace('*', '');
                                return url;
                            });
                            if(r){
                                return r;
                            }
                        }
                    }) || [];
                    game.bestStreams = game.bestStreams.filter(function(url){
                        return url !== undefined;
                    });
                    console.log(game.bestStreams);
                }).error(function(){
                    console.log('Error getting best streams...');
                });
                game.data.title = game.data.title.replace("Game Thread:", "");
            });
        }).error(function(err){
            console.error(err);
        });
    };
    self.getNHL();

    // self.search = function(search){
    //     if(self.timeoutId) $timeout.cancel(self.timeoutId);
    //     if(search.length > 0){
    //         self.timeoutId = $timeout(function() {
    //             $http.get('https://api.spotify.com/v1/search?q=' + search + '&type=track&limit=50').success(function(data){
    //                 self.data = data.tracks.items;
    //             }).error(function(err){
    //                 console.error(err);
    //             });
    //         }, 250);
    //     }
    // };

}]);
