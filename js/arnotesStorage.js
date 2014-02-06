'use strict';

arnotes.factory('arnotesStorage', function() {
	var STORAGE_ID = 'arnotes';
	
	return {
		load: function() {
			return JSON.parse(localStorage.getItem(STORAGE_ID) || '{}');
		},
		
		save: function(data) {
			localStorage.setItem(STORAGE_ID, JSON.stringify(data));
		}
	};
});
