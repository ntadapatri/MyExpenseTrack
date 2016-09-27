var nameApp = angular.module('todo', ['ionic', 'appservices','ui.router','chart.js','ngCordova','appservicesgeo','locator','firebase']);

nameApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    window.plugin.notification.local.onadd = function (id, state, json) {
      var notification = {
        id: id,
        state: state,
        json: json
      };
      $timeout(function () {
        $rootScope.$broadcast("$cordovaLocalNotification:added", notification);
      });
    };
  });
});

nameApp.factory('Items', ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase('https://fb-mar19-1.firebaseio.com/items');
  return $firebaseArray(itemsRef);
}])

nameApp.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$animateProvider,$logProvider) {


  /* PERFORMANCE TUNING*/
  $ionicConfigProvider.views.maxCache(5);
  $ionicConfigProvider.scrolling.jsScrolling(false);
  $animateProvider.classNameFilter(/\banimated\b/);
  $logProvider.debugEnabled(false);
//$ionicConfigProvider.views.transition('none');

  $stateProvider

    .state('dashboard', {
      cache: false,                   //PERFORMANCE TUNING
      url: '/dash',
      templateUrl: 'dashboard.html',
      controller: 'dashCtrl'
    })
    .state('fixedexp', {
      cache: false,
      url: '/fixedexp',
      templateUrl: 'fixedexp.html',
      controller: 'fixedexpCtrl'
    })
    .state('creditcard', {
      cache: false,
      url: '/creditcard',
      templateUrl: 'creditcard.html',
      controller: 'creditcardCtrl'
    })
    .state('fuel', {
      cache: false,
      url: '/fuel',
      templateUrl: 'fuel.html',
      controller: 'fuelCtrl'
    })
    .state('grocery', {
      cache: false,
      url: '/grocery',
      templateUrl: 'grocery.html',
      controller: 'groceryCtrl'
    })
    .state('park', {
      cache: false,
      url: '/park',
      templateUrl: 'park.html',
      controller: 'parkCtrl'
    })
    .state('shop', {
      cache: false,
      url: '/shop',
      templateUrl: 'shop.html',
      controller: 'shopCtrl'
    })
    .state('ent', {
      cache: false,
      url: '/ent',
      templateUrl: 'ent.html',
      controller:'entCtrl'
    })
    .state('misc', {
      cache: false,
      url: '/misc',
      templateUrl: 'misc.html',
      controller: 'miscCtrl'
    })
    .state('history', {
      cache: false,
      url: '/history',
      templateUrl: 'history.html',
      controller: 'histCtrl'
    })
    .state('stats', {
      cache: false,
      url: '/stats',
      templateUrl: 'stats.html',
      controller: 'statsCtrl'
    })
    .state('glist', {
      cache: false,
      url: '/glist',
      templateUrl: 'grocerylist.html',
      controller: 'glistCtrl'
    })
    .state('profile', {
      cache: false,
      url: '/profile',
      templateUrl: 'profile.html',
      controller: 'profCtrl'
    })
    .state('location', {
      cache: false,
      url: '/location',
      templateUrl: 'location.html',
      controller: 'MainCtrl'
    });

  $urlRouterProvider.otherwise("/dash");

});


nameApp.controller('dashCtrl', function($scope, $state, $stateParams, $ionicHistory, $rootScope,SQLService,$timeout) {


  SQLService.setup();

  SQLService.setIniTarget();

  $scope.loadTask = function() {
    SQLService.all().then(function(results){
      $rootScope.expensee=results;
    });
  };

  $scope.loadTask();

  $rootScope.monarr = [01,02,03,04,05,06,07,08,09,10,11,12];

  $scope.date = new Date();

  $rootScope.getTotal = function() {
    $rootScope.total=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr)
      {
        $rootScope.total+= $rootScope.expensee[i].exp_amt;
      }
    }
    return $rootScope.total;
  };

  $rootScope.getFETotal = function() {
    var fe_total=0;
    var fe_cnt = 0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Fixed Expense")
      {
        fe_total+= $rootScope.expensee[i].exp_amt;
      }
    }
    return fe_total;
  };
  $rootScope.getFECount = function() {
    var fe_total=0;
    var fe_cnt = 0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Fixed Expense")
      {
        fe_cnt=fe_cnt+1;
      }
    }
    return fe_cnt;
  };

  $rootScope.getCCTotal = function() {
    var cc_total=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Credit Card")
      {
        cc_total+= $rootScope.expensee[i].exp_amt;
      }
    }
    return cc_total;
  };

  $rootScope.getCCCount = function() {
    var cc_cnt=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Credit Card")
      {
        cc_cnt = cc_cnt +1;
      }
    }
    return cc_cnt;
  };

  $rootScope.getFuelTotal = function() {
    var f_total=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Fuel")
      {
        f_total+= $rootScope.expensee[i].exp_amt;
      }
    }
    return f_total;
  };

  $rootScope.getFuelCount = function() {
    var f_cnt=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Fuel")
      {
        f_cnt = f_cnt+1;
      }
    }
    return f_cnt;
  };

  $rootScope.getGroceryTotal = function() {
    var g_total=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Grocery")
      {
        g_total+= $rootScope.expensee[i].exp_amt;
      }
    }
    return g_total;
  };

  $rootScope.getGroceryCount = function() {
    var g_cnt=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Grocery")
      {
        g_cnt = g_cnt +1;
      }
    }
    return g_cnt;
  };

  $rootScope.getParkTotal = function() {
    var p_total=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Parking")
      {
        p_total+= $rootScope.expensee[i].exp_amt;
      }
    }
    return p_total;
  };

  $rootScope.getParkCount = function() {
    var p_cnt=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Parking")
      {
        p_cnt = p_cnt +1;
      }
    }
    return p_cnt;
  };

  $rootScope.getShopTotal = function() {
    var s_total=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Shopping")
      {
        s_total+= $rootScope.expensee[i].exp_amt;
      }
    }
    return s_total;
  };

  $rootScope.getShopCount = function() {
    var s_cnt=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Shopping")
      {
        s_cnt = s_cnt +1;
      }
    }
    return s_cnt;
  };

  $rootScope.getEntTotal = function() {
    var e_total=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Entertainment")
      {
        e_total+= $rootScope.expensee[i].exp_amt;
      }
    }
    return e_total;
  };

  $rootScope.getEntCount = function() {
    var e_cnt=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Entertainment")
      {
        e_cnt = e_cnt +1;
      }
    }
    return e_cnt;
  };

  $rootScope.getMiscTotal = function() {
    var m_total=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Miscellaneous")
      {
        m_total+= $rootScope.expensee[i].exp_amt;
      }
    }
    return m_total;
  };

  $rootScope.getMiscCount = function() {
    var m_cnt=0;
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      var mon= $rootScope.expensee[i].exp_date.toString().substr(5,2);
      var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);
      var thismon = new Date().getMonth()+1;
      var thisyr = new Date().getFullYear();
      for(var x=0;x<$rootScope.monarr.length;x++){
        if(mon==$rootScope.monarr[x]){
          mon=x+1;
          break;
        }
      }
      if(mon==thismon && yr==thisyr &&$rootScope.expensee[i].exp_category=="Miscellaneous")
      {
        m_cnt = m_cnt +1;
      }
    }
    return m_cnt;
  };


  $rootScope.getTargetInfo = function(){
    $rootScope.editMode = false;
    $rootScope.avail = false;
    var targetAmt;
    for (var i = 0; i < $rootScope.expensee.length; i++) {

      if ($rootScope.expensee[i].exp_category == 'Target Expenditure') {
        targetAmt=$rootScope.expensee[i].exp_target;
        if ($rootScope.total <= $rootScope.expensee[i].exp_target){ // || $rootScope.total==0

          $rootScope.editMode = true;
        }
        if ($rootScope.expensee[i].exp_target == 0 && $rootScope.total==0) {
          $rootScope.avail = true;
        }
      }
    }
    return targetAmt;
  }

});

nameApp.controller('fixedexpCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicPopup, SQLService, $timeout,$ionicSideMenuDelegate) {

  SQLService.setup();

  $scope.loadTask = function() {
    SQLService.all().then(function(results){
      $rootScope.expensee=results;
    });
  };

  $scope.loadTask();

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-fixedexpense-category.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.createFixedExpense = function(task) {
    SQLService.setFixedExpense(task.title,task.amount);
    $scope.loadTask();
    $scope.taskModal.hide();
    task.title = "";
    task.amount = "";
  };

  $scope.onItemDelete = function(taskid) {
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this expense?'
    }).then(function(res) {
      if(res) {
        SQLService.del(taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.onItemEdit = function(expid) {
    $ionicPopup.prompt({
      title: 'Update Expense Amount'
      //subTitle: 'Enter new task'
    }).then(function(res) {
      if(res) {
        SQLService.edit(res, expid);
        $scope.loadTask();
      }
    });
  };

  $scope.goToDash = function(){
    $state.go('dashboard',{});
  };

  $scope.refreshTasks = function() {

    console.log('Refreshing');

    $timeout(function() {
      $scope.loadTask();
      $scope.$broadcast('scroll.refreshComplete');
    }, 500);

  };
  $scope.loadMore = function() {
      $scope.loadTask();
      $scope.$broadcast('scroll.infiniteScrollComplete');

  };
});

nameApp.controller('creditcardCtrl', function($scope, $rootScope, $state, $ionicPopup, SQLService, $ionicSideMenuDelegate) {

  SQLService.setup();
  $scope.loadTask = function() {
    SQLService.all().then(function(results){
      $rootScope.expensee=results;
    });
  };

  $scope.loadTask();

  // Open our new task modal
  $scope.createCreditCard = function(task) {
    SQLService.setCreditCard(task.title,task.amount);
    $scope.loadTask();
    task.title = "";
    task.amount = "";
  };

  $scope.onItemDelete = function(taskid) {
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this expense?'
    }).then(function(res) {
      if(res) {
        SQLService.del(taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.onItemEdit = function(taskid) {
    $ionicPopup.prompt({
      title: 'Update Task'
      //subTitle: 'Enter new task'
    }).then(function(res) {
      if(res) {
        SQLService.edit(res, taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.goToDash = function(){
    $state.go('dashboard',{});
  };

});

nameApp.controller('fuelCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicPopup, SQLService, $ionicSideMenuDelegate) {

  SQLService.setup();
  $scope.loadTask = function() {
    SQLService.all().then(function(results){
      $rootScope.expensee=results;
    });
  };

  $scope.loadTask();

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-fuel-category.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.createFuel = function(task) {
    SQLService.setFuel(task.amount);
    $scope.loadTask();
    $scope.taskModal.hide();
  };

  $scope.onItemDelete = function(taskid) {
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this expense?'
    }).then(function(res) {
      if(res) {
        SQLService.del(taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.onItemEdit = function(taskid) {
    $ionicPopup.prompt({
      title: 'Update Task'
      //subTitle: 'Enter new task'
    }).then(function(res) {
      if(res) {
        SQLService.edit(res, taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.goToDash = function(){
    $state.go('dashboard',{});
  };
});

nameApp.controller('groceryCtrl', function($scope, $rootScope,$state, $ionicModal, $ionicPopup, SQLService, $ionicSideMenuDelegate) {

  SQLService.setup();
  $scope.loadTask = function() {
    SQLService.all().then(function(results){
      $rootScope.expensee=results;
    });
  };

  $scope.loadTask();

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-grocery-category.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.createGrocery = function(task) {
    SQLService.setGrocery(task.amount);
    $scope.loadTask();
    $scope.taskModal.hide();
  };

  $scope.onItemDelete = function(taskid) {
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this expense?'
    }).then(function(res) {
      if(res) {
        SQLService.del(taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.onItemEdit = function(taskid) {
    $ionicPopup.prompt({
      title: 'Update Task'
      //subTitle: 'Enter new task'
    }).then(function(res) {
      if(res) {
        SQLService.edit(res, taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.goToDash = function(){
    $state.go('dashboard',{});
  };
});

nameApp.controller('parkCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicPopup, SQLService, $ionicSideMenuDelegate) {

  SQLService.setup();
  $scope.loadTask = function() {
    SQLService.all().then(function(results){
      $rootScope.expensee=results;
    });
  };

  $scope.loadTask();

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-parking-category.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.createParking = function(task) {
    SQLService.setParking(task.amount);
    $scope.loadTask();
    $scope.taskModal.hide();
  };

  $scope.onItemDelete = function(taskid) {
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this expense?'
    }).then(function(res) {
      if(res) {
        SQLService.del(taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.onItemEdit = function(taskid) {
    $ionicPopup.prompt({
      title: 'Update Task'
      //subTitle: 'Enter new task'
    }).then(function(res) {
      if(res) {
        SQLService.edit(res, taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.goToDash = function(){
    $state.go('dashboard',{});
  };
});

nameApp.controller('shopCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicPopup, SQLService, $ionicSideMenuDelegate) {

  SQLService.setup();
  $scope.loadTask = function() {
    SQLService.all().then(function(results){
      $rootScope.expensee=results;
    });
  };

  $scope.loadTask();

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-shopping-category.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.createShopping = function(task) {
    SQLService.setShopping(task.title,task.amount);
    $scope.loadTask();
    $scope.taskModal.hide();
  };

  $scope.onItemDelete = function(taskid) {
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this expense?'
    }).then(function(res) {
      if(res) {
        SQLService.del(taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.onItemEdit = function(taskid) {
    $ionicPopup.prompt({
      title: 'Update Task'
      //subTitle: 'Enter new task'
    }).then(function(res) {
      if(res) {
        SQLService.edit(res, taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.goToDash = function(){
    $state.go('dashboard',{});
  };
});

nameApp.controller('entCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicPopup, SQLService, $ionicSideMenuDelegate) {
  SQLService.setup();
  $scope.loadTask = function() {
    SQLService.all().then(function(results){
      $rootScope.expensee=results;
    });
  };

  $scope.loadTask();

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-ent-category.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.createEnt = function(task) {
    SQLService.setEnt(task.title,task.amount);
    $scope.loadTask();
    $scope.taskModal.hide();
  };

  $scope.onItemDelete = function(taskid) {
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this expense?'
    }).then(function(res) {
      if(res) {
        SQLService.del(taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.onItemEdit = function(taskid) {
    $ionicPopup.prompt({
      title: 'Update Task'
      //subTitle: 'Enter new task'
    }).then(function(res) {
      if(res) {
        SQLService.edit(res, taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.goToDash = function(){
    $state.go('dashboard',{});
  };
});

nameApp.controller('miscCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicPopup, SQLService, $ionicSideMenuDelegate) {
  SQLService.setup();
  $scope.loadTask = function() {
    SQLService.all().then(function(results){
      $rootScope.expensee=results;
    });
  };

  $scope.loadTask();

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-misc-category.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.createMisc = function(task) {
    SQLService.setMisc(task.title,task.amount);
    $scope.loadTask();
    $scope.taskModal.hide();
  };

  $scope.onItemDelete = function(taskid) {
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this expense?'
    }).then(function(res) {
      if(res) {
        SQLService.del(taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.onItemEdit = function(taskid) {
    $ionicPopup.prompt({
      title: 'Update Task'
      //subTitle: 'Enter new task'
    }).then(function(res) {
      if(res) {
        SQLService.edit(res, taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.goToDash = function(){
    $state.go('dashboard',{});
  };
});

nameApp.controller('histCtrl', function($scope, $state, $rootScope) {

  var monthArr = new Array();
  var yearArr = new Array();

  for(var i=0;i<$rootScope.expensee.length;i++){
    var mon = $rootScope.expensee[i].exp_date.toString().substr(5, 2);


    var flag=0;
    for(var  j=0;j<monthArr.length;j++){
      if(monthArr[j]== mon){
        flag=1;
      }
    }
    if(flag==0){
      monthArr.push(mon);
    }
  }

  var yearArr = new Array();

  for(var i=0;i<$rootScope.expensee.length;i++){

    var yr = $rootScope.expensee[i].exp_date.toString().substr(0,4);

    var flag=0;
    for(var  j=0;j<yearArr.length;j++){
      if(yearArr[j]== yr){
        flag=1;
      }
    }
    if(flag==0){
      yearArr.push(yr);
    }
  }

  $scope.monthArrs = monthArr;
  $scope.yearArrs = yearArr;

  $scope.showSelectMon = function (mySelectMon) {
    $rootScope.chosenMonth = mySelectMon;
  }

  $scope.showSelectYr = function (mySelectYr) {
    $rootScope.chosenYear = mySelectYr;
  }

  $scope.sample = function(){

    var newArr= new Array();
    var total=0;

    $scope.expCats = ["Fixed Expense","Credit Card","Fuel","Grocery","Parking","Shopping","Entertainment","Miscellaneous"];

    for(var j = 0; j<$scope.expCats.length;j++) {
      for (var i = 0; i < $rootScope.expensee.length; i++) {
        var selectedMon = $rootScope.expensee[i].exp_date.toString().substr(5, 2);
        var selectedYr = $rootScope.expensee[i].exp_date.toString().substr(0, 4);

        if (selectedMon == $rootScope.chosenMonth && selectedYr == $rootScope.chosenYear) {
          if($rootScope.expensee[i].exp_category == $scope.expCats[j]){
            total+=($rootScope.expensee[i].exp_amt);
          }
        }
      }
      newArr.push(total);
      total=0;
    }
    $scope.outputArr = newArr;
  }

  $scope.goToDash = function(){
    $state.go('dashboard',{});
  };
});

nameApp.controller("statsCtrl", function($scope,$rootScope,$state) {

  $rootScope.labels =["Fixed Expense","Credit Card","Fuel","Grocery","Parking","Shopping","Entertainment","Miscellaneous"];
  $rootScope.data=[];
  var arr= new Array();
  var total=0;
  for(var j=0; j<$scope.labels.length;j++){
    for (var i = 0; i < $rootScope.expensee.length; i++) {
      if($rootScope.expensee[i].exp_category === $scope.labels[j]){
        total+=($rootScope.expensee[i].exp_amt);
      }
    }
    arr.push(total);
    total=0;
  }
  $rootScope.data.push(arr);

  $scope.goToDash = function(){
    $state.go('dashboard',{});
  };
});


nameApp.controller('glistCtrl', function($scope, $interval, $rootScope, $state, $ionicModal, $ionicPopup, SQLService, $cordovaGeolocation, $ionicLoading, $ionicPlatform,GEOService,$cordovaLocalNotification) {
  SQLService.setup();
  $scope.loadTask = function() {
    SQLService.all().then(function(results){
      $rootScope.expensee=results;
    });
  };

  $scope.loadTask();

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-grocerylist-category.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.createGrocerylist = function(task) {
    SQLService.setGL(task.title);
    $scope.loadTask();
    $scope.taskModal.hide();
    task.title = "";

  };

  $scope.onItemDelete = function(taskid) {
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this expense?'
    }).then(function(res) {
      if(res) {
        SQLService.del(taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.onItemEdit = function(taskid) {
    $ionicPopup.prompt({
      title: 'Update Task'
      //subTitle: 'Enter new task'
    }).then(function(res) {
      if(res) {
        SQLService.edit(res, taskid);
        $scope.loadTask();
      }
    });
  };

  $scope.onItemDone = function(taskid) {
    $ionicPopup.confirm({
      title: 'Complete?',
      content: 'Are you done buying this?'
    }).then(function(res) {
      if(res) {
        SQLService.del(taskid);
        $scope.loadTask();
      }
    });
  };

  $interval( function(){ $scope.itemExists(); }, 3000);

  $scope.itemExists = function(){


    $ionicPlatform.ready(function() {

      var posOptions = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      };
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;


        var myLatlng = new google.maps.LatLng(lat, long);

        var ref = new Firebase("https://fb-mar19-1.firebaseio.com/items/-KDGJ93HhYW060Krj9xF");
        ref.once("value", function(snapshot){
          $scope.lati = snapshot.child("lat").val();
          $scope.longi = snapshot.child("lng").val();
        });


        var d = 0;
        d=GEOService.getDist(lat,long,$scope.lati,$scope.longi);
        //alert(d);

        var cnt=0;
        for(var i=0;i<$rootScope.expensee.length;i++){
          if($rootScope.expensee[i].exp_category=='List'){
            cnt=cnt+1;
            //alert('hi');
          }
        }

        if(cnt>=1) {


          if (d <= 0.5) {
            //alert('hello');
            var alarmTime = new Date();

            //  !!!BORROWED FROM NIC RABOY'S BLOG!!!
            $cordovaLocalNotification.add({
              id: "1234",
              date: alarmTime,
              message: "Kosten Spur Notification",
              title: "Your have items in your grocery list",
              autoCancel: true,
              sound: null
            }).then(function () {
              console.log("The notification has been set");
            });
          }
        }

        //  !!!BORROWED FROM NIC RABOY'S BLOG!!!
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        $scope.map = map;
        $ionicLoading.hide();

      }, function(err) {
        $ionicLoading.hide();
        console.log(err);
      });
    });
  };

  $scope.goToDash = function(){
    $state.go('dashboard',{});
  };
});

nameApp.controller('profCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicPopup, SQLService, $ionicSideMenuDelegate,Items) {
  SQLService.setup();
  $rootScope.items=Items;

  $scope.loadTask = function() {
    SQLService.all().then(function(results){
      $rootScope.expensee=results;
    });
  };

  $scope.loadTask();

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-prof-category.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.createTarget = function(task) {
    //SQLService.delTarget();
    SQLService.setTarget(task.amount);
    $scope.loadTask();
    $rootScope.getTargetInfo();
    $scope.taskModal.hide();
  };

  $scope.goToDash = function(){
    $state.go('dashboard',{});
  };
});


nameApp.controller('MainCtrl', function ($scope,$rootScope, location,SQLService,Items) {

  $rootScope.items=Items;

  location.get(angular.noop, angular.noop);
  $scope.isModalVisible = false;

  $scope.toggleModal = function () {
    $scope.isModalVisible = !$scope.isModalVisible;
  };

  $scope.getLat = function (newVal) {
    $scope.lat = newVal;
    console.log($scope.lat);

    $scope.latitude = $scope.lat.toString();
    //alert($scope.latitude);

  };
  $scope.getLng = function (newVal) {
    $scope.lng = newVal;
    console.log($scope.lng);

    $scope.longitude = $scope.lng.toString();
    //alert($scope.longitude);
  }
  $scope.getName = function (newVal) {
    $scope.nam = newVal;
    console.log($scope.nam);

    $scope.name = $scope.nam.toString();
    //alert($scope.name);
  }
  $scope.getDescription = function (newVal) {
    $scope.des = newVal;
    console.log($scope.des);

    $scope.description = $scope.des.toString();
    //alert($scope.description);
  }

  $scope.showAdd = function () {
    $rootScope.items.$add({
      'name':$scope.name,
      'description':$scope.description,
      'lat':$scope.latitude,
      'lng':$scope.longitude
    });
  }

  $scope.$watch('pickedLocation', $scope.toggleModal);
  $scope.$watch('lookedUpLocation', $scope.toggleModal);
  $scope.$watch('lookedUpLocation.name', $scope.getName);
  $scope.$watch('lookedUpLocation.description', $scope.getDescription);
  $scope.$watch('lookedUpLocation.latitude', $scope.getLat);
  $scope.$watch('lookedUpLocation.longitude', $scope.getLng);


});
