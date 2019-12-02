module.exports = function (app) {
  app.config([
    'formioComponentsProvider',
    function (formioComponentsProvider) {
      var isNumeric = function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      };
      formioComponentsProvider.register('prism', {
        title: 'Prism',
        template: 'formio/components/prism.html',
        group: 'advanced',
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
      $templateCache.put('formio/components/prism.html', FormioUtils.fieldWrap(
        "<div class=\"range-container-prism\"\n>\n" +
        "<div class=\"prism\"\n>\n" +
        "<input\n type=\"range\"\n string-to-number\n class=\"form-control\"\n ng-model=\"data[component.key]\"\n  id=\"{{ componentId }}\"\n  name=\"{{ componentId }}\"\n  tabindex=\"{{ component.tabindex || 0 }}\"\n min=\"{{ component.validate.min }}\"\n  ng-disabled=\"readOnly\"\n  safe-multiple-to-single\n min=\"{{ component.validate.min }}\"\n  max=\"{{ component.validate.max }}\"\n step=\"{{ component.validate.step }}\"\n  ui-options=\"uiMaskOptions\"\n>\n" +
        "<div class=\"me\"\n>\n" +
        "<div class=\"me-circle\"\n>\n" +
        "<div class=\"me-text\">\n {{ component.inline }}\n</div>\n" +
        "</div>\n" +
        "</div>\n" +
        "</div>\n" +
        "<div class=\"prism-input\"\n>\n" +
        "<input\n  type=\"text\"\n   class=\"form-control\"\n  id=\"{{ componentId }}\"\n  name=\"{{ componentId }}\"\n  tabindex=\"{{ component.tabindex || 0 }}\"\n  ng-model=\"data[component.key]\"\n   ng-disabled=\"readOnly\"\n  safe-multiple-to-single\n  min=\"{{ component.validate.min }}\"\n  max=\"{{ component.validate.max }}\"\n  step=\"{{ component.validate.step }}\"\n  placeholder=\"{{ component.placeholder | formioTranslate:null:builder }}\"\n  custom-validator=\"component.validate.custom\"\n  ui-mask=\"{{ component.inputMask }}\"\n  ui-mask-placeholder=\"\"\n  ui-options=\"uiMaskOptions\"\n>\n" +
        "</div>\n" +
        "</div>\n"
      ));
    }
  ]);
};