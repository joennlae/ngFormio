module.exports = function (app) {
  app.config([
    'formioComponentsProvider',
    function (formioComponentsProvider) {
      formioComponentsProvider.register('timeline', {
        title: 'Timeline',
        template: 'formio/components/timeline.html',
        group: 'advanced',
        settings: {
          input: true,
          inputType: 'text',
          tableView: true,
          dataGridLabel: false,
          defaultValue: false,
          disabled: false,
          hidden: false,
          label: '',
          dialogHeadline: '',
          dialogLabelEvent: '',
          key: 'timeline',
          theme: 'default',
          size: 'md',
          values: [
            {
              label: '',
              value: ''
            }
          ],
          protected: false,
          unique: false,
          persistent: true
        },
        tableView: function (data, options) {
          for (var i in options.component.values) {
            if (options.component.values[i].value === data) {
              return options.component.values[i].label;
            }
          }
          return data;
        },
        controller: ['$scope', '$timeout', 'FormioUtils', 'ngDialog', function ($scope, $timeout, FormioUtils, ngDialog) {


          $scope.showEvent = false;
          $scope.showDate = false;
          $scope.value = '';
          $scope.label = '';

          $scope.showInputs = function (event, date, key) {
            // console.log(key)

            //console.log($scope.data)
            $scope.showEvent = event
            $scope.showDate = date
          }

          $scope.normalDialog = function (dataValue, dataLabel) {

            $scope.value = dataValue;
            $scope.label = dataLabel;
            ngDialog.open({
              template: 'formio/components/dialog_timeline.html',
              className: 'ngdialog-theme-default whitebg',
              scope: $scope,
              width: '400px',
            });
          };
          $scope.save = function (data) {
            console.log(data);
            ngDialog.close();
          }
        }]
      });
    }
  ]);
  app.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('formio/components/dialog_timeline.html',
        '<div style="margin: 20px 0; background-color: #FFFFFF"><span><b>{{component.dialogHeadline}}</b></span>' +
        '<div style="margin-top:20px"><span>{{component.dialogLabelEvent}}</span></div>' +
        '<div style="margin-top: 20px"><span><input type="text" style="width:100%" ng-maxlength="18" placeholder="Jahr" ng-model="data[value].date"></span></div>' +
        '<div style="margin-top:20px"><span><input maxlength="20" style="width:100%;" ng-model="data[value].event" ng-trim="false"></span><span>{{0 + data[value].event.length}} / 20</span></div>' +
        '<div style="margin-top:20px; margin-bottom: 20px"><span><button type="submit" class="btn btn-primary" ng-click="save(data)">OK</span></div>' +
        '</div>'
      );
      $templateCache.put('formio/components/timeline.html',
        "<swiper slides-per-view=\"3\">\n  <slides>\n    <slide ng-repeat=\"v in component.values track by $index\">\n      <div style=\"width: 100%\">\n        <span style=\"margin-top: 20px\" uib-tooltip=\"{{data[v.value].event || v.label}}\">{{data[v.value].event || v.label}}</span>\n        <div class=\"status\">\n          <span class=\"point\" ng-click=\"normalDialog(v.value,v.label)\" uib-tooltip=\"{{data[v.value].event || v.label}}\"></span>\n        </div>\n        <span style=\"margin-top: 20px\" uib-tooltip=\"{{data[v.value].event || v.label}}\">{{data[v.value].date.toDateString() || '______________________'}}</span>\n      </div>\n    </slide>\n\n  </slides>\n  <prev style=\"left:-3px;\" class=\"fa fa-angle-left\"></prev>\n  <next style=\"right: -8px\" class=\"fa fa-angle-right\"></next>\n  <!--<pagination></pagination>-->\n</swiper>\n"
      );
    }
  ]);
};