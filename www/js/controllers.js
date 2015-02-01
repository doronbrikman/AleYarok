angular.module('starter.controllers', [])

    .controller('AppCtrl', ['UserService', function(UserService) {
        this.userPoints = UserService.showPoints;
    }])

    .controller('DailyCtrl', ['DailyTasks', 'UserService', 'ionPlatform', '$cordovaPush', '$cordovaToast', function(DailyTasks, UserService, ionPlatform, $cordovaPush, $cordovaToast) {
        this.notifications = [];

        // call to register automatically upon device ready
        ionPlatform.ready.then(function (device) {
            //this.register();
        });

        this.register = function() {
            var config = null;

            if (ionic.platforms.isAndroid()) {
                config = { "senderID" : "YOUR_GCM_PROJECT_ID" };
            }
            else if (ionic.platforms.isIOS()) {
                config = {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true"
                };
            }

            $cordovaPush.register(config).then(function (result) {
                console.log("Register success " + result);

                $cordovaToast.showShortCenter('Registered for push notifications');

                // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
                if (ionic.Platform.isIOS()) {
                    $scope.regId = result;
                    storeDeviceToken("ios");
                }
            }, function (error) {
                console.log("Register error " + error);
            });
        };

        this.moment = DailyTasks.moment;
        this.tasks = DailyTasks.all();
        this.user = UserService.user;

        this.done = function(taskId) {
            DailyTasks.changeState(taskId);

            if (DailyTasks.get(taskId).done) {
                UserService.addPoints(DailyTasks.get(taskId).points);
            } else {
                UserService.reducePoints(DailyTasks.get(taskId).points);
            }
        }

        this.do = DailyTasks.do;
    }])

    .controller('WeeklyCtrl', ['WeeklyTasks', 'UserService', function(WeeklyTasks, UserService) {
        this.tasks = WeeklyTasks.all();
        this.user = UserService.user;

        this.done = function(taskId) {
            WeeklyTasks.changeState(taskId);

            if (WeeklyTasks.get(taskId).done) {
                UserService.addPoints(WeeklyTasks.get(taskId).points);
            } else {
                UserService.reducePoints(WeeklyTasks.get(taskId).points);
            }
        }
    }])

    .controller('OneTimeCtrl', ['OneTimeTasks', 'UserService', function(OneTimeTasks, UserService) {
        this.tasks = OneTimeTasks.all();
        this.user = UserService.user;

        this.done = function(taskId) {
            OneTimeTasks.changeState(taskId);

            if (OneTimeTasks.get(taskId).done) {
                UserService.addPoints(OneTimeTasks.get(taskId).points);
            } else {
                UserService.reducePoints(OneTimeTasks.get(taskId).points);
            }
        }
    }])

    .controller('ArticleCtrl', function() {

    });