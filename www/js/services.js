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

      var tasks = $localstorage.getObject('once');

      if (!tasks) {

        tasks = [{
          id: 0,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }, {
          id: 1,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }, {
          id: 2,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }, {
          id: 3,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }, {
          id: 4,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }];

        $localstorage.setObject('once', tasks);
      }

      return {
        all: function() {
          return tasks;
        },
        get: function(taskId) {
          return tasks[taskId];
        },
        changeState: function(taskId) {
          tasks[taskId].done = !tasks[taskId].done;
          $localstorage.setObject('once', tasks);
        }
      }
    }])

.factory('WeeklyTasks', ['$localstorage', function($localstorage) {

      // Get the state of the daily tasks
      var tasksObj = $localstorage.getObject('weekly');

      // We want to check if it's a new ׳week, for init the daily tasks
      if (!tasksObj || tasksObj.timestamp != moment().format('w')) {

        // Create new tasks object to save locally
        tasksObj = {};

        tasksObj.tasks = [{
          id: 0,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }, {
          id: 1,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }, {
          id: 2,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }, {
          id: 3,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }, {
          id: 4,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }];

        tasksObj.timestamp = moment().format('w');

        $localstorage.setObject('weekly', tasksObj);
      }

      return {
        all: function() {
          return tasksObj.tasks;
        },
        get: function(taskId) {
          return tasksObj.tasks[taskId];
        },
        changeState: function(taskId) {
          tasksObj.tasks[taskId].done = !tasksObj.tasks[taskId].done;
          $localstorage.setObject('weekly', tasksObj);
        }
      }
}])

    .factory('DailyTasks', ['$localstorage', function($localstorage) {

      // Get the state of the daily tasks
      var tasksObj = $localstorage.getObject('daily');

      // We want to check if it's a new day, for init the daily tasks
      if (!tasksObj || tasksObj.timestamp != moment().format('DD/MM/YY')) {

        // Create new tasks object to save locally
        tasksObj = {};

        tasksObj.tasks = [{
          id: 0,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }, {
          id: 1,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }, {
          id: 2,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }, {
          id: 3,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }, {
          id: 4,
          title: 'לשתף כרזה/סטטוס בפייסבוק',
          points: 2,
          done: false
        }];

        $localstorage.setObject('daily', { tasks: tasksObj.tasks, timestamp: moment().format('DD/MM/YY') });
      }

      return {
        all: function() {
          return tasksObj.tasks;
        },
        get: function(taskId) {
          return tasksObj.tasks[taskId];
        },
        changeState: function(taskId) {
          tasksObj.tasks[taskId].done = !tasksObj.tasks[taskId].done;
          $localstorage.setObject('daily', tasksObj);
        },
        moment: moment().format('DD/MM/YY'),
        do: function() {
          $localstorage.remove('daily');
        }
      }
    }]);