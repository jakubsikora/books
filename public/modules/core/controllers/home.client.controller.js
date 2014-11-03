'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

    $scope.shelves = [
      {
        name: 'Shelf 1',
        description: 'Stephen King\'s books',
        books: [
          {
            title: 'Green Mile',
            author: 'Stephen King',
            ISBN: ''
          },{
            title: 'Under the dome',
            author: 'Stephen King',
            ISBN: ''
          },{
            title: 'Dreamcatcher',
            author: 'Stephen King',
            ISBN: ''
          },{
            title: 'Misery',
            author: 'Stephen King',
            ISBN: ''
          },{
            title: 'Children of the corn',
            author: 'Stephen King',
            ISBN: ''
          },{
            title: 'Cujo',
            author: 'Stephen King',
            ISBN: ''
          },{
            title: 'The Shining',
            author: 'Stephen King',
            ISBN: ''
          }
        ]
      },{
        name: 'Shelf 2',
        description: 'Travel Guides',
        books: [
          {
            title: 'Barcelona',
            author: 'DK Eyewitness Travel',
            ISBN: ''
          },{
            title: 'Paris',
            author: 'DK Eyewitness Travel',
            ISBN: ''
          },{
            title: 'London',
            author: 'DK Eyewitness Travel',
            ISBN: ''
          },{
            title: 'Thailand',
            author: 'DK Eyewitness Travel',
            ISBN: ''
          },{
            title: 'Budapest',
            author: 'DK Eyewitness Travel',
            ISBN: ''
          },{
            title: 'Brussels',
            author: 'DK Eyewitness Travel',
            ISBN: ''
          },{
            title: 'Rome',
            author: 'DK Eyewitness Travel',
            ISBN: ''
          },{
            title: 'Venice',
            author: 'DK Eyewitness Travel',
            ISBN: ''
          },{
            title: 'Sicily',
            author: 'DK Eyewitness Travel',
            ISBN: ''
          },{
            title: 'Florence',
            author: 'DK Eyewitness Travel',
            ISBN: ''
          },{
            title: 'Dominican Republic',
            author: 'DK Eyewitness Travel',
            ISBN: ''
          }
        ]
      }
    ];


    $scope.flattenBooks = [];
    var booksIndex = 0;

    angular.forEach($scope.shelves, function(shelf) {
      angular.forEach(shelf.books, function(book, i) {
        $scope.flattenBooks.push({
          title: book.title,
          author: book.author,
          ISBN: book.ISBN,
          shelf_name: shelf.name,
          shelf_description: shelf.description,
          book_end: false
        });

        // Insert book end
        if (shelf.books.length - 1 === i) {
          $scope.flattenBooks.push({
            book_end: true
          });
        }
      });
    });
  }
]);