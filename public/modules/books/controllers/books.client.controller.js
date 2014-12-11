'use strict';

// Books controller
var bookApp = angular.module('books');

bookApp.controller('BooksController'
    , function($scope, $timeout, $stateParams, $location, $modal, $log,
        $translate, $filter, Authentication, Shelves, Genres, BooksAPI) {
    $scope.authentication = Authentication;
    $scope.shelves = Shelves.query();
    $scope.genres = Genres.query();

    $scope.data = {
      shelves: [],
      alert: null,
      masterBooks: [],
      flattenBooks: [],
      filteredBooks: [],
      search: {
        books: [],
        hide: true,
        start: false
      }
    };

    $scope.pagination = {
      currentPage: 1,
      maxSize: 5,
      itemsPerPage: 25
    };

    $scope.filter = {
      itemsPerPage: $scope.pagination.itemsPerPage
    };

    $scope.$watchCollection('filter', function(newVal, oldVal) {
      if (newVal === oldVal) return;

      $scope.pagination.currentPage = 1;
      $scope.pagination.itemsPerPage = $scope.filter.itemsPerPage;
      $scope.data.flattenBooks = $filter('customFilter')($scope.data.masterBooks, newVal);
      $scope.pagination.totalItems = $scope.data.flattenBooks.length;
      $scope.pageChanged();
    });

    $scope.pageChanged = function() {
      var begin = (($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage)
        , end = begin + $scope.pagination.itemsPerPage;

      var firstOnPage = 1 + begin;
      var lastOnPage = firstOnPage + $scope.pagination.itemsPerPage - 1;
      if (lastOnPage > $scope.data.flattenBooks.length) {
        lastOnPage = $scope.data.flattenBooks.length;
      }

      $scope.pagination.firstOnPage = firstOnPage;
      $scope.pagination.lastOnPage = lastOnPage;

      $scope.data.filteredBooks = $scope.data.flattenBooks.slice(begin, end);
    };

    // Create new Book
    $scope.create = function(data, skipAlert) {
      Shelves.get({ shelfId: data.shelf._id }).$promise.then(function(shelf) {
        var book = {
          isbn: data.isbn,
          title: data.title,
          author: data.author,
          publishedDate: data.publishedDate,
          description: data.description,
          pageCount: data.pageCount,
          thumbnail: data.thumbnail,
          coverColour: data.coverColour,
          fontColour: data.fontColour,
          genre: data.genre[0]._id
        };

        shelf.$createBook(book,
          function(response) {
            $scope.find();

            // TODO: service for alerts
            if (!skipAlert) {
              $translate('Book has been created.').then(function (alert) {
                $scope.data.alert = alert;

                $timeout(function() {
                  $scope.data.alert = null;
                }, 3000);
              });
            }
          },
          function(errorResponse) {
            $scope.error = errorResponse.data.message;
          });
      });
    };

    // Remove existing Book
    $scope.remove = function(data, skipAlert) {
      Shelves.get({ shelfId: data.shelf._id }).$promise.then(function(shelf) {
        shelf.$deleteBook({ 'bookId': data._id},
          function(response) {
            $scope.find();
            // TODO: service for alerts
            if (!skipAlert) {
              $translate('Book has been deleted.').then(function (alert) {
                $scope.data.alert = alert;

                $timeout(function() {
                  $scope.data.alert = null;
                }, 3000);
              });
            }
          },
          function(errorResponse) {
            $scope.error = errorResponse.data.message;
        });
      });
    };

    // Update existing Book
    $scope.update = function(data) {
      Shelves.get({ shelfId: data.shelf._id }).$promise.then(function(shelf) {

        // Get shelf for this book to check if it shelf hasnt changed
        Shelves.byBook({ bookId: data._id}).$promise.then(function(currentShelf) {
          if (shelf._id !== currentShelf[0]._id) {
            // Shelf has changed
            // Delete the book from the currentShelf
            var currentData = {};
            currentData = angular.copy(data);
            currentData.shelf = currentShelf[0];

            $scope.remove(currentData, true);

            // Create book in the shelf
            $scope.create(data, true);

            $translate('Book has been updated.').then(function (alert) {
              $scope.data.alert = alert;

              $timeout(function() {
                $scope.data.alert = null;
              }, 3000);
            });
          } else {
            shelf.$updateBook({ 'bookId': data._id,
              isbn: data.isbn,
              title: data.title,
              author: data.author,
              publishedDate: data.publishedDate,
              description: data.description,
              pageCount: data.pageCount,
              thumbnail: data.thumbnail,
              coverColour: data.coverColour,
              fontColour: data.fontColour,
              genre: data.genre[0]._id
            },
            function(response) {
              $scope.find();

              // TODO: service for alerts
              $translate('Book has been updated.').then(function (alert) {
                $scope.data.alert = alert;

                $timeout(function() {
                  $scope.data.alert = null;
                }, 3000);
              });
            },
            function(errorResponse) {
              $scope.error = errorResponse.data.message;
            });
          }
        });
      });
    };

    // Find a list of Books
    $scope.find = function() {
      var newBook = {};

      Shelves.query().$promise.then(function(shelves) {
        $scope.data.masterBooks = [];

        shelves.forEach(function(shelf) {
          if (shelf.books.length > 0) {
            shelf.books.forEach(function(book) {
              newBook = {
                shelf: {
                  _id: shelf._id,
                  name: shelf.name
                }
              };

              angular.extend(newBook, book);
              $scope.data.masterBooks.push(newBook);
            });
          }

          $scope.data.flattenBooks = $filter('customFilter')($scope.data.masterBooks, $scope.filter);
          $scope.pagination.totalItems = $scope.data.flattenBooks.length;
        });

        $scope.pageChanged();
      });
    };

    $scope.addShelf = function() {
      Shelves.save({}, {name: $scope.formData.newshelf}, function(response) {
        $scope.shelves = Shelves.query(function(shelf) {
          // Preselect shelf with newly created item
          $scope.formData.shelf = shelf[0];
        });
      }, function(errorResponse) {
        $scope.errorResponse = errorResponse.data.message;
      });
    };

    $scope.addGenre = function() {
      Genres.save({}, {name: $scope.formData.newgenre}, function(response) {
        $scope.genres = Genres.query(function(genres) {
          // Preselect genre with newly created item
          $scope.formData.genre[0] = genres[0];
        });
      }, function(errorResponse) {
        $scope.errorResponse = errorResponse.data.message;
      });
    };

    $scope.modalUpdate = function (size, selectedBook) {
      var modalInstance = $modal.open({
        templateUrl: 'modules/books/views/edit-book.client.view.html',
        controller: function($scope, $modalInstance, book) {
          Shelves.byBook({ bookId: book._id}, function(shelf) {
            $scope.formData = book;
            $scope.formData.shelf = shelf[0];
          });

          $scope.ok = function () {
            if (this.form.editBookForm.$valid) {
              $modalInstance.close($scope.formData);
            } else {
              $translate('Please fill or required fields').then(function (requiredFields) {
                $scope.error = requiredFields;
              });
            }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size,
        resolve: {
          book: function () {
            return selectedBook;
          }
        }
      });

      modalInstance.result.then(function (formData) {
        $scope.update(formData);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.modalDelete = function (size, selectedBook) {
      var modalInstance = $modal.open({
        templateUrl: 'modules/books/views/delete-book.client.view.html',
        controller: function($scope, $modalInstance, book) {
          $scope.formData = book;

          $scope.ok = function () {
            $modalInstance.close($scope.formData);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size,
        resolve: {
          book: function () {
            return selectedBook;
          }
        }
      });

      modalInstance.result.then(function (formData) {
        $scope.remove(formData);
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.modalCreate = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'modules/books/views/create-book.client.view.html',
        controller: function($scope, $modalInstance) {
          $scope.formData = { };
          $scope.formData.fontColour = '#FFFFFF';
          $scope.formData.coverColour = '#000000';

          $scope.ok = function () {
            if (this.form.createBookForm.$valid) {
              $modalInstance.close($scope.formData);
            } else {
              $translate('Please fill or required fields').then(function (requiredFields) {
                $scope.error = requiredFields;
              });
            }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size
      });

      modalInstance.result.then(function (formData) {
        $scope.create(formData);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.executeSearch = function(subQuery) {
      $scope.data.search.start = true;
      BooksAPI.searchBooks(subQuery + $scope.formData.isbn, function (error, data) {
        if (!error) {
          $scope.data.search.hide = false;
          $scope.data.search.books = data.items ? data.items : [];
        }
        $scope.data.search.start = false;
      });
    };

    $scope.closeSearch = function() {
      $scope.data.search.hide = true;
      $scope.data.search.books = [];
    };

    $scope.loadBook = function(book) {
      var bookInfo = book.volumeInfo;
      $scope.formData.title = bookInfo.title || '';
      $scope.formData.author = bookInfo.authors ? bookInfo.authors.join(', ') : '';
      $scope.formData.pageCount = bookInfo.pageCount || 0;
      $scope.formData.publishedDate = bookInfo.publishedDate || '';
      $scope.formData.thumbnail = bookInfo.imageLinks ? bookInfo.imageLinks.smallThumbnail : '';
    };

    $scope.format = function(field) {
      // TODO:
      if (field === 'isbn') {
        $scope.formData[field] = $scope.formData[field].replace(/-/g, '');
      }
    };

    // Load books
    $scope.find();
  }
);

bookApp.filter('customFilter', function () {
    return function (items, filter) {
      var filteredItems = []
        , query
        , title
        , author
        , skip;

      if (!filter) return items;


      items.forEach(function(item) {
        skip = false;
        title = item.title.toUpperCase();
        author = item.author.toUpperCase();

        if (filter.genre && filter.genre.name) {
          if (item.genre[0].name !== filter.genre.name) {
            skip = true;
          }
        }

        if (filter.shelf && filter.shelf.name) {
          if (item.shelf.name !== filter.shelf.name) {
            skip = true;
          }
        }

        if (filter.query) {
          query = filter.query.toUpperCase();

          if (!~title.indexOf(query) && !~author.indexOf(query)) {
            skip = true;
          }
        }

        if (!skip) filteredItems.push(item);
      });

      return filteredItems;
    };
});