var isNaN = require('lodash/isNaN');
var isFinite = require('lodash/isFinite');
var isEmpty = require('lodash/isEmpty');

module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'formio-wizard.html',
    scope: {
      src: '=?',
      url: '=?',
      formAction: '=?',
      form: '=?',
      submission: '=?',
      readOnly: '=?',
      hideComponents: '=?',
      disableComponents: '=?',
      formioOptions: '=?',
      options: '=?',
      storage: '=?'
    },
    link: function(scope, element) {
      // From https://siongui.github.io/2013/05/12/angularjs-get-element-offset-position/
      var offset = function(elm) {
        try {
          return elm.offset();
        }
        catch (e) {
          // Do nothing...
        }
        var rawDom = elm[0];
        var _x = 0;
        var _y = 0;
        var body = document.documentElement || document.body;
        var scrollX = window.pageXOffset || body.scrollLeft;
        var scrollY = window.pageYOffset || body.scrollTop;
        _x = rawDom.getBoundingClientRect().left + scrollX;
        _y = rawDom.getBoundingClientRect().top + scrollY;
        return {
          left: _x,
          top: _y
        };
      };

      scope.wizardLoaded = false;
      scope.wizardTop = offset(element).top;
      if (scope.wizardTop > 50) {
        scope.wizardTop -= 50;
      }
      scope.wizardElement = angular.element('.formio-wizard', element);
    },
    controller: [
      '$scope',
      '$compile',
      '$element',
      'Formio',
      'FormioScope',
      'FormioUtils',
      '$http',
      '$timeout',
      '$localStorage',
      'dataService',
      'IsSaved',
      '$rootScope',
      '$stateParams',
      function(
        $scope,
        $compile,
        $element,
        Formio,
        FormioScope,
        FormioUtils,
        $http,
        $timeout,
        $localStorage,
        dataService,
        IsSaved,
        $rootScope,
        $stateParams
      ) {
        $scope.options = $scope.options || {};
        Formio.setScopeBase($scope);
        var session = ($scope.storage && !$scope.readOnly) ? localStorage.getItem($scope.storage) : false;
        if (session) {
          session = angular.fromJson(session);
        }

        var storedData = {};
        var storage = {
          getItem: function(key) {
            if ($scope.options.noStorage) {
              return storedData[key];
            }
            try {
              var value = localStorage.getItem(key);
              return value ? JSON.parse(value) : false;
            }
            catch (err) {
              console.warn('error parsing json from localstorage', err);
            }
          },
          setItem: function(key, value) {
            if ($scope.options.noStorage) {
              storedData[key] = value;
              return;
            }
            if (typeof value !== 'string') {
              value = JSON.stringify(value);
            }
            localStorage.setItem(key, value);
          }
        };

        var session = ($scope.storage && !$scope.readOnly) ? localStorage.getItem($scope.storage) : false;
        if (session) {
            session = angular.fromJson(session);
        }
        $scope.showNextButton = true;
        //console.log($stateParams);
        $scope.$on('isPDF', function (e) {
           console.log(e)
        });
        if($stateParams.isPDF === 'true'){
            console.log('lksdfjlaskfjaöslkfja'+$stateParams.isPDF)
             $scope.isPDF = true;
        }
        if($stateParams.isPDF === 'false'){
       //     console.log('lksdfjlaskfjaöslkfja'+$stateParams.isPDF)
             $scope.isPDF = false;
        }
        //dataService.srcChange = false;
        $scope.formio = null;
        $scope.url = $scope.url || $scope.src;
        $scope.page = {};
        $scope.pages = [];
        $scope.hasTitles = false;
        $scope.colclass = '';

        if (!$scope.submission || !Object.keys($scope.submission).length) {
            // $scope.submission = session ? {data: session.data} : {data: {}};
        }
        // console.log($scope.submission);
        //$scope.currentPage = session ? session.page : 0;
        $scope.cPage = [];
        $scope.formioAlerts = [];
        $scope.currentPage = dataService.obj.currentPage || 0;
        console.log($scope.currentPage);
        for (var i = 0;i<$scope.currentPage;++i){
            $scope.cPage.push(i);
           // console.log($scope.cPage)
        }

        var getForm = function() {
            var element = $element.find('#formio-wizard-form');
            if (!element.length) {
                return {};
            }
            return element.children().scope().formioForm;
        };

        $scope.submission.data = dataService.obj.submissionData;
        $scope.surveyTitle = $scope.form.transTitle[$localStorage.lang]
        $rootScope.$on('$translateChangeSuccess', function (event) {
            $scope.surveyTitle = $scope.form.transTitle[$localStorage.lang]
        })

        console.log($scope.form.transTitle[$localStorage.lang]);
        dataService.obj.transTitle = $scope.form.transTitle[$localStorage.lang];
        var showPage = function(scroll,zwischenspeichern) {
            dataService.obj.transTitle = $scope.form.transTitle[$localStorage.lang];
            $scope.wizardLoaded = false;
            $scope.page.components = [];
            $scope.page.components.length = 0;
            $timeout(function() {
                // If the page is past the components length, try to clear first.
                if ($scope.currentPage >= $scope.pages.length) {
                    $scope.clear();
                }
                /*if ($scope.storage && !$scope.readOnly) {
                 localStorage.setItem($scope.storage, angular.toJson({
                 page: $scope.currentPage,
                 data: $scope.submission.data
                 }));
                 }*/
                $scope.showCurrentSection =  $scope.form[$localStorage.lang][$scope.currentPage].title
                $scope.page.components = $scope.pages[$scope.currentPage].components;
                //console.log($scope.page.components)
                $scope.formioAlerts = [];
                if (scroll) {
                    // window.scrollTo(0, $scope.wizardTop);
                    $scope.$emit('scrollTop',scroll);
                    //$location.hash('scrollTop1');
                    //$anchorScroll();
                }
                $scope.wizardLoaded = true;

                // console.log($scope.pages.length)

                $scope.$emit('wizardPage', $scope.currentPage,$scope.pages.length,$scope.submission.data);
                $scope.submission.data = dataService.obj.submissionData;
               $timeout($scope.$apply.bind($scope));


            });

        };

        $rootScope.$on('$translateChangeSuccess', function (event) {
            console.log($stateParams)
            allPages=[];
            setForm($scope.form)
        });

        if (!$scope.form && $scope.src) {
            (new Formio($scope.src)).loadForm().then(function(form) {
                form.components = form[$localStorage.lang];
                $scope.form = form;
                if (!$scope.wizardLoaded) {
                    showPage();
                }
            })
        }

        // Shows the given alerts (single or array), and dismisses old alerts
        this.showAlerts = $scope.showAlerts = function(alerts) {
            $scope.formioAlerts = [].concat(alerts);
        };

        $scope.clear = function() {
            if ($scope.storage && !$scope.readOnly) {
                //dataService.obj.submissionData = {};
                $scope.submission.data = {};
                dataService.obj.perc = "0";
                dataService.obj.ongoing = true;
                dataService.obj.currentPage = 0;
                localStorage.setItem($scope.storage, '');
            }
            $scope.submission = {data: {}};
            $scope.currentPage = 0;
        };
        // Check for errors.
        $scope.checkErrors = function() {
            if (false) { // !$scope.isValid()
                // Change all of the fields to not be pristine.
                angular.forEach($element.find('[name="formioForm"]').find('*'), function(element) {
                    var elementScope = angular.element(element).scope();
                    if (!elementScope || !elementScope.component) {
                        return;
                    }
                    var fieldForm = elementScope.formioForm;
                    if (!fieldForm) {
                        return;
                    }
                    if (fieldForm[elementScope.component.key]) {
                        fieldForm[elementScope.component.key].$pristine = false;
                    }
                });
                $scope.formioAlerts = [{
                    type: 'danger',
                    message: 'Bitte füllen Sie alle Pflichtfelder die mit einem "*" gekenntzeichnet sind aus um fortzufahren.'
                }];
                return true;
            }
            return false;
        };
        // Submit the submission.
        $scope.submit = function() {
            if ($scope.checkErrors()) {
                return;
            }
            // Create a sanitized submission object.
            var submissionData = {data: {}};
            if ($scope.submission._id) {
                submissionData._id = $scope.submission._id;
            }
            if ($scope.submission.data._id) {
                submissionData._id = $scope.submission.data._id;
            }
            var grabIds = function(input) {
                if (!input) {
                    return [];
                }
                if (!(input instanceof Array)) {
                    input = [input];
                }

                var final = [];
                input.forEach(function(element) {
                    if (element && element._id) {
                        final.push(element._id);
                    }
                });

                return final;
            };

            var defaultPermissions = {};
            FormioUtils.eachComponent($scope.form.components, function(component) {
                if (component.type === 'resource' && component.key && component.defaultPermission) {
                    defaultPermissions[component.key] = component.defaultPermission;
                }
                if (submissionData.data.hasOwnProperty(component.key) && (component.type === 'number')) {
                    var value = $scope.submission.data[component.key];
                    if (component.type === 'number') {
                        submissionData.data[component.key] = value ? parseFloat(value) : 0;
                    }
                    else {
                        submissionData.data[component.key] = value;
                    }
                }
            }, true);

            angular.forEach($scope.submission.data, function(value, key) {
                submissionData.data[key] = value;

                // Setup the submission access.
                var perm = defaultPermissions[key];
                if (perm) {
                    submissionData.access = submissionData.access || [];

                    // Coerce value into an array for plucking.
                    if (!(value instanceof Array)) {
                        value = [value];
                    }

                    // Try to find and update an existing permission.
                    var found = false;
                    submissionData.access.forEach(function(permission) {
                        if (permission.type === perm) {
                            found = true;
                            permission.resources = permission.resources || [];
                            permission.resources.concat(grabIds(value));
                        }
                    });

                    // Add a permission, because one was not found.
                    if (!found) {
                        submissionData.access.push({
                            type: perm,
                            resources: grabIds(value)
                        });
                    }
                }
            });
            // Strip out any angular keys.
            submissionData = angular.copy(submissionData);

            var submitEvent = $scope.$emit('formSubmit', submissionData);
            if (submitEvent.defaultPrevented) {
                // Listener wants to cancel the form submission
                return;
            }

            var onDone = function(submission) {
                if ($scope.storage && !$scope.readOnly) {
                    localStorage.setItem($scope.storage, '');
                }
                $scope.showAlerts({
                    type: 'success',
                    message: 'Submission Complete!'
                });
                $scope.$emit('formSubmission', submission);
            };

            // Save to specified action.
            if ($scope.action) {
                var method = submissionData._id ? 'put' : 'post';
                $http[method]($scope.action, submissionData).then(function(submission) {
                    Formio.clearCache();
                    onDone(submission);
                }, FormioScope.onError($scope, $element));
            }
            else if ($scope.formio && !$scope.formio.noSubmit) {
                $scope.formio.saveSubmission(submissionData).then(onDone).catch(FormioScope.onError($scope, $element));
            }
            else {
                onDone(submissionData);
            }
        };
        $scope.$on('SurveysetDefault',function(event){
            $scope.cancel();
        })
        $scope.cancel = function() {
            $scope.clear();
            showPage(true);
            $scope.$emit('cancel');
        };
        $scope.$on('onStartSurvey',function (event) {
            $scope.showNextButton = true;
            $scope.next();
        })
        $scope.$on('deleteOnStartSurvey',function (event) {
            $scope.showNextButton = false;

        })

        // Move onto the next page.
        $scope.next = function() {

            if ($scope.checkErrors()) {
                return;
            }
            if ($scope.currentPage >= ($scope.pages.length - 1)) {
                return;
            }

            if($scope.currentPage == $scope.cPage.length){
            $scope.cPage.push( $scope.currentPage);

            }
            $scope.currentPage++;
            showPage(true);
            dataService.obj.submissionData = $scope.submission.data
            //console.log($scope.submission)
            $scope.$emit('wizardNext', $scope.currentPage,$scope.submission);


        };
        // Save Function when trigger Next Button
        $scope.speichern = function(currentSave) {
            IsSaved.save = currentSave

            dataService.obj.submissionData = $scope.submission.data;

            $scope.$emit('wizardPage', $scope.currentPage,$scope.pages.length,$scope.submission.data);
           // showPage(true,true);
            $scope.$emit('wizardNext', $scope.currentPage,$scope.submission);
            console.log($scope.currentPage);


        };

        // Move onto the previous page.
        $scope.prev = function() {

            if ($scope.currentPage < 1) {
                return ;
            }

            $scope.currentPage--;
            showPage(true);
            dataService.obj.submissionData = $scope.submission.data
            $scope.$emit('wizardPrev', $scope.currentPage,$scope.submission);

        };

        $scope.goto = function(page) {
            if (page < 0) {
                return;
            }
            if (page >= $scope.pages.length) {
                return;
            }

            $scope.currentPage = page;
            if($scope.currentPage !== 0){
                $scope.showNextButton = true;
            }

            showPage(true);
        };

        $scope.isValid = function() {
            return getForm().$valid;
        };

        $scope.$on('wizardGoToPage', function(event, page) {
            $scope.goto(page);
        });

        var updatePages = function() {
            if ($scope.pages.length > 6) {
                $scope.margin = ((1 - ($scope.pages.length * 0.0833333333)) / 2) * 100;
                $scope.colclass = 'col-sm-1';
            }
            else {
                $scope.margin = ((1 - ($scope.pages.length * 0.1666666667)) / 2) * 100;
                $scope.colclass = 'col-sm-2';
            }
        };

        var allPages = [];
        var hasConditionalPages = false;
        var setForm = function(form) {
            form.components = form[$localStorage.lang];
            $scope.pages = [];
            angular.forEach(form.components, function(component) {
                // Only include panels for the pages.
                if (component.type === 'panel') {
                    if (!$scope.hasTitles && component.title) {
                        $scope.hasTitles = true;
                    }
                    if (component.customConditional) {
                        hasConditionalPages = true;
                    }
                    else if (component.conditional && component.conditional.when) {
                        hasConditionalPages = true;
                    }
                    // Make sure this page is not in the hide compoenents array.

                    if ((component.key) && ($scope.hideComponents) && ($scope.hideComponents.indexOf(component.key) !== -1)) {

                        return;
                    }
                    allPages.push(component);
                    $scope.pages.push(component);
                }
            });
            // var formioUtils = _dereq_('formiojs/utils');
            // FOR-71dataService.GetSurveyCMS($stateParams.surveyTitle).then(function (res) {
            dataService.GetSurveyCMS($stateParams.surveyTitle).then(function (res) {
                if(res){
                    // $scope.submission.data = res.survey
                    // dataService.obj.submissionData = res.survey

                    $scope.currentPage = parseInt(res.tags[2]) || 0;
                    //console.log($scope.currentUser)

                }
                //console.log($scope.submission.data)
            })

            if (!$scope.builder && hasConditionalPages) {
                $scope.$watch('submission.data', function(data) {
                    var newPages = [];
                    angular.forEach(allPages, function(page) {
                        if (FormioUtils.isVisible(page, null, data)) {
                              //console.log(page);
                            newPages.push(page);
                        }
                    });

                    $scope.pages = newPages;
                    updatePages();
                    setTimeout($scope.$apply.bind($scope), 10);
                }, true);
            }

            $scope.form = $scope.form ? angular.merge($scope.form, angular.copy(form)) : angular.copy(form);
            $scope.page = angular.copy(form);
            $scope.page.display = 'form';
            $scope.$emit('wizardFormLoad', form);
            updatePages();
            showPage();
        };

        // FOR-71
        if (!$scope.builder) {
            $scope.$watch('form', function(form) {
                if (
                    $scope.src ||
                    !form ||
                    !Object.keys(form).length ||
                    !form.components ||
                    !form.components.length
                ) {
                    return;
                }
                var formUrl = form.project ? '/project/' + form.project : '';
                formUrl += '/form/' + form._id;
                $scope.formio = new Formio(formUrl);
                setForm(form);
            });
        }



        // When the components length changes update the pages.
        $scope.$watch('form.components.length', updatePages);

        // Load the form.
        if ($scope.src) {
            $scope.formio = new Formio($scope.src);
            $scope.formio.loadForm().then(function(form) {
                form.components = form[$localStorage.lang];
                setForm(form);
            });
        }
        else {
            $scope.src = '';
            $scope.formio = new Formio($scope.src);
        }
      }
    ]
  };
};
