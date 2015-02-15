angular.module('starter.controllers', [])

    .controller('AppCtrl', ['UserService', function(UserService) {
        //this.userPoints = UserService.showPoints;
    }])

    .controller('DailyCtrl', ['$scope', '$rootScope', 'DailyTasks', 'UserService', '$localstorage', 'ionPlatform', '$cordovaPush', '$cordovaToast',
        function($scope, $rootScope, DailyTasks, UserService, $localstorage, ionPlatform, $cordovaPush, $cordovaToast) {
        this.notifications = [];

        // call to register automatically upon device ready
        ionPlatform.ready.then(function (device) {
            //$scope.register();
        });

        $scope.register = function() {
            var config = null;

            if (ionic.Platform.isAndroid()) {
                config = { "senderID" : "347053537384" };
            }
            else if (ionic.Platform.isIOS()) {
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
                    //$scope.regId = result;
                    //storeDeviceToken("ios");
                    $localstorage.set('ios-token', result);
                }
            }, function (error) {
                console.log("Register error " + error);
            });
        };

        // Notification Received
        $rootScope.$on('$cordovaPush:pushNotificationReceived', function (event, notification) {
            console.log('push Notification Received');
            $cordovaToast.showShortCenter(JSON.stringify([notification]));
            if (ionic.Platform.isAndroid()) {
                handleAndroid(notification);
            }
            else if (ionic.Platform.isIOS()) {
                //handleIOS(notification);
                //$scope.$apply(function () {
                //    $scope.notifications.push(JSON.stringify(notification.alert));
                //})
            }
        });

        // Android Notification Received Handler
        function handleAndroid(notification) {
            // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
            //             via the console fields as shown.
            console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);

            if (notification.event == 'registered') {
                $scope.regId = notification.regid;
                $localstorage.set('android-token', $scope.regId);
            }
            else if (notification.event == 'message') {
                $cordovaDialogs.alert(notification.message, "Push Notification Received");
                $scope.$apply(function () {
                    $scope.notifications.push(JSON.stringify(notification.message));
                });
            }
            else if (notification.event == 'error') {
                $cordovaDialogs.alert(notification.msg, "Push notification error event");
            }
            else {
                $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
            }
        }

        this.tasks = DailyTasks.all;
        this.user = UserService.user;

        this.done = function(taskId) {
            if(!DailyTasks.get(taskId).done) {
                DailyTasks.changeState(taskId);
                UserService.addPoints(DailyTasks.get(taskId).points);
            }
        };
    }])

    .controller('WeeklyCtrl', ['WeeklyTasks', 'UserService', function(WeeklyTasks, UserService) {
        this.tasks = WeeklyTasks.all;
        this.user = UserService.user;

        this.done = function(taskId) {
            if(!WeeklyTasks.get(taskId).done) {
                WeeklyTasks.changeState(taskId);
                UserService.addPoints(WeeklyTasks.get(taskId).points);
            }
        }
    }])

    .controller('OneTimeCtrl', ['OneTimeTasks', 'UserService', function(OneTimeTasks, UserService) {
        this.tasks = OneTimeTasks.all();
        this.user = UserService.user;

        this.done = function(taskId) {
            if(!OneTimeTasks.get(taskId).done) {
                OneTimeTasks.changeState(taskId);
                UserService.addPoints(OneTimeTasks.get(taskId).points);
            }
        }
    }])

    .controller('ArticleCtrl', ['$state', '$localstorage', '$ionicPopup', 'ionPlatform', '$cordovaLocalNotification',
        function($state, $localstorage, $ionicPopup, ionPlatform, $cordovaLocalNotification) {

            // call to register automatically upon device ready
            ionPlatform.ready.then(function (device) {
                if (ionic.Platform.isIOS()) {
                    window.plugin.notification.local.promptForPermission();
                }

                if (!$localstorage.get('notif')) {
                    addNotification();
                }
            });

            function addNotification() {
                $cordovaLocalNotification.add({
                    id: '123',
                    date: new Date(2015, 2, 17, 10, 00, 0),
                    message: 'יום הבוחר הגיע, לכו להצביע עלה ירוק'
                }).then(function () {
                    $localstorage.set('notif', true);
                });
            }

            if (!$localstorage.get('msg')) {
                showAlert();
            }

            // An alert dialog
            function showAlert() {
                var alertPopup = $ionicPopup.alert({
                    title: '!שלום לפעילי עלה ירוק',
                    templateUrl: 'templates/start-alert.html'
                });
                alertPopup.then(function (res) {
                    $localstorage.set('msg', true);
                });
            }

            this.goto = function(article) {
                $state.go('tab.articles-' + article);
            };

            this.href = function(link) {
                window.open(link, "_blank", "location=yes");
            };
    }]);