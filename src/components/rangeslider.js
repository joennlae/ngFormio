module.exports = function (app) {
  app.config([
    'formioComponentsProvider',
    function (formioComponentsProvider) {
      var isNumeric = function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      };
      formioComponentsProvider.register('rangeslider', {
        title: 'Range Slider',
        template: 'formio/components/rangeslider.html',
        settings: {
          input: true,
          tableView: true,
          inputType: 'text',
          label: '',
          key: 'numberField',
          placeholder: '',
          prefix: '',
          suffix: '',
          defaultValue: '',
          protected: false,
          persistent: true,
          validate: {
            required: false,
            min: '',
            max: '',
            step: 'any',
            integer: '',
            multiple: '',
            custom: ''
          }
        },
        controller: ['$scope', function ($scope) {
          if ($scope.builder) return; // FOR-71 - Skip parsing input data.

          // Ensure that values are numbers.
          if (
            $scope.data &&
            $scope.data.hasOwnProperty($scope.component.key) &&
            isNumeric($scope.data[$scope.component.key])
          ) {
            $scope.data[$scope.component.key] = parseFloat($scope.data[$scope.component.key]);
          }
        }]
      });
    }
  ]);

  app.run([
    '$templateCache',
    'FormioUtils',
    function ($templateCache, FormioUtils) {
      $templateCache.put('formio/components/rangeslider.html', FormioUtils.fieldWrap(
        "<div class=\"range-container\"\n>\n" +
        "<div class=\"range-hack\"\n>\n" +
        "<div class=\"range-col-50\"\n>\n {{ component.validate.min }} </div>\n" +
        "<div class=\"range-col-50\"\n>\n <span class=\"pull-right\"\n>\n{{ component.validate.max }} </span>\n" +
        "</div>\n" +
        "<input\n type=\"range\"\n string-to-number\n class=\"form-control\"\n ng-model=\"data[component.key]\"\n  id=\"{{ componentId }}\"\n  name=\"{{ componentId }}\"\n  tabindex=\"{{ component.tabindex || 0 }}\"\n min=\"{{ component.validate.min }}\"\n  ng-disabled=\"readOnly\"\n  safe-multiple-to-single\n min=\"{{ component.validate.min }}\"\n  max=\"{{ component.validate.max }}\"\n step=\"{{ component.validate.step }}\"\n  ui-options=\"uiMaskOptions\"\n>\n" +
        "<div ng-class=\"component.inline ? 'block-it' : 'none-it'\">\n" +
        "<div class=\"col-20-smiley left-it\"><div class=\"icon-sad-face-eyebrows\"></div>\n </div>\n" +
        "<div class=\"col-20-smiley center-it\"><div class=\"icon-sad-face\"></div>\n </div>\n" +
        "<div class=\"col-20-smiley center-it\"><div class=\"icon-neutral-face\"></div>\n </div>\n" +
        "<div class=\"col-20-smiley center-it\"><div class=\"icon-smiling-face\"></div>\n </div>\n" +
        "<div class=\"col-20-smiley right-it\"><div class=\"icon-laughing-face\"></div>\n </div>\n" +
        "</div>\n" +
        "<input\n  type=\"text\"\n   class=\"form-control\"\n  id=\"{{ componentId }}\"\n  name=\"{{ componentId }}\"\n  tabindex=\"{{ component.tabindex || 0 }}\"\n  ng-model=\"data[component.key]\"\n   ng-disabled=\"readOnly\"\n  safe-multiple-to-single\n  min=\"{{ component.validate.min }}\"\n  max=\"{{ component.validate.max }}\"\n  step=\"{{ component.validate.step }}\"\n  placeholder=\"{{ component.placeholder | formioTranslate:null:builder }}\"\n  custom-validator=\"component.validate.custom\"\n  ui-mask=\"{{ component.inputMask }}\"\n  ui-mask-placeholder=\"\"\n  ui-options=\"uiMaskOptions\"\n>\n" +
        "</div>\n" +
        "</div>\n"
      ));
    }
  ]);
};