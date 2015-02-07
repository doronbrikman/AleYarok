'use strict';

angular.module('starter.services', [])

  // Race condition found when trying to use $ionicPlatform.ready in app.js and calling register to display id in AppCtrl.
  // Implementing it here as a factory with promises to ensure register function is called before trying to display the id.
  .factory(("ionPlatform"), function( $q ){
    var ready = $q.defer();

    ionic.Platform.ready(function( device ){
      ready.resolve( device );
    });

    return {
      ready: ready.promise
    }
  })

    .factory('$localstorage', ['$window', function($window) {
      return {
        set: function(key, value) {
          $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
          return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
          $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
          return JSON.parse($window.localStorage[key] || false);
        },
        remove: function(key) {
          $window.localStorage.removeItem(key);
        }
      }
    }])

    .filter('externalLinks', function() {
      return function(text) {
        return String(text).replace(/href=/gm, "class=\"ex-link\" href=");
      }
    })

    .factory('UserService', ['$localstorage', function($localstorage) {

        function User() {
          this.points = 0;
        }

        var user = $localstorage.getObject('user');

        if (!user) {
          user = new User();
          $localstorage.setObject('user', user);
        }

        return {
          addPoints: function(pts) {
            user.points += pts;
            $localstorage.setObject('user', user);
          },
          reducePoints: function(pts) {
            user.points -= pts;
            $localstorage.setObject('user', user);
          },
          user: user
        }
    }])

  .factory('OneTimeTasks', ['$localstorage', function($localstorage) {

      var tasks = $localstorage.getObject('once1');

      if (!tasks) {

        tasks = [{
          id: 0,
          title: 'קראתי את המאמרים באפליקציה',
          points: 10,
          done: false
        }, {
          id: 1,
          title: 'הורדתי את הרינגטון',
          points: 15,
          done: false
        }, {
          id: 2,
          title: 'שכנעתי את כל חבריי לעשות תחרות מי ישיג יותר נקודות באפליקציה עד הבחירות',
          points: 10,
          done: false
        }, {
          id: 3,
          title: 'תליתי פלריג במרפסת',
          points: 7,
          done: false
        }, {
          id: 4,
          title: 'ארגנתי מפגש/חוג בית',
          points: 8,
          done: false
        }, {
          id: 5,
          title: 'התנדבתי ביום הבחירות',
          points: 20,
          done: false
        }, {
          id: 6,
          title: 'שיניתי את תמונת הפרופיל שלי בפייסבוק',
          points: 10,
          done: false
        }, {
          id: 7,
          title: 'דירגתי את האפליקציה ב-5 כוכבים',
          points: 3,
          done: false
        }];

        $localstorage.setObject('once1', tasks);
      }

      return {
        all: function() {
          return tasks;
        },
        get: function(taskId) {
          return tasks[taskId];
        },
        changeState: function(taskId) {
          tasks[taskId].done = true; // !tasks[taskId].done;
          $localstorage.setObject('once1', tasks);
        }
      }
    }])

.factory('WeeklyTasks', ['$localstorage', '$rootScope', function($localstorage, $rootScope) {

      // Get the state of the daily tasks
      var tasksObj = $localstorage.getObject('weekly1');

      // We want to check if it's a new ׳week, for init the daily tasks
      if (!tasksObj || tasksObj.timestamp != moment().format('w')) {

        // Create new tasks object to save locally
        tasksObj = {};

        tasksObj.tasks = [{
          id: 0,
          title: 'העליתי תמונה לאינסטגרם',
          points: 2,
          done: false
        }, {
          id: 1,
          title: 'דיברתי עם ההורים',
          points: 4,
          done: false
        }, {
          id: 2,
          title: 'דיברתי עם הבוס',
          points: 5,
          done: false
        }, {
          id: 3,
          title: 'הדבקתי מדבקות',
          points: 3,
          done: false
        }, {
          id: 4,
          title: 'יצאתי לשטח כפעיל עלה ירוק',
          points: 5,
          done: false
        }, {
          id: 5,
          title: 'לבשתי את חולצת המפלגה והסתובבתי בגאווה בעיר',
          points: 5,
          done: false
        }, {
          id: 6,
          title: 'חילקתי 100 פלאיירים',
          points: 5,
          done: false
        }, {
          id: 7,
          title: 'עדכנתי את האפליקציה',
          points: 5,
          done: false
        }];

        tasksObj.timestamp = moment().format('w');

        $localstorage.setObject('weekly1', tasksObj);
      }

      return {
        all: tasksObj,
        get: function(taskId) {
          return tasksObj.tasks[taskId];
        },
        changeState: function(taskId) {
          tasksObj.tasks[taskId].done = true; // !tasksObj.tasks[taskId].done;
          $localstorage.setObject('weekly1', tasksObj);
        },
        init: function() {

          $rootScope.$apply(function() {
            if (tasksObj.timestamp != moment().format('w')) {

              tasksObj.tasks = [{
                id: 0,
                title: 'העליתי תמונה לאינסטגרם',
                points: 2,
                done: false
              }, {
                id: 1,
                title: 'דיברתי עם ההורים',
                points: 4,
                done: false
              }, {
                id: 2,
                title: 'דיברתי עם הבוס',
                points: 5,
                done: false
              }, {
                id: 3,
                title: 'הדבקתי מדבקות',
                points: 3,
                done: false
              }, {
                id: 4,
                title: 'יצאתי לשטח כפעיל עלה ירוק',
                points: 5,
                done: false
              }, {
                id: 5,
                title: 'לבשתי את חולצת המפלגה והסתובבתי בגאווה בעיר',
                points: 5,
                done: false
              }, {
                id: 6,
                title: 'חילקתי 100 פלאיירים',
                points: 5,
                done: false
              }, {
                id: 7,
                title: 'עדכנתי את האפליקציה',
                points: 5,
                done: false
              }];

              tasksObj.timestamp = moment().format('w');

              $localstorage.setObject('weekly1', tasksObj);
            }
          });

        }
      }
}])

    .factory('DailyTasks', ['$localstorage', '$rootScope', function($localstorage, $rootScope) {

        // Get the state of the daily tasks
        var tasksObj = $localstorage.getObject('daily1');

        // We want to check if it's a new day, for init the daily tasks
        if (!tasksObj || tasksObj.timestamp != moment().format('DD/MM/YY')) {

          // Create new tasks object to save locally
          tasksObj = {};

          tasksObj.tasks = [{
            id: 0,
            title: 'שיתפתי פוסט בפייסבוק',
            points: 1,
            done: false
          }, {
            id: 1,
            title: 'שיתפתי כרזה/וידאו בווטסאפ',
            points: 1,
            done: false
          }, {
            id: 2,
            title: 'התכתבתי עם אנשים בפייסבוק',
            points: 2,
            done: false
          }, {
            id: 3,
            title: 'דיברתי בטלפון עם שני חברים',
            points: 3,
            done: false
          }, {
            id: 4,
            title: 'דיברתי עם בן/בת זוגי',
            points: 4,
            done: false
          },{
            id: 5,
            title: 'דיברתי עם חבריי לעבודה',
            points: 4,
            done: false
          }, {
            id: 6,
            title: 'דיברתי עם חבריי ללימודים',
            points: 4,
            done: false
          }, {
            id: 7,
            title: 'דיברתי עם לקוחות',
            points: 5,
            done: false
          }, {
            id: 8,
            title: 'דיברתי עם עובדיי',
            points: 5,
            done: false
          }, {
            id: 9,
            title: 'נפגשתי עם חברים',
            points: 5,
            done: false
          }];

          tasksObj.timestamp = moment().format('DD/MM/YY');

          $localstorage.setObject('daily1', tasksObj);
        }

        return {
          all: tasksObj,
          get: function(taskId) {
            return tasksObj.tasks[taskId];
          },
          changeState: function(taskId) {
            tasksObj.tasks[taskId].done = true; //!tasksObj.tasks[taskId].done;
            $localstorage.setObject('daily1', tasksObj);
          },
          init: function() {

            $rootScope.$apply(function() {
              if (tasksObj.timestamp != moment().format('DD/MM/YY')) {

                tasksObj.tasks = [{
                  id: 0,
                  title: 'שיתפתי פוסט בפייסבוק',
                  points: 1,
                  done: false
                }, {
                  id: 1,
                  title: 'שיתפתי כרזה/וידאו בווטסאפ',
                  points: 1,
                  done: false
                }, {
                  id: 2,
                  title: 'התכתבתי עם אנשים בפייסבוק',
                  points: 2,
                  done: false
                }, {
                  id: 3,
                  title: 'דיברתי בטלפון עם שני חברים',
                  points: 3,
                  done: false
                }, {
                  id: 4,
                  title: 'דיברתי עם בן/בת זוגי',
                  points: 4,
                  done: false
                },{
                  id: 5,
                  title: 'דיברתי עם חבריי לעבודה',
                  points: 4,
                  done: false
                }, {
                  id: 6,
                  title: 'דיברתי עם חבריי ללימודים',
                  points: 4,
                  done: false
                }, {
                  id: 7,
                  title: 'דיברתי עם לקוחות',
                  points: 5,
                  done: false
                }, {
                  id: 8,
                  title: 'דיברתי עם עובדיי',
                  points: 5,
                  done: false
                }, {
                  id: 9,
                  title: 'נפגשתי עם חברים',
                  points: 5,
                  done: false
                }];

                tasksObj.timestamp = moment().format('DD/MM/YY');

                $localstorage.setObject('daily1', tasksObj);
              }
            });

          }
        }
    }]);