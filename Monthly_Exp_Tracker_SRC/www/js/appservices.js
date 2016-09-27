angular.module('appservices', [])

  .factory("SQLService", function ($q) {

    var db;
    var task='';
    var deltask;

    function createDB() {
      try {
        db = window.openDatabase("expDB", "1.0", "ExpApp", 10*1024*1024);
        db.transaction(function(tx){
          tx.executeSql("CREATE TABLE IF NOT EXISTS expensee (exp_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, exp_category VARCHAR(100), exp_date DATE, exp_name VARCHAR(100),exp_amt integer,exp_target integer )",[]);
        });
      } catch (err) {
        alert("Error processing SQL: " + err);
      }
      console.log('database created');
    }

    function setFixedExpense(ename,eamt){
      return promisedQuery("INSERT INTO expensee(exp_category,exp_date,exp_name, exp_amt) VALUES ('Fixed Expense',date(),'" + ename + "','" + eamt + "')", defaultResultHandler, defaultErrorHandler);
    }

    function setCreditCard(ename,eamt){
      return promisedQuery("INSERT INTO expensee(exp_category,exp_date,exp_name, exp_amt) VALUES ('Credit Card',date(),'" + ename + "','" + eamt + "')", defaultResultHandler, defaultErrorHandler);
    }

    function setGrocery(eamt){
      return promisedQuery("INSERT INTO expensee(exp_category,exp_date,exp_name, exp_amt) VALUES ('Grocery',date(), date() ,'" + eamt + "')", defaultResultHandler, defaultErrorHandler);
    }

    function setFuel(eamt){
      return promisedQuery("INSERT INTO expensee(exp_category,exp_date,exp_name, exp_amt) VALUES ('Fuel',date(), date() ,'" + eamt + "')", defaultResultHandler, defaultErrorHandler);
    }

    function setParking(eamt){
      return promisedQuery("INSERT INTO expensee(exp_category,exp_date,exp_name, exp_amt) VALUES ('Parking',date(), date() ,'" + eamt + "')", defaultResultHandler, defaultErrorHandler);
    }

    function setShopping(ename,eamt){
      return promisedQuery("INSERT INTO expensee(exp_category,exp_date,exp_name, exp_amt) VALUES ('Shopping',date(),'" + ename + "','" + eamt + "')", defaultResultHandler, defaultErrorHandler);
    }

    function setEnt(ename,eamt){
      return promisedQuery("INSERT INTO expensee(exp_category,exp_date,exp_name, exp_amt) VALUES ('Entertainment',date(), '" + ename + "','" + eamt + "')", defaultResultHandler, defaultErrorHandler);
    }

    function setMisc(ename,eamt){
      return promisedQuery("INSERT INTO expensee(exp_category,exp_date,exp_name, exp_amt) VALUES ('Miscellaneous',date(), '" + ename + "','" + eamt + "')", defaultResultHandler, defaultErrorHandler);
    }

    function setGrocerylist(ename){
      return promisedQuery("INSERT INTO expensee(exp_category,exp_date,exp_name, exp_amt) VALUES ('List',date(), '" + ename + "',0)", defaultResultHandler, defaultErrorHandler);
    }

    function delTarget(){
      return promisedQuery("DELETE FROM expensee where exp_category = 'Target Expenditure'", defaultResultHandler, defaultErrorHandler);
    }
    function setTarget(eamt){
      return promisedQuery("UPDATE expensee SET exp_target='" + eamt + "' WHERE exp_category='Target Expenditure'", defaultResultHandler, defaultErrorHandler);
    }

    function setIniTarget(){
      return promisedQuery("INSERT INTO expensee (exp_category,exp_date, exp_amt,exp_target)SELECT * FROM (SELECT 'Target Expenditure', date(), 0, 0) AS tmp WHERE NOT EXISTS (SELECT exp_category FROM expensee WHERE exp_category = 'Target Expenditure') LIMIT 1", defaultResultHandler, defaultErrorHandler);
    }



    function delTasks(tid){
      return promisedQuery("DELETE FROM expensee where exp_id = " + tid, defaultResultHandler, defaultErrorHandler);
    }

    function UpdateTasks(eamt, eid){
      return promisedQuery("UPDATE expensee SET exp_amt='" + eamt + "' WHERE exp_id = " + eid, defaultResultHandler, defaultErrorHandler);
    }

   function getUser() {
     return promisedQuery('SELECT * FROM usere', defaultResultHandler1, defaultErrorHandler);

   }
    function getTasks(){
      return promisedQuery('SELECT * FROM expensee', defaultResultHandler, defaultErrorHandler);
    }


    function defaultResultHandler1(deferred) {
      return function(tx, result) {
        var len = result.rows.length;

        var output_results = [];

        for (var i=0; i<len; i++){
          var t = {'user_id':result.rows.item(i).user_id,'user_name':result.rows.item(i).user_name,'exp_budget':result.rows.item(i).exp_budget};
          output_results.push(t);
        }

        deferred.resolve(output_results);
      }
    }

    function defaultResultHandler(deferred) {
      return function(tx, results) {
        var len = results.rows.length;
        var output_results = [];

        for (var i=0; i<len; i++){
          var t = {'exp_id':results.rows.item(i).exp_id,'exp_category':results.rows.item(i).exp_category,'exp_date':results.rows.item(i).exp_date,'exp_name':results.rows.item(i).exp_name,'exp_amt':results.rows.item(i).exp_amt,'exp_target':results.rows.item(i).exp_target};
          output_results.push(t);
        }

        deferred.resolve(output_results);
      }
    }

    function defaultErrorHandler(deferred) {
      return function(tx, results) {
        var len = 0;
        var output_results = '';
        deferred.resolve(output_results);
      }
    }

    function promisedQuery(query, successCB, errorCB) {
      var deferred = $q.defer();
      db.transaction(function(tx){
        tx.executeSql(query, [], successCB(deferred), errorCB(deferred));
      }, errorCB);
      return deferred.promise;
    }

    return {
      setup: function() {
        return createDB();
      },
      setIniTarget: function() {
        return setIniTarget();
      },
      setFixedExpense: function(e_name,e_amt) {
        return setFixedExpense(e_name,e_amt);
      },
      setCreditCard: function(e_name,e_amt) {
        return setCreditCard(e_name,e_amt);
      },
      setFuel: function(e_amt) {
        return setFuel(e_amt);
      },
      setGrocery: function(e_amt) {
        return setGrocery(e_amt);
      },
      setParking: function(e_amt) {
        return setParking(e_amt);
      },
      setShopping: function(e_name,e_amt) {
        return setShopping(e_name,e_amt);
      },
      setEnt: function(e_name,e_amt) {
        return setEnt(e_name,e_amt);
      },
      setMisc: function(e_name,e_amt) {
        return setMisc(e_name,e_amt);
      },
      setGL: function (e_name) {
        return setGrocerylist(e_name);
      },
      delTarget: function () {
        return delTarget();
      },
      setTarget: function (e_amt) {
        return setTarget(e_amt);
      },
      delGL: function (e_name) {
        return delGrocerylist(e_name);
      },
      del: function(taskid) {
        return delTasks(taskid);
      },
      edit: function(e_amt,expid) {
        return UpdateTasks(e_amt, expid);
      },
      all: function() {
        return getTasks();
      },
      user: function() {
        return getUser();
      }
    }
  });

