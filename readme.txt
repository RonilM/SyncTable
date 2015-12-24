Editable table used for client-database interactions.


Usage:

var st = new SyncTable({
            divID: "testDiv",
            header: ["A1","A2","A3"],
            getDataURL: "url here",
            updateDataURL: "url here",
            deleteDataURL: "url here",
            tableClassList: ["table","table-hover","table-bordered","table-striped"],
            PrimaryKeyColumnIndex: 0,
            PrimaryKeyVisible: true
        });
        //dataFormat for getDataURL reply: {1:["B1","B2","B3"],2:["c1","c2","c3"],3:["d1","d2","d3"]},

st.init();