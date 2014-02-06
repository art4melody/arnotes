'use strict';

arnotes.controller('ArnotesCtrl', function ArnotesCtrl($scope, $location, arnotesStorage,
		idService) {
	var storage = arnotesStorage.load();
	var notebooks = $scope.notebooks = storage.notebooks || [];
	$scope.images = storage.images || [];

	var errorCodes = { 
		1	: { level: 'success', message:'Sucess.' },
		101	: { level: 'error', message:'Notebook name is required.' },
		102	: { level: 'error', message:'Notebook name is already exists.' },
		103	: { level: 'error', message:'Notebook name should be alphanumeric.' },
		104	: { level: 'error', message:'Notebook id could not be found.' },
	};
	
	$scope.$watch('notebooks', function() {
		storage.notebooks = notebooks;
		arnotesStorage.save(storage);
	}, true);

	$scope.$watch('images', function() {
		storage.images = $scope.images;
		arnotesStorage.save(storage);
		var test = arnotesStorage.load();
	}, true);
	
	if ($location.path() === '') {
		$location.path('/');
	}
	$scope.location = $location;
	
	var isNotebookExists = function(name) {
		for (notebook in notebooks) {
			if (notebook.name.toLower() == name.toLower()) return true;
		}
		return false;
	};
	
	var getNotebook = function(id) {
		for (notebook in notebooks) {
			if (notebook.id == id) return notebook;
		}
		return null;
	};
	
	var addNotebook = function(notebook) {
		if (!notebook.name.length) return 101;
		if (isNotebookExists(notebook.name)) return 102;
		var pattern = /^[a-z0-9]+$/i;
		if (!pattern.test(notebook.name)) return 103;
		
		notebook.id = idService.create(notebook.name);
		notebook.creationDate = new Date();
		notebook.lastModified = new Date();
		
		notebooks.push(notebook);
		return 1;
	};
	
	var updateNotebook = function(newNotebook) {
		if (!newNotebook.name.length) return 101;
		if (isNotebookExists(newNotebook.name)) return 102;
		var pattern = /^[a-z0-9]+$/i;
		if (!pattern.test(newNotebook.name)) return 103;
		
		newNotebook.lastModified = new Date();
		var notebook = getNotebook(newNotebook.id);
		if (notebook === null) return 104;
		notebook = newNotebook;
		
		return 1;
	};
	
	var deleteNotebook = function(notebook) {
		notebooks.splice(notebooks.indexOf(notebook), 1);
	};
	
	$scope.addNotebook = function() {
		$scope.newNotebookError = '';
		var returnCode = addNotebook({
			name: $scope.newNotebookName,
			desc: $scope.newNotebookDesc
		});
		if (returnCode == 1) {
			$scope.newNotebookName = '';
			$scope.newNotebookDesc = '';
		} else {
			$scope.newNotebookError = errorCodes[returnCode];
		}
		
		return returnCode;
	};
	
	$scope.editNotebook = function(notebook) {
		$scope.editedNotebook = notebook;
	};
	
	$scope.doneEditingNotebook = function(notebook) {
		$scope.editedNotebook = null;
		
	};
	
	$scope.deleteNotebook = function(notebook) {
		return deleteNotebook(notebook);
	};
	
	// if there is no notebook, create 'Unmanaged' notebook
	if (notebooks.length == 0) {
		addNotebook({
			name: 'Unmanaged',
			desc: 'Notebook for unmanaged notes'
		});
	}

	$scope.uploadImage = {};

	$scope.deleteImage = function(image) {
		var index = $scope.images.indexOf(image);
		$scope.images.splice(index, 1);
	}

	$scope.resetImageUpload = function() {
		$scope.uploadImage = {};
		var control = $('#inputImage');
		control.replaceWith(control = control.clone(true));
	}

	$scope.addImage = function() {
		$scope.images.push($scope.uploadImage);
		$scope.uploadImage = {};
	}

	$scope.insertImage = function(image) {
		addImageHandler(image.data, image.name || "Image");
	}

	$scope.imageSelect = function(file) {
		var file = file.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			$scope.$apply(function() {
				$scope.uploadImage.data = e.target.result;
			})
		}
		reader.readAsDataURL(file);
	}
});