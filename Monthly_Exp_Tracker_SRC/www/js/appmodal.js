angular.module('appmodal', [])

  .factory("Modal", function ($q,$ionicModal) {

    // Create and load the Modal
    $ionicModal.fromTemplateUrl('new-expense-category.html', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });

});
