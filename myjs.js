var app = angular.module('app', []);

app.controller('Controller', ["$scope", "$http", "$timeout", "$q", function($scope, $http, $timeout, $q) {
    var self = this;

    self.getNHL = function(){
        var promises = [];
        $http.get('//www.reddit.com/user/NHLStreamsBot/submitted.json?&sort=new').success(function(data){
            var date = (new Date());
            date.setHours(0);
            date.setMinutes(0);
            date.setMilliseconds(0);
            self.nhl = data.data.children.filter(function(child){
                return (child.data.created_utc * 1000) > date.getTime();
            });

            self.nhl.forEach(function(game){
                var p  = self.getYoutube(game.data.id);
                promises.push(p);
                p.success(function(data){
                    console.log(data[1].data.children);

                    game.bestStreams = data[1].data.children.map(function(child){
                        if(child.data.body){
                            // return child.data.body.split(' ').filter(function(s){
                            //     return s.indexOf('http') > -1;
                            // });
                            var r;
                            var result = URI.withinString(child.data.body, function(url) {
                                r = url.replace('*', '').replace('*', '');
                                return url;
                            });
                            return r;
                        }
                    }) || [];
                }).error(function(){
                    console.log('Error getting best streams...');
                });
            });
        }).error(function(err){
            console.error(err);
        });

        $q.all(promises).then(function(){
            // $scope.$apply();
        });
    };
    self.getNHL();

    self.getYoutube = function(id){
        return $http.get('//www.reddit.com/r/NHLStreams/comments/' + id + '.json?&sort=top&limit=5');
    };

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
