var idb = {
	db : undefined,
    open_db : function ()
    {
		return new Promise(function(resolve,reject)
		{
            window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            if (!window.indexedDB) {
                alert("IndexedDB n’est pas supporté !");
            }
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange


            // Ouvrons notre première base
            var request = window.indexedDB.open("rg65", 1);

            request.onerror = function(event) {
              reject("Pourquoi ne permettez-vous pas à ma web app d'utiliser IndexedDB?!" + event);
            };
            request.onsuccess = function(event) {
            	idb.db = event.target.result;
              	resolve(idb.db);
            };
			request.onupgradeneeded = function(event) {
                idb.db = event.target.result;
			     // Version 1
			     var objectStore = idb.db.createObjectStore("rg65", { keyPath: "nom" });
			};            
		});

    },
    get_list_files : function ()
    {
		return new Promise(function(resolve,reject)
		{
			var listes = [];
            var transaction = idb.db.transaction(["rg65"], "readwrite");
            var objectStore = transaction.objectStore("rg65");
            objectStore.openCursor().onsuccess= function(event) {
					var cursor = event.target.result;
					if (cursor){
						listes.push(cursor.value)
						cursor.continue();
					}
					else
						resolve(listes);
            }
		});
	},
     
    get_file : function (name)
    {
		return new Promise(function(resolve,reject)
		{
            // Regarde si la série est dans la base
            var transaction = idb.db.transaction(["rg65"], "readwrite");
            var objectStore = transaction.objectStore("rg65");
            var request = objectStore.get(name);
            request.onerror = function(event) {
              reject(event);
            };
            request.onsuccess = function(event) {
            	let r = event.currentTarget.result;
            	if (r!= undefined)
            	{
					resolve(r);          		
            	}
            	else
            		reject({msg:"Fichier inconnu", code: code});
            };
		});
    },
    put_file : function (file)
    {
		return new Promise(function(resolve,reject)
		{
            // Regarde si la série est dans la base
            var transaction = idb.db.transaction(["rg65"], "readwrite");
            var objectStore = transaction.objectStore("rg65");
            var request = objectStore.put(file);
            request.onerror = function(event) {
              reject(event);
            };
            request.onsuccess = function(event) {
                resolve(event.result);
            };
		});
    },
    delete_file : function (file)
    {
		return new Promise(function(resolve,reject)
		{
            // Regarde si la série est dans la base
            var transaction = idb.db.transaction(["rg65"], "readwrite");
            var objectStore = transaction.objectStore("rg65");
            var request = objectStore.delete(file);
            request.onerror = function(event) {
              reject(transaction.error);
            };
            request.onsuccess = function(event) {
                resolve("Suppression effectuée");
            };
		});
    },

    sauvegarde : function()
    {
    	return new Promise(function(resolve, reject)
    	{
			let objectStore = idb.db.transaction("rg65").objectStore("rg65");
			let json = "";
			//var msg ="";
			let crs = objectStore.openCursor();
			crs.onsuccess = function(event) {
				var cursor = event.target.result;
				if (cursor) {
					let rg = new rg65(cursor.value);
					json += "\r\n\r\n" + JSON.stringify(rg);
					cursor.continue();
				}
				else{
					resolve(json);
				}
			};
			crs.onerror = function(event) {
				reject(event);
			};

    	});

    },

}