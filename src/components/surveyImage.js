var fs = require('fs');

module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(formioComponentsProvider) {
      formioComponentsProvider.register('surveyImage', {
        title: 'Survey Image',
        template: 'formio/components/surveyImages.html',
        group: 'advanced',
        tableView: function(data, options) {
          var view = '<table class="table table-striped table-bordered"><thead>';
          var values = {};
          angular.forEach(options.component.values, function(v) {
            values[v.value] = v.label;
          });
          if (data) {
            angular.forEach(options.component.questions, function(question) {
              view += '<tr>';
              view += '<th>' + question.label + '</th>';
              view += '<td>' + values[data[question.value]] + '</td>';
              view += '</tr>';
            });
          }
          view += '</tbody></table>';
          return view;
        },
        settings: {
          input: true,
          tableView: true,
          label: 'Survey Images',
          key: 'surveyImage',
          questions: [],
          values: [],
          defaultValue: '',
          protected: false,
          persistent: true,
          hidden: false,
          clearOnHide: true,
          validate: {
            required: false,
            custom: '',
            customPrivate: false
          }
        }
      });
    }
  ]);
  app.run([
    '$templateCache',
    'FormioUtils',
    function($templateCache, FormioUtils) {
      $templateCache.put('formio/components/surveyImages.html', FormioUtils.fieldWrap(
        fs.readFileSync(__dirname + '/../templates/components/surveyImages.html', 'utf8')
      ));
    }
  ]);
};
