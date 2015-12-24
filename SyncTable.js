

var SyncTable = function (initVar) {
	var divID = initVar.divID;
	var header = initVar.header;
	var data;// = initVar.data;
	var getDataURL = initVar.getDataURL;
	var updateDataURL = initVar.updateDataURL;
	var deleteDataURL = initVar.deleteDataURL;
	var tableClassList = initVar.tableClassList;
	var PrimaryKeyColumnIndex = initVar.PrimaryKeyColumnIndex;
	var PrimaryKeyVisible = initVar.PrimaryKeyVisible;
	var changedRowTracker = {};
	var deletedRowTracker = {};

	SyncTable.prototype.init = function() {
		var getDataPromise = this.getData();
		var currentInstance = this;
		$.when(getDataPromise).done(function (tdata) {
            data = tdata;
            currentInstance.createTable();
        });

	}


	SyncTable.prototype.createTable = function() {
		this.checkValidity();
		var mainDiv = document.getElementById(divID);
		mainDiv.className = mainDiv.className + " panel panel-info";
		var table = document.createElement("table");
		var subDiv = document.createElement("div");
		subDiv.className = "panel-heading";
		var btnGrpDiv = document.createElement("div");
		btnGrpDiv.className = btnGrpDiv.className + " btn-group";
		var saveChangesButton = document.createElement("button");
		saveChangesButton.innerHTML = "Save Changes";
		saveChangesButton.className = "btn btn-default";
		var reloadButton = document.createElement("button");
		reloadButton.innerHTML = "Reload";
		reloadButton.className = "btn btn-default";

		btnGrpDiv.appendChild(saveChangesButton);
		btnGrpDiv.appendChild(reloadButton);
		subDiv.appendChild(btnGrpDiv);
		mainDiv.appendChild(subDiv);
		mainDiv.appendChild(table);


		var thead = document.createElement("thead");
		var tr = document.createElement("tr");
		thead.appendChild(tr);
		table.appendChild(thead);
		for(var i in header) {
			if(i == PrimaryKeyColumnIndex && PrimaryKeyVisible == false){
				continue;
			}
			var th = document.createElement("th");
			th.appendChild(document.createTextNode(header[i]));
			tr.appendChild(th);
		}
		var th = document.createElement("th");
		//var spanElement = document.createElement("span");
		th.appendChild(document.createTextNode("Actions"));
		tr.appendChild(th);



		var tbody = document.createElement("tbody");
		table.appendChild(tbody);
		for(var d in data){
			var tr = document.createElement("tr");
			tbody.appendChild(tr);
			for(var i in data[d]) {

				if(i == PrimaryKeyColumnIndex && PrimaryKeyVisible == false){
					continue;
				}
				var td = document.createElement("td");
				var text = document.createElement("input");
				text.setAttribute("type","input");
				td.appendChild(text);
				text.setAttribute("readonly",true);

				if(i != PrimaryKeyColumnIndex){

					text.addEventListener("click",function(event){
						this.removeAttribute("readonly");
					});


					text.addEventListener("change",function(event){
						//this.parentNode().paren;
						var tRow = this;
						tRow = getParentTR(tRow);
						if(tRow == null)
							return;
						tRow.className = tRow.className + " success";
						//changedRowTracker.push(tRow);
						changedRowTracker[getRowId(tRow)] = tRow;
						console.log(changedRowTracker);
					});

					text.addEventListener("blur",function(){
						this.setAttribute("readonly",true);	
					});
					//td.setAttribute("onchange","alert();");

				}
				text.setAttribute("value",data[d][i]);
				tr.appendChild(td);
			}
			var td = document.createElement("td");
			//var applySpan = document.createElement("span");
			//applySpan.className = "glyphicon glyphicon-ok";
			//applySpan.setAttribute();
			var deleteSpan = document.createElement("span");
			deleteSpan.className = "glyphicon glyphicon-trash";
			deleteSpan.addEventListener("click",function(event){
				var tRow = this;
				tRow = getParentTR(tRow);
				if(tRow == null)
					return;
				tRow.className = tRow.className + " danger";
				//deletedRowTracker.push(tRow);
				deletedRowTracker[getRowId(tRow)] = tRow;
				console.log(deletedRowTracker);
			});
			//td.appendChild(applySpan);
			td.appendChild(document.createTextNode("  "));
			td.appendChild(deleteSpan);
			tr.appendChild(td);
		}

		for(var i in tableClassList){
			table.className = table.className + " " + tableClassList[i];
		}
	
	}


	SyncTable.prototype.getData = function(){
		var currentInstance = this;
		return $.ajax({ url: getDataURL, type: "get", error: currentInstance.errorFunc  });
	}

	SyncTable.prototype.errorFunc = function (xhr, errorType, exception) {
		console.log(xhr);
	}

	SyncTable.prototype.checkValidity = function(){
		if(data == null || data.length == 0){
			console.log("[Warning] No Data!");
			return;
		}
		if(data[Object.keys(data)[0]].length != header.length){
			console.log("[Warning] header and data tuple length do not match!");
			return;
		}
	}

	var getParentTR = function(object){
		while(object.tagName != "TR"){
			object = object.parentNode;
			if(object == null || object.tagName == "body"){
				alert("Error: Parent tag not found!");
				return null;
			}
		}
		return object;
	}

	var getRowId = function(row){

		var childTdList = row.childNodes;
		return childTdList[PrimaryKeyColumnIndex].childNodes[0].value;

	}

}



