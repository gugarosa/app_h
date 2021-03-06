angular.module('starter.controllers', [])

// Controller da Index Page
.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.username = AuthService.username();

  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
})

// Controller da Login View
.controller('LoginCtrl', function($scope, $state, $ionicPopup, PouchService, AuthService) {

  // $scope.data = {};
  // //Redirect to mainPage
  $scope.authLogin = function(data) {

    AuthService.login(data.username, data.password).then(function(authenticated) {
      $scope.setCurrentUsername(data.username);
      if (authenticated.rows[0].doc.usertype == 1){
          $state.go('mainSet.home', {}, {reload: true});
      } else if (authenticated.rows[0].doc.usertype == 2){
         $state.go('mainSU.home', {}, {reload: true});
      } else if (authenticated.rows[0].doc.usertype == 3){
         $state.go('mainMKT.home', {}, {reload: true});
      } else if (authenticated.rows[0].doc.usertype == 4){
         $state.go('mainCoord.modulo', {}, {reload: true});
      }
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
    // PouchService.getDocument("userSUbrurubio").then(function(doc){
    //   console.log(doc.name);
    // })
    // PouchService.getAllDocuments().then(function(doc){
    //   console.log(doc);
    //   console.log(doc.rows);
    //   console.log(doc.rows[2].doc.name);
    // })
  };

  //Redirect to RegisterPage
  $scope.registerPage = function(){
    $state.go('mainSU.register');
  };
})

// Controller da Register View
.controller('RegisterCtrl', function($scope, $state, $ionicPopup, PouchService) {

  $scope.user = {};
  //Get usertype
  var myPopup = $ionicPopup.show({
  template: '<input type="text" ng-model="user.usertype">',
  title: 'Enter the user type',
  // subTitle: 'Please use normal things',
  scope: $scope,
  buttons: [
    { text: 'Cancel' },
    {
      text: '<b>Save</b>',
      type: 'button-positive',
      onTap: function(e) {
        if (!$scope.user.usertype) {
          //don't allow the user to close unless he enters wifi password
          e.preventDefault();
        } else {
          return $scope.user.usertype; // FAZER VALIDAÇAO DO DADO
        }
      }
    }
  ]
});

  //Register Function
  $scope.signUp = function (){
    if ($scope.user.usertype == 1){
        $scope.user._id = 'userSet'+$scope.user.username;
    } else if ($scope.user.usertype == 2){
       $scope.user._id = 'userSU'+$scope.user.username;
    } else if ($scope.user.usertype == 3){
       $scope.user._id = 'userMKT'+$scope.user.username;
    } else if ($scope.user.usertype == 4){
       $scope.user._id = 'userCoord'+$scope.user.username;
    }
    //PouchService.addRelational('user', $scope.user).then(function(){
    $scope.user.type = 'user';
    $scope.user.inst = [];
    PouchService.addDocument($scope.user).then(function(){
      //console.log(docs);
      $state.go('mainSU.home');
    });
    //PouchService.getDocument('').then(function(docs){console.log(docs);});
    //PouchService.getAllDocuments().then(function(docs){console.log(docs);});
    //PouchService.removeDocument('').then(function(docs){console.log(docs);});
  };
})

// Controller da MainMenu
// .controller('MainCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
//   $scope.logout = function() {
//     AuthService.logout();
//     $state.go('login');
//   };
// })
//
// // Controller da Mode View
// .controller('ModeCtrl', function($scope, $state, PouchService) {
//   $scope.redirecTo = function (){
//     $state.go('main.home');
//   };
// })
// Controllers da SU
.controller('MainSUCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
})

.controller('HomeSUCtrl', function($scope, $state, $http, $ionicPopup, PouchService, AuthService) {
  $scope.var = {};

  //Register User
  $scope.regUser = function(){
    $state.go('mainSU.register');
  };

  //Change User
  $scope.changeUser = function(){
    $state.go('mainSU.changeUser');
  };

  // RegisterInst - Set Type and Redirect
  $scope.regInst = function (){
    //Get instype
    var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="var.value">',
    title: 'Enter the inst type',
    // subTitle: 'Please use normal things',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.var.value) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
           } else {
             if ($scope.var.value == 1){
               $state.go('mainSU.regInstCLT');
             } else if ($scope.var.value == 2){
               $state.go('mainSU.regInstHosp');
             } else if ($scope.var.value == 3){
               $state.go('mainSU.regInstILP');
             } else if ($scope.var.value == 4){
               $state.go('mainSU.regInstONG');
             } else if ($scope.var.value == 5){
               $state.go('mainSU.regInstOP');
             } else if ($scope.var.value == 6){
               $state.go('mainSU.regInstPDV');
             }
            //return $scope.var.value; // FAZER VALIDAÇAO DO DADO
          }
        }
      }
    ]
  });
  };

  // Change Institution
  $scope.changeInst = function(){
    $state.go('mainSU.changeInst');
  };
})

.controller('MainSetCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
})
.controller('HomeSetCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
})

.controller('MainMKTCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
})
.controller('HomeMKTCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
})

.controller('MainCoordCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
})
.controller('ModeCoordCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
})
.controller('HomeCoordCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
})

.controller('regInstCLTCtrl', function($q, $scope, $state, $http, $ionicPopup, PouchService, AuthService) {
  $scope.inst = {};
  // Get user ID to bind in Institution
  getUserID = function (){
    return $q(function(resolve, reject) {
      PouchService.getDocumentbyUsername($scope.username).then(function(doc){
        if (Object.keys(doc.rows).length == '0'){
        } else {
           resolve(doc);
        }
      });
    });
  };
  // Register new CLT
  $scope.regNewCLT = function() {
    getUserID().then(function(d){
      $scope.inst.user = d.rows[0].doc._id;
      //console.log($scope.inst.user);
      $scope.inst._id = 'instCLT';
      $scope.inst.type = 'instituicao';
      //console.log($scope.inst);
      //console.log($scope.inst.user);
      PouchService.addDocument($scope.inst).then(function(){
           //console.log(doc);
           PouchService.getDocument($scope.inst.user).then(function(doc){
             doc.inst.push($scope.inst._id);
             //console.log(doc.inst);
               PouchService.addDocument(doc).then(function(){
               });
           });
           $state.go('mainSU.home');
      });
    });
  };
})
.controller('regInstHospCtrl', function($q, $scope, $state, $http, $ionicPopup, PouchService, AuthService) {
  //console.log($scope.username);
  $scope.inst = {};
  // Get user ID to bind in Institution
  getUserID = function (){
    return $q(function(resolve, reject) {
      PouchService.getDocumentbyUsername($scope.username).then(function(doc){
        if (Object.keys(doc.rows).length == '0'){
        } else {
           resolve(doc);
        }
      });
    });
  };
  // Register new Hosp
  $scope.regNewHosp = function() {
    getUserID().then(function(d){
      $scope.inst.user = d.rows[0].doc._id;
      //console.log($scope.inst.user);
      $scope.inst._id = 'instHosp';
      $scope.inst.type = 'instituicao';
      //console.log($scope.inst);
      //console.log($scope.inst.user);
      PouchService.addDocument($scope.inst).then(function(){
           //console.log(doc);
           PouchService.getDocument($scope.inst.user).then(function(doc){
             //append info in array
             doc.inst.push($scope.inst._id);

               // deletar inst._id do usuário
               ///var index = doc.inst.indexOf($scope.inst._id);
               ///console.log(index);
               ///if (index > -1) {
                ///  doc.inst.splice(index, 1);
                ///}
                ///
               PouchService.addDocument(doc).then(function(){
               });
           });
           $state.go('mainSU.home');
      });
    });
  };
})

.controller('regInstILPCtrl', function($q, $scope, $state, $http, $ionicPopup, PouchService, AuthService) {
  $scope.inst = {};
  // Get user ID to bind in Institution
  getUserID = function (){
    return $q(function(resolve, reject) {
      PouchService.getDocumentbyUsername($scope.username).then(function(doc){
        if (Object.keys(doc.rows).length == '0'){
        } else {
           resolve(doc);
        }
      });
    });
  };
  // Register new ILP
  $scope.regNewILP = function() {
    getUserID().then(function(d){
      $scope.inst.user = d.rows[0].doc._id;
      //console.log($scope.inst.user);
      $scope.inst._id = 'instILP';
      $scope.inst.type = 'instituicao';
      //console.log($scope.inst);
      //console.log($scope.inst.user);
      PouchService.addDocument($scope.inst).then(function(){
           //console.log(doc);
           PouchService.getDocument($scope.inst.user).then(function(doc){
             doc.inst.push($scope.inst._id);
             //console.log(doc.inst);
               PouchService.addDocument(doc).then(function(){
               });
           });
           $state.go('mainSU.home');
      });
    });
  };
})

.controller('regInstONGCtrl', function($q, $scope, $state, $http, $ionicPopup, PouchService, AuthService) {
  $scope.inst = {};
  // Get user ID to bind in Institution
  getUserID = function (){
    return $q(function(resolve, reject) {
      PouchService.getDocumentbyUsername($scope.username).then(function(doc){
        if (Object.keys(doc.rows).length == '0'){
        } else {
           resolve(doc);
        }
      });
    });
  };
  // Register new ONG
  $scope.regNewONG = function() {
    getUserID().then(function(d){
      $scope.inst.user = d.rows[0].doc._id;
      //console.log($scope.inst.user);
      $scope.inst._id = 'instONG';
      $scope.inst.type = 'instituicao';
      //console.log($scope.inst);
      //console.log($scope.inst.user);
      PouchService.addDocument($scope.inst).then(function(){
           //console.log(doc);
           PouchService.getDocument($scope.inst.user).then(function(doc){
             doc.inst.push($scope.inst._id);
             //console.log(doc.inst);
               PouchService.addDocument(doc).then(function(){
               });
           });
           $state.go('mainSU.home');
      });
    });
  };
})

.controller('regInstOPCtrl', function($q, $scope, $state, $http, $ionicPopup, PouchService, AuthService) {
  $scope.inst = {};
  // Get user ID to bind in Institution
  getUserID = function (){
    return $q(function(resolve, reject) {
      PouchService.getDocumentbyUsername($scope.username).then(function(doc){
        if (Object.keys(doc.rows).length == '0'){
        } else {
           resolve(doc);
        }
      });
    });
  };
  // Register new OP
  $scope.regNewOP = function() {
    getUserID().then(function(d){
      $scope.inst.user = d.rows[0].doc._id;
      //console.log($scope.inst.user);
      $scope.inst._id = 'instOP';
      $scope.inst.type = 'instituicao';
      //console.log($scope.inst);
      //console.log($scope.inst.user);
      PouchService.addDocument($scope.inst).then(function(){
           //console.log(doc);
           PouchService.getDocument($scope.inst.user).then(function(doc){
             doc.inst.push($scope.inst._id);
             //console.log(doc.inst);
               PouchService.addDocument(doc).then(function(){
               });
           });
           $state.go('mainSU.home');
      });
    });
  };
})

.controller('regInstPDVCtrl', function($q, $scope, $state, $http, $ionicPopup, PouchService, AuthService) {
  $scope.inst = {};
  // Get user ID to bind in Institution
  getUserID = function (){
    return $q(function(resolve, reject) {
      PouchService.getDocumentbyUsername($scope.username).then(function(doc){
        if (Object.keys(doc.rows).length == '0'){
        } else {
           resolve(doc);
        }
      });
    });
  };
  // Register new PDV
  $scope.regNewPDV = function() {
    getUserID().then(function(d){
      $scope.inst.user = d.rows[0].doc._id;
      //console.log($scope.inst.user);
      $scope.inst._id = 'instPDV';
      $scope.inst.type = 'instituicao';
      //console.log($scope.inst);
      //console.log($scope.inst.user);
      PouchService.addDocument($scope.inst).then(function(){
           //console.log(doc);
           PouchService.getDocument($scope.inst.user).then(function(doc){
             doc.inst.push($scope.inst._id);
             //console.log(doc.inst);
               PouchService.addDocument(doc).then(function(){
               });
           });
           $state.go('mainSU.home');
      });
    });
  };
})

.controller('ChangeUserCtrl', function($scope, $state, $http, $ionicPopup, $filter, $ionicFilterBar, PouchService, AuthService) {
  $scope.places = [];

  PouchService.getDocumentbyType('user').then(function(doc){
     for (i = 0; i < Object.keys(doc.rows).length; i++) {
       $scope.places.push({id: doc.rows[i].doc._id, name: doc.rows[i].doc.name});
     }
     //console.log($scope.places);
  });

  $scope.showFilterBar = function () {
    var filterBarInstance = $ionicFilterBar.show({
      cancelText: "<i class='ion-ios-close-outline'></i>",
      items: $scope.places,
      update: function (filteredItems, filterText) {
        $scope.places = filteredItems;
      }
    });
  };

  $scope.enterUser = function(id){
    //Change State sending parameters
    $state.go('mainSU.changeUserInfo', {'data':id});
  };
})

.controller('ChangeUserInfoCtrl', function($scope, $state, $stateParams, $http, $ionicPopup, $filter, $ionicFilterBar, PouchService, AuthService) {
  $scope.data = $stateParams.data;
  $scope.user = {};
  // store old user
  $scope.old = {};

  //Get user information and show on HTML Form
  PouchService.getDocument($stateParams.data).then(function(doc){
    //console.log(doc);
    $scope.user = doc;
    $scope.old = doc._id;
  });

  // update User Infos
  $scope.changeUser = function (){

    PouchService.getDocument($scope.old).then(function(docOld){
      if ($scope.user.usertype == 1){
           $scope.user._id = 'userSet'+$scope.user.username;
      } else if ($scope.user.usertype == 2){
          $scope.user._id = 'userSU'+$scope.user.username;
      } else if ($scope.user.usertype == 3){
          $scope.user._id = 'userMKT'+$scope.user.username;
      } else if ($scope.user.usertype == 4){
          $scope.user._id = 'userCoord'+$scope.user.username;
      }
      if (docOld._id == $scope.user._id){
        // if same id get old _rev
        $scope.user._rev = docOld._rev;
        docOld = $scope.user;
        //update doc
        PouchService.addDocument(docOld).then(function(){
          var alertPopup = $ionicPopup.alert({
            title: 'Usuário Alterado',
            //template: 'Please check your credentials!'
          });
          $state.go('mainSU.home');
        });
      } else {
        $scope.user.inst = docOld.inst;
        // if diferent id restore _rev
        $scope.user._rev = null;
        //remove old doc
        PouchService.removeDocument(docOld._id).then(function(){
           //add new doc
           PouchService.addDocument($scope.user).then(function(){
             $state.go('mainSU.home');
           });
        });
      }
    });
  };
})

.controller('ChangeInstCtrl', function($scope, $state, $http, $ionicPopup, $filter, $ionicFilterBar, PouchService, AuthService) {
  $scope.places = [];

  PouchService.getDocumentbyType('instituicao').then(function(doc){
     for (i = 0; i < Object.keys(doc.rows).length; i++) {
       $scope.places.push({id: doc.rows[i].doc._id, name: doc.rows[i].doc.NF});
     }
     console.log($scope.places);
  });

  $scope.showFilterBar = function () {
    var filterBarInstance = $ionicFilterBar.show({
      cancelText: "<i class='ion-ios-close-outline'></i>",
      items: $scope.places,
      update: function (filteredItems, filterText) {
        $scope.places = filteredItems;
      }
    });
  };

  $scope.enterInst = function(id){
    //Change State sending parameters
    $state.go('mainSU.changeInstInfo', {'data':id});
  };
})
;
