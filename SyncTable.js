/*
The MIT License (MIT)

Copyright (c) 2016 Ronil Vinod Mehta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// ****************** Created By Ronil Mehta ****************** \\



var SyncTable = function (initVar) {
	var currentInstance = this;
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
	var inputType = initVar.inputType;
	var table;

	SyncTable.prototype.init = function() {
		checkCompulsaryInputsAndSetDefaultValues();
		purgeTrackerVariables();
		var getDataPromise = getData();
		var currentInstance = this;
		$.when(getDataPromise).done(function (tdata) {
            data = tdata;
            currentInstance.createTable();
        });

	}


	SyncTable.prototype.createTable = function() {
		checkValidity();
		var mainDiv = document.getElementById(divID);
		mainDiv.innerHTML = "";
		mainDiv.className = mainDiv.className + " panel panel-info";

		table = document.createElement("table");

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

		createListenersForButtons(saveChangesButton,reloadButton);

		createTableHead();
		createTableBody();

		for(var i in tableClassList){
			table.className = table.className + " " + tableClassList[i];
		}
	
	}


	var getData = function(){
		var currentInstance = this;
		return $.ajax({ url: getDataURL, type: "get", error: errorHandlerForUnsuccessfulGet  });
	}
	var updateData = function(){
		var currentInstance = this;
		console.log("Implement updateData()");
		//TODO: add logic to convert row tuples in UpdateTracker variable to JSON objects and then send  {id1:rowObject1,id2:rowObject2 .....}  object to server
		//return $.ajax({ url: UpdateDataURL, type: "get", error: errorHandlerForUnsuccessfulUpdate  });
	}
	var deleteData = function(){
		var currentInstance = this;
		console.log("Implement deleteData()");
		//TODO: add logic to convert row tuples in DeleteTracker variable to JSON objects and then send  {id1:rowObject1,id2:rowObject2 .....}  object to server
		//return $.ajax({ url: deleteDataURL, type: "get", error: errorHandlerForUnsuccessfulDelete  });
	}


	var errorFunc = function (xhr, errorType, exception) {
		console.log(xhr);
	}

	var errorHandlerForUnsuccessfulGet = function (xhr, errorType, exception) {
		console.log("Implement errorHandlerForUnsuccessfulGet()");
		//TODO: Add actions for Unsuccessful get
		console.log(xhr);
	}

	var errorHandlerForUnsuccessfulUpdate = function (xhr, errorType, exception) {
		console.log("Implement errorHandlerForUnsuccessfulUpdate()");
		//TODO: Add actions for Unsuccessful Update (Remeber to add currentInstance.init(); in the end)
		console.log(xhr);
	}

	var errorHandlerForUnsuccessfulDelete = function (xhr, errorType, exception) {
		console.log("Implement errorHandlerForUnsuccessfulDelete()");
		//TODO: add actions for Unsuccessful Delete (Remember to add currentInstance.init(); in the end)
		console.log(xhr);
	}

	var checkValidity = function(){
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

	var issueSaveChangesRequest = function(){
		console.log(changedRowTracker);
		console.log(deletedRowTracker);
		//TODO: Add logic to send update and delete requests to updateDataURL & deleteDataURL
		var updateDataPromise = updateData();
		var deleteDataPromise = deleteData();
		$.when(updateDataPromise,deleteDataPromise).done(function(updateDataResponse,deleteDataResponse){
			//Todo: Add actions for event when Updates are successful
			//Todo: Add actions for event when  deletes are successful
			currentInstance.init();
		});
	}

	var issueReloadRequest = function(){
		currentInstance.init();
	}	

	var createListenersForButtons = function(saveChangesButton,reloadButton){
		saveChangesButton.addEventListener("click",function(event){
			issueSaveChangesRequest();
		});

		reloadButton.addEventListener("click",function(event){
			issueReloadRequest();
			
		});

	}

	var checkCompulsaryInputsAndSetDefaultValues = function(){
		//TODO: check whether the user passes values of compulsary variables (divID,header,getDataURL,updateDataURL,deleteDataURL,PrimaryKeyColumnIndex,PrimaryKeyVisible);
	}

	var purgeTrackerVariables = function(){
			changedRowTracker = {};
	 		deletedRowTracker = {};
	}

	var createTableHead = function(){
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
	}

	var createTableBody = function(){
		var tbody = document.createElement("tbody");
		table.appendChild(tbody);
		for(var d in data){
			var tr = document.createElement("tr");
			tbody.appendChild(tr);
			for(var i in data[d]) {

				if(i == PrimaryKeyColumnIndex && PrimaryKeyVisible == false){
					continue;
				}
				createAndAppendTextBoxCell(data[d][i],tr,i);

			}

			createAndAppendActionCell(tr);
		}
	}

	var createAndAppendTextBoxCell = function(currentData,currentTr,dataTupleIndex){
		var td = document.createElement("td");
		var text = document.createElement("input");
		text.setAttribute("type","input");
		td.appendChild(text);
		text.setAttribute("readonly",true);

		if(dataTupleIndex != PrimaryKeyColumnIndex){

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
		text.setAttribute("value",currentData);
		currentTr.appendChild(td);
	}

	var createAndAppendActionCell = function(currentTR){
		var td = document.createElement("td");
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
			currentTR.appendChild(td);
	}

}



