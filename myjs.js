var app = angular.module('app', ['ui.bootstrap']);

app.controller('Controller', ["$scope", "$http", "$timeout", "$q", function($scope, $http, $timeout, $q) {
    var self = this;
    self.subs = ["NHLStreams", "soccerstreams", "nbastreams", "mlbstreams", "nflstreams"];

    self.getStreams = function(sub){
        self.sub = sub;
        $http.get('//www.reddit.com/r/' + sub + '/search.json?q=Thread%3A&sort=news&restrict_sr=on&t=day&limit=100').success(function(data){
            var date = (new Date());
            date.setHours(0);
            date.setMinutes(0);
            date.setMilliseconds(0);
            self.games = data.data.children.filter(function(child){
                return (child.data.created_utc * 1000) > date.getTime() //&& child.data.title.indexOf('Game Thread') > -1;
            });

            self.games.forEach(function(game){
                $http.get('//www.reddit.com/r/' + sub + '/comments/' + game.data.id + '.json?&sort=top&limit=5').success(function(data){
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
                }).error(function(){
                    console.log('Error getting best streams...');
                });
                game.data.title = game.data.title.replace("Game Thread:", "");
            });
        }).error(function(err){
            console.error(err);
        });
    };
    self.getStreams(self.subs[0]);
}]);
